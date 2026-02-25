const testLog = {
  app: 'test-api',
  level: 'success',
  message: 'API chiamata completata con successo',
  userId: 'user123',
  responsePayload: {
    statusCode: 200,
    data: {
      userId: '12345',
      username: 'mario.rossi',
      email: 'mario@example.com'
    },
    timestamp: '2025-01-20T10:30:00Z',
    requestId: 'req-abc-123'
  }
};

fetch('http://localhost:3001/api/logs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testLog),
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Log creato con successo:');
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('❌ Errore:', error);
  });
