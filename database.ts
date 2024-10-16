import { createRequire } from 'module';
import { env } from 'process';
const require = createRequire(import.meta.url);
const mongoose = require('mongoose');

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected || mongoose.connection.readyState === 1) return;
  
  try {
    await mongoose.connect(env['MONGODB_URI'] as string);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}