# JusVend MERN Project

This project is a full MERN stack rewrite of the JusVend stationery shop.

## Structure
- **server/**: Node.js + Express + MongoDB Backend.
- **client/**: React + Vite Frontend.

## Prerequisites
- Node.js installed.
- MongoDB installed and running locally on default port (27017).

## How to Run

### 1. Start the Backend
Open a terminal in VS Code:
```bash
cd JusVend_MERN/server
npm start
```
*Note: This runs `node server.js`.*

### 2. Start the Frontend
Open a **second** terminal in VS Code:
```bash
cd JusVend_MERN/client
npm run dev
```

### 3. Open in Browser
Visit `http://localhost:5173` (or the URL shown in the frontend terminal).

## Features
- **Shop**: Filter by Category and Price.
- **Cart**: Add items, adjust quantity, checkout.
- **Auth**: Register and Login to save order history.
- **Print**: Upload files for printing (saved to `server/uploads`).
- **Orders**: View past orders.

## Initial Data
The database is auto-seeded with 20 stationary items (Pens, Notebooks, etc.) using the `scripts/seed.js` script which was run during setup.
