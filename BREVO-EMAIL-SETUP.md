# Brevo Email Service Setup Guide

## Overview

This guide explains how to set up Brevo (formerly SendinBlue) for reliable email delivery from your contact form. Brevo is free, reliable, and doesn't require DNS configuration.

## Why Brevo?

- ✅ **Free tier**: 300 emails/day forever
- ✅ **No DNS setup required**: Works immediately
- ✅ **Reliable delivery**: 99.9% deliverability
- ✅ **Professional emails**: Beautiful templates
- ✅ **Global infrastructure**: Fast delivery worldwide

## Setup Instructions

### Step 1: Create Brevo Account

1. **Go to Brevo**: Visit [brevo.com](https://brevo.com)
2. **Sign up for free**: Click "Sign up free"
3. **Choose plan**: Select the Free plan (300 emails/day)
4. **Verify email**: Complete email verification
5. **Complete profile**: Add your business information

### Step 2: Generate API Key

1. **Login to Brevo dashboard**
2. **Go to API & Integration**: Click on your profile → API & Integration
3. **Generate API Key**:
   - Click "Generate a new API key"
   - Name: `OptiScale360 Contact Form`
   - Type: Select `Full access` or `Send emails`
   - Click "Generate"
4. **Copy the API Key**: Save it securely (starts with `xkeysib-`)

### Step 3: Add to Cloudflare Environment Variables

1. **Go to Cloudflare Pages Dashboard**:
   - Visit [dash.cloudflare.com/pages](https://dash.cloudflare.com/pages)
   - Select your `optiscale360` project

2. **Add Environment Variable**:
   - Go to **Settings** → **Environment Variables**
   - Click **Add variable**
   - **Name**: `BREVO_API_KEY`
   - **Value**: Your Brevo API key (from Step 2)
   - **Environment**: Production ✅
   - Click **Save**

### Step 4: Test the Setup

1. **Wait for deployment** (2-3 minutes)
2. **Test the contact form**:
   - Visit: https://optiscale360.pages.dev/contact.html
   - Fill out with real email address
   - Submit the form
3. **Check emails**:
   - Lead notification: `vinod@optiscale360.com`
   - Customer acknowledgment: Your test email

## Email Content

### Lead Notification Email (to vinod@optiscale360.com)
- **Subject**: 🚀 New Lead Alert: [Customer Name] - [Service]
- **Content**: Complete contact details, customer message, lead ID
- **Features**: Direct reply button, professional formatting
- **Priority**: 24-hour response reminder

### Customer Acknowledgment Email (to visitor)
- **Subject**: Thank You [First Name] - Your OptiScale 360 Consultation Request
- **Content**: Welcome message, next steps, contact info
- **Features**: Professional branding, exclusive bonus offer
- **CTA**: Contact information for immediate assistance

## Brevo Dashboard Features

### Email Statistics
- **Sent emails**: Track all sent emails
- **Delivery rate**: Monitor email deliverability
- **Open rates**: See customer engagement
- **Bounce rates**: Identify delivery issues

### Templates (Optional)
- **Create templates**: Design reusable email templates
- **Personalization**: Add dynamic content
- **A/B testing**: Test different email versions

### Contacts Management
- **Auto-import**: Contacts added automatically
- **Segmentation**: Organize leads by criteria
- **Lists**: Create targeted email lists

## Free Tier Limits

- **300 emails/day**: Perfect for contact forms
- **Unlimited contacts**: No limit on contact storage
- **Basic support**: Email and chat support
- **Brevo branding**: Small footer in emails

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Check the API key is copied correctly
   - Ensure it starts with `xkeysib-`
   - Verify it has email sending permissions

2. **Emails Not Delivered**
   - Check Brevo dashboard for delivery status
   - Verify recipient email addresses
   - Check spam/junk folders

3. **Rate Limit Reached**
   - Monitor daily email usage in Brevo dashboard
   - Upgrade plan if needed (300 emails/day limit)

### Debug Steps

1. **Check Brevo Dashboard**:
   - Go to Statistics → Email activity
   - Look for recent email sends
   - Check delivery status

2. **Verify API Integration**:
   - Check Cloudflare function logs
   - Look for Brevo API response errors
   - Verify environment variable is set

3. **Test API Key**:
   ```bash
   curl -X GET https://api.brevo.com/v3/account \
     -H "accept: application/json" \
     -H "api-key: YOUR_API_KEY"
   ```

## Alternative Email Services

If you prefer other services:

1. **SendGrid**: 100 emails/day free
2. **Mailgun**: 5,000 emails/month free
3. **Amazon SES**: Pay-as-you-go pricing
4. **EmailJS**: Frontend-only solution

## Upgrade Options

### Brevo Paid Plans
- **Starter**: €25/month, unlimited emails
- **Business**: €65/month, advanced features
- **Enterprise**: Custom pricing

### When to Upgrade
- **More than 300 emails/day**: Need higher limits
- **Remove branding**: Professional appearance
- **Advanced features**: Automation, segmentation
- **Priority support**: Faster response times

## Security Best Practices

- ✅ Store API key in environment variables only
- ✅ Never commit API key to code repository
- ✅ Use least privilege (email sending only)
- ✅ Monitor API usage regularly
- ✅ Rotate API keys periodically

## Performance

- **Email delivery**: 1-5 seconds average
- **Global delivery**: Worldwide infrastructure
- **Uptime**: 99.9% service availability
- **Rate limits**: 300 emails/day (free tier)

## Next Steps

1. ✅ Create Brevo account
2. ✅ Generate API key
3. ✅ Add to Cloudflare environment variables
4. ✅ Test contact form
5. ✅ Monitor email delivery in Brevo dashboard

The contact form will now send professional emails reliably using Brevo's infrastructure!

## Support

- **Brevo Documentation**: [help.brevo.com](https://help.brevo.com)
- **API Documentation**: [developers.brevo.com](https://developers.brevo.com)
- **Support**: Contact Brevo support for email delivery issues