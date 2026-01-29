# Webory Backend & Cloud Architecture Guide

This guide explains how to transition your current "Simulated Backend" (which runs in the browser) into a real, secure Cloud Backend using Node.js and MongoDB.

## 1. High-Level Architecture
To make your data secure and accessible from anywhere (not just your local computer), you need three components:

1.  **Frontend (What you have now)**: `index.html`, `dashboard.html`. Hosted on Vercel or Netlify.
2.  **API Server (The "Brain")**: A Node.js app using Express.js. Hosted on Render, Heroku, or AWS.
3.  **Database (The "Vault")**: MongoDB Atlas (Cloud). Stores user accounts and orders securely.

## 2. Setting Up the Server (Node.js)

### Step 1: Initialize Project
Create a folder named `webory-backend` separate from your website.
```bash
mkdir webory-backend
cd webory-backend
npm init -y
npm install express mongoose cors dotenv jsonwebtoken bcryptjs helmet express-rate-limit
```

### Step 2: Basic Server (`server.js`)
```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // Security Headers
const rateLimit = require('express-rate-limit'); // Prevent Spam

const app = express();

// --- SECURITY MIDDLEWARE (OWASP A02 & A05) ---
app.use(helmet()); // Protects against common vulnerabilities
app.use(cors({ origin: 'https://your-webory-domain.com' })); // Only allow YOUR site
app.use(express.json({ limit: '10kb' })); // Prevent DoS payloads

// Rate Limiting (Prevents Brute Force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 // Limit to 100 requests per 15 min
});
app.use(limiter);

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI, () => console.log('Connected to DB'));

// --- ROUTES ---
app.use('/api/auth', require('./routes/auth'));

app.listen(5000, () => console.log('Server running on port 5000'));
```

## 3. Secure Authentication (OWASP A07)

Never store passwords plainly! Use `bcryptjs` to hash them.

### User Model (`models/User.js`)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);
```

## 4. OWASP Top 10 Checklist (2025) implementation

| Vulnerability | Fix in Your Backend |
| :--- | :--- |
| **A01 Broken Access Control** | Use JWTs (`jsonwebtoken`) to verify identity on every dashboard request. |
| **A03 Supply Chain** | Run `npm audit` regularly to check for vulnerable packages. |
| **A05 Injection** | Mongoose (used above) automatically sanitizes queries, preventing SQL/NoSQL injection. |
| **A09 Logging Failures** | Use a specialized logger like `winston` or `morgan` to track all login attempts. |

## 5. Deployment (Going Live)

1.  **Database**: Create a free Cluster on [MongoDB Atlas](https://www.mongodb.com/atlas). Get the connection string.
2.  **Server**: Push code to GitHub. Connect GitHub repo to [Render.com](https://render.com) (Web Service). Add environment variables (`MONGO_URI`, `JWT_SECRET`).
3.  **Frontend**: Update `auth.js` to `fetch('https://your-render-app.onrender.com/api/auth/login')` instead of using `localStorage`.
