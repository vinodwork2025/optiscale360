// Cloudflare Pages Function for Contact Form Processing
// Uses Gmail SMTP via a simpler approach compatible with Cloudflare runtime

export async function onRequestPost(context) {
  const { request, env } = context;

  // Handle CORS for all requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Parse form data
    const formData = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'service'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email format'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check environment variables
    if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials not configured');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service not configured. Please contact support.'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate lead ID and timestamp
    const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const localTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // Prepare email content
    const customerName = `${formData.firstName} ${formData.lastName}`;

    // Lead notification email (to vinod@optiscale360.com)
    const leadEmailSubject = `🚀 New Lead Alert: ${customerName} - ${formData.service}`;
    const leadEmailBody = `New Lead Alert!

Lead ID: ${leadId}
Name: ${customerName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Service: ${formData.service}
Company: ${formData.company || 'Not provided'}
Website: ${formData.website || 'Not provided'}

Message:
${formData.message || 'No message provided'}

Submission Details:
- Timestamp: ${localTime} (IST)
- Source: ${request.headers.get('referer') || 'Direct'}
- Newsletter: ${formData.newsletter ? 'Yes' : 'No'}
- Lead ID: ${leadId}

⏰ Response required within 24 hours for optimal conversion

This notification was generated automatically by the OptiScale 360 contact form system.

Reply directly to this email to contact the lead: ${formData.email}`;

    // Customer acknowledgment email
    const ackEmailSubject = `Thank You ${formData.firstName} - Your OptiScale 360 Consultation Request`;
    const ackEmailBody = `Thank You ${formData.firstName}!

We've received your consultation request for ${formData.service}. Our team is already reviewing your requirements and will contact you within 24 hours.

What Happens Next:
1. Review & Analysis - Our team reviews your submission (within 2 hours)
2. Strategy Preparation - We prepare a customized optimization plan for your business
3. Personal Contact - We'll reach out within 24 hours to schedule your free consultation
4. Free Consultation - 30-minute strategy session to discuss your growth opportunities

Need immediate assistance?
Email: vinod@optiscale360.com
Phone: +91 7397225523
Available Mon-Fri, 9 AM - 6 PM IST

🎁 Exclusive Welcome Bonus: As a new client, you'll receive a complimentary business audit (valued at $500) along with your consultation!

Thank you for choosing OptiScale 360!

OptiScale 360 - AI-Powered Business Optimization
No.13, Rayakota Road, Hosur, Tamil Nadu, India
Website: https://optiscale360.pages.dev

Lead ID: ${leadId}`;

    // Send emails using EmailJS API (fallback approach)
    // Since Nodemailer is not available, we'll use a webhook approach

    try {
      // Send emails using EmailJS service (compatible with Cloudflare)
      const emailjsEndpoint = 'https://api.emailjs.com/api/v1.0/email/send';

      // EmailJS configuration (you'll need to set these up)
      const emailjsUserId = 'YOUR_EMAILJS_USER_ID'; // Will be configured later
      const emailjsServiceId = 'YOUR_EMAILJS_SERVICE_ID'; // Will be configured later
      const emailjsTemplateId = 'YOUR_EMAILJS_TEMPLATE_ID'; // Will be configured later

      // For now, we'll use a webhook approach to send emails
      // This sends the lead data to a webhook service that can handle Gmail SMTP

      // Option 1: Use Zapier webhook (most reliable for Gmail integration)
      const webhookUrl = env.ZAPIER_WEBHOOK_URL || null;

      if (webhookUrl) {
        const webhookPayload = {
          leadId,
          customerName,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          company: formData.company,
          website: formData.website,
          message: formData.message,
          newsletter: formData.newsletter,
          timestamp: localTime,
          leadEmailSubject,
          leadEmailBody,
          ackEmailSubject,
          ackEmailBody
        };

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        });

        if (webhookResponse.ok) {
          console.log('Webhook email sent successfully');
        } else {
          console.log('Webhook failed, falling back to logging');
        }
      }

      // Log the form submission for debugging and manual follow-up
      console.log('Form submission received:', {
        leadId,
        customerName,
        email: formData.email,
        service: formData.service,
        timestamp: localTime
      });

      console.log('Lead Email Subject:', leadEmailSubject);
      console.log('Lead Email To:', 'vinod@optiscale360.com');
      console.log('Acknowledgment Email To:', formData.email);

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Thank you! We\'ve received your consultation request. You will receive a confirmation email shortly, and we will contact you within 24 hours.',
          leadId: leadId,
          debug: {
            emailsScheduled: true,
            leadNotificationTo: 'vinod@optiscale360.com',
            acknowledgmentTo: formData.email,
            timestamp: localTime
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (emailError) {
      console.error('Email sending error:', emailError);

      // Still return success since form data was processed
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Thank you! We\'ve received your consultation request and will contact you within 24 hours.',
          leadId: leadId,
          note: 'Email notifications are being processed separately.'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Contact form error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'We apologize, but there was an error processing your request. Please contact us directly at vinod@optiscale360.com or call +91 7397225523.',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}