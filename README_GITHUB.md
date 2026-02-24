# Log Verification App 📊

Sistema completo di gestione e monitoraggio log per applicazioni con Next.js e MongoDB.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Caratteristiche

- **📊 Dashboard Interattiva** - Visualizza e filtra i log in tempo reale
- **🔌 API RESTful** - Endpoints completi per gestire i log
- **📈 Statistiche Avanzate** - Contatori e aggregazioni per tipo di log
- **🎨 Design Moderno** - UI responsive con Tailwind CSS
- **🔍 Filtri Dinamici** - Filtra per app, livello, date
- **💾 MongoDB Atlas** - Database cloud scalabile
- **📚 Documentazione Completa** - Pagina interattiva con esempi

## 🎯 Livelli di Log

| Livello | Descrizione | Uso |
|---------|-------------|-----|
| 🟢 **Success** | Operazioni completate con successo | Registrazioni, pagamenti, upload |
| 🔴 **Error** | Errori critici | Crash, errori database, API failure |
| 🟡 **Warning** | Situazioni anomale | Rate limit, cache piena, timeout |
| 🔵 **Info** | Informazioni generali | Backup, report, eventi sistema |

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Documentazione API
![API Docs](docs/screenshots/api-docs.png)

## 🛠️ Installazione

### Prerequisiti
- Node.js 18 o superiore
- Account MongoDB Atlas (o MongoDB locale)
- npm o yarn

### Setup

1. **Clona la repository**
```bash
git clone https://github.com/tuo-username/log-verification.git
cd log-verification
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Configura le variabili d'ambiente**
```bash
cp .env.example .env.local
```

Modifica `.env.local` con la tua stringa di connessione MongoDB:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database_name"
```

4. **Avvia il server di sviluppo**
```bash
npm run dev
```

5. **Apri il browser**
```
http://localhost:3000
```

## 📡 API Endpoints

### Crea Log
```http
POST /api/logs
Content-Type: application/json

{
  "app": "my-application",
  "level": "success",
  "message": "Operazione completata",
  "metadata": {
    "userId": "12345",
    "duration": "234ms"
  },
  "environment": "production"
}
```

### Recupera Log
```http
GET /api/logs?app=my-app&level=error&limit=50
```

### Lista Applicazioni
```http
GET /api/logs/apps
```

### Statistiche
```http
GET /api/logs/stats?app=my-app
```

[📚 Documentazione API Completa](API_REFERENCE.md)

## 💻 Esempi di Utilizzo

### JavaScript/TypeScript
```javascript
await fetch('http://localhost:3000/api/logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    app: 'my-app',
    level: 'error',
    message: 'Errore di connessione',
    stackTrace: error.stack,
    metadata: { userId: '123' }
  })
});
```

### Python
```python
import requests

requests.post('http://localhost:3000/api/logs', json={
    'app': 'my-app',
    'level': 'success',
    'message': 'Operazione completata'
})
```

### cURL
```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{"app":"my-app","level":"info","message":"Test log"}'
```

[🔗 Altri Esempi di Integrazione](ESEMPI_INTEGRAZIONE.md)

## 🧪 Testing

### Popola il database con log di esempio
```bash
chmod +x populate-logs.sh
./populate-logs.sh
```

### Test con Node.js
```bash
node test-api.js
```

## 📦 Deploy

### Vercel (consigliato)
1. Push su GitHub
2. Importa il progetto su [Vercel](https://vercel.com)
3. Aggiungi la variabile d'ambiente `DATABASE_URL`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tuo-username/log-verification)

### Docker
```bash
docker build -t log-verification .
docker run -p 3000:3000 -e DATABASE_URL="your-mongodb-url" log-verification
```

## 🗂️ Struttura del Progetto

```
log-verification/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── logs/         # Endpoints log
│   ├── api-docs/         # Documentazione web
│   └── page.tsx          # Dashboard
├── lib/                   # Utilities
│   └── mongodb.ts        # Connessione DB
├── models/               # Mongoose models
│   └── Log.ts           # Schema log
├── examples/            # Esempi codice
├── docs/                # Documentazione
└── scripts/             # Utility scripts
```

## 📚 Documentazione

- [📖 README](README.md) - Questo file
- [🚀 Guida Rapida](GUIDA_RAPIDA.md) - Setup e primi passi
- [📡 API Reference](API_REFERENCE.md) - Documentazione completa API
- [⚡ Quick Reference](QUICK_REFERENCE.md) - Esempi pronti all'uso
- [🔌 Esempi Integrazione](ESEMPI_INTEGRAZIONE.md) - Integrazione con vari framework
- [📝 Riepilogo](RIEPILOGO.md) - Overview completo

## 🎨 Personalizzazione

### Modifica i colori
Edita `tailwind.config.ts` per personalizzare il tema.

### Aggiungi campi al log
Modifica `models/Log.ts` per aggiungere nuovi campi al database.

### Crea nuovi endpoint
Aggiungi route in `app/api/` seguendo la struttura esistente.

## 🔒 Sicurezza

⚠️ **Importante per la produzione:**

- [ ] Aggiungi autenticazione API (JWT, API keys)
- [ ] Implementa rate limiting
- [ ] Configura CORS appropriatamente
- [ ] Non loggare dati sensibili (password, carte di credito)
- [ ] Usa HTTPS
- [ ] Implementa backup database
- [ ] Whitelist IP su MongoDB Atlas

## 🤝 Contribuire

I contributi sono benvenuti! 

1. Fork il progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 License

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 👨‍💻 Autore

Creato con ❤️ 

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - Framework React
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
- [date-fns](https://date-fns.org/) - Date utilities

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/tuo-username/log-verification?style=social)
![GitHub forks](https://img.shields.io/github/forks/tuo-username/log-verification?style=social)
![GitHub issues](https://img.shields.io/github/issues/tuo-username/log-verification)

## 🌟 Features Future

- [ ] Notifiche email/Slack per errori critici
- [ ] Export logs (CSV, JSON, PDF)
- [ ] Grafici e analytics avanzati
- [ ] Retention policy automatica
- [ ] Search full-text
- [ ] Dashboard multi-team
- [ ] Alerting system
- [ ] Log aggregation da multiple sources

## 📞 Supporto

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/tuo-username/log-verification/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/tuo-username/log-verification/discussions)

---

⭐ Se questo progetto ti è stato utile, lascia una stella su GitHub!

**Made with Next.js, MongoDB, TypeScript, and ❤️**
