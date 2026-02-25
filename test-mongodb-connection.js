// Test connessione MongoDB
const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://user:ShadowCmh2025%40%21@cluster0.0flua7d.mongodb.net/log";

console.log('🔄 Tentativo di connessione a MongoDB...');
console.log('📍 URL:', DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Nasconde credenziali

mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log('✅ Connessione riuscita!');
    console.log('📊 Database:', mongoose.connection.name);
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Errore di connessione:');
    console.error('Tipo errore:', error.name);
    console.error('Messaggio:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 SOLUZIONI:');
      console.log('1. Verifica username e password su MongoDB Atlas');
      console.log('2. Vai su Database Access e controlla le credenziali');
      console.log('3. Resetta la password se necessario');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.log('\n💡 SOLUZIONI:');
      console.log('1. Vai su MongoDB Atlas → Network Access');
      console.log('2. Aggiungi il tuo IP corrente');
      console.log('3. Oppure abilita 0.0.0.0/0 per test');
    }
    
    process.exit(1);
  });
