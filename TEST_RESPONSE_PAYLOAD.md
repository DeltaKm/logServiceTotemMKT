# Test completo responsePayload

## 1. Verifica Model (models/Log.ts)
✅ Interface TypeScript: responsePayload?: Record<string, any>
✅ Schema Mongoose: type: Schema.Types.Mixed (come metadata)

## 2. Verifica API POST (app/api/logs/route.ts)
✅ Salvataggio: responsePayload: body.responsePayload

## 3. Verifica API GET (app/api/logs/route.ts)
✅ Recupero: Log.find().lean() ritorna tutti i campi

## 4. Verifica Frontend (app/page.tsx)
✅ Interface: responsePayload?: Record<string, any>
✅ Visualizzazione: JSON.stringify(log.responsePayload, null, 2)

## Test da fare:

1. Riavvia il server: npm run dev
2. Invia un log con responsePayload:
```bash
curl -X POST http://localhost:3000/api/logs -H "Content-Type: application/json" -d '{
  "app": "test-app",
  "level": "success",
  "message": "Test responsePayload",
  "responsePayload": {
    "status": 200,
    "data": {"userId": "123"}
  }
}'
```
3. Apri http://localhost:3000 e clicca sul log per vedere i dettagli
4. Dovresti vedere il responsePayload formattato in JSON con sfondo verde
