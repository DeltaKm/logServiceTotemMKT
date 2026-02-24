# 🚀 QUICK REFERENCE - Esempi Pronti all'Uso

Copia e incolla questi esempi per iniziare subito!

---

## 📦 PAYLOAD EXAMPLES

### ✅ Success Log
```json
{
  "app": "my-app",
  "level": "success",
  "message": "Operazione completata con successo",
  "metadata": {
    "userId": "12345",
    "operation": "user-registration",
    "duration": "234ms"
  },
  "environment": "production"
}
```

### ❌ Error Log
```json
{
  "app": "my-app",
  "level": "error",
  "message": "Errore durante l'elaborazione",
  "metadata": {
    "errorCode": "ERR_001",
    "userId": "12345",
    "context": "payment-processing"
  },
  "stackTrace": "Error: Payment failed\n    at processPayment (payment.js:45)\n    at handleOrder (order.js:120)",
  "environment": "production"
}
```

### ⚠️ Warning Log
```json
{
  "app": "my-app",
  "level": "warning",
  "message": "Utilizzo memoria elevato",
  "metadata": {
    "memoryUsage": "85%",
    "threshold": "80%",
    "action": "cleanup-scheduled"
  },
  "environment": "production"
}
```

### ℹ️ Info Log
```json
{
  "app": "my-app",
  "level": "info",
  "message": "Backup completato",
  "metadata": {
    "size": "2.5GB",
    "duration": "15m",
    "files": 1234
  },
  "environment": "production"
}
```

---

## 💻 CURL COMMANDS

### Create Success Log
```bash
curl -X POST http://localhost:3001/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "app": "my-app",
    "level": "success",
    "message": "Test completato con successo"
  }'
```

### Create Error Log
```bash
curl -X POST http://localhost:3001/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "app": "my-app",
    "level": "error",
    "message": "Test errore",
    "stackTrace": "Error at line 1"
  }'
```

### Get All Logs
```bash
curl http://localhost:3001/api/logs
```

### Get Logs by App
```bash
curl "http://localhost:3001/api/logs?app=my-app"
```

### Get Error Logs
```bash
curl "http://localhost:3001/api/logs?level=error"
```

### Get Logs with Limit
```bash
curl "http://localhost:3001/api/logs?limit=10"
```

### Get Apps List
```bash
curl http://localhost:3001/api/logs/apps
```

### Get Statistics
```bash
curl http://localhost:3001/api/logs/stats
```

---

## ⚡ JAVASCRIPT/TYPESCRIPT

### Simple Logger Function
```javascript
async function log(level, message, metadata = {}) {
  try {
    await fetch('http://localhost:3001/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: 'my-app',
        level,
        message,
        metadata,
        environment: 'production'
      })
    });
  } catch (error) {
    console.error('Logging failed:', error);
  }
}

// Uso
await log('success', 'Operazione riuscita', { userId: '123' });
await log('error', 'Operazione fallita', { errorCode: 'ERR_001' });
```

### Logger Class
```javascript
class Logger {
  constructor(appName) {
    this.appName = appName;
    this.apiUrl = 'http://localhost:3001/api/logs';
  }

  async log(level, message, metadata = {}) {
    try {
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: this.appName,
          level,
          message,
          metadata,
          environment: process.env.NODE_ENV || 'production'
        })
      });
    } catch (error) {
      console.error('Logging failed:', error);
    }
  }

  success(message, metadata) {
    return this.log('success', message, metadata);
  }

  error(message, error, metadata = {}) {
    return this.log('error', message, {
      ...metadata,
      stackTrace: error?.stack
    });
  }

  warning(message, metadata) {
    return this.log('warning', message, metadata);
  }

  info(message, metadata) {
    return this.log('info', message, metadata);
  }
}

// Uso
const logger = new Logger('my-app');
await logger.success('User registered', { userId: '123' });
await logger.error('Payment failed', new Error('Declined'), { orderId: '456' });
```

### Express Middleware
```javascript
const logMiddleware = async (req, res, next) => {
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
          duration: `${duration}ms`
        }
      })
    }).catch(console.error);
  });
  
  next();
};

app.use(logMiddleware);
```

### React Hook
```typescript
import { useCallback } from 'react';

export function useLogger(appName: string) {
  const log = useCallback(async (
    level: 'success' | 'error' | 'warning' | 'info',
    message: string,
    metadata?: Record<string, any>
  ) => {
    try {
      await fetch('http://localhost:3001/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: appName,
          level,
          message,
          metadata
        })
      });
    } catch (error) {
      console.error('Logging failed:', error);
    }
  }, [appName]);

  return {
    success: (msg: string, meta?: any) => log('success', msg, meta),
    error: (msg: string, meta?: any) => log('error', msg, meta),
    warning: (msg: string, meta?: any) => log('warning', msg, meta),
    info: (msg: string, meta?: any) => log('info', msg, meta)
  };
}

// Uso
function MyComponent() {
  const logger = useLogger('react-app');

  const handleClick = async () => {
    try {
      await doSomething();
      logger.success('Action completed');
    } catch (error) {
      logger.error('Action failed', { error: error.message });
    }
  };

  return <button onClick={handleClick}>Click</button>;
}
```

---

## 🐍 PYTHON

### Simple Logger
```python
import requests
import traceback

LOG_API = 'http://localhost:3001/api/logs'
APP_NAME = 'python-app'

def log(level, message, metadata=None, stack_trace=None):
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
        print(f'Logging failed: {e}')

# Uso
log('success', 'Operation completed', {'userId': '123'})

try:
    # qualche operazione
    pass
except Exception as e:
    log('error', str(e), stack_trace=traceback.format_exc())
```

### Python Class
```python
import requests
import traceback
from typing import Dict, Any, Optional

class Logger:
    def __init__(self, app_name: str, api_url: str = 'http://localhost:3001/api/logs'):
        self.app_name = app_name
        self.api_url = api_url
    
    def _log(self, level: str, message: str, metadata: Optional[Dict[str, Any]] = None, 
             stack_trace: Optional[str] = None):
        try:
            payload = {
                'app': self.app_name,
                'level': level,
                'message': message,
                'metadata': metadata or {},
                'environment': 'production'
            }
            if stack_trace:
                payload['stackTrace'] = stack_trace
            
            requests.post(self.api_url, json=payload, timeout=2)
        except Exception as e:
            print(f'Logging failed: {e}')
    
    def success(self, message: str, metadata: Optional[Dict[str, Any]] = None):
        self._log('success', message, metadata)
    
    def error(self, message: str, exception: Optional[Exception] = None, 
              metadata: Optional[Dict[str, Any]] = None):
        stack_trace = traceback.format_exc() if exception else None
        self._log('error', message, metadata, stack_trace)
    
    def warning(self, message: str, metadata: Optional[Dict[str, Any]] = None):
        self._log('warning', message, metadata)
    
    def info(self, message: str, metadata: Optional[Dict[str, Any]] = None):
        self._log('info', message, metadata)

# Uso
logger = Logger('python-app')
logger.success('User created', {'userId': '123'})

try:
    # operazione
    pass
except Exception as e:
    logger.error('Operation failed', e, {'operation': 'create_user'})
```

---

## 🔄 FETCH LOGS

### Get Logs with Filters
```javascript
async function getLogs(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`http://localhost:3001/api/logs?${params}`);
  return await response.json();
}

// Esempi di uso
const allLogs = await getLogs();
const errorLogs = await getLogs({ level: 'error' });
const appLogs = await getLogs({ app: 'my-app', limit: 50 });
const recentErrors = await getLogs({ 
  app: 'payment-service', 
  level: 'error',
  startDate: '2024-02-01',
  endDate: '2024-02-28'
});
```

### Get Statistics
```javascript
async function getStats(app = null) {
  const url = app 
    ? `http://localhost:3001/api/logs/stats?app=${app}`
    : 'http://localhost:3001/api/logs/stats';
  
  const response = await fetch(url);
  return await response.json();
}

// Uso
const allStats = await getStats();
const appStats = await getStats('my-app');

console.log('Errori totali:', allStats.data.byLevel.find(l => l._id === 'error')?.count);
```

### Get Apps
```javascript
async function getApps() {
  const response = await fetch('http://localhost:3001/api/logs/apps');
  const data = await response.json();
  return data.data;
}

// Uso
const apps = await getApps();
console.log('Apps disponibili:', apps);
```

---

## 🎯 USE CASES

### 1. User Authentication
```javascript
// Login success
await logger.success('User logged in', {
  userId: user.id,
  email: user.email,
  loginMethod: 'email',
  ip: req.ip
});

// Login failed
await logger.warning('Failed login attempt', {
  email: req.body.email,
  reason: 'invalid_password',
  attempts: loginAttempts,
  ip: req.ip
});
```

### 2. Payment Processing
```javascript
// Payment success
await logger.success('Payment processed', {
  orderId: order.id,
  amount: order.total,
  currency: 'EUR',
  paymentMethod: 'credit_card',
  userId: user.id
});

// Payment error
await logger.error('Payment failed', {
  orderId: order.id,
  amount: order.total,
  errorCode: error.code,
  errorMessage: error.message,
  userId: user.id
}, error.stack);
```

### 3. API Rate Limiting
```javascript
if (requestCount > RATE_LIMIT * 0.8) {
  await logger.warning('Approaching rate limit', {
    userId: user.id,
    currentRequests: requestCount,
    limit: RATE_LIMIT,
    percentage: (requestCount / RATE_LIMIT * 100).toFixed(2)
  });
}
```

### 4. Background Jobs
```javascript
const startTime = Date.now();

try {
  await runJob();
  const duration = Date.now() - startTime;
  
  await logger.success('Job completed', {
    jobName: 'daily-cleanup',
    duration: `${duration}ms`,
    itemsProcessed: results.count
  });
} catch (error) {
  await logger.error('Job failed', {
    jobName: 'daily-cleanup',
    duration: `${Date.now() - startTime}ms`,
    error: error.message
  }, error.stack);
}
```

### 5. Database Operations
```javascript
// Successful query
await logger.info('Database query executed', {
  query: 'SELECT * FROM users',
  duration: '45ms',
  rowsReturned: 150
});

// Connection error
await logger.error('Database connection failed', {
  host: 'db.example.com',
  port: 5432,
  database: 'mydb',
  error: error.message
}, error.stack);
```

---

## 🧪 TESTING SCRIPT

Salva questo come `test-logging.js` ed eseguilo con `node test-logging.js`:

```javascript
const API_URL = 'http://localhost:3001/api/logs';

async function testLog(name, payload) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    console.log(`✓ ${name}:`, data.success ? 'OK' : 'FAILED');
  } catch (error) {
    console.error(`✗ ${name}:`, error.message);
  }
}

async function runTests() {
  console.log('🧪 Testing Log API...\n');

  await testLog('Success Log', {
    app: 'test-app',
    level: 'success',
    message: 'Test success message'
  });

  await testLog('Error Log', {
    app: 'test-app',
    level: 'error',
    message: 'Test error message',
    stackTrace: 'Error at line 1'
  });

  await testLog('Warning Log', {
    app: 'test-app',
    level: 'warning',
    message: 'Test warning message'
  });

  await testLog('Info Log', {
    app: 'test-app',
    level: 'info',
    message: 'Test info message',
    metadata: { test: true }
  });

  console.log('\n✅ All tests completed!');
  console.log('🌐 Check http://localhost:3001 to see the logs\n');
}

runTests();
```

---

**Pronto per copiare e usare! 🚀**
