# EmailJS Setup Guide

## Current Status
✅ **Service ID configured**: `service_g4erqhd`
⚠️ **Still needed**: Public Key and Template ID

## Quick Setup Steps

### 1. Get Your EmailJS Public Key
1. **Login to EmailJS**: Go to [emailjs.com](https://emailjs.com)
2. **Navigate to Integration**: Click "Integration" in dashboard
3. **Copy Public Key**: Look for "Public Key" (starts with underscore like `_abc123def`)

### 2. Create Email Template
1. **Go to Email Templates**: In EmailJS dashboard
2. **Create New Template**: Click "Create New Template"
3. **Template Name**: `template_contact`
4. **Template Content**: Use this template:

#### Subject Line:
```
🚀 New Lead Alert: {{from_name}} - {{service_interest}}
```

#### Email Body:
```
New Lead Alert!

Lead ID: {{lead_id}}
Name: {{from_name}}
Email: {{customer_email}}
Phone: {{customer_phone}}
Service: {{service_interest}}
Company: {{customer_company}}
Website: {{customer_website}}

Message:
{{customer_message}}

Submission Details:
- Timestamp: {{timestamp}}
- Newsletter: {{newsletter}}
- Lead ID: {{lead_id}}

⏰ Response required within 24 hours for optimal conversion

Reply directly to: {{customer_email}}
```

#### Template Settings:
- **To Email**: `vinod@optiscale360.com`
- **From Name**: `{{from_name}}`
- **Reply To**: `{{reply_to}}`

### 3. Update Contact Form
Once you have the public key, update the contact form:

1. **Edit contact.html**
2. **Find this line**:
   ```javascript
   // emailjs.init("YOUR_PUBLIC_KEY");
   ```
3. **Replace with**:
   ```javascript
   emailjs.init("YOUR_ACTUAL_PUBLIC_KEY");
   ```
4. **Uncomment the line** (remove the //)

## How It Works

1. **User submits form** → Form validates data
2. **EmailJS attempts to send** → Using your service and template
3. **If EmailJS works** → Email sent automatically to vinod@optiscale360.com
4. **If EmailJS fails** → Falls back to mailto (opens email client)
5. **User gets confirmation** → Success message either way

## Benefits of This Setup

- ✅ **Automatic email delivery** when EmailJS is configured
- ✅ **Fallback to mailto** if EmailJS fails
- ✅ **No server setup required**
- ✅ **Professional email templates**
- ✅ **Lead tracking with unique IDs**

## Current Form Status

**Without EmailJS Public Key**: Form uses mailto fallback
**With EmailJS Public Key**: Form sends emails automatically

## Test Results

The contact form is already working with mailto fallback. Once you add the EmailJS public key, it will automatically start sending emails directly to your inbox.

## Next Steps

1. **Get your EmailJS Public Key** from the dashboard
2. **Create the email template** (copy the template above)
3. **Update the contact form** with your public key
4. **Test the form** to verify automatic email sending

The form is already deployed and working. Just need to complete the EmailJS configuration for automatic email delivery!