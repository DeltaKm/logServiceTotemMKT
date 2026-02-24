# Esempi di Integrazione Log Verification

Questo file contiene esempi pratici di come integrare il sistema di log nelle tue applicazioni.

---

## 1. Express.js (Node.js)

### Middleware per loggare tutte le richieste

```javascript
const express = require('express');
const app = express();

const LOG_API = 'http://localhost:3001/api/logs';
const APP_NAME = 'express-api';

// Middleware di logging
app.use(async (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'error' : 'success';
    
    try {
      await fetch(LOG_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: APP_NAME,
          level,
          message: `${req.method} ${req.path} - ${res.statusCode}`,
          metadata: {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
          }
        })
      });
    } catch (error) {
      console.error('Errore nel logging:', error);
    }
  });
  
  next();
});

// Gestore errori globale
app.use((err, req, res, next) => {
  fetch(LOG_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app: APP_NAME,
      level: 'error',
      message: err.message,
      stackTrace: err.stack,
      metadata: {
        path: req.path,
        method: req.method,
        body: req.body
      }
    })
  }).catch(console.error);
  
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000);
```

---

## 2. React / Next.js Frontend

### Error Boundary Component

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

const LOG_API = 'http://localhost:3001/api/logs';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log l'errore al sistema
    fetch(LOG_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: 'react-frontend',
        level: 'error',
        message: error.message,
        stackTrace: error.stack,
        metadata: {
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      })
    }).catch(console.error);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Qualcosa è andato storto.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Hook personalizzato per il logging

```tsx
import { useCallback } from 'react';

const LOG_API = 'http://localhost:3001/api/logs';

type LogLevel = 'success' | 'error' | 'warning' | 'info';

export function useLogger(appName: string) {
  const log = useCallback(
    async (level: LogLevel, message: string, metadata?: Record<string, any>) => {
      try {
        await fetch(LOG_API, {
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
        });
      } catch (error) {
        console.error('Errore nel logging:', error);
      }
    },
    [appName]
  );

  return {
    success: (message: string, metadata?: Record<string, any>) =>
      log('success', message, metadata),
    error: (message: string, metadata?: Record<string, any>) =>
      log('error', message, metadata),
    warning: (message: string, metadata?: Record<string, any>) =>
      log('warning', message, metadata),
    info: (message: string, metadata?: Record<string, any>) =>
      log('info', message, metadata)
  };
}

// Utilizzo nel componente
function MyComponent() {
  const logger = useLogger('my-react-app');

  const handleSubmit = async () => {
    try {
      await submitForm();
      logger.success('Form inviato con successo', { formId: 'contact-form' });
    } catch (error) {
      logger.error('Errore invio form', { error: error.message });
    }
  };

  return <button onClick={handleSubmit}>Invia</button>;
}
```

---

## 3. Python / Flask

```python
import requests
from functools import wraps
from flask import Flask, request, g
import time
import traceback

app = Flask(__name__)
LOG_API = 'http://localhost:3001/api/logs'
APP_NAME = 'flask-api'

def log_to_api(level, message, metadata=None, stack_trace=None):
    """Invia log all'API"""
    try:
        payload = {
            'app': APP_NAME,
            'level': level,
            'message': message,
            'metadata': metadata or {},
            'environment': 'production'
        }
        if stack_trace:
            payload['stackTrace'] = stack_trace
        
        requests.post(LOG_API, json=payload, timeout=2)
    except Exception as e:
        print(f'Errore nel logging: {e}')

@app.before_request
def before_request():
    """Registra l'inizio della richiesta"""
    g.start_time = time.time()

@app.after_request
def after_request(response):
    """Log automatico di tutte le richieste"""
    if hasattr(g, 'start_time'):
        duration = time.time() - g.start_time
        level = 'error' if response.status_code >= 400 else 'success'
        
        log_to_api(
            level=level,
            message=f"{request.method} {request.path} - {response.status_code}",
            metadata={
                'method': request.method,
                'path': request.path,
                'statusCode': response.status_code,
                'duration': f'{duration:.2f}s',
                'ip': request.remote_addr,
                'userAgent': request.user_agent.string
            }
        )
    
    return response

@app.errorhandler(Exception)
def handle_exception(e):
    """Gestore errori globale"""
    log_to_api(
        level='error',
        message=str(e),
        metadata={
            'path': request.path,
            'method': request.method,
            'args': dict(request.args)
        },
        stack_trace=traceback.format_exc()
    )
    
    return {'error': 'Internal Server Error'}, 500

def log_function_call(func):
    """Decoratore per loggare l'esecuzione di funzioni"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            result = func(*args, **kwargs)
            log_to_api(
                level='success',
                message=f'Funzione {func.__name__} eseguita con successo',
                metadata={'function': func.__name__}
            )
            return result
        except Exception as e:
            log_to_api(
                level='error',
                message=f'Errore in {func.__name__}: {str(e)}',
                metadata={'function': func.__name__},
                stack_trace=traceback.format_exc()
            )
            raise
    return wrapper

# Esempio di utilizzo del decoratore
@app.route('/api/process')
@log_function_call
def process_data():
    # Il tuo codice qui
    return {'status': 'ok'}

if __name__ == '__main__':
    app.run(port=5000)
```

---

## 4. Cron Jobs / Scheduled Tasks

```javascript
const cron = require('node-cron');

const LOG_API = 'http://localhost:3001/api/logs';
const APP_NAME = 'scheduler-service';

async function logJob(jobName, level, message, metadata = {}) {
  try {
    await fetch(LOG_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: APP_NAME,
        level,
        message: `[${jobName}] ${message}`,
        metadata: {
          jobName,
          ...metadata
        }
      })
    });
  } catch (error) {
    console.error('Errore nel logging:', error);
  }
}

// Job che gira ogni giorno alle 2 AM
cron.schedule('0 2 * * *', async () => {
  const jobName = 'daily-cleanup';
  const startTime = Date.now();
  
  await logJob(jobName, 'info', 'Job avviato');
  
  try {
    // Esegui il job
    const result = await performCleanup();
    
    const duration = Date.now() - startTime;
    await logJob(jobName, 'success', 'Job completato con successo', {
      duration: `${duration}ms`,
      itemsProcessed: result.count
    });
  } catch (error) {
    await logJob(jobName, 'error', `Job fallito: ${error.message}`, {
      stackTrace: error.stack,
      duration: `${Date.now() - startTime}ms`
    });
  }
});

console.log('Scheduler avviato');
```

---

## 5. Database Operations

```javascript
const mongoose = require('mongoose');

const LOG_API = 'http://localhost:3001/api/logs';
const APP_NAME = 'database-service';

// Middleware per loggare operazioni sul database
async function logDbOperation(operation, collection, success, metadata = {}) {
  try {
    await fetch(LOG_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: APP_NAME,
        level: success ? 'info' : 'error',
        message: `${operation} su ${collection}`,
        metadata: {
          operation,
          collection,
          ...metadata
        }
      })
    });
  } catch (error) {
    console.error('Errore nel logging:', error);
  }
}

// Esempio con Mongoose hooks
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});

userSchema.post('save', async function(doc) {
  await logDbOperation('INSERT', 'users', true, {
    documentId: doc._id,
    email: doc.email
  });
});

userSchema.post('remove', async function(doc) {
  await logDbOperation('DELETE', 'users', true, {
    documentId: doc._id
  });
});

const User = mongoose.model('User', userSchema);
```

---

## 6. API Gateway / Proxy

```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const LOG_API = 'http://localhost:3001/api/logs';

// Logger per il proxy
const proxyLogger = createProxyMiddleware({
  target: 'http://backend-service:3000',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // Log richiesta in arrivo
    fetch(LOG_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: 'api-gateway',
        level: 'info',
        message: `Proxy request: ${req.method} ${req.path}`,
        metadata: {
          method: req.method,
          path: req.path,
          target: proxyReq.path
        }
      })
    }).catch(console.error);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log risposta
    const level = proxyRes.statusCode >= 400 ? 'warning' : 'success';
    fetch(LOG_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: 'api-gateway',
        level,
        message: `Proxy response: ${req.method} ${req.path} - ${proxyRes.statusCode}`,
        metadata: {
          method: req.method,
          path: req.path,
          statusCode: proxyRes.statusCode
        }
      })
    }).catch(console.error);
  },
  onError: (err, req, res) => {
    // Log errore proxy
    fetch(LOG_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: 'api-gateway',
        level: 'error',
        message: `Proxy error: ${err.message}`,
        metadata: {
          method: req.method,
          path: req.path
        },
        stackTrace: err.stack
      })
    }).catch(console.error);
  }
});

app.use('/api', proxyLogger);

app.listen(8080);
```

---

## 7. Monitoraggio Metriche di Sistema

```javascript
const os = require('os');
const LOG_API = 'http://localhost:3001/api/logs';

// Monitora le risorse di sistema ogni minuto
setInterval(async () => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePercent = (usedMem / totalMem) * 100;
  
  const cpuUsage = process.cpuUsage();
  const uptime = process.uptime();
  
  let level = 'info';
  if (memUsagePercent > 90) level = 'error';
  else if (memUsagePercent > 75) level = 'warning';
  
  await fetch(LOG_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app: 'system-monitor',
      level,
      message: `Utilizzo memoria: ${memUsagePercent.toFixed(2)}%`,
      metadata: {
        memoryUsage: {
          total: `${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
          used: `${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
          free: `${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
          percentage: memUsagePercent.toFixed(2)
        },
        cpuUsage: {
          user: cpuUsage.user,
          system: cpuUsage.system
        },
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        loadAverage: os.loadavg()
      }
    })
  }).catch(console.error);
}, 60000); // Ogni minuto
```

---

## 8. WebSocket / Real-time Events

```javascript
const WebSocket = require('ws');
const LOG_API = 'http://localhost:3001/api/logs';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  
  // Log connessione
  fetch(LOG_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app: 'websocket-server',
      level: 'info',
      message: 'Nuova connessione WebSocket',
      metadata: { clientIp, totalConnections: wss.clients.size }
    })
  }).catch(console.error);
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      // Log messaggio ricevuto
      fetch(LOG_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: 'websocket-server',
          level: 'info',
          message: 'Messaggio ricevuto',
          metadata: { clientIp, messageType: data.type }
        })
      }).catch(console.error);
    } catch (error) {
      // Log errore parsing
      fetch(LOG_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: 'websocket-server',
          level: 'error',
          message: 'Errore nel parsing del messaggio',
          metadata: { clientIp },
          stackTrace: error.stack
        })
      }).catch(console.error);
    }
  });
  
  ws.on('close', () => {
    // Log disconnessione
    fetch(LOG_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: 'websocket-server',
        level: 'info',
        message: 'Connessione WebSocket chiusa',
        metadata: { clientIp, remainingConnections: wss.clients.size - 1 }
      })
    }).catch(console.error);
  });
});
```

---

Questi esempi mostrano come integrare il sistema di log in diversi scenari e tecnologie!
