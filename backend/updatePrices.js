import 'dotenv/config';
import mongoose from 'mongoose';
import { Product } from './models.js';
import seed from './data/seed-data.json' with { type: 'json' };

// Updates ONLY the prices of existing products (matched by id).
// Nothing is deleted; admin-added products and other fields stay untouched.
await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sriram_bakery');
let updated = 0;
for (const p of seed.products) {
  const r = await Product.updateOne(
    { id: p.id },
    { $set: { originalPrice: p.originalPrice, discount: p.discount, finalPrice: p.finalPrice } }
  );
  updated += r.modifiedCount;
}
console.log(`Prices updated for ${updated} products.`);
await mongoose.disconnect();
