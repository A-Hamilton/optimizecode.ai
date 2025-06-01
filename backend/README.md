# OptimizeCode.ai Backend

Express.js backend with Firebase Auth, Stripe payments, and OpenAI code optimization.

## 🚀 Quick Start

### 1. Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your configuration values:

```bash
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI (optional - for real AI optimization)
OPENAI_API_KEY=sk-...
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🔧 Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Go to Project Settings → Service Accounts
4. Generate new private key
5. Copy the credentials to your `.env` file

### Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from Developers → API keys
3. Create webhook endpoint pointing to `https://yourdomain.com/api/stripe/webhook`
4. Add webhook secret to `.env`

### Create Stripe Products

Create these products in your Stripe Dashboard:

**Pro Plan:**

- Name: "OptimizeCode.ai Pro"
- Monthly: $29/month
- Yearly: $290/year

**Unleashed Plan:**

- Name: "OptimizeCode.ai Unleashed"
- Monthly: $200/month
- Yearly: $2000/year

Update the price IDs in `src/routes/stripe.js`:

```javascript
const PRICE_IDS = {
  pro: {
    monthly: "price_1234567890", // Your actual price ID
    yearly: "price_1234567891",
  },
  unleashed: {
    monthly: "price_1234567892",
    yearly: "price_1234567893",
  },
};
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify token
- `GET /api/auth/profile` - Get user profile

### User Management

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/usage` - Get usage statistics
- `POST /api/user/track-usage` - Track optimization usage
- `POST /api/user/change-plan` - Change subscription plan

### Stripe Payments

- `POST /api/stripe/create-checkout-session` - Create payment session
- `POST /api/stripe/create-portal-session` - Customer portal
- `GET /api/stripe/subscription-status/:userId` - Check subscription
- `POST /api/stripe/cancel-subscription` - Cancel subscription
- `POST /api/stripe/webhook` - Stripe webhooks

### Code Optimization

- `POST /api/optimize/code` - Optimize single code snippet
- `POST /api/optimize/batch` - Batch optimize files (Pro+)
- `GET /api/optimize/history` - Get optimization history (Pro+)

## 🔒 Authentication

All protected endpoints require a Bearer token:

```javascript
headers: {
  'Authorization': 'Bearer <firebase-id-token>'
}
```

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes
- **CORS Protection**: Configurable allowed origins
- **Helmet**: Security headers
- **Input Validation**: Express Validator
- **Firebase Auth**: Token verification
- **Usage Limits**: Plan-based restrictions

## 📊 Monitoring & Logging

- Morgan HTTP logging
- Detailed error logging
- Webhook event logging
- Usage tracking

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Add environment variables in Vercel dashboard

### Railway

1. Connect GitHub repo to Railway
2. Add environment variables
3. Deploy automatically on push

### Traditional Server

1. Build: `npm run build`
2. Start: `npm start`
3. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name optimizecode-backend
   ```

## 🧪 Testing

```bash
# Run tests
npm test

# Test specific endpoint
curl -X GET http://localhost:3001/health
```

## 📝 Environment Variables

| Variable                | Description           | Required                  |
| ----------------------- | --------------------- | ------------------------- |
| `PORT`                  | Server port           | No (default: 3001)        |
| `NODE_ENV`              | Environment           | No (default: development) |
| `FRONTEND_URL`          | Frontend URL for CORS | Yes                       |
| `FIREBASE_PROJECT_ID`   | Firebase project ID   | Yes                       |
| `FIREBASE_PRIVATE_KEY`  | Firebase private key  | Yes                       |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | Yes                       |
| `STRIPE_SECRET_KEY`     | Stripe secret key     | Yes                       |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes                       |
| `OPENAI_API_KEY`        | OpenAI API key        | No                        |
| `CORS_ORIGINS`          | Allowed CORS origins  | No                        |

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Failed**

   - Verify credentials in `.env`
   - Check Firebase project permissions
   - Ensure private key formatting is correct

2. **Stripe Webhook Errors**

   - Verify webhook secret
   - Check endpoint URL in Stripe dashboard
   - Test with Stripe CLI: `stripe listen --forward-to localhost:3001/api/stripe/webhook`

3. **CORS Issues**

   - Add frontend URL to `CORS_ORIGINS`
   - Check if credentials are included in requests

4. **Rate Limiting**
   - Adjust limits in middleware
   - Implement user-specific rate limiting

## 📞 Support

- Check logs with `npm run dev`
- Test endpoints with Postman/curl
- Monitor webhook events in Stripe dashboard
- Check Firebase logs in console
