#!/bin/bash

echo "🧪 Test 1: Invio log CON responsePayload"
echo "=========================================="
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "app": "test-payload-app",
    "level": "success",
    "message": "Test con responsePayload",
    "userId": "test-user-123",
    "responsePayload": {
      "statusCode": 200,
      "data": {
        "userId": "12345",
        "username": "mario.rossi",
        "email": "mario@test.com"
      },
      "timestamp": "2025-02-25T10:30:00Z",
      "requestId": "req-test-123"
    }
  }'

echo ""
echo ""
echo "🧪 Test 2: Invio log CON metadata (per confronto)"
echo "=================================================="
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "app": "test-metadata-app",
    "level": "info",
    "message": "Test con metadata",
    "userId": "test-user-456",
    "metadata": {
      "version": "1.0.0",
      "source": "test"
    }
  }'

echo ""
echo ""
echo "✅ Test completati!"
echo "📋 Controlla i log del server Next.js per vedere:"
echo "   - Cosa riceve l'endpoint POST"
echo "   - Cosa viene salvato nel DB"
echo "   - Cosa ritorna l'endpoint GET"
