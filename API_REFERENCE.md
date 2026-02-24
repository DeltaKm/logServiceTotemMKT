# 📚 GUIDA COMPLETA API - LOG VERIFICATION

## 🌐 Base URL
```
http://localhost:3001
```

In produzione sostituisci con il tuo dominio (es: `https://logs.tuodominio.com`)

---

## 🎯 LIVELLI DI LOG

| Livello | Valore | Quando Usarlo | Colore |
|---------|--------|---------------|--------|
| **Success** | `success` | Operazioni completate con successo | 🟢 Verde |
| **Error** | `error` | Errori critici che richiedono attenzione immediata | 🔴 Rosso |
| **Warning** | `warning` | Situazioni anomale che potrebbero causare problemi | 🟡 Giallo |
| **Info** | `info` | Informazioni generali e di debug | 🔵 Blu |

---

## 📡 ENDPOINT 1: Crea Log

### `POST /api/logs`

Crea un nuovo log nel database.

### ✅ Campi Obbligatori
- `app` (string) - Nome dell'applicazione
- `level` (string) - Livello: `success`, `error`, `warning`, `info`
- `message` (string) - Messaggio del log

### ⭕ Campi Opzionali
- `metadata` (object) - Dati aggiuntivi personalizzati
- `stackTrace` (string) - Stack trace dell'errore
- `userId` (string) - ID dell'utente correlato
- `environment` (string) - Ambiente: `development`, `staging`, `production` (default: `production`)

### 📦 Esempio Payload

```json
{
  "app": "my-application",
  "level": "success",
  "message": "Operazione completata con successo",
  "metadata": {
    "userId": "12345",
    "operation": "user-registration",
    "duration": "234ms"
  },
  "userId": "user_12345",
  "environment": "production"
}
```

### 💻 Esempio cURL

```bash
curl -X POST http://localhost:3001/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "app": "my-application",
    "level": "success",
    "message": "Operazione completata con successo",
    "metadata": {
      "userId": "12345",
      "operation": "user-registration"
    },
    "environment": "production"
  }'
```

### ⚡ Esempio JavaScript/TypeScript

```javascript
const response = await fetch('http://localhost:3001/api/logs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    app: 'my-application',
    level: 'success',
    message: 'Operazione completata con successo',
    metadata: {
      userId: '12345',
      operation: 'user-registration',
      duration: '234ms'
    },
    userId: 'user_12345',
    environment: 'production'
  })
});

const data = await response.json();
console.log(data);
```

### 🐍 Esempio Python

```python
import requests

response = requests.post('http://localhost:3001/api/logs', json={
    'app': 'my-application',
    'level': 'success',
    'message': 'Operazione completata con successo',
    'metadata': {
        'userId': '12345',
        'operation': 'user-registration'
    },
    'environment': 'production'
})

data = response.json()
print(data)
```

### ✨ Esempio Risposta

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "app": "my-application",
    "level": "success",
    "message": "Operazione completata con successo",
    "metadata": {
      "userId": "12345",
      "operation": "user-registration",
      "duration": "234ms"
    },
    "userId": "user_12345",
    "environment": "production",
    "timestamp": "2024-02-24T15:30:00.000Z",
    "createdAt": "2024-02-24T15:30:00.000Z",
    "updatedAt": "2024-02-24T15:30:00.000Z"
  }
}
```

---

## 📡 ENDPOINT 2: Recupera Log

### `GET /api/logs`

Recupera i log dal database con filtri opzionali.

### 🔍 Query Parameters

| Parametro | Tipo | Descrizione | Esempio |
|-----------|------|-------------|---------|
| `app` | string | Nome dell'applicazione | `?app=my-app` |
| `level` | string | Livello del log | `?level=error` |
| `startDate` | ISO date | Data inizio | `?startDate=2024-01-01` |
| `endDate` | ISO date | Data fine | `?endDate=2024-12-31` |
| `limit` | number | Numero di risultati (default: 100) | `?limit=50` |
| `page` | number | Numero pagina (default: 1) | `?page=2` |

### 💻 Esempi cURL

```bash
# Tutti i log
curl http://localhost:3001/api/logs

# Log di una specifica app
curl "http://localhost:3001/api/logs?app=my-application"

# Log di errore
curl "http://localhost:3001/api/logs?level=error"

# Log filtrati per app e livello con limite
curl "http://localhost:3001/api/logs?app=my-app&level=error&limit=20"

# Log in un periodo specifico
curl "http://localhost:3001/api/logs?startDate=2024-02-01&endDate=2024-02-28"
```

### ⚡ Esempio JavaScript

```javascript
// Tutti i log
const response = await fetch('http://localhost:3001/api/logs');

// Con filtri
const params = new URLSearchParams({
  app: 'my-application',
  level: 'error',
  limit: '50',
  page: '1'
});
const response = await fetch(`http://localhost:3001/api/logs?${params}`);

const data = await response.json();
console.log(data.data); // Array di log
console.log(data.pagination); // Info paginazione
```

### ✨ Esempio Risposta

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "app": "my-application",
      "level": "error",
      "message": "Errore di connessione al database",
      "metadata": {
        "host": "db.example.com",
        "port": 5432
      },
      "timestamp": "2024-02-24T15:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "pages": 3
  }
}
```

---

## 📡 ENDPOINT 3: Lista Applicazioni

### `GET /api/logs/apps`

Recupera la lista di tutte le applicazioni che hanno generato log.

### 💻 Esempio cURL

```bash
curl http://localhost:3001/api/logs/apps
```

### ⚡ Esempio JavaScript

```javascript
const response = await fetch('http://localhost:3001/api/logs/apps');
const data = await response.json();
console.log(data.data); // Array di nomi app
```

### ✨ Esempio Risposta

```json
{
  "success": true,
  "data": [
    "analytics-service",
    "auth-service",
    "backup-service",
    "mobile-app",
    "my-application",
    "payment-service"
  ]
}
```

---

## 📡 ENDPOINT 4: Statistiche

### `GET /api/logs/stats`

Recupera statistiche aggregate sui log.

### 🔍 Query Parameters

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `app` | string | Filtra statistiche per una specifica app (opzionale) |

### 💻 Esempi cURL

```bash
# Statistiche globali
curl http://localhost:3001/api/logs/stats

# Statistiche per una specifica app
curl "http://localhost:3001/api/logs/stats?app=my-application"
```

### ⚡ Esempio JavaScript

```javascript
const response = await fetch('http://localhost:3001/api/logs/stats');
const data = await response.json();

console.log(data.data.byLevel); // Conteggi per livello
console.log(data.data.byApp); // Conteggi per app
console.log(data.data.byDay); // Conteggi ultimi 7 giorni
```

### ✨ Esempio Risposta

```json
{
  "success": true,
  "data": {
    "byLevel": [
      { "_id": "success", "count": 150 },
      { "_id": "error", "count": 45 },
      { "_id": "warning", "count": 30 },
      { "_id": "info", "count": 200 }
    ],
    "byApp": [
      {
        "_id": "my-application",
        "count": 300,
        "lastLog": "2024-02-24T15:30:00.000Z"
      },
      {
        "_id": "payment-service",
        "count": 125,
        "lastLog": "2024-02-24T14:20:00.000Z"
      }
    ],
    "byDay": [
      {
        "_id": { "date": "2024-02-24", "level": "success" },
        "count": 50
      },
      {
        "_id": { "date": "2024-02-24", "level": "error" },
        "count": 10
      }
    ]
  }
}
```

---

## 💡 ESEMPI PRATICI

### 1️⃣ Log un'operazione riuscita

```javascript
// Quando un utente si registra con successo
await fetch('http://localhost:3001/api/logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    app: 'auth-service',
    level: 'success',
    message: 'Nuovo utente registrato',
    metadata: {
      userId: newUser.id,
      email: newUser.email,
      registrationMethod: 'email'
    },
    userId: newUser.id,
    environment: 'production'
  })
});
```

### 2️⃣ Log un errore con stack trace

```javascript
// Quando si verifica un errore
try {
  await processPayment(orderId);
} catch (error) {
  await fetch('http://localhost:3001/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app: 'payment-service',
      level: 'error',
      message: `Errore nel processamento del pagamento: ${error.message}`,
      metadata: {
        orderId: orderId,
        errorCode: error.code,
        amount: orderAmount
      },
      stackTrace: error.stack,
      environment: 'production'
    })
  });
  throw error; // Rilancia l'errore
}
```

### 3️⃣ Log un warning

```javascript
// Quando un utente si avvicina al limite
if (userRequests > RATE_LIMIT * 0.9) {
  await fetch('http://localhost:3001/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app: 'api-gateway',
      level: 'warning',
      message: 'Utente vicino al rate limit',
      metadata: {
        userId: userId,
        currentRequests: userRequests,
        limit: RATE_LIMIT,
        remainingRequests: RATE_LIMIT - userRequests
      },
      userId: userId,
      environment: 'production'
    })
  });
}
```

### 4️⃣ Recupera i log di errore di un'app

```javascript
// Recupera tutti gli errori di payment-service
const response = await fetch(
  'http://localhost:3001/api/logs?app=payment-service&level=error&limit=50'
);
const { data, pagination } = await response.json();

console.log(`Trovati ${pagination.total} errori`);
data.forEach(log => {
  console.log(`[${log.timestamp}] ${log.message}`);
  if (log.metadata) {
    console.log('Metadata:', log.metadata);
  }
  if (log.stackTrace) {
    console.log('Stack:', log.stackTrace);
  }
});
```

### 5️⃣ Middleware Express per logging automatico

```javascript
const express = require('express');
const app = express();

// Middleware per loggare tutte le richieste
app.use(async (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'error' : 'success';
    
    await fetch('http://localhost:3001/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: 'my-api',
        level,
        message: `${req.method} ${req.path} - ${res.statusCode}`,
        metadata: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          ip: req.ip
        }
      })
    }).catch(console.error);
  });
  
  next();
});
```

### 6️⃣ Hook React per logging

```typescript
import { useCallback } from 'react';

export function useLogger(appName: string) {
  const log = useCallback(
    async (level: string, message: string, metadata?: Record<string, any>) => {
      await fetch('http://localhost:3001/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: appName,
          level,
          message,
          metadata: {
            ...metadata,
            url: window.location.href,
            userAgent: navigator.userAgent
          }
        })
      }).catch(console.error);
    },
    [appName]
  );

  return {
    success: (msg: string, meta?: any) => log('success', msg, meta),
    error: (msg: string, meta?: any) => log('error', msg, meta),
    warning: (msg: string, meta?: any) => log('warning', msg, meta),
    info: (msg: string, meta?: any) => log('info', msg, meta)
  };
}

// Uso nel componente
function MyComponent() {
  const logger = useLogger('my-react-app');

  const handleClick = async () => {
    try {
      await doSomething();
      logger.success('Operazione riuscita', { action: 'button-click' });
    } catch (error) {
      logger.error('Operazione fallita', { error: error.message });
    }
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

---

## 🔒 BEST PRACTICES

### 1. **Non loggare dati sensibili**
```javascript
// ❌ MALE
await fetch(LOG_API, {
  body: JSON.stringify({
    message: 'Login failed',
    metadata: {
      password: userPassword, // MAI loggare password!
      creditCard: userCard    // MAI loggare dati finanziari!
    }
  })
});

// ✅ BENE
await fetch(LOG_API, {
  body: JSON.stringify({
    message: 'Login failed',
    metadata: {
      username: username,
      reason: 'invalid_password',
      attemptCount: 3
    }
  })
});
```

### 2. **Usa livelli appropriati**
- `success`: Solo per operazioni completate con successo
- `error`: Per errori che richiedono attenzione
- `warning`: Per situazioni anomale ma gestibili
- `info`: Per informazioni generali

### 3. **Aggiungi contesto utile**
```javascript
// ❌ MALE
await log('error', 'Errore');

// ✅ BENE
await log('error', 'Errore nel processamento del pagamento', {
  orderId: '12345',
  amount: 99.99,
  errorCode: 'PAYMENT_DECLINED',
  userId: 'user_001',
  timestamp: new Date().toISOString()
});
```

### 4. **Gestisci gli errori di logging**
```javascript
try {
  await fetch(LOG_API, { /* ... */ });
} catch (error) {
  // Non bloccare l'applicazione se il logging fallisce
  console.error('Logging failed:', error);
}
```

### 5. **Usa environment correttamente**
```javascript
const environment = process.env.NODE_ENV === 'production' 
  ? 'production' 
  : process.env.NODE_ENV === 'staging' 
  ? 'staging' 
  : 'development';

await log('info', 'App started', { environment });
```

---

## 🚀 TESTING

### Test con cURL
```bash
# Test success
curl -X POST http://localhost:3001/api/logs \
  -H "Content-Type: application/json" \
  -d '{"app":"test","level":"success","message":"Test OK"}'

# Test error
curl -X POST http://localhost:3001/api/logs \
  -H "Content-Type: application/json" \
  -d '{"app":"test","level":"error","message":"Test Error","stackTrace":"Error at line 1"}'

# Recupera i log di test
curl "http://localhost:3001/api/logs?app=test"
```

### Test con Postman
1. **Create New Request**
2. **Method:** POST
3. **URL:** `http://localhost:3001/api/logs`
4. **Headers:** `Content-Type: application/json`
5. **Body (raw JSON):**
```json
{
  "app": "postman-test",
  "level": "info",
  "message": "Test da Postman",
  "metadata": {
    "tester": "Il tuo nome"
  }
}
```

---

## 📞 SUPPORTO

- **Dashboard:** http://localhost:3001
- **API Docs:** http://localhost:3001/api-docs
- **Repository:** Controlla il README.md per maggiori dettagli

---

**Buon logging! 🎯**
