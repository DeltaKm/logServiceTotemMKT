#!/bin/bash

# Colori
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Test responsePayload su Vercel${NC}"
echo "=================================================="
echo ""

# Sostituisci con il tuo URL Vercel
VERCEL_URL="https://log-app-sage.vercel.app"

echo -e "${GREEN}📤 Invio log con responsePayload a Vercel...${NC}"
curl -X POST $VERCEL_URL/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "app": "test-vercel-app",
    "level": "success",
    "message": "Test responsePayload su Vercel",
    "userId": "vercel-test-user",
    "responsePayload": {
      "statusCode": 200,
      "testData": {
        "timestamp": "2026-02-26T10:00:00Z",
        "success": true,
        "message": "Test da Vercel"
      },
      "requestId": "vercel-test-123"
    }
  }'

echo ""
echo ""
echo -e "${GREEN}✅ Test completato!${NC}"
echo ""
echo "Vai su Vercel Dashboard → Function Logs per vedere i log:"
echo "1. Cerca '🔍 POST /api/logs'"
echo "2. Controlla '📦 responsePayload ricevuto'"
echo "3. Controlla '✅ responsePayload salvato nel DB'"
echo ""
echo "Poi apri $VERCEL_URL per vedere se il log appare con il responsePayload"
