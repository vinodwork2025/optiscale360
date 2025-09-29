export async function onRequestPost(context) {
    try {
        const { request } = context;

        // Parse form data
        const formData = await request.json();

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'service'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            return new Response(JSON.stringify({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Generate lead ID and timestamp
        const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'medium'
        });

        const customerName = `${formData.firstName} ${formData.lastName}`;

        // Simple email content
        const emailSubject = `🚀 New Lead Alert: ${customerName} - ${formData.service}`;
        const emailBody = `NEW LEAD ALERT!

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
- Timestamp: ${timestamp}
- Newsletter: ${formData.newsletter ? 'Yes' : 'No'}
- Lead ID: ${leadId}

⏰ Response required within 24 hours for optimal conversion

Reply directly to: ${formData.email}

---
This notification was generated automatically by OptiScale 360 contact form.`;

        // Use fetch to send email via SMTP service
        const smtpResponse = await fetch('https://api.smtp2go.com/v3/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Smtp2go-Api-Key': 'api-7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E'
            },
            body: JSON.stringify({
                to: ['vinod@optiscale360.com'],
                from: 'noreply@optiscale360.pages.dev',
                subject: emailSubject,
                text_body: emailBody,
                reply_to: formData.email
            })
        });

        if (smtpResponse.ok) {
            return new Response(JSON.stringify({
                success: true,
                message: `Thank you ${formData.firstName}! Your consultation request has been sent successfully. We will contact you within 24 hours.`,
                leadId: leadId
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } else {
            throw new Error('SMTP service failed');
        }

    } catch (error) {
        console.error('Contact form error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to send email. Please contact us directly at vinod@optiscale360.com or call +91 7397225523.',
            details: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}