// Esempio di utilizzo dell'API da TypeScript
// Puoi integrare questo codice nella tua applicazione

interface LogPayload {
  app: string;
  level: 'success' | 'error' | 'warning' | 'info';
  message: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
  userId?: string;
  environment?: 'development' | 'staging' | 'production';
}

class LoggerClient {
  private apiUrl: string;

  constructor(apiUrl: string = 'http://localhost:3000/api/logs') {
    this.apiUrl = apiUrl;
  }

  async log(payload: LogPayload): Promise<void> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Errore nell\'invio del log:', response.statusText);
      }
    } catch (error) {
      console.error('Errore di connessione al servizio log:', error);
    }
  }

  success(app: string, message: string, metadata?: Record<string, any>): Promise<void> {
    return this.log({ app, level: 'success', message, metadata });
  }

  error(app: string, message: string, error?: Error, metadata?: Record<string, any>): Promise<void> {
    return this.log({
      app,
      level: 'error',
      message,
      metadata,
      stackTrace: error?.stack,
    });
  }

  warning(app: string, message: string, metadata?: Record<string, any>): Promise<void> {
    return this.log({ app, level: 'warning', message, metadata });
  }

  info(app: string, message: string, metadata?: Record<string, any>): Promise<void> {
    return this.log({ app, level: 'info', message, metadata });
  }
}

// Esempio di utilizzo
const logger = new LoggerClient();

// Log di successo
logger.success('my-app', 'Operazione completata', {
  operation: 'user-registration',
  userId: '12345',
});

// Log di errore
try {
  // ... codice che può generare errori
  throw new Error('Qualcosa è andato storto');
} catch (error) {
  logger.error('my-app', 'Errore durante l\'operazione', error as Error, {
    operation: 'data-processing',
  });
}

// Log di warning
logger.warning('my-app', 'Cache quasi piena', {
  usage: 85,
  threshold: 90,
});

// Log di info
logger.info('my-app', 'Processo completato', {
  duration: '5s',
  itemsProcessed: 100,
});

export default LoggerClient;
