import { Request, Response } from 'express';
import { connectToDatabase } from '../database';
import Item from '../models/item';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

export default async function foodItems(req: Request, res: Response): Promise<void> {
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
