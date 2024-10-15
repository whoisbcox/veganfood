import { Request, Response } from 'express';
import Stripe from 'stripe';
import { connectToDatabase } from '../database';
import { env } from 'process';
import { Item } from '../models/item';


export default async function createCheckoutSessions(req: Request, res: Response): Promise<void> {
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
