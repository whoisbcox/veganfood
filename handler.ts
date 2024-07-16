
import Stripe from 'stripe';
import { env } from 'process';
const stripeApiKey: string = env['STRIPE_PRIVATE_KEY'] as string;
const stripeServer = new Stripe(stripeApiKey, {
  apiVersion: '2024-06-20',
});

export const getHandler = (req: any, res: any) => {
  const func = req.params[0];
  let r = 'wrong endpoint';

  if (func === 'me') 'some data from "me" endpoint';
  if (func === 'you') 'some data from "you" endpoint';
  
  res.status(200).json({ r });
};

export const postHandler = async(req: any, res: any) => {
  const func = req.params[0];

  const lineItems = new Map([
    [1, {priceInCents: 1000, name: 'Vegan Pancakes'}],
    [2, {priceInCents: 1500, name: 'Tofu Scramble'}],
  ]);

  if (func === 'create-checkout-session') {
    const session = await stripeServer.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: '{{PRICE_ID}}',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${env['SERVER_URL']}/success.html`,
      cancel_url: `${env['SERVER_URL']}/cancel.html`,
    });
    res.redirect(303, session.url);
  }
};
