import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Use public reliable DNS resolvers (Google & Cloudflare) for SRV resolution
dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  console.log('Testing connection to MongoDB Atlas with Google/Cloudflare DNS...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('🎉 SUCCESS! Connected directly to MongoDB Atlas cluster!');
    console.log('   Host:', mongoose.connection.host);
    console.log('   Database:', mongoose.connection.name);
    console.log('   Connection State:', mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
