# Vercel Deployment Guide

## Quick Deployment Steps

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy to Vercel

```bash
vercel
```

### 4. Deploy to Production

```bash
vercel --prod
```

## Environment Variables Setup

After deployment, you need to configure environment variables in the Vercel dashboard:

1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to Settings → Environment Variables
3. Add the following variables:

### Required Environment Variables

```env
# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Client URL (Update this to your frontend URL)
CLIENT_URL=https://your-frontend-domain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# AI
GEMINI_API_KEY=your_gemini_api_key
```

## Important Configuration Notes

### 1. Database

- Ensure your MongoDB database is accessible from Vercel's servers
- Use MongoDB Atlas for cloud-hosted database
- Whitelist Vercel's IP addresses if needed

### 2. CORS Configuration

- Update `CLIENT_URL` to your frontend URL
- For development: `http://localhost:3000`
- For production: `https://your-frontend-domain.com`

### 3. OAuth Callback URLs

Update your OAuth provider settings:

- Google: `https://your-backend-domain.vercel.app/api/auth/google/callback`
- GitHub: `https://your-backend-domain.vercel.app/api/auth/github/callback`

### 4. Stripe Webhooks

Configure Stripe webhook endpoints:

- `https://your-backend-domain.vercel.app/api/webhook`

## API Endpoints

Your API will be available at: `https://your-project-name.vercel.app`

### Health Check

- `/health` - Check if the server is running

### Base URL: `/api`

Available endpoints:

- Authentication: `/api/auth`
- Mentors: `/api/mentors`
- Students: `/api/students`
- Bookings: `/api/bookings`
- Messages: `/api/messages`
- Reviews: `/api/reviews`
- Workshops: `/api/workshops`
- Admin: `/api/admin`
- AI Services: `/api/ai`
- Payments: `/api/payment`

## Socket.IO

**Note**: Socket.IO real-time messaging is not supported in Vercel's serverless environment. For real-time features, consider:

1. **Alternative Solutions**:

   - Use a separate WebSocket service (like Pusher, Socket.io Cloud, or Ably)
   - Implement polling for real-time updates
   - Use Server-Sent Events (SSE) for one-way real-time communication

2. **Migration Options**:
   - Deploy Socket.IO server separately on a platform that supports WebSockets (Railway, Render, Heroku)
   - Use a managed WebSocket service
   - Implement real-time features using polling or SSE

For now, the REST API endpoints will work perfectly on Vercel.

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Set**

   - Check Vercel dashboard → Settings → Environment Variables
   - Ensure all variables are properly configured

2. **Database Connection Issues**

   - Verify MongoDB connection string
   - Check if database is accessible from Vercel

3. **CORS Errors**

   - Update `CLIENT_URL` environment variable
   - Check frontend URL configuration

4. **File Upload Issues**

   - Verify Cloudinary configuration
   - Check Cloudinary credentials

5. **Payment Issues**
   - Use correct Stripe keys (test/live)
   - Configure webhook endpoints

### Checking Logs:

```bash
vercel logs
```

### Redeploying:

```bash
vercel --prod
```

## Support

If you encounter issues:

1. Check Vercel function logs
2. Verify all environment variables
3. Test API endpoints individually
4. Check database connectivity
