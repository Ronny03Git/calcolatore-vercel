# Calcolatore Fido — Deploy Veloce su Vercel

Questa cartella è già pronta per il deploy.

## Struttura
- `public/calcolatore_fido-bancario_integrato_fix.html` → la tua pagina HTML
- `api/tassi-ecb.js` → endpoint server-side `/api/tassi-ecb` che proxy-a l'ECB (CSV → JSON)

## Deploy con interfaccia web
1. Vai su https://vercel.com → **New Project** → **Import** questa cartella (o il repository che la contiene).
2. Deploy. L'app sarà disponibile su `https://<progetto>.vercel.app/`.

## Deploy con CLI (alternativa)
```bash
npm i -g vercel
vercel login
vercel --cwd ./fido-calcolatore-vercel
```
Alla prima esecuzione, rispondi alle domande con i default.

## Verifica
- Apri `https://<progetto>.vercel.app/api/tassi-ecb?tenor=3m` → deve restituire `{ "value": <numero>, "date": "YYYY-MM-DD", ... }`.
- Apri `https://<progetto>.vercel.app/calcolatore_fido-bancario_integrato_fix.html` → in alto dovresti vedere
  “Indice base: X,XXX% (ECB via server) • agg. YYYY-MM-DD”.

## Note
- Quando avrai un endpoint **Euribor® via Vendor**, modifica la funzione `caricaTassoUfficiale()`
  nell'HTML per chiamare `/api/euribor-3m` (o aggiungi un secondo file `api/euribor-3m.js`).
- Se vuoi rinominare la pagina in `index.html`, sposta/duplica il file nella cartella `public/` con quel nome.
