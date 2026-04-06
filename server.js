const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const API_KEY = process.env.ANTHROPIC_API_KEY;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/scan', async (req, res) => {
  try {
    const { base64, mode, collection } = req.body;
    if (!base64) return res.status(400).json({ error: 'Kein Bild' });

    const colText = collection?.length > 0
      ? `Aktuelle Sammlung (${collection.length} Autos):\n${collection.map((c,i) =>
          `${i+1}. ${c.name}${c.seriesName?' | '+c.seriesName:''}${c.seriesNum?' Nr.'+c.seriesNum+'/'+c.seriesTotal:''}`
        ).join('\n')}`
      : 'Sammlung ist noch leer.';

    const prompt = `Du bist ein Hot Wheels Experte. Analysiere das Foto.

${colText}

Bekannte Serien: HW Race Day, HW Flames, HW City Works, HW Daredevils, HW Rescue, HW Screen Time, HW Exotics, HW Dream Garage, HW Speed Graphics, HW Nightburnerz, HW Art Cars, Car Culture Boulevard, Car Culture Circuit Legends, Fast & Furious, Marvel, DC, Star Wars, Pop Culture etc.
Mainline-Serien haben typisch 10 Autos, Car Culture 5 Autos.

Aufgabe:
1. Identifiziere das Auto (Modellname, Farbe, Jahr falls erkennbar).
2. Erkenne die offizielle Hot Wheels Serie.
3. Erkenne Seriennummer und Gesamtanzahl falls sichtbar.
4. Liste alle anderen Autos der gleichen Serie auf die du kennst.
5. ${mode === 'scan' ? 'Prüfe ob dieses Auto bereits in der Sammlung ist.' : '"owned" ist immer false.'}

Antworte NUR mit JSON (kein Markdown):
{
  "name": "Modellname",
  "color": "Farbe auf Deutsch",
  "year": "Jahr oder null",
  "owned": ${mode === 'scan' ? 'true oder false' : 'false'},
  "matchedWith": "übereinstimmender Name oder null",
  "seriesName": "Offizieller Serienname oder null",
  "seriesNum": Nummer als Zahl oder null,
  "seriesTotal": Gesamtanzahl als Zahl oder null,
  "seriesAllCars": [{"num": 1, "name": "Modellname"}, ...] oder [],
  "confidence": "hoch oder mittel oder niedrig",
  "note": "Kurze Anmerkung auf Deutsch oder null"
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
    res.json(JSON.parse(text));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
