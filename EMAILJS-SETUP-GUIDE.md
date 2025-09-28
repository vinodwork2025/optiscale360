# EmailJS Setup Guide for OptiScale 360

## Overview

This guide will help you set up EmailJS for direct SMTP email sending from your website forms. EmailJS allows you to send emails directly from client-side JavaScript without a backend server.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" to create a free account
3. Verify your email address

## Step 2: Add Email Service

1. **Log in to EmailJS Dashboard**
2. **Go to "Email Services"** in the left sidebar
3. **Click "Add New Service"**
4. **Choose your email provider:**
   - **Gmail** (Recommended for business)
   - **Outlook/Hotmail**
   - **Yahoo**
   - **Custom SMTP**

### For Gmail Setup:
1. Select "Gmail"
2. Enter your Gmail address (info@optiscale360.com)
3. Click "Connect Account" and follow OAuth flow
4. Note the **Service ID** (e.g., `service_gmail_123`)

### For Custom SMTP:
1. Select "Custom SMTP"
2. Enter SMTP settings:
   - **SMTP Server**: smtp.gmail.com (for Gmail)
   - **Port**: 587
   - **Username**: info@optiscale360.com
   - **Password**: Your email password or app password
3. Note the **Service ID**

## Step 3: Create Email Templates

Create two email templates for the different form types:

### Template 1: Contact Form Template

1. **Go to "Email Templates"** in sidebar
2. **Click "Create New Template"**
3. **Template Settings:**
   - **Template Name**: Contact Form Submission
   - **Template ID**: `template_contact_form`

4. **Email Content:**

**Subject:**
```
New Contact Form Submission - {{customer_name}}
```

**Content:**
```
New Contact Form submission from {{customer_name}}

Customer Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: {{first_name}} {{last_name}}
Email: {{customer_email}}
Phone: {{customer_phone}}
Company: {{customer_company}}
Website: {{website}}
Service Interest: {{service}}

Message:
{{message}}

Newsletter Subscription: {{newsletter_subscription}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Timestamp: {{submission_timestamp}}
Source: {{source_url}}
Lead ID: {{lead_id}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is an automated notification from OptiScale 360 website.
Please respond within 24 hours for optimal conversion.
```

### Template 2: Free AI-Ready Website Template

1. **Create another template**
2. **Template Settings:**
   - **Template Name**: Free AI-Ready Website Request
   - **Template ID**: `template_website_request`

3. **Email Content:**

**Subject:**
```
Free AI-Ready Website Request - {{customer_name}}
```

**Content:**
```
New Free AI-Ready Website request from {{customer_name}}

Customer Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: {{first_name}} {{last_name}}
Email: {{customer_email}}
Phone: {{customer_phone}}
Company: {{customer_company}}
Current Website: {{website}}
Business Type: {{business_type}}

Project Goals:
{{message}}

Newsletter Subscription: {{newsletter_subscription}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Timestamp: {{submission_timestamp}}
Source: {{source_url}}
Lead ID: {{lead_id}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 FREE WEBSITE BUILD REQUEST
This customer is requesting a free website build under our
"Build First, Pay What You Value" program.

Please begin the discovery process within 24 hours.
```

## Step 4: Get Your Public Key

1. **Go to "Account"** in the left sidebar
2. **Find "Public Key"** section
3. **Copy the Public Key** (e.g., `user_abc123xyz`)

## Step 5: Configure the Website

1. **Open `email-service.js`** in your code editor
2. **Update the configuration:**

```javascript
class EmailService {
    constructor() {
        this.serviceId = 'your_service_id_here';      // Replace with your Service ID
        this.publicKey = 'your_public_key_here';      // Replace with your Public Key
        // ...
    }
    // ...
}
```

**Example configuration:**
```javascript
this.serviceId = 'service_gmail_123';
this.publicKey = 'user_abc123xyz';
```

## Step 6: Test the Setup

1. **Open browser console** on your website
2. **Run test command:**
```javascript
window.emailAdminFunctions.sendTest()
```

3. **Check your email** (info@optiscale360.com) for test message
4. **Verify configuration:**
```javascript
window.emailAdminFunctions.checkConfig()
```

## Step 7: Template Variables Reference

Your templates can use these variables:

### Basic Customer Info
- `{{customer_name}}` - Full name
- `{{first_name}}` - First name only
- `{{last_name}}` - Last name only
- `{{customer_email}}` - Email address
- `{{customer_phone}}` - Phone number
- `{{customer_company}}` - Company name

### Form-Specific Fields
- `{{website}}` - Website URL (contact) or current website (free site)
- `{{service}}` - Service interest (contact form)
- `{{business_type}}` - Business type (free website)
- `{{message}}` - Message or project goals

### System Info
- `{{newsletter_subscription}}` - "Yes" or "No"
- `{{submission_timestamp}}` - When submitted
- `{{source_url}}` - Page URL where form was submitted
- `{{lead_id}}` - Unique lead identifier
- `{{form_fields}}` - All form fields formatted

## Step 8: Email Delivery Settings

### EmailJS Account Settings
1. **Go to "Account" → "Settings"**
2. **Set monthly email limit** (200 emails/month on free plan)
3. **Configure email notifications** for failures

### Gmail Settings (if using Gmail)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in EmailJS (not your regular password)

## Troubleshooting

### Common Issues

**1. "EmailJS not initialized" error**
- Check your Public Key is correct
- Verify script is loading properly
- Check browser console for errors

**2. "Service not found" error**
- Verify Service ID matches your EmailJS dashboard
- Ensure email service is properly configured

**3. "Template not found" error**
- Check Template ID matches exactly
- Verify templates are published/active

**4. Emails not being received**
- Check spam/junk folder
- Verify email address in template settings
- Test with a different email address

**5. "Quota exceeded" error**
- You've reached monthly email limit
- Upgrade EmailJS plan or wait for next month

### Debug Commands

```javascript
// Check if EmailJS is configured
window.EmailService.isConfigured()

// Get setup instructions
window.emailAdminFunctions.getInstructions()

// Send test email
window.emailAdminFunctions.sendTest()

// Reinitialize service
window.emailAdminFunctions.reinit()

// Check current configuration
console.log('Service ID:', window.EmailService.serviceId);
console.log('Public Key:', window.EmailService.publicKey);
```

## Security Considerations

### Safe Practices
✅ **Public Key is safe to expose** - it's meant for client-side use
✅ **Service ID is safe to expose** - it's a public identifier
✅ **Template IDs are safe** - they're public references

### Important Warnings
⚠️ **Never expose your EmailJS Private Key** in client-side code
⚠️ **Rate limiting** - EmailJS has monthly sending limits
⚠️ **Email validation** - Validate email addresses before sending

## Monitoring & Analytics

### EmailJS Dashboard
- Monitor email delivery rates
- Track monthly usage
- View failed deliveries
- Download delivery reports

### Website Analytics
- Form submission tracking already implemented
- Conversion tracking available
- Lead quality analysis through admin tools

## Upgrade Considerations

### Free Plan Limitations
- 200 emails/month
- EmailJS branding in emails
- Basic support

### Paid Plans
- Higher email limits (1,000 - 50,000/month)
- Remove EmailJS branding
- Priority support
- Advanced features

## Fallback System

If EmailJS fails, the system automatically falls back to:
1. **mailto: links** - Opens user's email client
2. **Local storage** - Saves lead data locally
3. **Error notifications** - Informs user of issues

This ensures no leads are lost even if EmailJS is down.

---

**Setup Checklist:**
- [ ] EmailJS account created
- [ ] Email service configured
- [ ] Contact form template created (`template_contact_form`)
- [ ] Website request template created (`template_website_request`)
- [ ] Public key obtained
- [ ] `email-service.js` configured
- [ ] Test email sent successfully
- [ ] Forms tested on live website

**Support:**
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
- Free plan includes community support