# Real Estate Platform

A full-stack real estate listing and property marketplace platform.

## Features
- User Authentication (Buyer, Seller, Admin)
- Property Listings (Sale, Rent, Sold)
- Admin Dashboard (User & Property Management)
- Contact & Inquiry System
- Wishlist for Buyers

## Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

## Getting Started

### 1. Clone/Unzip the project
```bash
# Navigate to the project directory
cd real-estate-platform
```

### 2. Backend Setup
1. Open the `backend` folder.
2. Create a `.env` file based on `.env.example`.
3. Fill in your credentials (MongoDB, JWT, Cloudinary, etc.).
4. Install dependencies and start:
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
1. Open the `frontend` folder.
2. Install dependencies and start:
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables Needed
Check `backend/.env.example` for the full list of required keys.

## Admin Credentials
Ensure you manually set the `role` to `admin` in your MongoDB collection for your first user to access the Admin Panel.
