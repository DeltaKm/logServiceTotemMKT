#!/bin/bash

echo "🔍 DEBUG: Test responsePayload su Vercel vs Localhost"
echo "======================================================"
echo ""

# URL di Vercel (sostituisci con il tuo)
VERCEL_URL="https://log-app-sage.vercel.app"
LOCAL_URL="http://localhost:3000"

# Payload di test
PAYLOAD='{
  "app": "totem2-debug",
  "level": "success",
  "message": "DEBUG test responsePayload",
  "userId": "debug-user",
  "responsePayload": {
    "test": "vercel-debug",
    "timestamp": "2026-02-26T15:00:00Z",
    "data": {
      "value1": "test1",
      "value2": "test2"
    }
  }
}'

echo "📤 Test 1: Invio a LOCALHOST"
echo "----------------------------"
curl -X POST $LOCAL_URL/api/logs \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" | jq

echo ""
echo ""
echo "📤 Test 2: Invio a VERCEL"
echo "-------------------------"
curl -X POST $VERCEL_URL/api/logs \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" | jq

echo ""
echo ""
echo "✅ Confronta le due risposte sopra:"
echo "   - Entrambe dovrebbero avere 'responsePayload' nella risposta"
echo "   - Se Vercel non ha 'responsePayload', c'è un problema nel deployment"
echo ""
echo "📊 Vai su Vercel Dashboard → Function Logs per vedere:"
echo "   - '🔍 POST /api/logs - Body ricevuto'"
echo "   - '📦 responsePayload ricevuto'"
echo "   - '✅ responsePayload aggiunto ai dati'"
echo "   - '📦 responsePayload salvato nel DB'"
