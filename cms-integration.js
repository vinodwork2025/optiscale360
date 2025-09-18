// CMS Integration for Resource Pages
import { contentAPI } from './cms-api.js';

class CMSIntegration {
  constructor() {
    this.init();
  }

  async init() {
    const pageType = this.getCurrentPageType();
    if (pageType) {
      await this.loadContent(pageType);
    }
  }

  getCurrentPageType() {
    const path = window.location.pathname;
    if (path.includes('business-templates.html')) return 'business-templates';
    if (path.includes('best-practices.html')) return 'best-practices';
    if (path.includes('industry-insights.html')) return 'industry-insights';
    if (path.includes('webinars-training.html')) return 'webinars-training';
    if (path.includes('support-center.html')) return 'support-center';
    return null;
  }

  async loadContent(pageType) {
    try {
      switch (pageType) {
        case 'business-templates':
          await this.loadBusinessTemplates();
          break;
        case 'best-practices':
          await this.loadBestPractices();
          break;
        case 'industry-insights':
          await this.loadIndustryInsights();
          break;
        case 'webinars-training':
          await this.loadWebinars();
          break;
        case 'support-center':
          await this.loadFAQs();
          break;
      }
    } catch (error) {
      console.error(`Error loading ${pageType} content:`, error);
      this.showError(`Failed to load content. Please try again later.`);
    }
  }

  async loadBusinessTemplates() {
    const templates = await contentAPI.getBusinessTemplatesByCategory();
    const container = document.getElementById('templates-grid');

    if (!container) return;

    let html = '';

    // Category mapping for display
    const categoryLabels = {
      'strategic': 'Strategic Planning',
      'financial': 'Financial Templates',
      'operations': 'Operations',
      'marketing': 'Marketing',
      'hr': 'HR & People',
      'project': 'Project Management'
    };

    Object.entries(templates).forEach(([category, items]) => {
      const categoryLabel = categoryLabels[category] || category;

      html += `
        <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">${categoryLabel}</h3>
          <div class="space-y-3 mb-6">
            ${items.map(template => `
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 class="font-medium text-gray-900">${template.title}</h4>
                  ${template.description ? `<p class="text-sm text-gray-600">${template.description}</p>` : ''}
                </div>
                ${template.downloadUrl ? `
                  <a href="${template.downloadUrl}" target="_blank" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Download →
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
          <div class="text-center">
            <span class="text-sm text-gray-500">${items.length} template${items.length !== 1 ? 's' : ''} available</span>
          </div>
        </div>
      `;
    });

    if (html) {
      container.innerHTML = html;
    } else {
      container.innerHTML = this.getEmptyState('No templates available yet.');
    }
  }

  async loadBestPractices() {
    const practices = await contentAPI.getBestPractices();
    const container = document.getElementById('practices-content');

    if (!container) return;

    let html = '';

    practices.forEach((practice, index) => {
      html += `
        <section id="practice-${index}" class="bg-white rounded-xl p-8 shadow-lg">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">${practice.title}</h2>
          <div class="prose max-w-none">
            ${practice.summary ? `<p class="text-xl text-gray-600 mb-6">${practice.summary}</p>` : ''}
            ${practice.content ? contentAPI.blockToHtml(practice.content) : ''}
          </div>
          ${practice.category ? `
            <div class="mt-6 pt-6 border-t border-gray-200">
              <span class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                ${practice.category}
              </span>
            </div>
          ` : ''}
        </section>
      `;
    });

    if (html) {
      container.innerHTML = html;
    } else {
      container.innerHTML = this.getEmptyState('No best practices available yet.');
    }
  }

  async loadIndustryInsights() {
    const insights = await contentAPI.getIndustryInsights();
    const container = document.getElementById('insights-grid');

    if (!container) return;

    let html = '';

    insights.forEach(insight => {
      const publishedDate = new Date(insight.publishedAt).toLocaleDateString();

      html += `
        <article class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">${insight.title}</h3>
          <p class="text-gray-600 mb-6">${insight.summary || ''}</p>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              ${insight.industry ? `<span class="text-sm text-gray-500">${insight.industry}</span>` : ''}
              <span class="text-sm text-gray-400">•</span>
              <span class="text-sm text-gray-500">${publishedDate}</span>
            </div>
            ${insight.featured ? '<span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Featured</span>' : ''}
          </div>
        </article>
      `;
    });

    if (html) {
      container.innerHTML = html;
    } else {
      container.innerHTML = this.getEmptyState('No insights available yet.');
    }
  }

  async loadWebinars() {
    const webinars = await contentAPI.getAllWebinars();
    const container = document.getElementById('events-list');

    if (!container) return;

    let html = '';

    webinars.forEach(webinar => {
      const eventDate = new Date(webinar.eventDate);
      const isUpcoming = eventDate > new Date();
      const formattedDate = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      html += `
        <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div class="flex justify-between items-start mb-6">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span class="bg-${isUpcoming ? 'green' : 'gray'}-100 text-${isUpcoming ? 'green' : 'gray'}-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              ${isUpcoming ? 'Upcoming' : 'Past Event'}
            </span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">${webinar.title}</h3>
          ${webinar.description ? `<p class="text-gray-600 mb-6">${webinar.description}</p>` : ''}
          <div class="space-y-2 mb-6">
            <div class="flex items-center text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              ${formattedDate}
            </div>
            ${webinar.duration ? `
              <div class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                ${webinar.duration}
              </div>
            ` : ''}
            ${webinar.type ? `
              <div class="flex items-center text-gray-600">
                <span class="w-4 h-4 mr-2">📋</span>
                ${webinar.type}
              </div>
            ` : ''}
          </div>
          ${webinar.registrationUrl && isUpcoming ? `
            <a href="${webinar.registrationUrl}" target="_blank" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center block">
              Register Now
            </a>
          ` : `
            <div class="w-full bg-gray-100 text-gray-500 px-6 py-3 rounded-lg text-center">
              ${isUpcoming ? 'Registration Link Coming Soon' : 'Event Completed'}
            </div>
          `}
        </div>
      `;
    });

    if (html) {
      container.innerHTML = html;
    } else {
      container.innerHTML = this.getEmptyState('No events scheduled yet.');
    }
  }

  async loadFAQs() {
    const faqs = await contentAPI.getFAQs();
    const container = document.getElementById('faq-list');

    if (!container) return;

    let html = '';

    faqs.forEach((faq, index) => {
      html += `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <button class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors" onclick="toggleFAQ(${index})">
            <span class="font-medium text-gray-900">${faq.question}</span>
            <svg class="w-5 h-5 text-gray-500 transform transition-transform faq-icon" data-faq="${index}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="faq-content hidden px-6 pb-4" data-faq="${index}">
            <div class="text-gray-600">
              ${faq.answer ? contentAPI.blockToHtml(faq.answer) : ''}
            </div>
          </div>
        </div>
      `;
    });

    if (html) {
      container.innerHTML = html;
    } else {
      container.innerHTML = this.getEmptyState('No FAQs available yet.');
    }

    // Add FAQ toggle functionality
    window.toggleFAQ = (index) => {
      const content = document.querySelector(`[data-faq="${index}"].faq-content`);
      const icon = document.querySelector(`[data-faq="${index}"].faq-icon`);

      if (content.classList.contains('hidden')) {
        // Close all other FAQs
        document.querySelectorAll('.faq-content').forEach(item => {
          item.classList.add('hidden');
        });
        document.querySelectorAll('.faq-icon').forEach(item => {
          item.classList.remove('rotate-180');
        });

        // Open this FAQ
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
      } else {
        content.classList.add('hidden');
        icon.classList.remove('rotate-180');
      }
    };
  }

  getEmptyState(message) {
    return `
      <div class="col-span-full text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Content Yet</h3>
        <p class="text-gray-500">${message}</p>
      </div>
    `;
  }

  showError(message) {
    const containers = [
      'templates-grid', 'practices-content', 'insights-grid',
      'events-list', 'faq-list'
    ];

    containers.forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `
          <div class="col-span-full text-center py-12">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Content</h3>
            <p class="text-gray-500">${message}</p>
          </div>
        `;
      }
    });
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new CMSIntegration();
});