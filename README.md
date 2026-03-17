# B2B Nexus | Premium Industrial Marketplace

This is a full-stack e-commerce project built with Vue 3 (Vite), Pinia/Vuex, and Node.js (SQLite).

## Setup
1. **Server**: `cd server && npm install && node index.js`
2. **Client**: `cd client && npm install && npm run dev`

## Default Credentials
All accounts share the same password for testing.

**Password**: `password123`

###  Admin Accounts
- `user1@example.com`
- `user2@example.com`
- `user3@example.com`

###  Seller Accounts
- `user6@example.com`
- `user7@example.com`
- `user8@example.com`

### 🛒 Customer Accounts
- `user16@example.com`
- `user17@example.com`
- `user18@example.com`

## Features
- **Dual Payment Integration**: Choose between **Paystack** and **Stripe** at checkout.
- **Admin Control**: Verify sellers and moderate products in the Control Center.
- **Dynamic Marketplace**: Global B2B components with role-based access.

## 🔑 Environment Configuration
Create a `.env` in both `client` and `server` folders.

**Server**:
- `STRIPE_SECRET_KEY`: sk_test_...
- `PAYSTACK_SECRET_KEY`: sk_test_...
- `JWT_SECRET`: any_secret_string

**Client**:
- `VITE_STRIPE_PUBLIC_KEY`: pk_test_...
- `VITE_PAYSTACK_PUBLIC_KEY`: pk_test_...
- `VITE_API_URL`: http://localhost:5000 (Pinia) or 5001 (Vuex)
