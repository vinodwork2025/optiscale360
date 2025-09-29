// Cloudflare Pages Function for Contact Form Processing
// Uses EmailJS for reliable email delivery without DNS requirements

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

    // Generate lead ID and timestamp
    const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const localTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // Prepare email content
    const customerName = `${formData.firstName} ${formData.lastName}`;

    // Send emails using Brevo SMTP - much more reliable than API
    const smtpConfig = {
      host: 'smtp-relay.brevo.com',
      port: 587,
      username: '9812f4002@smtp-brevo.com',
      password: 'jTM7ha2grpKOB8tn'
    };

    let emailSuccess = false;
    let emailMessage = '';

      // Send lead notification email using SMTP
      const leadEmailData = {
        from: `OptiScale 360 Contact Form <${smtpConfig.username}>`,
        to: 'vinod@optiscale360.com',
        subject: `🚀 New Lead Alert: ${customerName} - ${formData.service}`,
        replyTo: formData.email,
          htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0066FF 0%, #0052CC 100%); color: white; padding: 25px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 25px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
        .lead-info { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 5px solid #0066FF; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .priority { color: #dc2626; font-weight: bold; background: #fef2f2; padding: 10px; border-radius: 5px; border-left: 4px solid #dc2626; }
        .btn { display: inline-block; background: #0066FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
        .btn:hover { background: #0052CC; }
        h1 { margin: 0; font-size: 24px; }
        h2 { color: #0066FF; margin-top: 0; }
        h3 { color: #374151; margin-top: 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 New Lead Alert</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Lead ID: ${leadId}</p>
    </div>
    <div class="content">
        <div class="lead-info">
            <h2>📋 Contact Details</h2>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${formData.email}" style="color: #0066FF;">${formData.email}</a></p>
            <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
            <p><strong>Website:</strong> ${formData.website ? `<a href="${formData.website}" style="color: #0066FF;">${formData.website}</a>` : 'Not provided'}</p>
            <p><strong>Service Interest:</strong> ${formData.service}</p>
            <p><strong>Newsletter:</strong> ${formData.newsletter ? 'Yes' : 'No'}</p>
        </div>

        ${formData.message ? `
        <div class="lead-info">
            <h3>💬 Customer Message</h3>
            <p style="font-style: italic; background: #f1f5f9; padding: 15px; border-radius: 5px; border-left: 3px solid #0066FF;">"${formData.message}"</p>
        </div>
        ` : ''}

        <div class="lead-info">
            <h3>📊 Submission Details</h3>
            <p><strong>Timestamp:</strong> ${localTime} (IST)</p>
            <p><strong>Lead ID:</strong> ${leadId}</p>
            <p><strong>Source:</strong> ${request.headers.get('referer') || 'Direct'}</p>
            <p><strong>User Agent:</strong> ${request.headers.get('user-agent')?.substring(0, 100)}...</p>
        </div>

        <div class="priority">
            ⏰ <strong>Action Required:</strong> Response within 24 hours for optimal conversion rate
        </div>

        <p style="text-align: center;">
            <a href="mailto:${formData.email}?subject=Re: Your OptiScale 360 Consultation Request&body=Hi ${formData.firstName},%0A%0AThank you for your interest in OptiScale 360. I'd love to discuss how we can help optimize your business growth.%0A%0ABest regards,%0AVinod" class="btn">📧 Reply to Lead</a>
        </p>

        <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
            This notification was generated automatically by the OptiScale 360 contact form system.
        </p>
    </div>
</body>
</html>`,
          textContent: `🚀 NEW LEAD ALERT

Lead ID: ${leadId}
Name: ${customerName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Service: ${formData.service}
Company: ${formData.company || 'Not provided'}
Website: ${formData.website || 'Not provided'}

Customer Message:
${formData.message || 'No message provided'}

Submission Details:
- Timestamp: ${localTime} (IST)
- Lead ID: ${leadId}
- Source: ${request.headers.get('referer') || 'Direct'}
- Newsletter: ${formData.newsletter ? 'Yes' : 'No'}

⏰ URGENT: Response required within 24 hours for optimal conversion

Reply directly to: ${formData.email}

--
This notification was generated automatically by OptiScale 360 contact form.`
        };

        const leadEmailResponse = await fetch(brevoEndpoint, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify(leadEmailPayload)
        });

        let leadEmailSuccess = false;
        if (leadEmailResponse.ok) {
          console.log('Lead notification email sent successfully');
          leadEmailSuccess = true;
        } else {
          const errorText = await leadEmailResponse.text();
          console.error('Failed to send lead notification:', leadEmailResponse.status, errorText);
        }

        // Send customer acknowledgment email
        const ackEmailPayload = {
          sender: {
            name: 'OptiScale 360',
            email: 'noreply@optiscale360.com'
          },
          to: [
            {
              email: formData.email,
              name: customerName
            }
          ],
          replyTo: {
            email: 'vinod@optiscale360.com',
            name: 'Vinod - OptiScale 360'
          },
          subject: `Thank You ${formData.firstName} - Your OptiScale 360 Consultation Request`,
          htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0066FF 0%, #0052CC 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
        .highlight { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 5px solid #0066FF; }
        .steps { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .contact-info { background: #f0fdf4; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 5px solid #10b981; }
        .bonus { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .footer { background: #f1f5f9; padding: 20px; margin-top: 30px; border-radius: 8px; text-align: center; font-size: 14px; color: #6b7280; }
        h1 { margin: 0; font-size: 28px; }
        h2 { color: #0066FF; margin-top: 0; }
        h3 { color: #374151; margin-top: 0; }
        ol { padding-left: 20px; }
        li { margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <div style="font-size: 40px; margin-bottom: 10px;">🚀</div>
        <h1>Thank You, ${formData.firstName}!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your consultation request has been received</p>
    </div>
    <div class="content">
        <p style="font-size: 18px;">Thank you for choosing OptiScale 360! We've received your consultation request for <strong>${formData.service}</strong> and our team is already reviewing your requirements.</p>

        <div class="highlight">
            <h2>🎯 What Happens Next?</h2>
            <p>Our business optimization experts will analyze your requirements and prepare a personalized strategy to help you achieve <strong>300% growth</strong> using our AI-powered solutions.</p>
        </div>

        <div class="steps">
            <h3>📋 Your Journey With Us</h3>
            <ol>
                <li><strong>Review & Analysis</strong> - Our team reviews your submission (within 2 hours)</li>
                <li><strong>Strategy Preparation</strong> - We prepare a customized optimization plan for your business</li>
                <li><strong>Personal Contact</strong> - We'll reach out within 24 hours to schedule your free consultation</li>
                <li><strong>Free Consultation</strong> - 30-minute strategy session to discuss your growth opportunities</li>
            </ol>
        </div>

        <div class="contact-info">
            <h3>📞 Need Immediate Assistance?</h3>
            <p><strong>📧 Email:</strong> <a href="mailto:vinod@optiscale360.com" style="color: #10b981;">vinod@optiscale360.com</a></p>
            <p><strong>📱 Phone:</strong> <a href="tel:+917397225523" style="color: #10b981;">+91 7397225523</a></p>
            <p><strong>🕒 Available:</strong> Monday - Friday, 9 AM - 6 PM IST</p>
        </div>

        <div class="bonus">
            <h3 style="margin-top: 0; color: white;">🎁 Exclusive Welcome Bonus</h3>
            <p style="margin-bottom: 0;">As a new client, you'll receive a <strong>complimentary business audit</strong> (valued at ₹40,000) along with your consultation!</p>
        </div>

        <div class="footer">
            <p><strong>OptiScale 360</strong> - AI-Powered Business Optimization</p>
            <p>📍 No.13, Rayakota Road, Hosur, Tamil Nadu, India</p>
            <p>🌐 Website: <a href="https://optiscale360.pages.dev" style="color: #0066FF;">optiscale360.pages.dev</a></p>
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.7;">Lead ID: ${leadId} | This is an automated confirmation email.</p>
        </div>
    </div>
</body>
</html>`,
          textContent: `Thank You ${formData.firstName}!

We've received your consultation request for ${formData.service}. Our team is already reviewing your requirements and will contact you within 24 hours.

🎯 What Happens Next?
Our business optimization experts will analyze your requirements and prepare a personalized strategy to help you achieve 300% growth using our AI-powered solutions.

📋 Your Journey With Us:
1. Review & Analysis - Our team reviews your submission (within 2 hours)
2. Strategy Preparation - We prepare a customized optimization plan for your business
3. Personal Contact - We'll reach out within 24 hours to schedule your free consultation
4. Free Consultation - 30-minute strategy session to discuss your growth opportunities

📞 Need Immediate Assistance?
📧 Email: vinod@optiscale360.com
📱 Phone: +91 7397225523
🕒 Available: Monday - Friday, 9 AM - 6 PM IST

🎁 Exclusive Welcome Bonus
As a new client, you'll receive a complimentary business audit (valued at ₹40,000) along with your consultation!

Thank you for choosing OptiScale 360!

OptiScale 360 - AI-Powered Business Optimization
📍 No.13, Rayakota Road, Hosur, Tamil Nadu, India
🌐 Website: https://optiscale360.pages.dev

Lead ID: ${leadId}
This is an automated confirmation email.`
        };

        const ackEmailResponse = await fetch(brevoEndpoint, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify(ackEmailPayload)
        });

        let ackEmailSuccess = false;
        if (ackEmailResponse.ok) {
          console.log('Acknowledgment email sent successfully');
          ackEmailSuccess = true;
        } else {
          const errorText = await ackEmailResponse.text();
          console.error('Failed to send acknowledgment email:', ackEmailResponse.status, errorText);
        }

        if (leadEmailSuccess && ackEmailSuccess) {
          emailSuccess = true;
          emailMessage = 'Emails sent successfully to both parties.';
        } else if (leadEmailSuccess) {
          emailMessage = 'Lead notification sent. Customer acknowledgment pending.';
        } else if (ackEmailSuccess) {
          emailMessage = 'Customer acknowledgment sent. Lead notification pending.';
        } else {
          emailMessage = 'Email delivery failed. Manual follow-up required.';
        }

      } catch (emailError) {
        console.error('Email API error:', emailError);
        emailMessage = 'Email service temporarily unavailable.';
      }
    } else {
      // Fallback: No email service configured, but still log the lead
      emailMessage = 'Email service not configured. Lead logged for manual follow-up.';
    }

    // Log the form submission for manual follow-up if needed
    console.log(`📧 Form submission processed: ${leadId}`);
    console.log(`👤 Customer: ${customerName} (${formData.email})`);
    console.log(`🎯 Service: ${formData.service}`);
    console.log(`📞 Phone: ${formData.phone || 'Not provided'}`);
    console.log(`🏢 Company: ${formData.company || 'Not provided'}`);
    console.log(`💬 Message: ${formData.message || 'No message'}`);
    console.log(`📅 Timestamp: ${localTime}`);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: emailSuccess
          ? 'Thank you! We\'ve received your consultation request and sent confirmation emails. We will contact you within 24 hours.'
          : 'Thank you! We\'ve received your consultation request and will contact you within 24 hours.',
        leadId: leadId,
        emailStatus: emailMessage
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

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