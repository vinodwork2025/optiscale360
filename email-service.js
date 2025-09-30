/**
 * OptiScale 360 Email Service
 * Direct SMTP email sending for form submissions using EmailJS
 */

class EmailService {
    constructor() {
        this.serviceId = 'service_g4erqhd';  // EmailJS service ID
        this.publicKey = 'F25NFcVlXeUqES9qL';  // EmailJS public key
        this.initialized = false;
        this.fallbackEmail = 'vinod@optiscale360.com';

        this.init();
    }

    /**
     * Initialize EmailJS service
     */
    async init() {
        try {
            // Load EmailJS SDK if not already loaded
            if (typeof emailjs === 'undefined') {
                await this.loadEmailJS();
            }

            // Initialize with public key
            if (this.publicKey !== 'YOUR_PUBLIC_KEY_HERE') {
                emailjs.init(this.publicKey);
                this.initialized = true;
                console.log('EmailJS initialized successfully');
            } else {
                console.warn('EmailJS not configured - using fallback method');
                this.initialized = false;
            }
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
            this.initialized = false;
        }
    }

    /**
     * Dynamically load EmailJS SDK
     */
    loadEmailJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Send email using EmailJS
     * @param {Object} formData - Form data object
     * @param {string} formType - Type of form
     * @returns {Promise<boolean>} - Success status
     */
    async sendEmail(formData, formType) {
        if (!this.initialized) {
            console.log('EmailJS not initialized, falling back to mailto');
            this.fallbackToMailto(formData, formType);
            return false;
        }

        try {
            const templateParams = this.formatEmailTemplate(formData, formType);

            // Send email using EmailJS
            const response = await emailjs.send(
                this.serviceId,
                this.getTemplateId(formType),
                templateParams
            );

            console.log('Email sent successfully:', response);
            return true;
        } catch (error) {
            console.error('Failed to send email via EmailJS:', error);

            // Fallback to mailto
            this.fallbackToMailto(formData, formType);
            return false;
        }
    }

    /**
     * Format email template parameters
     * @param {Object} formData - Form data object
     * @param {string} formType - Type of form
     * @returns {Object} - Template parameters
     */
    formatEmailTemplate(formData, formType) {
        const customerName = `${formData.firstName || 'Unknown'} ${formData.lastName || ''}`.trim();
        const timestamp = new Date().toLocaleString();

        // Format all form fields as a readable string
        const formFields = Object.entries(formData)
            .filter(([key, value]) => value && key !== 'newsletter')
            .map(([key, value]) => {
                const fieldName = this.formatFieldName(key);
                return `${fieldName}: ${value}`;
            })
            .join('\n');

        const newsletterStatus = formData.newsletter ? 'Yes' : 'No';

        return {
            to_email: this.fallbackEmail,
            customer_name: customerName,
            form_type: formType,
            customer_email: formData.email || 'Not provided',
            customer_phone: formData.phone || 'Not provided',
            customer_company: formData.company || 'Not provided',
            form_fields: formFields,
            newsletter_subscription: newsletterStatus,
            submission_timestamp: timestamp,
            source_url: window.location.href,
            lead_id: Date.now().toString(),
            // Individual fields for template flexibility
            first_name: formData.firstName || '',
            last_name: formData.lastName || '',
            email: formData.email || '',
            phone: formData.phone || '',
            company: formData.company || '',
            current_website: formData.currentWebsite || formData.website || '',
            website: formData.website || formData.currentWebsite || '',
            service: formData.service || '',
            business_type: formData.businessType || '',
            message: formData.message || formData.projectGoals || '',
            newsletter: formData.newsletter ? true : false,
        };
    }

    /**
     * Get EmailJS template ID based on form type
     * @param {string} formType - Type of form
     * @returns {string} - Template ID
     */
    getTemplateId(formType) {
        const templates = {
            'Contact Form': 'template_contact',
            'Free AI-Ready Website': 'template_freeaiwebsite',
            'Newsletter Signup': 'template_contact',
            'Consultation Request': 'template_contact'
        };

        return templates[formType] || 'template_contact';
    }

    /**
     * Format field names for display
     * @param {string} fieldName - Raw field name from form
     * @returns {string} - Formatted field name
     */
    formatFieldName(fieldName) {
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    /**
     * Fallback to mailto if EmailJS fails
     * @param {Object} formData - Form data object
     * @param {string} formType - Type of form
     */
    fallbackToMailto(formData, formType) {
        try {
            const subjectPrefix = this.getSubjectPrefix(formType);
            const customerName = `${formData.firstName || 'Unknown'} ${formData.lastName || ''}`.trim();
            const subject = `${subjectPrefix} - ${customerName}`;

            // Create email body
            const emailBody = this.formatEmailBody(formData, formType);

            // Create mailto URL
            const mailtoUrl = `mailto:${this.fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

            // Open email client
            window.open(mailtoUrl, '_blank');

            console.log('Fallback to email client successful');
        } catch (error) {
            console.error('Fallback to mailto failed:', error);
        }
    }

    /**
     * Get subject prefix based on form type
     * @param {string} formType - Type of form
     * @returns {string} - Subject prefix
     */
    getSubjectPrefix(formType) {
        const prefixes = {
            'Contact Form': 'Contact Form Submission',
            'Free AI-Ready Website': 'Free AI-Ready Website Request',
            'Newsletter Signup': 'Newsletter Subscription',
            'Consultation Request': 'Business Consultation Request'
        };

        return prefixes[formType] || 'Website Form Submission';
    }

    /**
     * Format email body with lead information (for mailto fallback)
     * @param {Object} formData - Form data object
     * @param {string} formType - Type of form
     * @returns {string} - Formatted email body
     */
    formatEmailBody(formData, formType) {
        const customerName = `${formData.firstName || 'Unknown'} ${formData.lastName || ''}`.trim();

        let emailBody = `New ${formType} submission from ${customerName}\n\n`;
        emailBody += `Submission Details:\n`;
        emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        // Add all form fields with proper formatting
        Object.entries(formData).forEach(([key, value]) => {
            if (value && key !== 'newsletter') {
                const fieldName = this.formatFieldName(key);
                emailBody += `${fieldName}: ${value}\n`;
            }
        });

        // Add newsletter subscription status
        if (formData.newsletter !== undefined) {
            emailBody += `Newsletter Subscription: ${formData.newsletter ? 'Yes' : 'No'}\n`;
        }

        // Add metadata
        emailBody += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        emailBody += `Timestamp: ${new Date().toLocaleString()}\n`;
        emailBody += `Source URL: ${window.location.href}\n`;
        emailBody += `Lead ID: ${Date.now()}\n`;
        emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        emailBody += `\nThis is an automated notification from OptiScale 360 website.\n`;
        emailBody += `Please respond to this lead within 24 hours for optimal conversion.`;

        return emailBody;
    }

    /**
     * Send test email
     * @returns {Promise<boolean>} - Success status
     */
    async sendTestEmail() {
        const testData = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '+1 (555) 123-4567',
            company: 'Test Company',
            message: 'This is a test email from the OptiScale 360 website.',
            newsletter: true
        };

        return await this.sendEmail(testData, 'Contact Form');
    }

    /**
     * Check if email service is properly configured
     * @returns {boolean} - Configuration status
     */
    isConfigured() {
        return this.initialized && this.publicKey !== 'YOUR_PUBLIC_KEY_HERE';
    }

    /**
     * Get configuration instructions
     * @returns {string} - Setup instructions
     */
    getSetupInstructions() {
        return `
EmailJS Setup Instructions:

1. Go to https://www.emailjs.com/
2. Create a free account
3. Create an email service (Gmail, Outlook, etc.)
4. Create email templates for each form type
5. Get your Public Key and Service ID
6. Update the configuration in email-service.js:
   - Replace 'YOUR_PUBLIC_KEY_HERE' with your actual public key
   - Replace 'service_optiscale360' with your actual service ID
   - Create templates with IDs: template_contact_form, template_website_request

Template Variables Available:
- {{customer_name}}
- {{customer_email}}
- {{customer_phone}}
- {{customer_company}}
- {{form_fields}}
- {{newsletter_subscription}}
- {{submission_timestamp}}
- {{source_url}}
- {{lead_id}}
- Individual field variables: {{first_name}}, {{last_name}}, etc.
        `;
    }
}

// Create global instance
window.EmailService = new EmailService();

// Admin functions for testing and configuration
window.emailAdminFunctions = {
    sendTest: () => window.EmailService.sendTestEmail(),
    checkConfig: () => window.EmailService.isConfigured(),
    getInstructions: () => console.log(window.EmailService.getSetupInstructions()),
    reinit: () => window.EmailService.init()
};

console.log('OptiScale 360 Email Service initialized');
console.log('Run window.emailAdminFunctions.getInstructions() for setup help');