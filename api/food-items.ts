import { env } from 'process';
import { createRequire } from 'module';
import type { VercelRequest, VercelResponse } from '@vercel/node';
const require = createRequire(import.meta.url);
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


let isConnected = false;

async function connectToDatabase() {
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

const { model, Schema, Document } = mongoose;

const itemSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true }
});

const Item = model('Item', itemSchema);

export default async function foodItems(req: VercelRequest, res: VercelResponse) {
  try {
    await connectToDatabase();

    const { type, ids } = req.query;
    let filter: any = {};

    if (type) filter.type = type;
    if (ids) {
      const idsArray = (ids as string).split(',').map(id => new ObjectId(id));
      filter._id = { $in: idsArray };
    }

    const items = await Item.find(filter);
    
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', Error);
    res.status(500).json({ error: 'Error fetching items', details: error });
  }
};
