
/**
 * SIMPLIFIED Blog Manager - Direct posts loading
 * Fixed version that guarantees posts display
 */

class SimpleBlogManager {
    constructor() {
        this.posts = [];
        this.categories = [];
        this.currentCategory = 'all';
    }

    // Initialize the blog system
    async init() {
        console.log('📍 SimpleBlogManager: Starting initialization...');
        try {
            await this.loadPosts();
            console.log('📍 Posts loaded:', this.posts.length, 'posts');

            this.renderPosts();
            console.log('📍 Posts rendered to DOM');

            this.renderCategories();
            console.log('📍 Categories rendered');

            this.setupEventListeners();
            console.log('📍 Event listeners setup complete');

            console.log('✅ SimpleBlogManager: Initialization complete!');
        } catch (error) {
            console.error('❌ SimpleBlogManager initialization failed:', error);
        }
    }

    // Load posts data (embedded for reliability)
    async loadPosts() {
        console.log('📍 Loading posts data...');

        // Embedded posts data - no external fetch needed
        const data = {
            "posts": [
                {
                    "id": "blockchain-ehr-consent-management-sulonya-sevenhills",
                    "title": "Revolutionary Blockchain-Based EHR Consent Management: Sulonya's Innovative Solution for SevenHills Healthcare",
                    "slug": "blockchain-ehr-consent-management-sulonya-sevenhills",
                    "excerpt": "Discover how Sulonya's cutting-edge blockchain-based consent management system transforms Electronic Health Records (EHR) security, ensuring patients maintain complete control over their medical data while enabling seamless, compliant access for healthcare providers.",
                    "author": "Sulonya Healthcare Solutions",
                    "authorImage": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=80&h=80&fit=crop&crop=face",
                    "category": "Healthcare Technology",
                    "publishDate": "2025-01-15",
                    "readTime": 12,
                    "featured": false,
                    "featuredImage": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop"
                },
                {
                    "id": "staff-augmentation-for-startups-scale-your-enginee",
                    "title": "Staff Augmentation for Startups: Scale Your Engineering Team Without Hiring Headaches",
                    "slug": "staff-augmentation-for-startups-scale-your-enginee",
                    "excerpt": "Discover how staff augmentation helps startups scale engineering teams efficiently without hiring headaches. Learn cost-effective strategies, benefits, and best practices for rapid team scaling.",
                    "author": "Vinod Kumar",
                    "authorImage": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
                    "category": "Business",
                    "publishDate": "2025-09-15",
                    "readTime": 12,
                    "featured": false,
                    "featuredImage": "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=400&fit=crop"
                },
                {
                    "id": "google-tracker",
                    "title": "Google Tracker",
                    "slug": "google-tracker",
                    "excerpt": "Get detailed Google search tracking and insights with our comprehensive Google Tracker tool.",
                    "author": "Alex Chen",
                    "authorImage": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
                    "category": "SEO",
                    "publishDate": "2024-01-10",
                    "readTime": 6,
                    "featured": false,
                    "featuredImage": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop"
                },
                {
                    "id": "build-your-own-ai-agent-7-day-adventure-for-kids-a",
                    "title": "Build Your Own AI Agent: 7-Day Adventure for Kids (Age 8)",
                    "slug": "build-your-own-ai-agent-7-day-adventure-for-kids-a",
                    "excerpt": "Join an exciting 7-day journey to build your first AI agent! Perfect for curious kids who love tech and want to create something amazing.",
                    "author": "Sarah Johnson",
                    "authorImage": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
                    "category": "AI & ML",
                    "publishDate": "2024-01-08",
                    "readTime": 10,
                    "featured": false,
                    "featuredImage": "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&h=400&fit=crop"
                },
                {
                    "id": "ai-web-design-trends-2024",
                    "title": "AI-Powered Web Design Trends That Will Dominate 2024",
                    "slug": "ai-web-design-trends-2024",
                    "excerpt": "Explore the revolutionary AI-powered web design trends reshaping the digital landscape in 2024. From intelligent layouts to automated optimization.",
                    "author": "Alex Chen",
                    "authorImage": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
                    "category": "AI & ML",
                    "publishDate": "2024-01-07",
                    "readTime": 8,
                    "featured": false,
                    "featuredImage": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop"
                },
                {
                    "id": "responsive-design-beyond-mobile",
                    "title": "Responsive Design in 2024: Beyond Mobile-First Thinking",
                    "slug": "responsive-design-beyond-mobile",
                    "excerpt": "Discover the evolution of responsive design beyond mobile-first approaches. Learn about device-agnostic design and future-proof responsive strategies.",
                    "author": "Maria Garcia",
                    "authorImage": "https://images.unsplash.com/photo-1494790108755-2616b612b567?w=80&h=80&fit=crop&crop=face",
                    "category": "Web Design",
                    "publishDate": "2024-01-06",
                    "readTime": 7,
                    "featured": false,
                    "featuredImage": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop"
                },
                {
                    "id": "seo-ai-optimization-guide",
                    "title": "AI-Powered SEO: How Machine Learning is Changing Search Rankings",
                    "slug": "seo-ai-optimization-guide",
                    "excerpt": "Understand how AI and machine learning are revolutionizing SEO strategies. Learn to optimize for AI-driven search algorithms and voice search.",
                    "author": "David Park",
                    "authorImage": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
                    "category": "SEO",
                    "publishDate": "2024-01-05",
                    "readTime": 9,
                    "featured": false,
                    "featuredImage": "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=400&fit=crop"
                },
                {
                    "id": "website-performance-optimization-2024",
                    "title": "Website Performance Optimization: Advanced Techniques That Actually Work in 2024",
                    "slug": "website-performance-optimization-2024",
                    "excerpt": "Master the latest website performance optimization techniques that deliver real results. From Core Web Vitals to cutting-edge loading strategies.",
                    "author": "Tom Wilson",
                    "authorImage": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
                    "category": "Development",
                    "publishDate": "2024-01-04",
                    "readTime": 11,
                    "featured": false,
                    "featuredImage": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop"
                },
                {
                    "id": "business-automation-ai-tools",
                    "title": "5 AI Tools That Will Automate Your Business (And You Haven't Heard Of Them)",
                    "slug": "business-automation-ai-tools",
                    "excerpt": "Discover lesser-known but powerful AI tools that can automate key business processes and boost productivity significantly.",
                    "author": "Lisa Chen",
                    "authorImage": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
                    "category": "Business",
                    "publishDate": "2024-01-04",
                    "readTime": 6,
                    "featured": false,
                    "featuredImage": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop"
                },
                {
                    "id": "conversion-rate-optimization-psychology",
                    "title": "The Psychology of High-Converting Websites: What Makes Users Click 'Buy'",
                    "slug": "conversion-rate-optimization-psychology",
                    "excerpt": "Learn the psychology behind high-converting websites and how to apply behavioral science to boost your conversion rates.",
                    "author": "Emma Rodriguez",
                    "authorImage": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
                    "category": "Business",
                    "publishDate": "2024-01-03",
                    "readTime": 9,
                    "featured": false,
                    "featuredImage": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
                }
            ],
            "categories": [
                {
                    "name": "All Posts",
                    "slug": "all",
                    "description": "All blog posts"
                },
                {
                    "name": "Web Design",
                    "slug": "web-design",
                    "description": "Latest trends and techniques in web design"
                },
                {
                    "name": "AI & ML",
                    "slug": "ai-ml",
                    "description": "Artificial Intelligence and Machine Learning insights"
                },
                {
                    "name": "Development",
                    "slug": "development",
                    "description": "Web development tips and best practices"
                },
                {
                    "name": "SEO",
                    "slug": "seo",
                    "description": "Search engine optimization strategies"
                },
                {
                    "name": "Business",
                    "slug": "business",
                    "description": "Business optimization and growth strategies"
                },
                {
                    "name": "Healthcare Technology",
                    "slug": "healthcare-technology",
                    "description": "Healthcare technology and digital health solutions"
                }
            ]
        };

        this.posts = data.posts || [];
        this.categories = data.categories || [];

        console.log('✅ Posts loaded successfully:', this.posts.length, 'posts');

        // Log first few posts for debugging
        this.posts.slice(0, 3).forEach((post, i) => {
            console.log(`📄 Post ${i+1}: "${post.title}" (${post.category})`);
        });
    }

    // Render blog posts
    renderPosts() {
        console.log('📍 Starting renderPosts...');

        // Try multiple selectors to find container
        const container = document.getElementById('blog-posts-container') ||
                          document.querySelector('.grid.lg\\:grid-cols-3') ||
                          document.querySelector('[class*="grid"][class*="lg:grid-cols-3"]') ||
                          document.querySelector('.grid');

        if (!container) {
            console.error('❌ No posts container found!');
            console.log('📍 Available containers:', document.querySelectorAll('.grid, [class*="grid"]'));
            return;
        }

        console.log('✅ Container found:', container.className);

        const filteredPosts = this.getFilteredPosts();
        console.log('📍 Filtered posts:', filteredPosts.length);

        if (filteredPosts.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg">No blog posts found.</p>
                    <p class="text-gray-400 text-sm mt-2">Total posts in database: ${this.posts.length}</p>
                </div>
            `;
            return;
        }

        const postsHTML = filteredPosts.map(post => this.createPostCard(post)).join('');
        container.innerHTML = postsHTML;

        console.log('✅ Posts rendered:', filteredPosts.length, 'posts displayed');
    }

    // Get filtered posts
    getFilteredPosts() {
        console.log('🔍 Filtering posts - Current category:', this.currentCategory);
        console.log('📊 Total posts available:', this.posts.length);

        if (this.currentCategory === 'all') {
            const filtered = this.posts.filter(post => !post.featured);
            console.log('📊 Non-featured posts:', filtered.length);
            return filtered;
        }

        const filtered = this.posts.filter(post => {
            if (post.featured) return false;

            const categorySlug = post.category.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/&/g, '')
                .replace(/\s+/g, '');

            console.log(`📊 Post "${post.title}" category: "${post.category}" -> slug: "${categorySlug}", matches "${this.currentCategory}": ${categorySlug === this.currentCategory}`);
            return categorySlug === this.currentCategory;
        });

        console.log('📊 Filtered posts for category', this.currentCategory + ':', filtered.length);
        return filtered;
    }

    // Create individual post card HTML
    createPostCard(post) {
        const categoryColors = {
            'Web Design': 'from-blue-500 to-purple-600',
            'AI & ML': 'from-green-500 to-teal-600',
            'Development': 'from-orange-500 to-red-600',
            'SEO': 'from-purple-500 to-pink-600',
            'Business': 'from-indigo-500 to-blue-600',
            'Healthcare Technology': 'from-emerald-500 to-cyan-600'
        };

        const gradientClass = categoryColors[post.category] || 'from-gray-500 to-gray-700';

        return `
            <article class="blog-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="aspect-video bg-gradient-to-br ${gradientClass} relative">
                    <div class="absolute inset-0 bg-black/20"></div>
                    <div class="absolute top-4 left-4">
                        <span class="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">${post.category}</span>
                    </div>
                </div>
                <div class="p-6">
                    <div class="text-sm text-gray-500 mb-3">${this.formatDate(post.publishDate)} • ${post.readTime} min read</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3 leading-tight">
                        <a href="./blog/posts/${post.slug}.html" class="hover:text-blue-600 transition-colors">
                            ${post.title}
                        </a>
                    </h3>
                    <p class="text-gray-600 mb-4 leading-relaxed">
                        ${post.excerpt}
                    </p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <img src="${post.authorImage}" alt="${post.author}" class="w-8 h-8 rounded-full">
                            <span class="text-sm font-medium text-gray-700">${post.author}</span>
                        </div>
                        <a href="./blog/posts/${post.slug}.html" class="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                            Read More →
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    // Render categories
    renderCategories() {
        const categoryContainer = document.querySelector('div[class*="flex"][class*="flex-wrap"][class*="justify-center"][class*="gap-4"]');

        if (!categoryContainer) {
            console.log('⚠️  Category container not found');
            return;
        }

        const categoryButtons = this.categories.map(category => {
            const isActive = this.currentCategory === category.slug;
            const activeClass = isActive ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600';

            return `
                <button class="category-tag px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-blue-200 ${activeClass}"
                        data-category="${category.slug}">
                    ${category.name}
                </button>
            `;
        }).join('');

        categoryContainer.innerHTML = categoryButtons;
        console.log('✅ Categories rendered:', this.categories.length);
    }

    // Setup event listeners
    setupEventListeners() {
        // Category filtering
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-tag')) {
                e.preventDefault();
                const category = e.target.dataset.category || 'all';
                this.filterByCategory(category);
            }
        });

        console.log('✅ Event listeners attached');
    }

    // Filter by category
    filterByCategory(category) {
        this.currentCategory = category;
        console.log('📍 Filtering by category:', category);
        this.renderPosts();
        this.renderCategories();
    }


    // Format date
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Fallback posts data
    getFallbackPosts() {
        return [
            {
                id: "blockchain-ehr-consent-management-sulonya-sevenhills",
                title: "Revolutionary Blockchain-Based EHR Consent Management",
                slug: "blockchain-ehr-consent-management-sulonya-sevenhills",
                excerpt: "Discover how Sulonya's cutting-edge blockchain-based consent management system transforms Electronic Health Records security.",
                author: "Sulonya Healthcare Solutions",
                authorImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=80&h=80&fit=crop&crop=face",
                category: "Healthcare Technology",
                publishDate: "2025-01-15",
                readTime: 12,
                featured: false
            },
            {
                id: "staff-augmentation-for-startups-scale-your-enginee",
                title: "Staff Augmentation for Startups: Scale Your Engineering Team",
                slug: "staff-augmentation-for-startups-scale-your-enginee",
                excerpt: "Discover how staff augmentation helps startups scale engineering teams efficiently without hiring headaches.",
                author: "Vinod Kumar",
                authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
                category: "Business",
                publishDate: "2025-09-15",
                readTime: 8,
                featured: false
            }
        ];
    }

    // Fallback categories
    getFallbackCategories() {
        return [
            { name: "All Posts", slug: "all", description: "All blog posts" },
            { name: "Healthcare Technology", slug: "healthcare-technology", description: "Healthcare tech insights" },
            { name: "Business", slug: "business", description: "Business optimization" },
            { name: "AI & ML", slug: "ai-ml", description: "AI insights" }
        ];
    }
}

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing SimpleBlogManager...');
    const blogManager = new SimpleBlogManager();
    blogManager.init();
});

// Export for external use
window.SimpleBlogManager = SimpleBlogManager;
