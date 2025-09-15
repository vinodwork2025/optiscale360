
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

    // Load posts from JSON file
    async loadPosts() {
        try {
            console.log('📍 Fetching posts.json...');
            const response = await fetch('./blog/posts.json');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            this.posts = data.posts || [];
            this.categories = data.categories || [];

            console.log('✅ Posts loaded successfully:', this.posts.length, 'posts');

            // Log first few posts for debugging
            this.posts.slice(0, 3).forEach((post, i) => {
                console.log(`📄 Post ${i+1}: "${post.title}" (${post.category})`);
            });

        } catch (error) {
            console.error('❌ Failed to load posts:', error);
            // Use hardcoded fallback to ensure something displays
            this.posts = this.getFallbackPosts();
            this.categories = this.getFallbackCategories();
            console.log('⚠️  Using fallback posts:', this.posts.length, 'posts');
        }
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
        if (this.currentCategory === 'all') {
            return this.posts.filter(post => !post.featured);
        }

        return this.posts.filter(post => {
            if (post.featured) return false;

            const categorySlug = post.category.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/&/g, '')
                .replace(/\s+/g, '');

            return categorySlug === this.currentCategory;
        });
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
                    <h3 class="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-blue-600 transition-colors">
                        ${post.title}
                    </h3>
                    <p class="text-gray-600 mb-4 leading-relaxed">
                        ${post.excerpt}
                    </p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <img src="${post.authorImage}" alt="${post.author}" class="w-8 h-8 rounded-full">
                            <span class="text-sm font-medium text-gray-700">${post.author}</span>
                        </div>
                        <button class="text-blue-600 font-semibold hover:text-blue-700 transition-colors read-more-btn" data-post-id="${post.id}">
                            Read More →
                        </button>
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

            if (e.target.classList.contains('read-more-btn')) {
                e.preventDefault();
                const postId = e.target.dataset.postId;
                this.navigateToPost(postId);
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

    // Navigate to post
    navigateToPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            window.location.href = `./blog/posts/${post.slug}.html`;
        }
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
