# QuickSideTool File Converter - Deployment Guide

This guide covers deploying the complete file conversion system to production.

## 🚀 Overview

The system consists of:
- **Backend**: FastAPI application deployed on Render
- **Frontend**: React.js application deployed on Vercel/Netlify
- **Database**: No database required (stateless design)

## 📋 Prerequisites

- GitHub repository with the code
- Render.com account (for backend)
- Vercel or Netlify account (for frontend)
- Domain name (optional)

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend

1. **Verify Requirements**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Test Locally**:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 4000
   ```

3. **Run Tests**:
   ```bash
   python test_api.py
   ```

### Step 2: Deploy to Render

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   ```
   Name: quicksidetool-backend
   Environment: Python
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
   ```

3. **Environment Variables**:
   ```
   PORT=4000
   MAX_FILE_SIZE=52428800
   CLEANUP_INTERVAL=600
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for build to complete
   - Note the service URL (e.g., `https://quicksidetool-backend.onrender.com`)

### Step 3: Verify Backend

1. **Health Check**:
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```

2. **API Documentation**:
   - Visit: `https://your-backend-url.onrender.com/docs`
   - Test endpoints using the interactive docs

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create `.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

3. **Test Locally**:
   ```bash
   npm start
   ```

4. **Build**:
   ```bash
   npm run build
   ```

### Step 2: Deploy to Vercel

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   ```
   Framework Preset: Create React App
   Root Directory: ./
   Build Command: npm run build
   Output Directory: build
   ```

3. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Note the deployment URL

### Alternative: Netlify Deployment

1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**:
   ```
   Build command: npm run build
   Publish directory: build
   ```

3. **Environment Variables**:
   - Go to Site settings → Environment variables
   - Add: `REACT_APP_API_URL=https://your-backend-url.onrender.com`

## 🔒 Security Configuration

### Backend Security

1. **CORS Configuration**:
   ```python
   # In app.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-frontend-domain.com"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **File Size Limits**:
   ```python
   MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
   ```

3. **Rate Limiting** (Optional):
   ```python
   from slowapi import Limiter, _rate_limit_exceeded_handler
   from slowapi.util import get_remote_address
   
   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter
   app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
   ```

### Frontend Security

1. **Environment Variables**:
   - Never expose API keys in client-side code
   - Use environment variables for configuration

2. **Content Security Policy**:
   ```html
   <!-- In public/index.html -->
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' 'unsafe-inline';">
   ```

## 📊 Monitoring & Analytics

### Backend Monitoring

1. **Render Logs**:
   - Monitor application logs in Render dashboard
   - Set up log aggregation if needed

2. **Health Checks**:
   ```bash
   # Monitor health endpoint
   curl https://your-backend-url.onrender.com/health
   ```

3. **Performance Monitoring**:
   - Monitor response times
   - Track conversion success rates
   - Monitor file processing errors

### Frontend Monitoring

1. **Vercel Analytics**:
   - Enable Vercel Analytics in dashboard
   - Monitor page views and performance

2. **Error Tracking**:
   ```javascript
   // Add error boundary logging
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: "production"
   });
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.11
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          python test_api.py

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 18
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
```

## 🚨 Troubleshooting

### Common Issues

1. **Backend Not Starting**:
   ```bash
   # Check logs
   render logs --service quicksidetool-backend
   
   # Verify requirements
   pip install -r requirements.txt
   ```

2. **CORS Errors**:
   - Verify CORS configuration in backend
   - Check frontend API URL configuration

3. **File Upload Failures**:
   - Check file size limits
   - Verify file type validation
   - Monitor backend logs

4. **Conversion Failures**:
   - Check library dependencies
   - Monitor memory usage
   - Verify file format support

### Performance Optimization

1. **Backend**:
   - Enable gzip compression
   - Optimize image processing
   - Implement caching if needed

2. **Frontend**:
   - Enable code splitting
   - Optimize bundle size
   - Use CDN for static assets

## 📈 Scaling Considerations

### Backend Scaling

1. **Render Scaling**:
   - Upgrade to paid plan for better performance
   - Enable auto-scaling if needed
   - Monitor resource usage

2. **Database** (Future):
   - Add PostgreSQL for user management
   - Implement file storage (AWS S3, etc.)
   - Add Redis for caching

### Frontend Scaling

1. **CDN**:
   - Use Vercel's global CDN
   - Configure custom domain
   - Enable edge caching

2. **Performance**:
   - Implement lazy loading
   - Optimize images
   - Use service workers for caching

## 🔐 Production Checklist

- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] SSL certificates verified
- [ ] Health checks passing
- [ ] Error monitoring configured
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place
- [ ] Documentation updated

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review Render/Vercel documentation
3. Monitor application logs
4. Test endpoints manually
5. Contact support if needed

---

**Happy Deploying! 🚀** 