# OptiScale 360 - Sanity Headless CMS Setup

## 🚀 Complete Content Management Solution

This setup provides a professional headless CMS solution using Sanity, integrated with Cloudflare Pages for automatic deployment and content synchronization.

## 📋 What's Included

### Content Types
- **Business Templates** - Downloadable templates organized by category
- **Best Practices** - Comprehensive methodology guides
- **Industry Insights** - Latest trends and analysis articles
- **Webinars & Training** - Event scheduling and management
- **FAQs** - Support documentation

### Features
- ✅ Real-time content synchronization
- ✅ Professional admin interface
- ✅ Automatic deployments via Cloudflare Pages
- ✅ Mobile-responsive content management
- ✅ Rich text editing with images
- ✅ SEO-optimized content structure

## 🛠️ Setup Instructions

### 1. Sanity Studio Setup

**Option A: Use Existing Studio (Recommended)**
- Go to [https://optiscale360.sanity.studio](https://optiscale360.sanity.studio)
- Login with your Sanity account
- Start adding content immediately

**Option B: Deploy Your Own Studio**
```bash
cd optiscale360/studio
npm install sanity
npm install
sanity deploy
```

### 2. Content Management Workflow

1. **Access Admin Panel**
   - Open `admin.html` in your browser
   - Click "Open Sanity Studio"

2. **Add Content**
   - Choose content type from sidebar
   - Fill in required fields
   - Click "Publish" to make content live

3. **Content Appears Automatically**
   - Changes sync to website within seconds
   - No manual deployment needed

### 3. Cloudflare Pages Configuration

**Environment Variables** (if deploying your own)
```
SANITY_PROJECT_ID=n8rucjn3
SANITY_DATASET=production
SANITY_API_VERSION=2023-05-03
```

**Build Settings**
- Build command: `npm run build` (if using build process)
- Output directory: `/` (root directory)
- Node.js version: 18+

## 📝 Content Management Guide

### Adding Business Templates

1. Go to **Business Templates** in Sanity Studio
2. Click **Create new Business Template**
3. Fill in:
   - **Title**: Template name
   - **Category**: Select from dropdown
   - **Description**: Brief description
   - **Download URL**: Link to template file
   - **Featured**: Toggle for homepage display

### Creating Best Practices

1. Go to **Best Practices** in Sanity Studio
2. Click **Create new Best Practice**
3. Fill in:
   - **Title**: Practice name
   - **Slug**: Auto-generated URL slug
   - **Summary**: Brief overview
   - **Content**: Full rich-text content
   - **Category**: Practice area

### Publishing Industry Insights

1. Go to **Industry Insights** in Sanity Studio
2. Click **Create new Industry Insight**
3. Fill in:
   - **Title**: Insight headline
   - **Summary**: Article preview
   - **Content**: Full article with images
   - **Industry**: Target industry
   - **Featured**: Highlight on homepage

### Scheduling Webinars

1. Go to **Webinars & Training** in Sanity Studio
2. Click **Create new Webinar**
3. Fill in:
   - **Title**: Event name
   - **Description**: Event details
   - **Event Date**: Date and time
   - **Duration**: Event length
   - **Registration URL**: Sign-up link

### Managing FAQs

1. Go to **FAQs** in Sanity Studio
2. Click **Create new FAQ**
3. Fill in:
   - **Question**: Customer question
   - **Answer**: Rich-text response
   - **Category**: Group by topic
   - **Order**: Display priority

## 🔧 Technical Details

### API Integration
- **Client**: @sanity/client for data fetching
- **Endpoint**: https://n8rucjn3.api.sanity.io/v2023-05-03/data/query/production
- **Real-time**: Content updates automatically
- **CDN**: Sanity CDN for fast global delivery

### Security
- **CORS**: Configured for optiscale360.pages.dev
- **API**: Read-only public access
- **Admin**: Secure Sanity Studio access

### Performance
- **Caching**: CDN-cached content delivery
- **Optimization**: Lazy loading and image optimization
- **Mobile**: Responsive design for all devices

## 🎯 Quick Start Checklist

- [ ] Open [admin.html](admin.html) to access CMS dashboard
- [ ] Click "Open Sanity Studio" to manage content
- [ ] Add your first Business Template
- [ ] Create a Best Practice guide
- [ ] Publish an Industry Insight
- [ ] Schedule a Webinar
- [ ] Add FAQs to Support Center
- [ ] Verify content appears on live pages

## 🆘 Troubleshooting

**Content not appearing?**
- Check browser console for errors
- Verify content is published in Sanity Studio
- Clear browser cache and refresh

**Can't access Sanity Studio?**
- Ensure you have admin access to project n8rucjn3
- Contact Sanity support if login issues persist

**Deployment issues?**
- Check Cloudflare Pages build logs
- Verify environment variables are set
- Ensure _headers file is properly configured

## 📞 Support

For technical support or questions about content management:
- Check browser developer console for errors
- Review Sanity Studio documentation
- Verify API connectivity and permissions

---

**Your content management system is now ready for production use!** 🎉