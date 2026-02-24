// Script di esempio per testare l'API di log
// Esegui con: node test-api.js

const API_URL = 'http://localhost:3000/api/logs';

// Funzione per creare log di test
async function createTestLog(app, level, message, additionalData = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app,
        level,
        message,
        ...additionalData,
      }),
    });

    const data = await response.json();
    console.log(`✓ Log creato: ${app} - ${level} - ${message}`);
    return data;
  } catch (error) {
    console.error(`✗ Errore nella creazione del log:`, error.message);
  }
}

// Funzione principale per creare log di esempio
async function createSampleLogs() {
  console.log('🚀 Creazione log di esempio...\n');

  // Log di successo
  await createTestLog(
    'e-commerce-app',
    'success',
    'Ordine creato con successo',
    {
      metadata: { orderId: 'ORD-12345', amount: 99.99, userId: 'user_001' },
      environment: 'production',
    }
  );

  await createTestLog(
    'auth-service',
    'success',
    'Login utente effettuato',
    {
      metadata: { userId: 'user_002', ip: '192.168.1.10' },
      userId: 'user_002',
      environment: 'production',
    }
  );

  // Log di errore
  await createTestLog(
    'payment-service',
    'error',
    'Errore nel processamento del pagamento',
    {
      metadata: { errorCode: 'PAYMENT_DECLINED', cardType: 'VISA' },
      stackTrace: 'Error: Payment declined\n    at processPayment (payment.js:45)\n    at handleOrder (order.js:120)',
      environment: 'production',
    }
  );

  await createTestLog(
    'database-service',
    'error',
    'Connessione al database fallita',
    {
      metadata: { host: 'db.example.com', port: 5432, attempts: 3 },
      stackTrace: 'Error: ECONNREFUSED\n    at Socket.connect (net.js:156)\n    at Database.connect (db.js:89)',
      environment: 'production',
    }
  );

  // Log di warning
  await createTestLog(
    'api-gateway',
    'warning',
    'Limite di rate limiting quasi raggiunto',
    {
      metadata: { userId: 'user_003', requests: 95, limit: 100 },
      userId: 'user_003',
      environment: 'production',
    }
  );

  await createTestLog(
    'cache-service',
    'warning',
    'Cache quasi piena',
    {
      metadata: { usagePercentage: 85, maxSize: '1GB' },
      environment: 'production',
    }
  );

  // Log di info
  await createTestLog(
    'notification-service',
    'info',
    'Email inviata con successo',
    {
      metadata: { to: 'user@example.com', type: 'welcome' },
      environment: 'production',
    }
  );

  await createTestLog(
    'backup-service',
    'info',
    'Backup giornaliero completato',
    {
      metadata: { size: '2.5GB', duration: '15m', files: 1234 },
      environment: 'production',
    }
  );

  // Log da diverse app
  await createTestLog(
    'mobile-app',
    'error',
    'Crash dell\'applicazione rilevato',
    {
      metadata: { version: '2.1.0', device: 'iPhone 13', os: 'iOS 16' },
      stackTrace: 'Fatal Exception: NSInvalidArgumentException\n    at [AppDelegate application:didFinishLaunchingWithOptions:]',
      environment: 'production',
    }
  );

  await createTestLog(
    'analytics-service',
    'info',
    'Report mensile generato',
    {
      metadata: { period: '2024-01', users: 15420, revenue: 45678.90 },
      environment: 'production',
    }
  );

  await createTestLog(
    'scheduler-service',
    'success',
    'Job notturno eseguito',
    {
      metadata: { jobName: 'cleanup-old-logs', duration: '5m23s', deletedRows: 15000 },
      environment: 'production',
    }
  );

  console.log('\n✅ Log di esempio creati con successo!');
  console.log('🌐 Apri http://localhost:3000 per visualizzare la dashboard');
}

// Esegui lo script
createSampleLogs();
