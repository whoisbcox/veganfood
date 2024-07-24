import mongoose from 'mongoose';

const uri = 'mongodb+srv://whoisbcox:arMQPZUPYdmLTE9w@veganfood.qdagtdn.mongodb.net/veganfood?retryWrites=true&w=majority&appName=veganfood';

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model for the items
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true }
});

const Item = mongoose.model('Item', itemSchema);

// Define the items to import
const items = [
  {
    "name": "Vegan Pancakes",
    "description": "Fluffy vegan pancakes with maple syrup and fresh berries.",
    "price": 9.99,
    "type": "brunch",
    "image": "vegan_pancakes.jpg"
  },
  {
    "name": "Avocado Toast",
    "description": "Toasted sourdough topped with mashed avocado, cherry tomatoes, and hemp seeds.",
    "price": 8.99,
    "type": "brunch",
    "image": "avocado_toast.jpg"
  },
  {
    "name": "Tofu Scramble",
    "description": "Seasoned tofu scramble with mixed veggies and whole grain toast.",
    "price": 10.99,
    "type": "brunch",
    "image": "tofu_scramble.jpg"
  },
  {
    "name": "Chia Pudding",
    "description": "Chia pudding with almond milk, topped with fresh fruit and granola.",
    "price": 7.99,
    "type": "brunch",
    "image": "chia_pudding.jpg"
  },
  {
    "name": "Vegan French Toast",
    "description": "Delicious French toast made with vegan ingredients, served with berries and syrup.",
    "price": 10.49,
    "type": "brunch",
    "image": "vegan_french_toast.jpg"
  },
  {
    "name": "Smoothie Bowl",
    "description": "Acai smoothie bowl topped with granola, coconut flakes, and fresh fruit.",
    "price": 9.49,
    "type": "brunch",
    "image": "smoothie_bowl.jpg"
  },
  {
    "name": "Vegan Burger",
    "description": "Juicy vegan burger with lettuce, tomato, and vegan cheese, served with fries.",
    "price": 12.99,
    "type": "dinner",
    "image": "vegan_burger.jpg"
  },
  {
    "name": "Stuffed Bell Peppers",
    "description": "Bell peppers stuffed with quinoa, black beans, and veggies, served with a side salad.",
    "price": 11.99,
    "type": "dinner",
    "image": "stuffed_bell_peppers.jpg"
  },
  {
    "name": "Vegan Lasagna",
    "description": "Layered vegan lasagna with tofu ricotta, marinara sauce, and vegetables.",
    "price": 13.99,
    "type": "dinner",
    "image": "vegan_lasagna.jpg"
  },
  {
    "name": "Mushroom Risotto",
    "description": "Creamy vegan mushroom risotto with fresh herbs and a hint of truffle oil.",
    "price": 14.99,
    "type": "dinner",
    "image": "mushroom_risotto.jpg"
  },
  {
    "name": "Chickpea Curry",
    "description": "Flavorful chickpea curry served with basmati rice and naan bread.",
    "price": 12.49,
    "type": "dinner",
    "image": "chickpea_curry.jpg"
  },
  {
    "name": "Grilled Portobello",
    "description": "Grilled portobello mushrooms with garlic, rosemary, and a side of roasted vegetables.",
    "price": 13.49,
    "type": "dinner",
    "image": "grilled_portobello.jpg"
  },
  {
    "name": "Lentil Stew",
    "description": "Hearty lentil stew with root vegetables and a side of crusty bread.",
    "price": 11.49,
    "type": "dinner",
    "image": "lentil_stew.jpg"
  },
  {
    "name": "Vegan Pizza",
    "description": "Thin-crust vegan pizza with tomato sauce, vegan cheese, and assorted veggies.",
    "price": 14.49,
    "type": "dinner",
    "image": "vegan_pizza.jpg"
  },
  {
    "name": "Green Smoothie",
    "description": "Refreshing smoothie with spinach, banana, apple, and a hint of ginger.",
    "price": 6.99,
    "type": "drinks",
    "image": "green_smoothie.jpg"
  },
  {
    "name": "Almond Milk Latte",
    "description": "Creamy almond milk latte with a shot of espresso.",
    "price": 4.99,
    "type": "drinks",
    "image": "almond_milk_latte.jpg"
  },
  {
    "name": "Matcha Latte",
    "description": "Smooth and earthy matcha latte made with oat milk.",
    "price": 5.49,
    "type": "drinks",
    "image": "matcha_latte.jpg"
  },
  {
    "name": "Berry Smoothie",
    "description": "Mixed berry smoothie with strawberries, blueberries, and raspberries.",
    "price": 6.49,
    "type": "drinks",
    "image": "berry_smoothie.jpg"
  },
  {
    "name": "Herbal Tea",
    "description": "A selection of herbal teas including chamomile, peppermint, and hibiscus.",
    "price": 3.99,
    "type": "drinks",
    "image": "herbal_tea.jpg"
  },
  {
    "name": "Coconut Water",
    "description": "Hydrating coconut water served chilled.",
    "price": 4.49,
    "type": "drinks",
    "image": "coconut_water.jpg"
  }
];

// Import the items into the database
const importItems = async () => {
  try {
    await Item.insertMany(items);
    console.log('Items imported successfully');
  } catch (error) {
    console.error('Error importing items:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Call the import function
importItems();
