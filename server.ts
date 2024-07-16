import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

const storeItems = new Map([
  [1, {priceInCents: 1000, name: 'Vegan Pancakes'}],
  [2, {priceInCents: 1500, name: 'Tofu Scramble'}],
]);

// Import Stripe library
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51Pba9tRo35rgW6dlVY3ZPQDBpSpDeCkOnfuQ62UvTtaGQNJUP8Fjmcn5sZUnwgVQi32gDrYcBuRkdmbDF3u0mGZF00HNC0Bpdg', {
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
  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // Define the Stripe checkout endpoint
  server.post('/create-checkout-session', async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: req.body.items.map((item: {
          quantity: number; id: number; 
}) => {
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

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
