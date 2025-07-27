# Graduation Project - Backend API

A Node.js/Express backend API for a mentorship platform with real-time messaging, payment processing, and AI features.

## Features

- User authentication and authorization
- Real-time messaging with Socket.IO
- Payment processing with Stripe
- File uploads with Cloudinary
- AI-powered recommendations
- OAuth integration (Google, GitHub)
- Admin dashboard
- Booking system
- Review system

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO
- **Authentication**: JWT, Passport.js
- **File Upload**: Multer + Cloudinary
- **Payments**: Stripe
- **AI**: Google Generative AI
- **Email**: Nodemailer

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
```

## Deployment to Vercel

### Prerequisites

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Make sure you have a Vercel account at [vercel.com](https://vercel.com)

### Deployment Steps

1. **Login to Vercel**:

   ```bash
   vercel login
   ```

2. **Deploy to Vercel**:

   ```bash
   vercel
   ```

3. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Environment Variables on Vercel

After deployment, you need to set up your environment variables in the Vercel dashboard:

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add all the environment variables from your `.env` file

**Important**: Make sure to set the `CLIENT_URL` to your frontend URL in production.

### Configuration Files

The project includes:

- `vercel.json` - Vercel deployment configuration
- `package.json` - Updated with proper scripts for production

### API Endpoints

The API will be available at: `https://your-project-name.vercel.app`

Base URL: `/api`

Available routes:

- `/api/auth` - Authentication routes
- `/api/mentors` - Mentor management
- `/api/students` - Student management
- `/api/bookings` - Booking system
- `/api/messages` - Messaging system
- `/api/reviews` - Review system
- `/api/workshops` - Workshop management
- `/api/admin` - Admin routes
- `/api/ai` - AI services
- `/api/payment` - Payment processing

### Socket.IO Configuration

The real-time messaging feature uses Socket.IO. The Socket.IO server will be available at the same URL as your API.

### Important Notes

1. **Database**: Ensure your MongoDB database is accessible from Vercel's servers
2. **CORS**: Update the `CLIENT_URL` environment variable to your frontend URL
3. **File Uploads**: Cloudinary configuration must be set up correctly
4. **Payments**: Use production Stripe keys for live payments
5. **OAuth**: Update OAuth callback URLs in your OAuth provider settings

### Troubleshooting

- Check Vercel function logs for any deployment issues
- Ensure all environment variables are properly set
- Verify database connectivity
- Check CORS configuration for frontend integration

## License

ISC
