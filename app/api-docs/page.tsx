'use client';

import { useState } from 'react';

export default function ApiDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      id: 'create-log',
      method: 'POST',
      path: '/api/logs',
      description: 'Crea un nuovo log nel database',
      headers: {
        'Content-Type': 'application/json',
      },
      requiredFields: ['app', 'level', 'message'],
      optionalFields: ['metadata', 'stackTrace', 'userId', 'environment'],
      examplePayload: {
        app: 'my-application',
        level: 'success',
        message: 'Operazione completata con successo',
        metadata: {
          userId: '12345',
          operation: 'user-registration',
          duration: '234ms',
        },
        userId: 'user_12345',
        environment: 'production',
      },
      exampleCurl: `curl -X POST http://localhost:3001/api/logs \\
  -H "Content-Type: application/json" \\
  -d '{
    "app": "my-application",
    "level": "success",
    "message": "Operazione completata con successo",
    "metadata": {
      "userId": "12345",
      "operation": "user-registration"
    },
    "environment": "production"
  }'`,
      exampleJavaScript: `const response = await fetch('http://localhost:3001/api/logs', {
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
console.log(data);`,
      exampleResponse: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          app: 'my-application',
          level: 'success',
          message: 'Operazione completata con successo',
          metadata: {
            userId: '12345',
            operation: 'user-registration',
            duration: '234ms',
          },
          userId: 'user_12345',
          environment: 'production',
          timestamp: '2024-02-24T15:30:00.000Z',
          createdAt: '2024-02-24T15:30:00.000Z',
          updatedAt: '2024-02-24T15:30:00.000Z',
        },
      },
    },
    {
      id: 'get-logs',
      method: 'GET',
      path: '/api/logs',
      description: 'Recupera i log con filtri opzionali',
      queryParams: {
        app: 'Nome dell\'applicazione (es: my-app)',
        level: 'Livello del log: success, error, warning, info',
        startDate: 'Data inizio in formato ISO (es: 2024-01-01T00:00:00Z)',
        endDate: 'Data fine in formato ISO',
        limit: 'Numero di risultati (default: 100)',
        page: 'Numero pagina (default: 1)',
      },
      exampleCurl: `# Tutti i log
curl http://localhost:3001/api/logs

# Log di una specifica app
curl "http://localhost:3001/api/logs?app=my-application"

# Log di errore
curl "http://localhost:3001/api/logs?level=error"

# Log filtrati per app e livello
curl "http://localhost:3001/api/logs?app=my-app&level=error&limit=20"

# Log in un periodo specifico
curl "http://localhost:3001/api/logs?startDate=2024-02-01&endDate=2024-02-28"`,
      exampleJavaScript: `// Tutti i log
const response = await fetch('http://localhost:3001/api/logs');

// Con filtri
const params = new URLSearchParams({
  app: 'my-application',
  level: 'error',
  limit: '50',
  page: '1'
});
const response = await fetch(\`http://localhost:3001/api/logs?\${params}\`);

const data = await response.json();
console.log(data.data); // Array di log
console.log(data.pagination); // Info paginazione`,
      exampleResponse: {
        success: true,
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            app: 'my-application',
            level: 'error',
            message: 'Errore di connessione al database',
            timestamp: '2024-02-24T15:30:00.000Z',
          },
        ],
        pagination: {
          total: 150,
          page: 1,
          limit: 50,
          pages: 3,
        },
      },
    },
    {
      id: 'get-apps',
      method: 'GET',
      path: '/api/logs/apps',
      description: 'Recupera la lista di tutte le applicazioni che hanno generato log',
      exampleCurl: `curl http://localhost:3001/api/logs/apps`,
      exampleJavaScript: `const response = await fetch('http://localhost:3001/api/logs/apps');
const data = await response.json();
console.log(data.data); // Array di nomi app`,
      exampleResponse: {
        success: true,
        data: ['my-application', 'payment-service', 'auth-service', 'mobile-app'],
      },
    },
    {
      id: 'get-stats',
      method: 'GET',
      path: '/api/logs/stats',
      description: 'Recupera statistiche aggregate sui log',
      queryParams: {
        app: 'Filtra statistiche per una specifica app (opzionale)',
      },
      exampleCurl: `# Statistiche globali
curl http://localhost:3001/api/logs/stats

# Statistiche per una specifica app
curl "http://localhost:3001/api/logs/stats?app=my-application"`,
      exampleJavaScript: `const response = await fetch('http://localhost:3001/api/logs/stats');
const data = await response.json();

console.log(data.data.byLevel); // Conteggi per livello
console.log(data.data.byApp); // Conteggi per app
console.log(data.data.byDay); // Conteggi ultimi 7 giorni`,
      exampleResponse: {
        success: true,
        data: {
          byLevel: [
            { _id: 'success', count: 150 },
            { _id: 'error', count: 45 },
            { _id: 'warning', count: 30 },
            { _id: 'info', count: 200 },
          ],
          byApp: [
            { _id: 'my-application', count: 300, lastLog: '2024-02-24T15:30:00.000Z' },
            { _id: 'payment-service', count: 125, lastLog: '2024-02-24T14:20:00.000Z' },
          ],
          byDay: [
            { _id: { date: '2024-02-24', level: 'success' }, count: 50 },
            { _id: { date: '2024-02-24', level: 'error' }, count: 10 },
          ],
        },
      },
    },
  ];

  const logLevels = [
    { value: 'success', label: 'Success', color: 'green', description: 'Operazioni completate con successo' },
    { value: 'error', label: 'Error', color: 'red', description: 'Errori critici che richiedono attenzione' },
    { value: 'warning', label: 'Warning', color: 'yellow', description: 'Situazioni anomale che potrebbero causare problemi' },
    { value: 'info', label: 'Info', color: 'blue', description: 'Informazioni generali e di debug' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Torna alla Dashboard
          </a>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Documentazione API
          </h1>
          <p className="text-gray-600 text-lg">
            Guida completa per integrare il sistema di log nelle tue applicazioni
          </p>
        </div>

        {/* Base URL */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🌐 Base URL</h3>
          <code className="bg-blue-100 px-3 py-2 rounded text-blue-900 font-mono text-lg">
            http://localhost:3001
          </code>
          <p className="text-blue-800 mt-3">
            Tutti gli endpoint utilizzano questo URL come base. In produzione, sostituisci con il tuo dominio.
          </p>
        </div>

        {/* Log Levels */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Livelli di Log</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logLevels.map((level) => (
              <div
                key={level.value}
                className={`border-l-4 border-${level.color}-500 bg-${level.color}-50 p-4 rounded`}
              >
                <h3 className={`text-lg font-semibold text-${level.color}-900 mb-1`}>
                  {level.label}
                </h3>
                <code className={`bg-${level.color}-100 px-2 py-1 rounded text-sm`}>
                  level: "{level.value}"
                </code>
                <p className={`text-${level.color}-800 mt-2 text-sm`}>{level.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Endpoints */}
        {endpoints.map((endpoint, index) => (
          <div key={endpoint.id} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded font-semibold text-sm ${
                    endpoint.method === 'POST'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {endpoint.method}
                </span>
                <code className="text-lg font-mono text-gray-800">{endpoint.path}</code>
              </div>
              <p className="text-gray-600">{endpoint.description}</p>
            </div>

            {/* Required Fields */}
            {endpoint.requiredFields && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">✅ Campi Obbligatori:</h3>
                <div className="flex flex-wrap gap-2">
                  {endpoint.requiredFields.map((field) => (
                    <code
                      key={field}
                      className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm"
                    >
                      {field}
                    </code>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Fields */}
            {endpoint.optionalFields && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">⭕ Campi Opzionali:</h3>
                <div className="flex flex-wrap gap-2">
                  {endpoint.optionalFields.map((field) => (
                    <code
                      key={field}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                    >
                      {field}
                    </code>
                  ))}
                </div>
              </div>
            )}

            {/* Query Params */}
            {endpoint.queryParams && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🔍 Query Parameters:</h3>
                <div className="bg-gray-50 rounded p-3 space-y-2">
                  {Object.entries(endpoint.queryParams).map(([key, description]) => (
                    <div key={key}>
                      <code className="bg-gray-200 px-2 py-1 rounded text-sm mr-2">
                        {key}
                      </code>
                      <span className="text-gray-600 text-sm">{description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Example Payload */}
            {endpoint.examplePayload && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">📦 Esempio Payload:</h3>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(endpoint.examplePayload, null, 2),
                        `payload-${endpoint.id}`
                      )
                    }
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {copiedEndpoint === `payload-${endpoint.id}` ? '✓ Copiato!' : '📋 Copia'}
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
                  {JSON.stringify(endpoint.examplePayload, null, 2)}
                </pre>
              </div>
            )}

            {/* cURL Example */}
            {endpoint.exampleCurl && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">💻 Esempio cURL:</h3>
                  <button
                    onClick={() =>
                      copyToClipboard(endpoint.exampleCurl, `curl-${endpoint.id}`)
                    }
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {copiedEndpoint === `curl-${endpoint.id}` ? '✓ Copiato!' : '📋 Copia'}
                  </button>
                </div>
                <pre className="bg-gray-900 text-yellow-400 p-4 rounded overflow-x-auto text-sm">
                  {endpoint.exampleCurl}
                </pre>
              </div>
            )}

            {/* JavaScript Example */}
            {endpoint.exampleJavaScript && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">⚡ Esempio JavaScript/TypeScript:</h3>
                  <button
                    onClick={() =>
                      copyToClipboard(endpoint.exampleJavaScript, `js-${endpoint.id}`)
                    }
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {copiedEndpoint === `js-${endpoint.id}` ? '✓ Copiato!' : '📋 Copia'}
                  </button>
                </div>
                <pre className="bg-gray-900 text-cyan-400 p-4 rounded overflow-x-auto text-sm">
                  {endpoint.exampleJavaScript}
                </pre>
              </div>
            )}

            {/* Example Response */}
            <div className="mb-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">✨ Esempio Risposta:</h3>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(endpoint.exampleResponse, null, 2),
                      `response-${endpoint.id}`
                    )
                  }
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {copiedEndpoint === `response-${endpoint.id}` ? '✓ Copiato!' : '📋 Copia'}
                </button>
              </div>
              <pre className="bg-gray-900 text-purple-400 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(endpoint.exampleResponse, null, 2)}
              </pre>
            </div>
          </div>
        ))}

        {/* Esempi Pratici */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Esempi Pratici</h2>

          <div className="space-y-6">
            {/* Esempio 1 */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">1️⃣ Log un'operazione riuscita</h3>
              <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`// Quando un utente si registra con successo
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
});`}
              </pre>
            </div>

            {/* Esempio 2 */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">2️⃣ Log un errore con stack trace</h3>
              <pre className="bg-gray-900 text-red-400 p-3 rounded text-sm overflow-x-auto">
{`// Quando si verifica un errore
try {
  await processPayment(orderId);
} catch (error) {
  await fetch('http://localhost:3001/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app: 'payment-service',
      level: 'error',
      message: \`Errore nel processamento del pagamento: \${error.message}\`,
      metadata: {
        orderId: orderId,
        errorCode: error.code,
        amount: orderAmount
      },
      stackTrace: error.stack,
      environment: 'production'
    })
  });
}`}
              </pre>
            </div>

            {/* Esempio 3 */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">3️⃣ Log un warning</h3>
              <pre className="bg-gray-900 text-yellow-400 p-3 rounded text-sm overflow-x-auto">
{`// Quando un utente si avvicina al limite
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
}`}
              </pre>
            </div>

            {/* Esempio 4 */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                4️⃣ Recupera i log di errore di un'app
              </h3>
              <pre className="bg-gray-900 text-cyan-400 p-3 rounded text-sm overflow-x-auto">
{`// Recupera tutti gli errori di payment-service
const response = await fetch(
  'http://localhost:3001/api/logs?app=payment-service&level=error&limit=50'
);
const { data, pagination } = await response.json();

console.log(\`Trovati \${pagination.total} errori\`);
data.forEach(log => {
  console.log(\`[\${log.timestamp}] \${log.message}\`);
  if (log.metadata) {
    console.log('Metadata:', log.metadata);
  }
});`}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Link Utili</h2>
          <div className="space-y-2">
            <a
              href="/"
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              📊 Dashboard - Visualizza i log
            </a>
            <a
              href="https://github.com/mongoose/mongoose"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              📚 Documentazione Mongoose
            </a>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              ⚡ Documentazione Next.js
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
