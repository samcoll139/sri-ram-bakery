# Sriram Bakery Backend — MongoDB

## 1. Install
Open a terminal inside `backend`:

```bash
npm install
```

## 2. Configure MongoDB
Copy `.env.example` to `.env` and set `MONGO_URI`.

Local MongoDB example:
`MONGO_URI=mongodb://127.0.0.1:27017/sriram_bakery`

MongoDB Atlas can also be used by replacing `MONGO_URI` with the Atlas connection string.

## 3. Seed the bakery data

```bash
npm run seed
```

This inserts the 10 categories and 72 products already present in the frontend catalogue and creates the demo admin.

## 4. Start backend

```bash
npm run dev
```

Backend URL: `http://localhost:8080`
Health check: `http://localhost:8080/api/health`

## 5. Start frontend
Open another terminal in the project root:

```bash
npm install
npm run dev
```

Frontend normally opens at the Vite URL shown in the terminal.

## Demo admin
Email: `admin@sriramcakes.in`
Password: `admin123`

## Demo customer OTP
The backend returns a development OTP to the login screen. Default: `123456`.

## Important
Keep MongoDB running before starting the backend. If using Atlas, internet access is required and the Atlas IP/network access must allow the laptop.
