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
const mongoose = require('mongoose');
const { model, Document } = mongoose;

// Define schema for item collection
const itemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true }
});

// Create mongoose model
const Item = model('Item', itemSchema);

const storeItems = new Map([
  [1, {priceInCents: 1000, name: 'Vegan Pancakes'}],
  [2, {priceInCents: 1500, name: 'Tofu Scramble'}],
]);

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

  // Parse JSON bodies
  server.use(express.json());

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });

  server.get('/api/food-items', async (req, res) => {
    console.log('Fetching food items...');
    try {
      const items = await Item.find();
      res.status(200).json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Error fetching items' });
    }
  });

  // Define the Stripe checkout endpoint
  server.post('/api/create-checkout-session', async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: req.body.items.map((item: { quantity: number; id: number; }) => {
          const storeItem = storeItems.get(item.id);
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: storeItem?.name
              },
              unit_amount: storeItem?.priceInCents
            },
            quantity: item.quantity,
          }
        }),
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}?success=true`,
        cancel_url: `${req.protocol}://${req.get('host')}?canceled=true`,
      });

      res.json({ url: session.url });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).send(errorMessage);
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
    await mongoose.connect('mongodb+srv://whoisbcox:arMQPZUPYdmLTE9w@veganfood.qdagtdn.mongodb.net/veganfood?retryWrites=true&w=majority&appName=veganfood');
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
