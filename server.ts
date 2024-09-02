import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { env } from 'process';
import Stripe from 'stripe';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import cors from 'cors';
import dotenv from 'dotenv';
const mongoose = require('mongoose');
const { model, Schema } = mongoose;

dotenv.config();

// Define schema for item collection
const itemSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true }
});

// Create mongoose model
const Item = model('Item', itemSchema);
const mongodbServer = env['MONGODB_URI']

// Import Stripe library
const stripeApiKey: string = env['STRIPE_PRIVATE_KEY'] as string;
const stripe = new Stripe(stripeApiKey, {
  apiVersion: '2024-06-20',
});

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.use(cors());
  
  // Parse JSON bodies
  server.use(express.json());

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });

  server.get('/api/food-items', async (req, res) => {
    console.log('Fetching food items...');
    try {
      const { type, ids } = req.query;
      let filter: any = {};

      if (type) {
        filter.type = type;
      }

      if (ids) {
        const idsArray = (ids as string).split(',').map(id => new mongoose.Types.ObjectId(id));
        filter._id = { $in: idsArray };
      }

      console.log(filter);

      const items = await Item.find(filter);
      res.status(200).json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Error fetching items' });
    }
  });

  // Define the Stripe checkout endpoint
  server.post('/api/create-checkout-session', async (req, res) => {
    try {
      const items = req.body;
      
      if (!items) {
        return res.status(400).json({ error: 'Invalid request: items array is required' });
      }
  
      // Fetch item details from the database
      const itemDetails = await Item.find({ _id: { $in: items.map((item: { _id: string; quantity: number }) => item._id) } });
  
      if (itemDetails.length !== items.length) {
        return res.status(400).json({ error: 'Some items not found in the database' });
      }

      // Create line items for Stripe
      const lineItems = items.map((item: { _id: string; quantity: any; }) => {
        const itemDetail = itemDetails.find((detail: { _id: string }) => detail._id.toString() === item._id);

        if (!itemDetail) {
          throw new Error(`Item with ID ${item._id} not found`);
        }

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: itemDetail.name,
            },
            unit_amount: itemDetail.price * 100, // Convert price to cents
          },
          quantity: item.quantity,
          tax_rates: [ env['TAX_RATE_ID'] ]
        };
      });
      
      const orderTime = new Date().toISOString();
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/order-status/?success=true&orderTime=${encodeURIComponent(orderTime)}`,
        cancel_url: `${req.protocol}://${req.get('host')}/order-status/?canceled=true`
      });

      return res.json({ url: session.url });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).send(errorMessage);
    }
  });

  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

async function run(): Promise<void> {
  try {
    await mongoose.connect(mongodbServer);
    console.log('Connected to MongoDB');

    const port = process.env['PORT'] || 4000;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process with failure
  }
}

run();
