// Cloudflare Worker for Contact Form Processing with Nodemailer + Gmail SMTP
// Deploy this to: functions/api/contact.js

import nodemailer from 'nodemailer';

export default {
  async fetch(request, env, ctx) {
    // Handle CORS for all requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS request for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only handle POST requests to /api/contact
    if (request.method !== 'POST' || !request.url.includes('/api/contact')) {
      return new Response('Not Found', {
        status: 404,
        headers: corsHeaders
      });
    }

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

      // Validate environment variables
      if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) {
        throw new Error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
      }

      // Generate lead ID and timestamp
      const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();
      const localTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'medium'
      });

      // Prepare email content
      const customerName = `${formData.firstName} ${formData.lastName}`;

      // Configure Gmail SMTP with Nodemailer
      const transporter = nodemailer.createTransporter({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: env.GMAIL_USER, // Your Gmail address (e.g., vinod@optiscale360.com)
          pass: env.GMAIL_APP_PASSWORD, // Gmail App Password
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Lead notification email HTML template
      const leadEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Lead - ${customerName}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #0066FF 0%, #0052CC 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .lead-badge { background: rgba(255,255,255,0.2); display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; margin-top: 10px; }
        .content { padding: 30px; }
        .lead-summary { background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #0066FF; }
        .lead-summary h2 { margin: 0 0 15px 0; color: #0066FF; font-size: 18px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
        .info-item { background: #fafbfc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; }
        .info-label { font-weight: 600; color: #475569; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .info-value { color: #1e293b; font-size: 15px; }
        .message-section { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .message-section h3 { margin: 0 0 15px 0; color: #334155; }
        .message-content { background: white; padding: 15px; border-radius: 6px; border-left: 3px solid #0066FF; font-style: italic; }
        .action-buttons { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; padding: 12px 24px; background: #0066FF; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 10px; }
        .btn-secondary { background: #10b981; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .priority-high { color: #ef4444; font-weight: 600; }
        .meta-info { font-size: 12px; color: #94a3b8; margin-top: 20px; padding-top: 15px; border-top: 1px solid #f1f5f9; }
        @media (max-width: 600px) {
            .info-grid { grid-template-columns: 1fr; }
            .container { margin: 0; border-radius: 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 New Lead Alert</h1>
            <div class="lead-badge">Lead ID: ${leadId}</div>
        </div>

        <div class="content">
            <div class="lead-summary">
                <h2>📋 Lead Summary</h2>
                <p><strong>${customerName}</strong> is interested in <strong>${formData.service}</strong></p>
                <p class="priority-high">⏰ Response required within 24 hours for optimal conversion</p>
            </div>

            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Contact Person</div>
                    <div class="info-value">${customerName}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email Address</div>
                    <div class="info-value">${formData.email}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Phone Number</div>
                    <div class="info-value">${formData.phone || 'Not provided'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Service Interest</div>
                    <div class="info-value">${formData.service}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Company</div>
                    <div class="info-value">${formData.company || 'Not provided'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Website</div>
                    <div class="info-value">${formData.website || 'Not provided'}</div>
                </div>
            </div>

            ${formData.message ? `
            <div class="message-section">
                <h3>💬 Customer Message</h3>
                <div class="message-content">${formData.message}</div>
            </div>
            ` : ''}

            <div class="action-buttons">
                <a href="mailto:${formData.email}?subject=Re: Your OptiScale 360 Consultation Request&body=Hi ${formData.firstName},%0A%0AThank you for your interest in OptiScale 360. I'd love to discuss how we can help optimize your business..." class="btn">📧 Reply to Lead</a>
                <a href="tel:${formData.phone}" class="btn btn-secondary">📞 Call Now</a>
            </div>

            <div class="meta-info">
                <p><strong>Submission Details:</strong></p>
                <p>🕒 Timestamp: ${localTime} (IST)</p>
                <p>🌐 Source: ${request.headers.get('referer') || 'Direct'}</p>
                <p>📱 User Agent: ${request.headers.get('user-agent')?.substring(0, 100)}...</p>
                <p>📬 Newsletter: ${formData.newsletter ? 'Yes' : 'No'}</p>
                <p>🆔 Lead ID: ${leadId}</p>
            </div>
        </div>

        <div class="footer">
            <p>This notification was generated automatically by the OptiScale 360 contact form system.</p>
            <p>For technical support, contact the website administrator.</p>
        </div>
    </div>
</body>
</html>`;

      // Acknowledgment email HTML template
      const ackEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - OptiScale 360</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #0066FF 0%, #0052CC 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .logo { width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px; }
        .content { padding: 30px; }
        .welcome-section { text-align: center; margin-bottom: 30px; }
        .welcome-section h2 { color: #0066FF; margin-bottom: 15px; }
        .highlight-box { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #0066FF20; }
        .next-steps { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; }
        .next-steps h3 { color: #10b981; margin-top: 0; }
        .step-list { list-style: none; padding: 0; }
        .step-list li { padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        .step-list li:last-child { border-bottom: none; }
        .step-number { background: #0066FF; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 10px; }
        .contact-info { background: #fafbfc; padding: 20px; border-radius: 8px; margin: 25px 0; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .contact-item { text-align: center; }
        .contact-icon { width: 40px; height: 40px; background: #0066FF; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 16px; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .social-links { margin: 15px 0; }
        .social-links a { display: inline-block; margin: 0 10px; color: #0066FF; text-decoration: none; }
        @media (max-width: 600px) {
            .contact-grid { grid-template-columns: 1fr; }
            .container { margin: 0; border-radius: 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚀</div>
            <h1>Thank You, ${formData.firstName}!</h1>
            <p>Your consultation request has been received</p>
        </div>

        <div class="content">
            <div class="welcome-section">
                <h2>We're Excited to Help Transform Your Business!</h2>
                <p>Thank you for choosing OptiScale 360. We've received your consultation request for <strong>${formData.service}</strong> and our team is already reviewing your requirements.</p>
            </div>

            <div class="highlight-box">
                <h3 style="margin-top: 0; color: #0066FF;">🎯 What Happens Next?</h3>
                <p>Our business optimization experts will analyze your requirements and prepare a personalized strategy to help you achieve <strong>300% growth</strong> using our AI-powered solutions.</p>
            </div>

            <div class="next-steps">
                <h3>📋 Next Steps</h3>
                <ul class="step-list">
                    <li>
                        <span class="step-number">1</span>
                        <strong>Review & Analysis</strong> - Our team reviews your submission (within 2 hours)
                    </li>
                    <li>
                        <span class="step-number">2</span>
                        <strong>Strategy Preparation</strong> - We prepare a customized optimization plan for your business
                    </li>
                    <li>
                        <span class="step-number">3</span>
                        <strong>Personal Contact</strong> - We'll reach out within 24 hours to schedule your free consultation
                    </li>
                    <li>
                        <span class="step-number">4</span>
                        <strong>Free Consultation</strong> - 30-minute strategy session to discuss your growth opportunities
                    </li>
                </ul>
            </div>

            <div class="contact-info">
                <h3 style="text-align: center; margin-top: 0; color: #334155;">📞 Need Immediate Assistance?</h3>
                <div class="contact-grid">
                    <div class="contact-item">
                        <div class="contact-icon">📧</div>
                        <p><strong>Email</strong><br>vinod@optiscale360.com</p>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon">📱</div>
                        <p><strong>Phone</strong><br>+91 7397225523</p>
                    </div>
                </div>
                <p style="text-align: center; margin-top: 15px; font-size: 14px; color: #64748b;">Available Mon-Fri, 9 AM - 6 PM IST</p>
            </div>

            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                <h3 style="margin-top: 0;">🎁 Exclusive Welcome Bonus</h3>
                <p style="margin-bottom: 0;">As a new client, you'll receive a <strong>complimentary business audit</strong> (valued at $500) along with your consultation!</p>
            </div>
        </div>

        <div class="footer">
            <p><strong>OptiScale 360</strong> - AI-Powered Business Optimization</p>
            <p>No.13, Rayakota Road, Hosur, Tamil Nadu, India</p>
            <div class="social-links">
                <a href="https://optiscale360.pages.dev">🌐 Website</a>
                <a href="mailto:vinod@optiscale360.com">📧 Email</a>
                <a href="tel:+917397225523">📞 Call</a>
            </div>
            <p style="font-size: 12px; color: #94a3b8;">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;

      // Prepare text versions for better deliverability
      const leadEmailText = `New Lead Alert!

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

This notification was generated automatically by the OptiScale 360 contact form system.`;

      const ackEmailText = `Thank You ${formData.firstName}!

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
Website: https://optiscale360.pages.dev`;

      // Verify transporter connection
      await transporter.verify();

      // Prepare email options
      const leadEmailOptions = {
        from: `"OptiScale 360" <${env.GMAIL_USER}>`,
        to: 'vinod@optiscale360.com',
        subject: `🚀 New Lead Alert: ${customerName} - ${formData.service}`,
        html: leadEmailHtml,
        text: leadEmailText
      };

      const ackEmailOptions = {
        from: `"OptiScale 360" <${env.GMAIL_USER}>`,
        to: formData.email,
        subject: `Thank You ${formData.firstName} - Your OptiScale 360 Consultation Request`,
        html: ackEmailHtml,
        text: ackEmailText
      };

      // Send lead notification email
      console.log('Sending lead notification email...');
      const leadEmailResult = await transporter.sendMail(leadEmailOptions);
      console.log('Lead notification sent:', leadEmailResult.messageId);

      // Send acknowledgment email
      console.log('Sending acknowledgment email...');
      const ackEmailResult = await transporter.sendMail(ackEmailOptions);
      console.log('Acknowledgment email sent:', ackEmailResult.messageId);

      // Log successful submission
      console.log(`New lead submission: ${leadId} from ${formData.email}`);

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Thank you! We\'ve received your consultation request and will contact you within 24 hours.',
          leadId: leadId
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (error) {
      console.error('Contact form error:', error);

      // Provide specific error messages for debugging
      let errorMessage = 'We apologize, but there was an error processing your request. Please contact us directly at vinod@optiscale360.com or call +91 7397225523.';

      if (error.message.includes('Gmail credentials')) {
        errorMessage = 'Email service configuration error. Please contact support.';
      } else if (error.message.includes('Invalid login')) {
        errorMessage = 'Email authentication failed. Please contact support.';
      } else if (error.message.includes('SMTP')) {
        errorMessage = 'Email server connection failed. Please try again or contact us directly.';
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: errorMessage
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  },
};