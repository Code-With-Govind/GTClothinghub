# 🚀 STEP-BY-STEP FREE HOSTING GUIDE

Complete step-by-step instructions to host your Print-On-Demand streetwear website **100% FREE** with custom domain support, automatic SSL certificates, and MongoDB cloud database.

---

## 📋 Stack Overview for Free Hosting
| Layer | Recommended Free Provider | Free Limit | Setup Time |
| :--- | :--- | :--- | :--- |
| **Database** | **MongoDB Atlas** | 512 MB Free Forever | 3 mins |
| **Backend API** | **Render.com** | Free Web Service (512MB RAM) | 4 mins |
| **Frontend Web App** | **Vercel / Netlify** | Unlimited Free Bandwidth & SSL | 2 mins |

---

## STEP 1: Cloud Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a **Free Account**.
2. Create a new database deployment:
   - Select **M0 Free** cluster tier (512 MB storage).
   - Provider: AWS / Google Cloud (Mumbai or closest region).
3. In **Database Access**:
   - Create a database user (e.g., username: `poduser`, password: `your_strong_password`).
4. In **Network Access**:
   - Click **Add IP Address** -> Select **Allow Access From Anywhere (`0.0.0.0/0`)** so your Render backend can connect.
5. In **Database** -> Click **Connect** -> Choose **Drivers (Node.js)**:
   - Copy your connection string:
   `mongodb+srv://poduser:<password>@cluster0.xxx.mongodb.net/pod_ecommerce?retryWrites=true&w=majority`

---

## STEP 2: Deploy Backend API to Render.com (100% Free)

1. Create a free account on [Render.com](https://render.com).
2. Create a new GitHub / GitLab repository for your code:
   ```bash
   # Push your code to your GitHub
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
3. In Render Dashboard -> Click **New +** -> Select **Web Service**.
4. Connect your GitHub repository.
5. Configure Web Service settings:
   - **Name**: `pod-streetwear-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
6. Under **Environment Variables**, add the following keys:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *(Paste your MongoDB Atlas connection string from Step 1)*
   - `JWT_SECRET`: `super_secret_jwt_key_pod_2026`
   - `FRONTEND_URL`: *(Your Vercel frontend URL, e.g. `https://your-app.vercel.app`)*
   - `RAZORPAY_KEY_ID`: *(Your Razorpay Key)*
   - `RAZORPAY_KEY_SECRET`: *(Your Razorpay Secret)*
   - `POD_PROVIDER`: `mock` *(or `qikink` when live credentials are set)*
   - `POD_API_KEY`: *(Your Qikink API Key)*
   - `POD_API_SECRET`: *(Your Qikink Secret)*

7. Click **Create Web Service**.
8. Once deployed, Render will provide a free API URL, e.g.:
   `https://pod-streetwear-api.onrender.com`

---

## STEP 3: Seed Products & Initial Data to Cloud DB

Run seed command targeting your live Mongo Atlas database:
```bash
# In backend directory:
MONGO_URI="mongodb+srv://poduser:password@cluster0.xxx.mongodb.net/pod_ecommerce" node seeders/seed.js
```

---

## STEP 4: Deploy Frontend Web App to Vercel (100% Free)

1. Create a free account on [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project** -> Import your GitHub repository.
3. Select the `frontend` folder as **Root Directory**.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://pod-streetwear-api.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID`: *(Your Razorpay key)*
8. Click **Deploy**.

---

## 🎉 YOUR STORE IS NOW LIVE 24/7 FOR FREE!

- **Frontend URL**: `https://your-brand.vercel.app`
- **Backend API**: `https://pod-streetwear-api.onrender.com/api`
- **Database**: MongoDB Atlas Cloud
- **Fulfillment**: Automatic POD Sync (Mock / Qikink API)
