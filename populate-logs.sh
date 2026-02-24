#!/bin/bash

# Script per testare l'API e creare log di esempio
# Assicurati che il server Next.js sia in esecuzione su localhost:3001

API_URL="http://localhost:3001/api/logs"

echo "🚀 Creazione log di esempio..."
echo ""

# Log di successo
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "e-commerce-app",
    "level": "success",
    "message": "Ordine creato con successo",
    "metadata": {"orderId": "ORD-12345", "amount": 99.99, "userId": "user_001"},
    "environment": "production"
  }' -s > /dev/null && echo "✓ Log 1 creato"

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "auth-service",
    "level": "success",
    "message": "Login utente effettuato",
    "metadata": {"userId": "user_002", "ip": "192.168.1.10"},
    "userId": "user_002",
    "environment": "production"
  }' -s > /dev/null && echo "✓ Log 2 creato"

# Log di errore
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "payment-service",
    "level": "error",
    "message": "Errore nel processamento del pagamento",
    "metadata": {"errorCode": "PAYMENT_DECLINED", "cardType": "VISA"},
    "stackTrace": "Error: Payment declined\n    at processPayment (payment.js:45)\n    at handleOrder (order.js:120)",
    "environment": "production"
  }' -s > /dev/null && echo "✓ Log 3 creato"

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "database-service",
    "level": "error",
    "message": "Connessione al database fallita",
    "metadata": {"host": "db.example.com", "port": 5432, "attempts": 3},
    "stackTrace": "Error: ECONNREFUSED\n    at Socket.connect (net.js:156)\n    at Database.connect (db.js:89)",
    "environment": "production"
  }' -s > /dev/null && echo "✓ Log 4 creato"

# Log di warning
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "api-gateway",
    "level": "warning",
    "message": "Limite di rate limiting quasi raggiunto",
    "metadata": {"userId": "user_003", "requests": 95, "limit": 100},
    "userId": "user_003",
    "environment": "production"
  }' -s > /dev/null && echo "✓ Log 5 creato"

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "cache-service",
    "level": "warning",
    "message": "Cache quasi piena",
    "metadata": {"usagePercentage": 85, "maxSize": "1GB"},
    "environment": "production"
  }' -s > /dev/null && echo "✓ Log 6 creato"

# Log di info
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "notification-service",
    "level": "info",
    "message": "Email inviata con successo",
    "metadata": {"to": "user@example.com", "type": "welcome"},
    "environment": "production"
  }' -s > /dev/null && echo "✓ Log 7 creato"

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "backup-service",
    "level": "info",
    "message": "Backup giornaliero completato",
    "metadata": {"size": "2.5GB", "duration": "15m", "files": 1234},
    "environment": "production"
  }' -s > /dev/null && echo "✓ Log 8 creato"

# Log da altre app
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "mobile-app",
    "level": "error",
    "message": "Crash dell'\''applicazione rilevato",
    "metadata": {"version": "2.1.0", "device": "iPhone 13", "os": "iOS 16"},
    "stackTrace": "Fatal Exception: NSInvalidArgumentException\n    at [AppDelegate application:didFinishLaunchingWithOptions:]",
    "environment": "production"
  }' -s > /dev/null && echo "✓ Log 9 creato"

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "analytics-service",
    "level": "info",
    "message": "Report mensile generato",
    "metadata": {"period": "2024-01", "users": 15420, "revenue": 45678.90},
    "environment": "production"
  }' -s > /dev/null && echo "✓ Log 10 creato"

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "scheduler-service",
    "level": "success",
    "message": "Job notturno eseguito",
    "metadata": {"jobName": "cleanup-old-logs", "duration": "5m23s", "deletedRows": 15000},
    "environment": "production"
  }' -s > /dev/null && echo "✓ Log 11 creato"

echo ""
echo "✅ Log di esempio creati con successo!"
echo "🌐 Apri http://localhost:3001 per visualizzare la dashboard"
