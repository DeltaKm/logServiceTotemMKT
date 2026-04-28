# 🎉 LOG VERIFICATION APP - GUIDA RAPIDA

L'applicazione è stata creata con successo! 

## 🌐 Accesso

**Dashboard:** http://localhost:3001

L'applicazione è attualmente in esecuzione e il database è stato popolato con log di esempio.

---

## 📊 CARATTERISTICHE PRINCIPALI

### Dashboard Frontend
✅ **Statistiche in tempo reale** - Contatori per success, error, warning, info
✅ **Filtri dinamici** - Filtra per applicazione e livello di log
✅ **Vista dettagliata** - Espandi i log per vedere metadata e stack trace
✅ **Design moderno** - UI responsive con Tailwind CSS
✅ **Aggiornamento automatico** - I filtri aggiornano automaticamente i dati

### API Backend
✅ **POST /api/logs** - Crea nuovi log (**protetto da API key**)
✅ **GET /api/logs** - Recupera log con filtri (**protetto da Basic Auth**)
✅ **GET /api/logs/apps** - Lista tutte le applicazioni (**protetto da Basic Auth**)
✅ **GET /api/logs/stats** - Statistiche aggregate (**protetto da Basic Auth**)

### Database
✅ **MongoDB Atlas** - Database cloud già configurato
✅ **Indici ottimizzati** - Per query veloci su app, level e timestamp
✅ **Schema validato** - Con Mongoose

---

## 🚀 COMANDI UTILI

### Avviare il server (se non è già in esecuzione)
```bash
cd /Volumes/ORICO/log_verification/log-app
npm run dev
```

### Popolare con nuovi log di esempio
```bash
./populate-logs.sh
```

### Test manuale dell'API
```bash
# Crea un log di successo
curl -X POST http://localhost:3001/api/logs \
  -H "Content-Type: application/json" \
  -H "x-api-key: $xApiKey" \
  -d '{
    "app": "test-app",
    "level": "success",
    "message": "Test completato con successo",
    "metadata": {"test": true}
  }'

# Recupera tutti i log
curl -u "$DASHBOARD_USER:$DASHBOARD_PASSWORD" http://localhost:3001/api/logs

# Recupera log di errore
curl -u "$DASHBOARD_USER:$DASHBOARD_PASSWORD" "http://localhost:3001/api/logs?level=error"

# Recupera log di una specifica app
curl -u "$DASHBOARD_USER:$DASHBOARD_PASSWORD" "http://localhost:3001/api/logs?app=payment-service"
```

---

## 📡 ESEMPI DI UTILIZZO

### Da JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:3001/api/logs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.xApiKey,
  },
  body: JSON.stringify({
    app: 'my-app',
    level: 'error',
    message: 'Errore durante l\'elaborazione',
    metadata: { userId: '123', errorCode: 'ERR_001' },
    stackTrace: error.stack,
    environment: 'production'
  })
});
```

### Da TypeScript (con client incluso)
Vedi il file: `examples/logger-client.ts`

```typescript
import LoggerClient from './examples/logger-client';

const logger = new LoggerClient('http://localhost:3001/api/logs');

// Log di successo
await logger.success('my-app', 'Operazione completata', { userId: '123' });

// Log di errore
await logger.error('my-app', 'Errore critico', error, { context: 'payment' });
```

### Da Python
```python
import requests

requests.post('http://localhost:3001/api/logs', json={
    'app': 'python-app',
    'level': 'info',
    'message': 'Script eseguito con successo',
    'metadata': {'duration': 5.2, 'items': 100}
}, headers={'x-api-key': 'YOUR_xApiKey'})
```

---

## 📝 STRUTTURA LOG

### Campi obbligatori
- `app` (string) - Nome dell'applicazione
- `level` (string) - Uno tra: success, error, warning, info
- `message` (string) - Messaggio del log

### Campi opzionali
- `metadata` (object) - Dati aggiuntivi personalizzati
- `stackTrace` (string) - Stack trace per gli errori
- `userId` (string) - ID utente correlato
- `environment` (string) - development, staging, production (default: production)
- `timestamp` (Date) - Viene generato automaticamente

---

## 🎨 FUNZIONALITÀ DASHBOARD

### Statistiche
Visualizza contatori in tempo reale per:
- ✓ Success (verde)
- ✗ Error (rosso)
- ⚠ Warning (giallo)
- ℹ Info (blu)

### Filtri
- Filtra per **applicazione** (tutte le app o una specifica)
- Filtra per **livello** (tutti o uno specifico)
- Pulsante **Reset Filtri** per cancellare i filtri

### Vista Log
- **Badge colorati** per livello e app
- **Timestamp formattato** in italiano
- **Pulsante espandi** per vedere metadata e stack trace
- **Ordinamento** per data (più recenti prima)

---

## 🔐 VARIABILI D'AMBIENTE

File: `.env.local`
```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/log"
DASHBOARD_USER="admin"
DASHBOARD_PASSWORD="change-me-strong-password"
xApiKey="change-me-long-random-api-key"
```

---

## 📦 TECNOLOGIE UTILIZZATE

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling moderno
- **MongoDB + Mongoose** - Database NoSQL
- **date-fns** - Gestione e formattazione date

---

## 🚀 DEPLOY IN PRODUZIONE

### Su Vercel (consigliato)
1. Push il codice su GitHub
2. Vai su [vercel.com](https://vercel.com)
3. Importa il repository
4. Aggiungi le variabili d'ambiente `DATABASE_URL`, `DASHBOARD_USER`, `DASHBOARD_PASSWORD`, `xApiKey`
5. Deploy!

### Con Docker
```dockerfile
# Aggiungi un Dockerfile se necessario
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔒 SICUREZZA PER PRODUZIONE

La versione corrente implementa:
- ✅ Basic Auth su dashboard e API di lettura
- ✅ API key su `POST /api/logs`

Prima di andare in produzione, considera comunque:
- ✅ Implementare rate limiting
- ✅ Validare e sanitizzare tutti gli input
- ✅ Usare HTTPS
- ✅ Limitare le dimensioni del payload
- ✅ Configurare CORS appropriatamente
- ✅ Aggiungere logging degli accessi API
- ✅ Implementare backup del database

---

## 📚 FILE UTILI

- `README.md` - Documentazione completa
- `test-api.js` - Script Node.js per testare l'API
- `populate-logs.sh` - Script bash per popolare log di esempio
- `examples/logger-client.ts` - Client TypeScript riutilizzabile

---

## 🆘 TROUBLESHOOTING

### Il server non si avvia
```bash
# Verifica che la porta non sia occupata
lsof -ti:3001
# Se occupata, uccidi il processo
kill -9 $(lsof -ti:3001)
```

### Errori di connessione al database
- Verifica che l'URL in `.env.local` sia corretto
- Controlla che il tuo IP sia nella whitelist di MongoDB Atlas
- Verifica le credenziali del database

### Log non vengono visualizzati
- Controlla la console del browser per errori
- Verifica che il database sia raggiungibile
- Controlla i log del server Next.js

---

## 📞 SUPPORTO

Per problemi o domande:
1. Controlla la documentazione nel `README.md`
2. Verifica i log del server
3. Controlla la console del browser per errori frontend

---

**Buon logging! 🎯**
