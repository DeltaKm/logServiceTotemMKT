#!/bin/bash

echo "🔍 Testing GET /api/logs..."
echo ""

# Recupera i log
curl -X GET "http://localhost:3000/api/logs?limit=5" \
  -H "Content-Type: application/json" | jq

echo ""
echo "✅ Controlla i log del server per vedere i dati dal database"
