# Cloudflare Environment Variables Setup

## Gmail SMTP Configuration

Use these exact values when setting up your Cloudflare Pages environment variables:

### Environment Variables

**Variable 1:**
- **Name**: `GMAIL_USER`
- **Value**: `vinod@optiscale360.com`
- **Environment**: Production ✅ (and Preview if needed)

**Variable 2:**
- **Name**: `GMAIL_APP_PASSWORD`
- **Value**: `irmgttafppucygfb`
- **Environment**: Production ✅ (and Preview if needed)

## Setup Instructions

### Step 1: Access Cloudflare Pages Dashboard
1. Go to [dash.cloudflare.com/pages](https://dash.cloudflare.com/pages)
2. Log into your Cloudflare account
3. Select your `optiscale360` project

### Step 2: Add Environment Variables
1. Navigate to **Settings** → **Environment Variables**
2. Click **Add variable**

**Add First Variable:**
- Name: `GMAIL_USER`
- Value: `vinod@optiscale360.com`
- Environment: Select `Production` ✅
- Click **Save**

**Add Second Variable:**
- Name: `GMAIL_APP_PASSWORD`
- Value: `irmgttafppucygfb`
- Environment: Select `Production` ✅
- Click **Save**

### Step 3: Verify Configuration
After saving both variables, you should see:
```
GMAIL_USER = vinod@optiscale360.com
GMAIL_APP_PASSWORD = irmgttafppucygfb
```

### Step 4: Deploy Changes
1. Commit and push your code changes to trigger a new deployment
2. Or manually trigger a redeploy from the Cloudflare dashboard

## Testing the Setup

### Option 1: Test Contact Form
1. Wait for deployment to complete
2. Visit: `https://optiscale360.pages.dev/contact.html`
3. Fill out the form with test data
4. Submit and verify emails are received

### Option 2: Use Test Page
1. Visit: `https://optiscale360.pages.dev/test-contact-form.html`
2. Run the automated test suite
3. Check results for success

### Option 3: Monitor Logs
1. Go to Cloudflare Pages → Functions → Real-time Logs
2. Submit a test form
3. Watch for successful email sending messages

## Expected Results

**Success Indicators:**
- ✅ Form submits without errors
- ✅ Lead notification email arrives at `vinod@optiscale360.com`
- ✅ Acknowledgment email arrives at test email address
- ✅ Function logs show "Email sent successfully"

**Error Indicators:**
- ❌ "Gmail credentials not configured" → Environment variables not set
- ❌ "Invalid login" → App Password incorrect
- ❌ "Authentication failed" → Check 2FA is enabled

## Security Notes

- ✅ App Password is for app name: "cloudflare SMTP"
- ✅ Password format: `irmgttafppucygfb` (no spaces)
- ✅ Only used for SMTP authentication
- ✅ Stored securely in Cloudflare environment variables

## Next Steps

1. **Set up environment variables** (using values above)
2. **Deploy your changes** to Cloudflare Pages
3. **Test the contact form** submission
4. **Verify email delivery** to both addresses
5. **Monitor initial submissions** for any issues

The contact form is ready for production use once these environment variables are configured!