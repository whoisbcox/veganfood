
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mongoose = require('mongoose');
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

export { Item };
