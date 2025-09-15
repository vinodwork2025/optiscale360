/**
 * Blog Management System for OptiScale 360
 * Handles blog post loading, filtering, and display
 */

class BlogManager {
    constructor() {
        this.posts = [];
        this.categories = [];
        this.currentCategory = 'all';
        this.postsPerPage = 9;
        this.currentPage = 1;
    }

    // Initialize the blog system
    async init() {
        try {
            console.log('BlogManager: Starting initialization...');
            await this.loadPosts();
            console.log('BlogManager: Posts loaded:', this.posts.length, 'posts');

            this.setupEventListeners();
            this.renderFeaturedPost();
            console.log('BlogManager: Featured post rendered');

            this.renderPosts();
            console.log('BlogManager: Posts rendered');

            this.renderCategories();
            console.log('BlogManager: Categories rendered');

            console.log('BlogManager: Initialization complete!');
        } catch (error) {
            console.error('Failed to initialize blog:', error);
        }
    }

    // Load posts from JSON file
    async loadPosts() {
        try {
            const response = await fetch('./blog/posts.json');
            const data = await response.json();
            this.posts = data.posts;
            this.categories = data.categories;
        } catch (error) {
            console.error('Failed to load posts:', error);
            // Fallback data
            this.posts = this.getFallbackPosts();
            this.categories = this.getFallbackCategories();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Category filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-tag')) {
                e.preventDefault();
                const category = e.target.dataset.category || 'all';
                this.filterByCategory(category);
            }
        });

        // Search functionality
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchPosts(e.target.value);
            });
        }

        // Read more buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('read-more-btn')) {
                e.preventDefault();
                const postId = e.target.dataset.postId;
                this.navigateToPost(postId);
            }
        });
    }

    // Render featured post
    renderFeaturedPost() {
        const featuredPost = this.posts.find(post => post.featured);
        if (!featuredPost) return;

        const featuredSection = document.querySelector('.featured-post');
        if (featuredSection) {
            featuredSection.innerHTML = `
                <div class="featured-content p-12 text-white" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.9)), url('${featuredPost.featuredImage}') center/cover;">
                    <div class="max-w-4xl">
                        <div class="flex items-center gap-4 mb-6">
                            <span class="category-tag !bg-white/20 !text-white">${featuredPost.category}</span>
                            <span class="text-white/80">•</span>
                            <span class="text-white/80">${featuredPost.readTime} min read</span>
                            <span class="text-white/80">•</span>
                            <span class="text-white/80">${this.formatDate(featuredPost.publishDate)}</span>
                        </div>

                        <h3 class="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                            ${featuredPost.title}
                        </h3>

                        <p class="text-xl text-white/90 mb-8 leading-relaxed">
                            ${featuredPost.excerpt}
                        </p>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <img src="${featuredPost.authorImage}" alt="${featuredPost.author}" class="w-12 h-12 rounded-full">
                                <div>
                                    <div class="font-semibold">${featuredPost.author}</div>
                                    <div class="text-white/80 text-sm">${featuredPost.authorTitle}</div>
                                </div>
                            </div>

                            <button class="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors read-more-btn" data-post-id="${featuredPost.id}">
                                Read Full Article →
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Render blog posts
    renderPosts() {
        const postsContainer = document.querySelector('div[class*="grid"][class*="lg:grid-cols-3"][class*="md:grid-cols-2"][class*="gap-8"]');
        if (!postsContainer) {
            console.error('Posts container not found. Looking for grid with lg:grid-cols-3 md:grid-cols-2 gap-8');
            return;
        }

        const filteredPosts = this.getFilteredPosts();
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        postsContainer.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');
    }

    // Create individual post card HTML
    createPostCard(post) {
        const categoryColors = {
            'Web Design': 'from-blue-500 to-purple-600',
            'AI & ML': 'from-green-500 to-teal-600',
            'Development': 'from-orange-500 to-red-600',
            'SEO': 'from-purple-500 to-pink-600',
            'Business': 'from-indigo-500 to-blue-600'
        };

        const gradientClass = categoryColors[post.category] || 'from-gray-500 to-gray-700';

        return `
            <article class="blog-card bg-white rounded-2xl overflow-hidden shadow-lg">
                <div class="aspect-video bg-gradient-to-br ${gradientClass} relative">
                    <div class="absolute inset-0 bg-black/20"></div>
                    <div class="absolute top-4 left-4">
                        <span class="category-tag !bg-white !text-gray-800">${post.category}</span>
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

    // Render category filters
    renderCategories() {
        const categoryContainer = document.querySelector('div[class*="flex"][class*="flex-wrap"][class*="justify-center"][class*="gap-4"]');
        if (!categoryContainer) {
            console.error('Category container not found. Looking for flex flex-wrap justify-center gap-4');
            return;
        }

        const categoryButtons = this.categories.map(category => {
            const isActive = this.currentCategory === category.slug;
            const activeClass = isActive ? 'active !bg-blue-600 !text-white' : '';

            return `
                <button class="category-tag ${activeClass}" data-category="${category.slug}">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    ${category.name}
                </button>
            `;
        }).join('');

        categoryContainer.innerHTML = categoryButtons;
    }

    // Filter posts by category
    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        this.renderPosts();
        this.renderCategories();
        this.updateURL();
    }

    // Search posts
    searchPosts(query) {
        if (!query.trim()) {
            this.currentCategory = 'all';
            this.renderPosts();
            return;
        }

        const searchResults = this.posts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        this.renderSearchResults(searchResults);
    }

    // Render search results
    renderSearchResults(searchResults) {
        const postsContainer = document.querySelector('div[class*="grid"][class*="lg:grid-cols-3"][class*="md:grid-cols-2"][class*="gap-8"]');
        if (!postsContainer) {
            console.error('Posts container not found for search results');
            return;
        }

        if (searchResults.length === 0) {
            postsContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg">No articles found matching your search.</p>
                </div>
            `;
            return;
        }

        postsContainer.innerHTML = searchResults.map(post => this.createPostCard(post)).join('');
    }

    // Get filtered posts based on current category
    getFilteredPosts() {
        if (this.currentCategory === 'all') {
            return this.posts.filter(post => !post.featured);
        }
        return this.posts.filter(post => {
            if (post.featured) return false;

            // Convert category to slug format for comparison
            const categorySlug = post.category.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/&/g, '')
                .replace(/\s+/g, '');

            return categorySlug === this.currentCategory;
        });
    }

    // Navigate to individual post
    navigateToPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            window.location.href = `./blog/posts/${post.slug}.html`;
        }
    }

    // Format date for display
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Update URL with current filters
    updateURL() {
        const url = new URL(window.location);
        if (this.currentCategory !== 'all') {
            url.searchParams.set('category', this.currentCategory);
        } else {
            url.searchParams.delete('category');
        }
        window.history.pushState({}, '', url);
    }

    // Get URL parameters
    getURLParams() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        if (category) {
            this.currentCategory = category;
        }
    }

    // Fallback data if JSON fails to load
    getFallbackPosts() {
        return [
            {
                id: "ai-web-design-trends-2024",
                title: "The Future of AI-Powered Web Design: 10 Game-Changing Trends for 2024",
                slug: "ai-web-design-trends-2024",
                excerpt: "Discover how artificial intelligence is revolutionizing web design, from automated layouts to personalized user experiences.",
                author: "Alex Chen",
                authorTitle: "AI Design Specialist",
                authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
                category: "AI & ML",
                tags: ["AI", "Web Design", "Machine Learning"],
                publishDate: "2024-01-15",
                readTime: 8,
                featured: true,
                featuredImage: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1200&h=630&fit=crop"
            }
        ];
    }

    // Fallback categories
    getFallbackCategories() {
        return [
            { name: "All Posts", slug: "all", description: "All blog posts" },
            { name: "Web Design", slug: "web-design", description: "Latest trends in web design" },
            { name: "AI & ML", slug: "ai-ml", description: "Artificial Intelligence insights" },
            { name: "Development", slug: "development", description: "Web development tips" },
            { name: "SEO", slug: "seo", description: "Search engine optimization" },
            { name: "Business", slug: "business", description: "Business optimization strategies" }
        ];
    }
}

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const blogManager = new BlogManager();
    blogManager.init();
});

// Export for potential external use
window.BlogManager = BlogManager;