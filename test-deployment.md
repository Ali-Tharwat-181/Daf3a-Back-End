# Deployment Test Guide

## Testing Your Deployment

After deploying to Vercel, test these endpoints to ensure everything is working:

### 1. Health Check

```bash
curl https://your-project-name.vercel.app/health
```

Expected response:

```json
{
  "message": "Server is running!",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production"
}
```

### 2. API Root

```bash
curl https://your-project-name.vercel.app/api
```

Expected response: 404 (Endpoint not found) - This is normal as there's no root endpoint.

### 3. Test Authentication Endpoint

```bash
curl https://your-project-name.vercel.app/api/auth
```

Expected response: Should return authentication routes.

## Common Issues and Solutions

### Issue: FUNCTION_INVOCATION_FAILED

**Solution**:

1. Check environment variables are set in Vercel dashboard
2. Ensure MongoDB connection string is correct
3. Verify all required environment variables are configured

### Issue: Database Connection Errors

**Solution**:

1. Use MongoDB Atlas (cloud-hosted)
2. Ensure IP whitelist includes Vercel's IPs
3. Check connection string format

### Issue: CORS Errors

**Solution**:

1. Update `CLIENT_URL` environment variable
2. Set it to your frontend URL in production

## Environment Variables Checklist

Make sure these are set in Vercel dashboard:

- [ ] `MONGO_URI`
- [ ] `JWT_SECRET`
- [ ] `CLIENT_URL`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_PUBLISHABLE_KEY`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GITHUB_CLIENT_ID`
- [ ] `GITHUB_CLIENT_SECRET`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASS`
- [ ] `GEMINI_API_KEY`

## Next Steps

1. **Test the health endpoint** first
2. **Set up environment variables** in Vercel dashboard
3. **Test API endpoints** one by one
4. **Configure frontend** to use the new API URL
5. **Set up real-time features** using alternative solutions

## Support

If you still encounter issues:

1. Check Vercel function logs: `vercel logs`
2. Test locally first: `npm run dev`
3. Verify environment variables
4. Check database connectivity
