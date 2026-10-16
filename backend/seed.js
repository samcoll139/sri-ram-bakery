import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Product, Category, User, Admin } from './models.js';
import seed from './data/seed-data.json' with { type: 'json' };

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sriram_bakery');
await Category.deleteMany({});
await Product.deleteMany({});
await Category.insertMany(seed.categories.map(c => ({ ...c, _id: undefined })));
await Product.insertMany(seed.products.map(p => ({ ...p, _id: undefined })));
const email = (process.env.ADMIN_EMAIL || 'admin@sriramcakes.in').toLowerCase();
const password = process.env.ADMIN_PASSWORD || 'admin123';
await Admin.findOneAndUpdate({email}, {email, passwordHash: await bcrypt.hash(password, 10), name:'Sriram Bakery Admin'}, {upsert:true,new:true,setDefaultsOnInsert:true});
console.log(`Seeded ${seed.categories.length} categories and ${seed.products.length} products.`);
console.log(`Admin: ${email} / ${password}`);
await mongoose.disconnect();
