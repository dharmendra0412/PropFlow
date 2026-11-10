import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

async function checkCollections() {
  const uri = process.env.MONGODB_URI;
  console.log('Connecting to MongoDB Atlas to check collections...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`\nFound ${collections.length} collections in database "${mongoose.connection.name}":`);

    let totalDocs = 0;
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(` - Collection "${col.name}": ${count} documents`);
      totalDocs += count;
    }

    console.log(`\nTotal documents across entire database: ${totalDocs}`);
    await mongoose.disconnect();
    return totalDocs;
  } catch (err) {
    console.error('Check failed:', err.message);
  }
}

checkCollections();

