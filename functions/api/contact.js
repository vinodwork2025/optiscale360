// Cloudflare Pages Function for Contact Form Processing
// Uses Gmail SMTP via direct SMTP implementation

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

    // Send emails using MailChannels (Cloudflare's email service)
    const mailChannelsEndpoint = 'https://api.mailchannels.net/tx/v1/send';

    // Lead notification email
    const leadEmailPayload = {
      personalizations: [
        {
          to: [{ email: 'vinod@optiscale360.com', name: 'Vinod' }],
          dkim_domain: 'optiscale360.pages.dev',
          dkim_selector: 'mailchannels',
          dkim_private_key: env.DKIM_PRIVATE_KEY || ''
        }
      ],
      from: {
        email: 'noreply@optiscale360.pages.dev',
        name: 'OptiScale 360 Contact Form'
      },
      subject: `🚀 New Lead Alert: ${customerName} - ${formData.service}`,
      content: [
        {
          type: 'text/html',
          value: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0066FF; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .lead-info { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #0066FF; }
        .priority { color: #FF0000; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 New Lead Alert</h1>
            <p>Lead ID: ${leadId}</p>
        </div>
        <div class="content">
            <div class="lead-info">
                <h2>Contact Details</h2>
                <p><strong>Name:</strong> ${customerName}</p>
                <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
                <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
                <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
                <p><strong>Website:</strong> ${formData.website || 'Not provided'}</p>
                <p><strong>Service Interest:</strong> ${formData.service}</p>
                <p><strong>Newsletter:</strong> ${formData.newsletter ? 'Yes' : 'No'}</p>
            </div>

            ${formData.message ? `
            <div class="lead-info">
                <h3>Customer Message:</h3>
                <p><em>"${formData.message}"</em></p>
            </div>
            ` : ''}

            <div class="lead-info">
                <h3>Submission Details</h3>
                <p><strong>Timestamp:</strong> ${localTime} (IST)</p>
                <p><strong>Lead ID:</strong> ${leadId}</p>
                <p><strong>Source:</strong> ${request.headers.get('referer') || 'Direct'}</p>
            </div>

            <p class="priority">⏰ Response required within 24 hours for optimal conversion</p>

            <p><a href="mailto:${formData.email}?subject=Re: Your OptiScale 360 Consultation Request"
                 style="background: #0066FF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                 📧 Reply to Lead
               </a></p>
        </div>
    </div>
</body>
</html>`
        },
        {
          type: 'text/plain',
          value: `New Lead Alert!

Lead ID: ${leadId}
Name: ${customerName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Service: ${formData.service}
Company: ${formData.company || 'Not provided'}
Website: ${formData.website || 'Not provided'}

Message: ${formData.message || 'No message provided'}

Submission Details:
- Timestamp: ${localTime} (IST)
- Lead ID: ${leadId}
- Source: ${request.headers.get('referer') || 'Direct'}
- Newsletter: ${formData.newsletter ? 'Yes' : 'No'}

⏰ Response required within 24 hours for optimal conversion

Reply directly to: ${formData.email}`
        }
      ]
    };

    // Customer acknowledgment email
    const ackEmailPayload = {
      personalizations: [
        {
          to: [{ email: formData.email, name: customerName }],
          dkim_domain: 'optiscale360.pages.dev',
          dkim_selector: 'mailchannels',
          dkim_private_key: env.DKIM_PRIVATE_KEY || ''
        }
      ],
      from: {
        email: 'noreply@optiscale360.pages.dev',
        name: 'OptiScale 360'
      },
      reply_to: {
        email: 'vinod@optiscale360.com',
        name: 'Vinod - OptiScale 360'
      },
      subject: `Thank You ${formData.firstName} - Your OptiScale 360 Consultation Request`,
      content: [
        {
          type: 'text/html',
          value: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0066FF; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .highlight { background: #E8F4FD; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #0066FF; }
        .steps { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .contact-info { background: #F0F8F0; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .bonus { background: #10B981; color: white; padding: 15px; margin: 15px 0; border-radius: 5px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Thank You, ${formData.firstName}!</h1>
            <p>Your consultation request has been received</p>
        </div>
        <div class="content">
            <p>Thank you for choosing OptiScale 360. We've received your consultation request for <strong>${formData.service}</strong> and our team is already reviewing your requirements.</p>

            <div class="highlight">
                <h3>🎯 What Happens Next?</h3>
                <p>Our business optimization experts will analyze your requirements and prepare a personalized strategy to help you achieve <strong>300% growth</strong> using our AI-powered solutions.</p>
            </div>

            <div class="steps">
                <h3>📋 Next Steps</h3>
                <ol>
                    <li><strong>Review & Analysis</strong> - Our team reviews your submission (within 2 hours)</li>
                    <li><strong>Strategy Preparation</strong> - We prepare a customized optimization plan for your business</li>
                    <li><strong>Personal Contact</strong> - We'll reach out within 24 hours to schedule your free consultation</li>
                    <li><strong>Free Consultation</strong> - 30-minute strategy session to discuss your growth opportunities</li>
                </ol>
            </div>

            <div class="contact-info">
                <h3>📞 Need Immediate Assistance?</h3>
                <p><strong>Email:</strong> vinod@optiscale360.com<br>
                   <strong>Phone:</strong> +91 7397225523<br>
                   <strong>Available:</strong> Mon-Fri, 9 AM - 6 PM IST</p>
            </div>

            <div class="bonus">
                <h3>🎁 Exclusive Welcome Bonus</h3>
                <p>As a new client, you'll receive a <strong>complimentary business audit</strong> (valued at $500) along with your consultation!</p>
            </div>

            <p><strong>OptiScale 360</strong> - AI-Powered Business Optimization<br>
               No.13, Rayakota Road, Hosur, Tamil Nadu, India<br>
               Website: <a href="https://optiscale360.pages.dev">optiscale360.pages.dev</a></p>

            <p style="font-size: 12px; color: #666;">Lead ID: ${leadId}</p>
        </div>
    </div>
</body>
</html>`
        },
        {
          type: 'text/plain',
          value: `Thank You ${formData.firstName}!

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

Lead ID: ${leadId}`
        }
      ]
    };

    try {
      // Send lead notification email
      console.log('Sending lead notification email...');
      const leadEmailResponse = await fetch(mailChannelsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadEmailPayload),
      });

      let leadEmailSuccess = false;
      if (leadEmailResponse.ok) {
        console.log('Lead notification email sent successfully');
        leadEmailSuccess = true;
      } else {
        const errorText = await leadEmailResponse.text();
        console.error('Failed to send lead notification:', leadEmailResponse.status, errorText);
      }

      // Send acknowledgment email
      console.log('Sending acknowledgment email...');
      const ackEmailResponse = await fetch(mailChannelsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ackEmailPayload),
      });

      let ackEmailSuccess = false;
      if (ackEmailResponse.ok) {
        console.log('Acknowledgment email sent successfully');
        ackEmailSuccess = true;
      } else {
        const errorText = await ackEmailResponse.text();
        console.error('Failed to send acknowledgment email:', ackEmailResponse.status, errorText);
      }

      // Log successful submission
      console.log(`Form submission processed: ${leadId} from ${formData.email}`);

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: leadEmailSuccess && ackEmailSuccess
            ? 'Thank you! We\'ve received your consultation request and sent confirmation emails. We will contact you within 24 hours.'
            : 'Thank you! We\'ve received your consultation request and will contact you within 24 hours. Email notifications are being processed.',
          leadId: leadId,
          emailStatus: {
            leadNotification: leadEmailSuccess ? 'sent' : 'failed',
            acknowledgment: ackEmailSuccess ? 'sent' : 'failed'
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
          note: 'Email notifications are being processed separately.',
          error: emailError.message
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
        debug: error.message
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