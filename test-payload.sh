#!/bin/bash

echo "🧪 Testing responsePayload..."
echo ""

# Invia un log con responsePayload
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
echo "✅ Log inviato! Controlla i log del server per vedere cosa è stato ricevuto."
