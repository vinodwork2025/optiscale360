/**
 * OptiScale 360 Lead Management System
 * Handles local storage of leads and email client integration
 */

class LeadManager {
    constructor() {
        this.storageKey = 'optiscale360_leads';
        this.emailAddress = 'info@optiscale360.com';
    }

    /**
     * Save a lead to local storage
     * @param {Object} formData - Form data object
     * @param {string} formType - Type of form (e.g., 'Contact Form', 'Free AI-Ready Website')
     * @returns {Object|null} - Saved lead object or null if failed
     */
    saveLead(formData, formType) {
        try {
            // Get existing leads or initialize empty array
            const existingLeads = this.getLeads();

            // Create lead object with timestamp and unique ID
            const lead = {
                id: Date.now(),
                formType: formType,
                timestamp: new Date().toISOString(),
                data: formData,
                status: 'new',
                source: window.location.href
            };

            // Add to existing leads
            existingLeads.push(lead);

            // Save back to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(existingLeads));

            console.log('Lead saved locally:', lead);
            return lead;
        } catch (error) {
            console.error('Error saving lead locally:', error);
            return null;
        }
    }

    /**
     * Get all leads from local storage
     * @returns {Array} - Array of lead objects
     */
    getLeads() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch (error) {
            console.error('Error retrieving leads:', error);
            return [];
        }
    }

    /**
     * Get leads by form type
     * @param {string} formType - Type of form to filter by
     * @returns {Array} - Array of filtered lead objects
     */
    getLeadsByType(formType) {
        return this.getLeads().filter(lead => lead.formType === formType);
    }

    /**
     * Mark a lead as processed
     * @param {number} leadId - ID of the lead to mark as processed
     * @returns {boolean} - Success status
     */
    markLeadAsProcessed(leadId) {
        try {
            const leads = this.getLeads();
            const leadIndex = leads.findIndex(lead => lead.id === leadId);

            if (leadIndex !== -1) {
                leads[leadIndex].status = 'processed';
                leads[leadIndex].processedAt = new Date().toISOString();
                localStorage.setItem(this.storageKey, JSON.stringify(leads));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error marking lead as processed:', error);
            return false;
        }
    }

    /**
     * Open email client with formatted lead data
     * @param {Object} formData - Form data object
     * @param {string} formType - Type of form
     */
    openEmailClient(formData, formType) {
        try {
            // Create email subject based on form type
            const subjectPrefix = this.getSubjectPrefix(formType);
            const customerName = `${formData.firstName || 'Unknown'} ${formData.lastName || ''}`.trim();
            const subject = `${subjectPrefix} - ${customerName}`;

            // Create email body
            const emailBody = this.formatEmailBody(formData, formType);

            // Create mailto URL
            const mailtoUrl = `mailto:${this.emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

            // Open email client
            window.open(mailtoUrl, '_blank');

            console.log('Email client opened with lead data');
        } catch (error) {
            console.error('Error opening email client:', error);
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
     * Format email body with lead information
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
     * Format field names for display
     * @param {string} fieldName - Raw field name from form
     * @returns {string} - Formatted field name
     */
    formatFieldName(fieldName) {
        // Convert camelCase to Title Case
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    /**
     * Export all leads as CSV
     * @returns {string} - CSV formatted string
     */
    exportLeadsAsCSV() {
        const leads = this.getLeads();

        if (leads.length === 0) {
            return 'No leads found';
        }

        // Get all unique field names
        const allFields = new Set();
        leads.forEach(lead => {
            Object.keys(lead.data).forEach(field => allFields.add(field));
        });

        // Create CSV header
        const headers = ['ID', 'Form Type', 'Timestamp', 'Status', 'Source', ...Array.from(allFields)];
        let csv = headers.join(',') + '\n';

        // Add data rows
        leads.forEach(lead => {
            const row = [
                lead.id,
                lead.formType,
                lead.timestamp,
                lead.status || 'new',
                lead.source || '',
                ...Array.from(allFields).map(field => lead.data[field] || '')
            ];
            csv += row.map(value => `"${value}"`).join(',') + '\n';
        });

        return csv;
    }

    /**
     * Download leads as CSV file
     */
    downloadLeadsAsCSV() {
        const csv = this.exportLeadsAsCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `optiscale360-leads-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    /**
     * Clear all leads (admin function)
     * @returns {boolean} - Success status
     */
    clearAllLeads() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('All leads cleared');
            return true;
        } catch (error) {
            console.error('Error clearing leads:', error);
            return false;
        }
    }

    /**
     * Get lead statistics
     * @returns {Object} - Statistics object
     */
    getLeadStats() {
        const leads = this.getLeads();
        const stats = {
            total: leads.length,
            new: leads.filter(lead => lead.status === 'new').length,
            processed: leads.filter(lead => lead.status === 'processed').length,
            byFormType: {},
            byDate: {}
        };

        // Group by form type
        leads.forEach(lead => {
            stats.byFormType[lead.formType] = (stats.byFormType[lead.formType] || 0) + 1;
        });

        // Group by date
        leads.forEach(lead => {
            const date = new Date(lead.timestamp).toDateString();
            stats.byDate[date] = (stats.byDate[date] || 0) + 1;
        });

        return stats;
    }

    /**
     * Process form submission (main method to be called by forms)
     * @param {FormData} formData - Form data from submission
     * @param {string} formType - Type of form being submitted
     * @returns {Object|null} - Saved lead object or null if failed
     */
    processFormSubmission(formData, formType) {
        // Convert FormData to object
        const data = Object.fromEntries(formData.entries());

        // Save lead locally
        const savedLead = this.saveLead(data, formType);

        if (savedLead) {
            // Open email client
            this.openEmailClient(data, formType);

            // Track conversion event (for analytics)
            this.trackConversion(formType);
        }

        return savedLead;
    }

    /**
     * Track conversion event
     * @param {string} formType - Type of form that was submitted
     */
    trackConversion(formType) {
        try {
            // Google Analytics 4 event tracking (if gtag is available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    form_type: formType,
                    event_category: 'engagement',
                    event_label: formType
                });
            }

            // Facebook Pixel tracking (if fbq is available)
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    form_type: formType
                });
            }

            console.log('Conversion tracked:', formType);
        } catch (error) {
            console.error('Error tracking conversion:', error);
        }
    }
}

// Create global instance
window.LeadManager = new LeadManager();

// Admin console functions (for debugging/management)
window.leadAdminFunctions = {
    viewAllLeads: () => window.LeadManager.getLeads(),
    getStats: () => window.LeadManager.getLeadStats(),
    exportCSV: () => window.LeadManager.downloadLeadsAsCSV(),
    clearAll: () => window.LeadManager.clearAllLeads()
};

console.log('OptiScale 360 Lead Manager initialized');
console.log('Admin functions available via window.leadAdminFunctions');