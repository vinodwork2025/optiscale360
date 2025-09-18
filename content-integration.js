// Content Integration System - Loads admin content into resource pages
class ContentIntegration {
    constructor() {
        this.loadPageContent();
    }

    loadPageContent() {
        const contentData = this.getStoredContent();
        const currentPage = this.getCurrentPageType();

        if (currentPage && contentData[currentPage]) {
            this.renderPageContent(currentPage, contentData[currentPage]);
        }
    }

    getCurrentPageType() {
        const path = window.location.pathname;
        if (path.includes('business-templates.html')) return 'business-templates';
        if (path.includes('best-practices.html')) return 'best-practices';
        if (path.includes('industry-insights.html')) return 'industry-insights';
        if (path.includes('roi-calculator.html')) return 'roi-calculator';
        if (path.includes('webinars-training.html')) return 'webinars-training';
        if (path.includes('support-center.html')) return 'support-center';
        return null;
    }

    getStoredContent() {
        const saved = localStorage.getItem('optiscale-content');
        return saved ? JSON.parse(saved) : null;
    }

    renderPageContent(pageType, content) {
        // Update page title and description
        this.updateBasicInfo(content);

        // Render page-specific content
        switch (pageType) {
            case 'business-templates':
                this.renderBusinessTemplates(content);
                break;
            case 'best-practices':
                this.renderBestPractices(content);
                break;
            case 'industry-insights':
                this.renderIndustryInsights(content);
                break;
            case 'webinars-training':
                this.renderWebinarsTraining(content);
                break;
            case 'support-center':
                this.renderSupportCenter(content);
                break;
        }
    }

    updateBasicInfo(content) {
        // Update page title
        const titleElement = document.querySelector('h1');
        if (titleElement && content.title) {
            titleElement.textContent = content.title;
        }

        // Update description
        const descElement = document.querySelector('.hero-description, .description');
        if (descElement && content.description) {
            descElement.textContent = content.description;
        }
    }

    renderBusinessTemplates(content) {
        const container = document.getElementById('templates-grid');
        if (!container || !content.sections) return;

        let html = '';
        content.sections.forEach(section => {
            html += `
                <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-4">${section.title}</h3>
                    <ul class="space-y-2 mb-6">
                        ${section.items.map(item => `<li class="text-gray-600">• ${item}</li>`).join('')}
                    </ul>
                    <button class="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                        Download Templates →
                    </button>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    renderBestPractices(content) {
        const container = document.getElementById('practices-content');
        if (!container || !content.sections) return;

        let html = '';
        content.sections.forEach((section, index) => {
            html += `
                <section id="practice-${index}" class="bg-white rounded-xl p-8 shadow-lg">
                    <h2 class="text-3xl font-bold text-gray-900 mb-6">${section.title}</h2>
                    <div class="prose max-w-none">
                        <p class="text-gray-600 text-lg leading-relaxed">${section.content}</p>
                    </div>
                </section>
            `;
        });
        container.innerHTML = html;
    }

    renderIndustryInsights(content) {
        const container = document.getElementById('insights-grid');
        if (!container || !content.insights) return;

        let html = '';
        content.insights.forEach(insight => {
            html += `
                <article class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-4">${insight.title}</h3>
                    <p class="text-gray-600 mb-6">${insight.summary}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">Industry Insight</span>
                        <button class="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                            Read More →
                        </button>
                    </div>
                </article>
            `;
        });
        container.innerHTML = html;
    }

    renderWebinarsTraining(content) {
        const container = document.getElementById('events-list');
        if (!container || !content.events) return;

        let html = '';
        content.events.forEach(event => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            html += `
                <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                    <div class="flex justify-between items-start mb-6">
                        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Upcoming</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-4">${event.title}</h3>
                    <div class="space-y-2 mb-6">
                        <div class="flex items-center text-gray-600">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            ${formattedDate}
                        </div>
                        <div class="flex items-center text-gray-600">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            ${event.duration}
                        </div>
                    </div>
                    <button class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Register Now
                    </button>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    renderSupportCenter(content) {
        const container = document.getElementById('faq-list');
        if (!container || !content.faqs) return;

        let html = '';
        content.faqs.forEach((faq, index) => {
            html += `
                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors" onclick="toggleFAQ(${index})">
                        <span class="font-medium text-gray-900">${faq.question}</span>
                        <svg class="w-5 h-5 text-gray-500 transform transition-transform faq-icon" data-faq="${index}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <div class="faq-content hidden px-6 pb-4" data-faq="${index}">
                        <p class="text-gray-600">${faq.answer}</p>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
}

// FAQ toggle function for support center
function toggleFAQ(index) {
    const content = document.querySelector(`[data-faq="${index}"].faq-content`);
    const icon = document.querySelector(`[data-faq="${index}"].faq-icon`);

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        icon.classList.remove('rotate-180');
    }
}

// Initialize content integration when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ContentIntegration();
});