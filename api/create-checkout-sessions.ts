import { env } from 'process';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRequire } from 'module';
import Stripe from 'stripe';
const require = createRequire(import.meta.url);
const mongoose = require('mongoose');

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

export default async function createCheckoutSessions(req: VercelRequest, res: VercelResponse) {
  const taxRateID = env['TAX_RATE_ID'] as string;
  const stripeApiKey = env['STRIPE_PRIVATE_KEY'] as string;
  const stripe = new Stripe(stripeApiKey, { apiVersion: '2024-06-20' });

  try {
    await connectToDatabase();

    const items = req.body;
    const itemDetails = await Item.find({ _id: { $in: items.map((item: { _id: string }) => item._id) } });

    if (itemDetails.length !== items.length) {
      res.status(400).json({ error: 'Some items not found in the database' });
      return;
    }

    const lineItems = items.map((item: { _id: string; quantity: number }) => {
      const itemDetail = itemDetails.find((detail: { _id: string }) => detail._id.toString() === item._id);
      
      if (!itemDetail) {
        throw new Error(`Item with ID ${item._id} not found in the database`);
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: itemDetail.name
          },
          unit_amount: itemDetail.price * 100
        },
        quantity: item.quantity,
        tax_rates: [taxRateID]
      };
    });

    const orderTime = new Date().toISOString();
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/order-status/?success=true&orderTime=${encodeURIComponent(orderTime)}`,
      cancel_url: `${req.headers.origin}/order-status/?canceled=true`
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).send(error);
  }
};
