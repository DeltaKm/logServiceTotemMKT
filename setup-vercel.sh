#!/bin/bash

# Script per configurare Vercel

echo "🚀 Configurazione Vercel..."
echo ""

# Verifica se vercel CLI è installato
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI non installato"
    echo "📥 Installa con: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI trovato"
echo ""

# Login se necessario
echo "🔐 Verifica autenticazione..."
vercel whoami || vercel login

echo ""
echo "📝 Aggiunta variabile d'ambiente DATABASE_URL..."

# Leggi DATABASE_URL da .env.local
if [ -f .env.local ]; then
    DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d '=' -f 2- | tr -d '"')
    echo "$DATABASE_URL" | vercel env add DATABASE_URL production
    echo "$DATABASE_URL" | vercel env add DATABASE_URL preview  
    echo "$DATABASE_URL" | vercel env add DATABASE_URL development
    echo "✅ Variabile aggiunta!"
else
    echo "❌ File .env.local non trovato"
    exit 1
fi

echo ""
echo "🔄 Rideploy dell'applicazione..."
vercel --prod

echo ""
echo "✅ Deploy completato!"
echo "🌐 La tua app è online!"
