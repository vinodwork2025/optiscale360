class ContentManager {
    constructor() {
        this.currentResource = null;
        this.contentData = {};
        this.init();
    }

    init() {
        this.loadContentData();
        this.bindEvents();
    }

    loadContentData() {
        // Load existing content from localStorage or initialize empty
        const saved = localStorage.getItem('optiscale-content');
        this.contentData = saved ? JSON.parse(saved) : this.getDefaultContent();
    }

    getDefaultContent() {
        return {
            'business-templates': {
                title: 'Business Templates',
                description: 'Ready-to-use templates for business planning, process documentation, and strategic planning.',
                sections: [
                    {
                        title: 'Strategic Planning Templates',
                        items: ['Business Plan Template', 'SWOT Analysis Template', 'Strategic Roadmap Template']
                    },
                    {
                        title: 'Financial Templates',
                        items: ['Budget Planning Template', 'Financial Forecast Template', 'ROI Analysis Template']
                    }
                ]
            },
            'best-practices': {
                title: 'Best Practices Guide',
                description: 'Comprehensive guides on business optimization, process improvement, and operational excellence.',
                sections: [
                    {
                        title: 'Strategic Planning Best Practices',
                        content: 'Start with a clear, compelling vision that aligns with your organization\'s core values and market opportunities.'
                    },
                    {
                        title: 'Operations Excellence Framework',
                        content: 'Combine Lean and Six Sigma methodologies for maximum impact.'
                    }
                ]
            },
            'industry-insights': {
                title: 'Industry Insights',
                description: 'Stay updated with the latest trends, benchmarks, and insights across various industries.',
                insights: [
                    {
                        title: 'Digital Transformation Trends 2025',
                        summary: 'Key digital transformation trends shaping businesses this year.'
                    },
                    {
                        title: 'Supply Chain Optimization',
                        summary: 'Best practices for optimizing supply chain operations.'
                    }
                ]
            },
            'roi-calculator': {
                title: 'ROI Calculator',
                description: 'Calculate the return on investment for your business optimization initiatives and projects.',
                features: ['NPV Calculation', 'Payback Period', 'Visual Charts', 'Export Results']
            },
            'webinars-training': {
                title: 'Webinars & Training',
                description: 'Join our educational webinars and training sessions on business optimization strategies.',
                events: [
                    {
                        title: 'Business Process Optimization Masterclass',
                        date: '2025-01-25',
                        duration: '2 hours'
                    }
                ]
            },
            'support-center': {
                title: 'Support Center',
                description: 'Access FAQs, documentation, and get help with your business optimization journey.',
                faqs: [
                    {
                        question: 'How do I get started with OptiScale 360?',
                        answer: 'Contact our team to schedule a consultation and assessment.'
                    }
                ]
            }
        };
    }

    bindEvents() {
        document.getElementById('saveAll').addEventListener('click', () => this.saveAllChanges());
    }

    loadEditor(resourceType) {
        this.currentResource = resourceType;
        this.updateActiveNav(resourceType);

        const content = this.contentData[resourceType];
        const editorHtml = this.generateEditorHTML(resourceType, content);

        document.getElementById('welcomeScreen').classList.add('hidden');
        document.getElementById('editorContent').classList.remove('hidden');
        document.getElementById('editorContent').innerHTML = editorHtml;

        this.bindEditorEvents();
    }

    updateActiveNav(resourceType) {
        document.querySelectorAll('.resource-nav-btn').forEach(btn => {
            btn.classList.remove('bg-blue-50', 'text-blue-600');
            btn.classList.add('text-gray-700');
        });

        const activeBtn = document.querySelector(`[data-resource="${resourceType}"]`);
        if (activeBtn) {
            activeBtn.classList.add('bg-blue-50', 'text-blue-600');
            activeBtn.classList.remove('text-gray-700');
        }
    }

    generateEditorHTML(resourceType, content) {
        const resourceNames = {
            'business-templates': 'Business Templates',
            'best-practices': 'Best Practices Guide',
            'industry-insights': 'Industry Insights',
            'roi-calculator': 'ROI Calculator',
            'webinars-training': 'Webinars & Training',
            'support-center': 'Support Center'
        };

        let html = `
            <div class="p-8">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900">${resourceNames[resourceType]}</h2>
                        <p class="text-gray-600 mt-2">Edit content for this resource page</p>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="contentManager.previewChanges()" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                            Preview
                        </button>
                        <button onclick="contentManager.saveResource()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>

                <div class="space-y-8">
                    <!-- Basic Info -->
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input type="text" value="${content.title}" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" data-field="title">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea rows="3" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" data-field="description">${content.description}</textarea>
                            </div>
                        </div>
                    </div>
        `;

        // Add resource-specific content editors
        if (resourceType === 'business-templates') {
            html += this.generateTemplatesEditor(content);
        } else if (resourceType === 'best-practices') {
            html += this.generateBestPracticesEditor(content);
        } else if (resourceType === 'industry-insights') {
            html += this.generateInsightsEditor(content);
        } else if (resourceType === 'webinars-training') {
            html += this.generateWebinarsEditor(content);
        } else if (resourceType === 'support-center') {
            html += this.generateSupportEditor(content);
        }

        html += `
                </div>
            </div>
        `;

        return html;
    }

    generateTemplatesEditor(content) {
        let html = `
            <div class="bg-gray-50 p-6 rounded-lg">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Template Categories</h3>
                    <button onclick="contentManager.addSection()" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                        Add Category
                    </button>
                </div>
                <div id="sectionsContainer" class="space-y-4">
        `;

        content.sections.forEach((section, index) => {
            html += `
                <div class="bg-white p-4 rounded border section-item" data-index="${index}">
                    <div class="flex justify-between items-start mb-3">
                        <input type="text" value="${section.title}" class="text-lg font-medium border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2" data-field="sections.${index}.title">
                        <button onclick="contentManager.removeSection(${index})" class="text-red-600 hover:text-red-800 text-sm">Remove</button>
                    </div>
                    <div class="space-y-2">
                        ${section.items.map((item, itemIndex) => `
                            <div class="flex items-center space-x-2">
                                <input type="text" value="${item}" class="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" data-field="sections.${index}.items.${itemIndex}">
                                <button onclick="contentManager.removeItem(${index}, ${itemIndex})" class="text-red-600 hover:text-red-800 text-sm">×</button>
                            </div>
                        `).join('')}
                        <button onclick="contentManager.addItem(${index})" class="text-blue-600 hover:text-blue-800 text-sm">+ Add Item</button>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    generateBestPracticesEditor(content) {
        let html = `
            <div class="bg-gray-50 p-6 rounded-lg">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Practice Sections</h3>
                    <button onclick="contentManager.addSection()" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                        Add Section
                    </button>
                </div>
                <div id="sectionsContainer" class="space-y-4">
        `;

        content.sections.forEach((section, index) => {
            html += `
                <div class="bg-white p-4 rounded border section-item" data-index="${index}">
                    <div class="flex justify-between items-start mb-3">
                        <input type="text" value="${section.title}" class="text-lg font-medium border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 flex-1" data-field="sections.${index}.title">
                        <button onclick="contentManager.removeSection(${index})" class="text-red-600 hover:text-red-800 text-sm ml-2">Remove</button>
                    </div>
                    <textarea rows="4" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" data-field="sections.${index}.content" placeholder="Section content...">${section.content}</textarea>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    generateInsightsEditor(content) {
        let html = `
            <div class="bg-gray-50 p-6 rounded-lg">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Industry Insights</h3>
                    <button onclick="contentManager.addInsight()" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                        Add Insight
                    </button>
                </div>
                <div id="insightsContainer" class="space-y-4">
        `;

        content.insights.forEach((insight, index) => {
            html += `
                <div class="bg-white p-4 rounded border insight-item" data-index="${index}">
                    <div class="flex justify-between items-start mb-3">
                        <input type="text" value="${insight.title}" class="text-lg font-medium border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 flex-1" data-field="insights.${index}.title">
                        <button onclick="contentManager.removeInsight(${index})" class="text-red-600 hover:text-red-800 text-sm ml-2">Remove</button>
                    </div>
                    <textarea rows="3" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" data-field="insights.${index}.summary" placeholder="Insight summary...">${insight.summary}</textarea>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    generateWebinarsEditor(content) {
        let html = `
            <div class="bg-gray-50 p-6 rounded-lg">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                    <button onclick="contentManager.addEvent()" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                        Add Event
                    </button>
                </div>
                <div id="eventsContainer" class="space-y-4">
        `;

        content.events.forEach((event, index) => {
            html += `
                <div class="bg-white p-4 rounded border event-item" data-index="${index}">
                    <div class="flex justify-between items-start mb-3">
                        <input type="text" value="${event.title}" class="text-lg font-medium border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 flex-1" data-field="events.${index}.title">
                        <button onclick="contentManager.removeEvent(${index})" class="text-red-600 hover:text-red-800 text-sm ml-2">Remove</button>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Date</label>
                            <input type="date" value="${event.date}" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" data-field="events.${index}.date">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Duration</label>
                            <input type="text" value="${event.duration}" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" data-field="events.${index}.duration">
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    generateSupportEditor(content) {
        let html = `
            <div class="bg-gray-50 p-6 rounded-lg">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">FAQ Items</h3>
                    <button onclick="contentManager.addFAQ()" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                        Add FAQ
                    </button>
                </div>
                <div id="faqsContainer" class="space-y-4">
        `;

        content.faqs.forEach((faq, index) => {
            html += `
                <div class="bg-white p-4 rounded border faq-item" data-index="${index}">
                    <div class="flex justify-between items-start mb-3">
                        <input type="text" value="${faq.question}" class="text-lg font-medium border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 flex-1" data-field="faqs.${index}.question" placeholder="Question...">
                        <button onclick="contentManager.removeFAQ(${index})" class="text-red-600 hover:text-red-800 text-sm ml-2">Remove</button>
                    </div>
                    <textarea rows="3" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" data-field="faqs.${index}.answer" placeholder="Answer...">${faq.answer}</textarea>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    bindEditorEvents() {
        // Bind input events for real-time updates
        document.querySelectorAll('[data-field]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateContentData(e.target.dataset.field, e.target.value);
            });
        });
    }

    updateContentData(fieldPath, value) {
        const keys = fieldPath.split('.');
        let obj = this.contentData[this.currentResource];

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (key.includes('[') && key.includes(']')) {
                // Handle array notation like "sections[0]"
                const arrayKey = key.split('[')[0];
                const index = parseInt(key.split('[')[1].split(']')[0]);
                obj = obj[arrayKey][index];
            } else {
                obj = obj[key];
            }
        }

        const lastKey = keys[keys.length - 1];
        if (lastKey.includes('[') && lastKey.includes(']')) {
            const arrayKey = lastKey.split('[')[0];
            const index = parseInt(lastKey.split('[')[1].split(']')[0]);
            obj[arrayKey][index] = value;
        } else {
            obj[lastKey] = value;
        }
    }

    // Action methods for adding/removing content
    addSection() {
        const resource = this.contentData[this.currentResource];
        if (this.currentResource === 'business-templates') {
            resource.sections.push({
                title: 'New Category',
                items: ['New Template']
            });
        } else if (this.currentResource === 'best-practices') {
            resource.sections.push({
                title: 'New Practice',
                content: 'Description of the best practice...'
            });
        }
        this.loadEditor(this.currentResource);
    }

    removeSection(index) {
        if (confirm('Are you sure you want to remove this section?')) {
            this.contentData[this.currentResource].sections.splice(index, 1);
            this.loadEditor(this.currentResource);
        }
    }

    addItem(sectionIndex) {
        this.contentData[this.currentResource].sections[sectionIndex].items.push('New Item');
        this.loadEditor(this.currentResource);
    }

    removeItem(sectionIndex, itemIndex) {
        this.contentData[this.currentResource].sections[sectionIndex].items.splice(itemIndex, 1);
        this.loadEditor(this.currentResource);
    }

    addInsight() {
        this.contentData[this.currentResource].insights.push({
            title: 'New Insight',
            summary: 'Insight description...'
        });
        this.loadEditor(this.currentResource);
    }

    removeInsight(index) {
        if (confirm('Are you sure you want to remove this insight?')) {
            this.contentData[this.currentResource].insights.splice(index, 1);
            this.loadEditor(this.currentResource);
        }
    }

    addEvent() {
        this.contentData[this.currentResource].events.push({
            title: 'New Event',
            date: new Date().toISOString().split('T')[0],
            duration: '1 hour'
        });
        this.loadEditor(this.currentResource);
    }

    removeEvent(index) {
        if (confirm('Are you sure you want to remove this event?')) {
            this.contentData[this.currentResource].events.splice(index, 1);
            this.loadEditor(this.currentResource);
        }
    }

    addFAQ() {
        this.contentData[this.currentResource].faqs.push({
            question: 'New Question',
            answer: 'Answer to the question...'
        });
        this.loadEditor(this.currentResource);
    }

    removeFAQ(index) {
        if (confirm('Are you sure you want to remove this FAQ?')) {
            this.contentData[this.currentResource].faqs.splice(index, 1);
            this.loadEditor(this.currentResource);
        }
    }

    saveResource() {
        localStorage.setItem('optiscale-content', JSON.stringify(this.contentData));
        this.showSuccessToast();
    }

    saveAllChanges() {
        localStorage.setItem('optiscale-content', JSON.stringify(this.contentData));
        this.showSuccessToast();
    }

    previewChanges() {
        if (this.currentResource) {
            window.open(`resources/${this.currentResource}.html`, '_blank');
        }
    }

    showSuccessToast() {
        const toast = document.getElementById('successToast');
        toast.classList.remove('translate-y-full');
        setTimeout(() => {
            toast.classList.add('translate-y-full');
        }, 3000);
    }
}

// Initialize the content manager
const contentManager = new ContentManager();

// Make functions globally available
window.loadEditor = (resourceType) => contentManager.loadEditor(resourceType);