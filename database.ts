import { env } from 'process';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mongoose = require('mongoose');

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  
  try {
    await mongoose.connect(env['MONGODB_URI'] as string);

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}