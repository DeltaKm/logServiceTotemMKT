// Script per verificare cosa c'è nel database MongoDB
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// DATABASE_URL direttamente
const DATABASE_URL = 'mongodb+srv://user:ShadowCmh2025%40%21@cluster0.0flua7d.mongodb.net/log';

const LogSchema = new mongoose.Schema({
  app: String,
  level: String,
  message: String,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: Date,
  stackTrace: String,
  userId: String,
  environment: String,
  responsePayload: mongoose.Schema.Types.Mixed,
}, { strict: false });

const Log = mongoose.models.Log || mongoose.model('Log', LogSchema);

async function checkDatabase() {
  try {
    console.log('🔌 Connessione a MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connesso!\n');

    // Cerca gli ultimi 3 log
    const logs = await Log.find().sort({ timestamp: -1 }).limit(3).lean();
    
    console.log(`📊 Trovati ${logs.length} log recenti:\n`);
    
    logs.forEach((log, index) => {
      console.log(`\n--- LOG ${index + 1} ---`);
      console.log('ID:', log._id);
      console.log('App:', log.app);
      console.log('Message:', log.message);
      console.log('Timestamp:', log.timestamp);
      console.log('\n📦 responsePayload:');
      console.log(JSON.stringify(log.responsePayload, null, 2));
      console.log('\n📝 metadata:');
      console.log(JSON.stringify(log.metadata, null, 2));
      console.log('\n🔍 Tutti i campi disponibili:');
      console.log(Object.keys(log));
      console.log('\n💾 Raw document:');
      console.log(JSON.stringify(log, null, 2));
      console.log('\n' + '='.repeat(50));
    });

  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connessione chiusa');
  }
}

checkDatabase();
