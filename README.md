# Log Verification App

Sistema completo di gestione e monitoraggio log per applicazioni con Next.js e MongoDB.

## 🚀 Caratteristiche

- **Dashboard Interattiva**: Visualizza e filtra i log in tempo reale
- **API RESTful**: Endpoints per salvare e recuperare log
- **Statistiche**: Contatori per tipo di log (success, error, warning, info)
- **Filtri Avanzati**: Filtra per app, livello, date
- **Design Moderno**: UI responsive con Tailwind CSS
- **MongoDB**: Database scalabile per la gestione dei log

## 📋 Requisiti

- Node.js 18+
- MongoDB (cloud o locale)

## 🛠️ Installazione

1. Installa le dipendenze:
```bash
npm install
```

2. Configura le variabili d'ambiente in `.env.local` (puoi partire da `.env.example`):
```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/log"
DASHBOARD_USER="admin"
DASHBOARD_PASSWORD="change-me-strong-password"
xApiKey="change-me-long-random-api-key"
```

3. Avvia il server di sviluppo:
```bash
npm run dev
```

4. Apri [http://localhost:3000](http://localhost:3000) nel browser

## 📡 API Endpoints

### POST /api/logs
Crea un nuovo log

**Autenticazione richiesta:**
- Header `x-api-key: <xApiKey>`

**Body:**
```json
{
  "app": "my-app",
  "level": "error",
  "message": "Errore di connessione al database",
  "metadata": {
    "userId": "123",
    "ip": "192.168.1.1"
  },
  "stackTrace": "Error: ...",
  "userId": "user123",
  "environment": "production"
}
```

**Campi obbligatori:** `app`, `level`, `message`

**Level validi:** `success`, `error`, `warning`, `info`

### GET /api/logs
Recupera i log con filtri

**Autenticazione richiesta:**
- Basic Auth (`DASHBOARD_USER` / `DASHBOARD_PASSWORD`)

**Query params:**
- `app` - Nome dell'applicazione
- `level` - Livello del log (success, error, warning, info)
- `startDate` - Data inizio (ISO 8601)
- `endDate` - Data fine (ISO 8601)
- `limit` - Numero di risultati (default: 100)
- `page` - Numero pagina (default: 1)

**Esempio:**
```
GET /api/logs?app=my-app&level=error&limit=50
```

### GET /api/logs/apps
Recupera la lista di tutte le applicazioni

**Autenticazione richiesta:** Basic Auth

### GET /api/logs/stats
Recupera statistiche sui log

**Autenticazione richiesta:** Basic Auth

**Query params:**
- `app` - Filtra per applicazione specifica

## 📊 Struttura del Log

```typescript
{
  app: string;              // Nome dell'applicazione (obbligatorio)
  level: LogLevel;          // success | error | warning | info (obbligatorio)
  message: string;          // Messaggio del log (obbligatorio)
  metadata?: object;        // Dati aggiuntivi personalizzati
  timestamp: Date;          // Data e ora (auto-generato)
  stackTrace?: string;      // Stack trace per errori
  userId?: string;          // ID utente correlato
  environment?: string;     // development | staging | production
}
```

## 🎨 Funzionalità Dashboard

1. **Statistiche in tempo reale**: Visualizza contatori per ogni tipo di log
2. **Filtri dinamici**: Filtra per app e livello
3. **Vista dettagliata**: Espandi i log per vedere metadata e stack trace
4. **Design responsive**: Funziona su desktop e mobile
5. **Indicatori colorati**: Colori differenti per ogni livello di log

## 🔧 Esempio di utilizzo

### Da un'altra applicazione Node.js:

```javascript
// Invia un log di successo
await fetch('http://localhost:3000/api/logs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.xApiKey,
  },
  body: JSON.stringify({
    app: 'my-app',
    level: 'success',
    message: 'Operazione completata con successo',
    metadata: { operation: 'user-registration', duration: 234 }
  })
});

// Invia un log di errore
await fetch('http://localhost:3000/api/logs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.xApiKey,
  },
  body: JSON.stringify({
    app: 'my-app',
    level: 'error',
    message: 'Errore durante l\'elaborazione',
    stackTrace: error.stack,
    metadata: { errorCode: 'DB_CONNECTION_FAILED' }
  })
});
```

### Da curl:

```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -H "x-api-key: $xApiKey" \
  -d '{
    "app": "test-app",
    "level": "info",
    "message": "Test log message"
  }'

curl -u "$DASHBOARD_USER:$DASHBOARD_PASSWORD" \
  "http://localhost:3000/api/logs?limit=10"
```

## 🚀 Deploy su Vercel

1. Crea un account su [Vercel](https://vercel.com)
2. Installa Vercel CLI: `npm i -g vercel`
3. Esegui: `vercel`
4. Configura le variabili d'ambiente su Vercel dashboard

## 📝 Note

- I log sono ordinati per data decrescente (più recenti prima)
- Gli indici MongoDB sono ottimizzati per query su app, level e timestamp
- La paginazione è supportata per gestire grandi quantità di log
- Il database usa UTC per i timestamp

## 🔒 Sicurezza

La versione corrente implementa:
- Basic Auth su dashboard e API di lettura (`/`, `GET /api/logs*`)
- API key su ingestione log (`POST /api/logs`)

Per produzione, considera comunque di:
- Implementare rate limiting
- Validare e sanitizzare tutti gli input
- Usare HTTPS
- Limitare le dimensioni del payload

## 📦 Tecnologie utilizzate

- **Next.js 15** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MongoDB + Mongoose** - Database
- **date-fns** - Gestione date

## 🤝 Supporto

Per problemi o domande, consulta la documentazione o apri un issue.
