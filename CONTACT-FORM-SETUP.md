# Contact Form Setup Guide

## Overview

This guide explains how to set up the fully functional contact form with automated email notifications using Cloudflare Workers and Gmail SMTP via Nodemailer.

## Features

✅ **Automated Email Notifications**
- Lead notification email sent to `vinod@optiscale360.com`
- Professional acknowledgment email sent to the visitor
- Beautiful HTML email templates with OptiScale 360 branding

✅ **Advanced Form Processing**
- Client-side validation with real-time feedback
- Server-side validation and sanitization
- Error handling with user-friendly messages
- CORS support for cross-origin requests

✅ **Professional Email Templates**
- Lead notification with comprehensive contact details
- Customer acknowledgment with next steps
- Mobile-responsive email design
- Branded styling with company colors

✅ **Analytics & Tracking**
- Unique lead ID generation
- Google Analytics event tracking
- Submission timestamp and source tracking
- User agent and referrer logging

## Architecture

```
Contact Form (contact.html)
      ↓ (AJAX POST)
Cloudflare Function (/api/contact)
      ↓ (processes form data)
Gmail SMTP (via Nodemailer)
      ↓ (sends emails)
✉️ vinod@optiscale360.com (lead notification)
✉️ customer@email.com (acknowledgment)
```

## Setup Instructions

### 1. Gmail App Password Setup

1. **Enable 2-Factor Authentication**
   - Go to [myaccount.google.com](https://myaccount.google.com)
   - Navigate to Security → 2-Step Verification
   - Enable 2FA if not already enabled (required for App Passwords)

2. **Generate App Password**
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" as the app type
   - Choose "Other (Custom name)" and enter "OptiScale360 Contact Form"
   - Copy the 16-character App Password (format: xxxx xxxx xxxx xxxx)
   - **Important**: This password is different from your regular Gmail password

3. **Configure Gmail Account**
   - Email: `vinod@optiscale360.com`
   - App Password: The 16-character password from step 2
   - SMTP Settings: smtp.gmail.com, port 587, TLS enabled

### 2. Cloudflare Pages Configuration

1. **Add Environment Variables**
   - Go to your Cloudflare Pages dashboard
   - Select your project (`optiscale360`)
   - Go to Settings → Environment Variables
   - Add two new variables:

     **Variable 1:**
     - **Name**: `GMAIL_USER`
     - **Value**: `vinod@optiscale360.com`
     - **Environment**: Production (and Preview if needed)

     **Variable 2:**
     - **Name**: `GMAIL_APP_PASSWORD`
     - **Value**: Your 16-character Gmail App Password (no spaces)
     - **Environment**: Production (and Preview if needed)

   - Click "Save" for each variable

2. **Deploy the Function**
   - The function is already set up in `/functions/api/contact.js`
   - Uses Nodemailer to connect to Gmail SMTP
   - It will be automatically deployed when you push to your repository
   - The endpoint will be available at: `https://optiscale360.pages.dev/api/contact`

### 3. Gmail Security Configuration

1. **Verify Gmail Settings**
   - Ensure 2-Factor Authentication is enabled
   - App Password is generated and copied correctly
   - Account has necessary permissions to send emails

2. **SMTP Configuration Used**
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Security: `TLS/STARTTLS`
   - Authentication: App Password (not regular password)

### 4. Testing the Setup

1. **Test Form Submission**
   - Go to your contact page: `https://optiscale360.pages.dev/contact.html`
   - Fill out the form with test data
   - Submit the form
   - Check for success message

2. **Verify Emails**
   - Check `vinod@optiscale360.com` for lead notification
   - Check test email address for acknowledgment
   - Emails should arrive within 30 seconds to 2 minutes

3. **Check Logs** (if issues occur)
   - Go to Cloudflare Pages dashboard
   - Functions → View functions
   - Click on `/api/contact` function
   - Check "Real-time Logs" for error messages
   - Look for Gmail SMTP connection errors

## Email Templates

### Lead Notification Email
- **To**: vinod@optiscale360.com
- **Subject**: 🚀 New Lead Alert: [Customer Name] - [Service]
- **Content**: Professional lead summary with contact details
- **Features**: Direct reply button, call link, customer message

### Customer Acknowledgment Email
- **To**: Customer's email address
- **Subject**: Thank You [First Name] - Your OptiScale 360 Consultation Request
- **Content**: Welcome message with next steps
- **Features**: Contact information, timeline, exclusive bonus offer

## Form Features

### Client-Side Features
- Real-time form validation
- Field formatting (phone numbers, URLs)
- Loading states and animations
- Success overlay with additional actions
- Google Analytics event tracking

### Server-Side Features
- Comprehensive data validation
- Email format verification
- Error handling and logging
- CORS support for API calls
- Unique lead ID generation

## Customization Options

### 1. Email Content
Edit `/functions/api/contact.js` to modify:
- Email templates (HTML and text versions)
- Subject lines
- Contact information
- Branding and styling

### 2. Form Fields
Edit `contact.html` to:
- Add/remove form fields
- Change validation rules
- Modify styling and layout
- Update success messages

### 3. Notification Settings
In `/functions/api/contact.js`:
- Change recipient email address
- Add CC/BCC recipients
- Modify lead notification format
- Add webhook integrations

## Troubleshooting

### Common Issues

1. **Emails Not Sending**
   - Verify GMAIL_USER and GMAIL_APP_PASSWORD are set correctly in Cloudflare
   - Ensure App Password is 16 characters (no spaces)
   - Check that 2FA is enabled on Gmail account
   - Review function logs for SMTP authentication errors
   - Verify Gmail account can send emails normally

2. **Gmail Authentication Errors**
   - **"Invalid login"**: App Password is incorrect or not generated properly
   - **"Less secure app"**: Use App Password, not regular password
   - **"Username and Password not accepted"**: Verify 2FA is enabled and App Password is correct
   - **"Connection timeout"**: Check if Gmail SMTP is accessible from Cloudflare

3. **Form Submission Errors**
   - Check network tab for API call errors
   - Verify function is deployed correctly
   - Check CORS headers in browser console
   - Validate form data format

4. **Email Delivery Issues**
   - Check spam/junk folders
   - Verify recipient email addresses
   - Test with different email providers
   - Check Gmail's Sent folder to confirm emails were sent

### Debug Steps

1. **Check Function Logs**
   ```bash
   # View recent function logs
   npx wrangler pages functions logs
   ```

2. **Test API Endpoint**
   ```bash
   # Test with curl
   curl -X POST https://optiscale360.pages.dev/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Test",
       "lastName": "User",
       "email": "test@example.com",
       "service": "AI SEO Optimization"
     }'
   ```

3. **Validate Environment Variables**
   - Go to Cloudflare Pages → Settings → Environment Variables
   - Ensure GMAIL_USER and GMAIL_APP_PASSWORD are set and visible
   - Redeploy if variables were recently added

4. **Test Gmail App Password**
   ```bash
   # You can test Gmail SMTP credentials using a simple Node.js script
   # This helps verify the App Password works outside of Cloudflare
   ```

## Security Considerations

- ✅ Input validation and sanitization
- ✅ CORS configuration for allowed origins
- ✅ Rate limiting (handled by Cloudflare)
- ✅ API key environment variable (not hardcoded)
- ✅ No sensitive data in client-side code
- ✅ HTTPS enforcement for all communications

## Performance

- **Function Cold Start**: ~100-200ms
- **Email Delivery**: 1-5 seconds
- **Form Submission**: Total ~2-6 seconds
- **Cloudflare Edge**: Global CDN performance

## Monitoring

### Metrics to Monitor
- Form submission success rate
- Email delivery rate
- Function execution time
- Error rates and types

### Available Logs
- Cloudflare Pages function logs
- Resend delivery logs
- Google Analytics events
- Browser console errors

## Cost Estimation

### Resend Pricing (Free Tier)
- 3,000 emails/month free
- $0.40 per 1,000 emails after that
- No monthly minimums

### Cloudflare Pages Functions
- 100,000 requests/month free
- $0.50 per million requests after that

**Estimated monthly cost for 100 leads**: $0 (within free tiers)

## Support

For technical support with this setup:
- Check this documentation first
- Review Cloudflare Pages documentation
- Check Resend documentation
- Contact the development team

## File Structure

```
optiscale360/
├── contact.html                 # Updated contact form
├── functions/
│   └── api/
│       └── contact.js          # Cloudflare Function
├── wrangler.toml               # Updated with functions config
└── CONTACT-FORM-SETUP.md       # This documentation
```

## Next Steps

1. Set up Resend account and verify domain
2. Add RESEND_API_KEY to Cloudflare environment variables
3. Deploy the updated code to Cloudflare Pages
4. Test the form submission flow
5. Monitor email delivery and form performance

The contact form is now ready for production use with professional email automation!