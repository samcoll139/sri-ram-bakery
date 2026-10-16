import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { Product, Category, User, Otp, Address, Order, Review, CustomCakeOrder, Admin } from './models.js';
import * as A from './analytics.js';

const app = express();
const PORT = Number(process.env.PORT || 8080);
const JWT_SECRET = process.env.JWT_SECRET || 'sriram-demo-secret';
app.use(cors()); app.use(express.json({limit:'2mb'}));
const id = v => String(v);
// The pages read o.date and o.statusHistory ([{status, at}]); orders saved before
// statusHistory existed get one built from createdAt/status so tracking never breaks.
const ord = o => ({
  ...o, id: id(o._id), date: o.createdAt,
  statusHistory: o.statusHistory?.length ? o.statusHistory
    : [{ status: 'Pending', at: o.createdAt }, ...(o.status && o.status !== 'Pending' ? [{ status: o.status, at: o.updatedAt || o.createdAt }] : [])],
});
const stamp = status => ({ status, at: new Date() });
function tokenFor(user,type='user'){return jwt.sign({sub:id(user._id),type},JWT_SECRET,{expiresIn:'7d'});}
function auth(required=false, type='user') { return async (req,res,next)=>{ const h=req.headers.authorization||''; if(!h.startsWith('Bearer ')){if(required)return res.status(401).json({error:'Authentication required'}); return next();} try{const p=jwt.verify(h.slice(7),JWT_SECRET); if(p.type!==type) throw Error('wrong token'); req.auth=p; req.user=type==='user'?await User.findById(p.sub):await Admin.findById(p.sub); if(!req.user)throw Error('missing'); next();}catch(e){if(required)return res.status(401).json({error:'Invalid or expired token'}); next();}};}

// ---- OTP email (Gmail SMTP) ----
const MAIL_ENABLED = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
const mailer = MAIL_ENABLED ? nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: { user: process.env.SMTP_USER, pass: String(process.env.SMTP_PASS).replace(/\s+/g, '') }
}) : null;
if (MAIL_ENABLED) console.log('Email OTP enabled (SMTP user: ' + process.env.SMTP_USER + ')');
else console.log('Email OTP disabled: using DEV_OTP. Set SMTP_USER and SMTP_PASS in .env to send real emails.');

async function issueOtp(email){
  const otp = MAIL_ENABLED ? String(crypto.randomInt(100000, 1000000)) : (process.env.DEV_OTP || '123456');
  await Otp.deleteMany({email});
  await Otp.create({email, otp, expiresAt:new Date(Date.now()+10*60e3)});
  if (!MAIL_ENABLED) return {devOtp: otp};
  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Your Sriram Cakes login OTP',
      text: `Your Sriram Cakes OTP is ${otp}. It is valid for 10 minutes. Do not share it with anyone.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px"><h2 style="margin:0 0 8px">Sriram Cakes</h2><p>Your login OTP is</p><p style="font-size:32px;letter-spacing:6px;font-weight:bold;margin:12px 0">${otp}</p><p style="color:#666">Valid for 10 minutes. Do not share this OTP with anyone.</p></div>`
    });
  } catch (e) {
    console.error('OTP email failed:', e.message);
    await Otp.deleteMany({email});
    throw new Error('Could not send OTP email. Please try again.');
  }
  return {};
}

const admin=auth(true,'admin'); const user=auth(true,'user');
app.get('/api/health',(req,res)=>res.json({ok:true,service:'Sriram Bakery Backend',database:mongoose.connection.readyState===1?'MongoDB connected':'MongoDB disconnected'}));

app.get('/api/categories',async(req,res)=>res.json(await Category.find().lean()));
app.get('/api/products',async(req,res)=>{const q={}; if(req.query.category)q.category=req.query.category; if(req.query.search)q.$or=[{name:new RegExp(req.query.search,'i')},{tags:new RegExp(req.query.search,'i')}]; let data=await Product.find(q).lean(); if(req.query.sort==='price-low')data.sort((a,b)=>a.finalPrice-b.finalPrice); if(req.query.sort==='price-high')data.sort((a,b)=>b.finalPrice-a.finalPrice); res.json(data);});
app.get('/api/products/:id',async(req,res)=>{const p=await Product.findOne({id:Number(req.params.id)}).lean(); if(!p)return res.status(404).json({error:'Product not found'});res.json(p);});
app.get('/api/products/:id/related',async(req,res)=>{const p=await Product.findOne({id:Number(req.params.id)}).lean(); if(!p)return res.status(404).json({error:'Product not found'});res.json(await Product.find({category:p.category,id:{$ne:p.id}}).limit(4).lean());});

app.post('/api/auth/register',async(req,res)=>{const {name,email,phone}=req.body||{}; if(!email)return res.status(400).json({error:'Email is required'}); let u=await User.findOne({email:email.toLowerCase()}); if(!u)u=await User.create({name,email:email.toLowerCase(),phone}); try{const r=await issueOtp(u.email); res.json({message:'Registration successful. OTP sent to your email.',...r});}catch(e){res.status(500).json({error:e.message});}});
app.post('/api/auth/request-otp',async(req,res)=>{const email=(req.body?.email||'').trim().toLowerCase(); if(!email)return res.status(400).json({error:'Email is required'}); let u=await User.findOne({email}); if(!u)u=await User.create({email,name:email.split('@')[0]}); try{const r=await issueOtp(email); res.json({message:MAIL_ENABLED?'OTP sent to your email.':'OTP sent. For demo, use the displayed development OTP.',...r});}catch(e){res.status(500).json({error:e.message});}});
app.post('/api/auth/verify-otp',async(req,res)=>{const email=(req.body?.email||'').trim().toLowerCase(),otp=String(req.body?.otp||''); const rec=await Otp.findOne({email,otp}).sort({createdAt:-1}); if(!rec||rec.expiresAt<new Date())return res.status(401).json({error:'Invalid or expired OTP'}); const u=await User.findOne({email}); await Otp.deleteMany({email}); res.json({token:tokenFor(u),user:{id:id(u._id),name:u.name,email:u.email,phone:u.phone}});});
app.get('/api/auth/me',user,async(req,res)=>res.json({user:{id:id(req.user._id),name:req.user.name,email:req.user.email,phone:req.user.phone}}));

app.get('/api/addresses',user,async(req,res)=>res.json((await Address.find({userId:req.user._id}).lean()).map(a=>({...a,id:id(a._id)}))));
app.post('/api/addresses',user,async(req,res)=>{if(req.body.isDefault)await Address.updateMany({userId:req.user._id},{isDefault:false}); const a=await Address.create({...req.body,userId:req.user._id});res.json({...a.toObject(),id:id(a._id)});});
app.put('/api/addresses/:id',user,async(req,res)=>{const a=await Address.findOneAndUpdate({_id:req.params.id,userId:req.user._id},req.body,{new:true}).lean();if(!a)return res.status(404).json({error:'Address not found'});res.json({...a,id:id(a._id)});});
app.delete('/api/addresses/:id',user,async(req,res)=>{await Address.deleteOne({_id:req.params.id,userId:req.user._id});res.json({success:true});});
app.post('/api/addresses/:id/default',user,async(req,res)=>{await Address.updateMany({userId:req.user._id},{isDefault:false});await Address.updateOne({_id:req.params.id,userId:req.user._id},{isDefault:true});res.json({success:true});});

app.post('/api/orders',auth(false,'user'),async(req,res)=>{const {items,address,paymentMethod,amount}=req.body||{}; if(!Array.isArray(items)||!items.length)return res.status(400).json({error:'Cart is empty'}); const o=await Order.create({userId:req.user?req.user._id:null,items,address,paymentMethod,amount,status:paymentMethod==='cod'?'Pending':'Confirmed',statusHistory:paymentMethod==='cod'?[stamp('Pending')]:[stamp('Pending'),stamp('Confirmed')]});res.json(ord(o.toObject()));});
app.get('/api/orders',user,async(req,res)=>{const rows=await Order.find({userId:req.user._id}).sort({createdAt:-1}).lean();res.json(rows.map(o=>ord(o)));});
app.get('/api/orders/:id',async(req,res)=>{const o=await Order.findById(req.params.id).lean();if(!o)return res.status(404).json({error:'Order not found'});res.jsonord(o);});
app.post('/api/orders/:id/confirm',user,async(req,res)=>{const o=await Order.findOneAndUpdate({_id:req.params.id,userId:req.user._id},{status:'Confirmed',$push:{statusHistory:stamp('Confirmed')}},{new:true}).lean();if(!o)return res.status(404).json({error:'Order not found'});res.jsonord(o);});
app.post('/api/orders/:id/cancel',user,async(req,res)=>{const o=await Order.findOneAndUpdate({_id:req.params.id,userId:req.user._id},{status:'Cancelled',$push:{statusHistory:stamp('Cancelled')}},{new:true}).lean();if(!o)return res.status(404).json({error:'Order not found'});res.jsonord(o);});

app.get('/api/reviews',async(req,res)=>res.json((await Review.find().sort({createdAt:-1}).lean()).map(r=>({...r,id:id(r._id)}))));
app.post('/api/reviews',async(req,res)=>{const r=await Review.create(req.body);res.json({...r.toObject(),id:id(r._id)});});
app.delete('/api/reviews/:id',admin,async(req,res)=>{await Review.findByIdAndDelete(req.params.id);res.json({success:true});});
app.post('/api/custom-cake-orders',auth(false,'user'),async(req,res)=>{const c=await CustomCakeOrder.create({userId:req.user?req.user._id:null,payload:req.body});res.json({...c.toObject(),id:id(c._id)});});
app.get('/api/custom-cake-orders',admin,async(req,res)=>res.json((await CustomCakeOrder.find().sort({createdAt:-1}).lean()).map(c=>({...c,id:id(c._id)}))));
app.put('/api/custom-cake-orders/:id/status',admin,async(req,res)=>{const c=await CustomCakeOrder.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true}).lean();res.json({...c,id:id(c._id)});});

app.post('/api/admin/login',async(req,res)=>{const email=(req.body?.email||'').toLowerCase();const a=await Admin.findOne({email});if(!a||!(await bcrypt.compare(req.body?.password||'',a.passwordHash)))return res.status(401).json({error:'Invalid admin credentials'});res.json({token:tokenFor(a,'admin'),admin:{id:id(a._id),name:a.name,email:a.email}});});
app.post('/api/admin/products',admin,async(req,res)=>{const p=await Product.create(req.body);res.json({...p.toObject(),id:p.id});});
app.put('/api/admin/products/:id',admin,async(req,res)=>{const p=await Product.findOneAndUpdate({id:Number(req.params.id)},req.body,{new:true}).lean();if(!p)return res.status(404).json({error:'Product not found'});res.json(p);});
app.delete('/api/admin/products/:id',admin,async(req,res)=>{await Product.deleteOne({id:Number(req.params.id)});res.json({success:true});});
app.post('/api/admin/categories',admin,async(req,res)=>{const c=await Category.create(req.body);res.json(c);});
app.put('/api/admin/categories/:id',admin,async(req,res)=>{const c=await Category.findOneAndUpdate({id:req.params.id},req.body,{new:true}).lean();res.json(c);});
app.delete('/api/admin/categories/:id',admin,async(req,res)=>{await Category.deleteOne({id:req.params.id});res.json({success:true});});
app.get('/api/orders/admin/all',admin,async(req,res)=>{const rows=await Order.find().sort({createdAt:-1}).lean();res.json(rows.map(o=>ord(o)));});
app.put('/api/orders/admin/:id/status',admin,async(req,res)=>{const o=await Order.findByIdAndUpdate(req.params.id,{status:req.body.status,$push:{statusHistory:stamp(req.body.status)}},{new:true}).lean();if(!o)return res.status(404).json({error:'Order not found'});res.jsonord(o);});

// Admin analytics — all maths lives in analytics.js (shapes match the React admin pages).
const loadAnalytics = async () => {
  const [orders, products, users, categories] = await Promise.all([
    Order.find().lean(), Product.find().lean(), User.find().lean(), Category.find().lean(),
  ]);
  return { orders, products, users, categories };
};
const analyticsRoute = (name, build) => app.get(`/api/admin/analytics/${name}`, admin, async (req, res) => {
  try { res.json(build(await loadAnalytics(), req.query)); }
  catch (e) { console.error(`analytics/${name}`, e); res.status(500).json({ error: 'Could not build analytics' }); }
});
analyticsRoute('summary', (d) => A.buildSummary(d.orders));
analyticsRoute('sales', (d, q) => A.buildSales(d.orders, q.range));
analyticsRoute('category', (d) => A.buildCategory(d.orders, d.categories));
analyticsRoute('top-products', (d) => A.buildTopProducts(d.orders));
analyticsRoute('order-status', (d) => A.buildOrderStatus(d.orders));
analyticsRoute('customers', (d) => A.buildCustomers(d.orders, d.users));
analyticsRoute('product-performance', (d) => A.buildProductPerformance(d.orders, d.products, d.categories));
analyticsRoute('period-financials', (d, q) => A.buildPeriodFinancials(d.orders, q.period));
app.get('/api/user/purchases',user,async(req,res)=>{const rows=await Order.find({userId:req.user._id}).sort({createdAt:-1}).lean();res.json(rows.map(o=>ord(o)));});
app.get('/api/user/spending',user,async(req,res)=>{const rows=await Order.find({userId:req.user._id}).lean();const total=rows.reduce((s,o)=>s+Number(o.amount||0),0);res.json({totalSpending:total,totalOrders:rows.length,averageOrderValue:rows.length?total/rows.length:0});});
// ---- Sriram AI chatbot: Gemini replies in the customer's own language ----
// Tamil script -> Tamil, Tanglish (Tamil in English letters) -> Tanglish, English -> English.
// If Gemini isn't configured or the call fails we answer { source: 'fallback' } and the
// frontend uses its own offline engine (which also speaks all three).
const AI_SYSTEM_PROMPT = `You are "Sriram AI", the friendly shopping assistant of Sriram Cakes & Sweets (a bakery in Tamil Nadu).
LANGUAGE RULES (very important): detect the language of the customer's LAST message and reply in the same one.
- Tamil script (தமிழ்) -> reply fully in natural, simple spoken Tamil script.
- Tanglish (Tamil written in English letters, e.g. "birthday cake venum") -> reply in Tanglish, using English letters only.
- English -> reply in English.
- Mixed Tamil/English words -> reply in Tanglish.
Keep product names exactly as in the catalogue (in English letters), even inside Tamil sentences.
STYLE: warm, short (max 3 sentences), a couple of relevant emojis at most.
SCOPE: only help with cakes, sweets, savouries, offers, delivery, orders, custom cakes and reviews. Politely steer other topics back to the shop in the customer's language.
ACCURACY: only recommend products from the catalogue below and quote prices exactly as listed (₹). Never invent products, prices, offers or policies. If unsure, say so and suggest the Contact page.`;

// Offline reply used when Gemini is not configured / fails — also speaks Tamil, Tanglish, English.
const TANGLISH_WORDS = /\b(venum|vendum|enna|epdi|eppadi|irukku|iruku|evlo|evvalavo|vilai|rate|sollunga|solunga|nalla|romba|enaku|ennaku|unga|ungalukku|kudunga|anupunga|eppo|enga|illa|illai|pannunga|panna|vangu|vaangu|vanakkam|nandri|thanks?a?|sapadu|inippu|kaara)\b/i;
function fallbackReply(msg) {
  const lang = /[\u0B80-\u0BFF]/.test(msg) ? 'ta' : TANGLISH_WORDS.test(msg) ? 'tg' : 'en';
  const replies = {
    ta: 'ஸ்ரீராம் பேக்கரிக்கு வரவேற்கிறோம்! கேக், இனிப்பு, கார வகைகள், ஆஃபர், டெலிவரி, ஆர்டர் பற்றி கேளுங்கள் 😊',
    tg: 'Sriram Bakery-ku vanakkam! Cake, sweets, savouries, offers, delivery, order pathi enna venumnalum kelunga 😊',
    en: 'Welcome to Sriram Bakery! Ask me about cakes, sweets, savouries, offers, delivery or orders. 😊',
  };
  return replies[lang];
}

app.post('/api/ai/chat', async (req, res) => {
  const msg = String(req.body?.message || '').slice(0, 1000);
  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
  if (process.env.GEMINI_API_KEY && msg) {
    try {
      const catalogue = (await Product.find({}, 'name category finalPrice').lean())
        .map((p) => `${p.name} (${p.category}, ₹${p.finalPrice})`).join('; ');
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const contents = [
        ...history.map((h) => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(h.text || '').slice(0, 800) }] })),
        { role: 'user', parts: [{ text: msg }] },
      ];
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: `${AI_SYSTEM_PROMPT}\n\nCATALOGUE: ${catalogue}` }] },
          contents,
          generationConfig: { temperature: 0.6, maxOutputTokens: 300 },
        }),
      });
      const j = await r.json();
      const text = j?.candidates?.[0]?.content?.parts?.map((x) => x.text).join('').trim();
      if (text) return res.json({ reply: text, source: 'gemini' });
    } catch { /* fall through to the fallback below */ }
  }
  res.json({ reply: fallbackReply(msg), source: 'fallback' });
});

mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/sriram_bakery').then(async()=>{console.log('MongoDB connected');app.listen(PORT,()=>console.log(`Backend running: http://localhost:${PORT}`));}).catch(err=>{console.error('MongoDB connection failed:',err.message);process.exit(1)});
