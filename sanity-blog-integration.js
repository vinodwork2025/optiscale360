/**
 * Sanity Blog Integration
 * Fetches posts from Sanity and adds them to the blog
 */

class SanityBlogIntegration {
    constructor() {
        this.sanityClient = null;
        this.initClient();
    }

    initClient() {
        // Initialize Sanity client for browser
        if (typeof window !== 'undefined' && window.sanityClient) {
            this.sanityClient = window.sanityClient;
        }
    }

    async fetchSanityPosts() {
        if (!this.sanityClient) {
            console.log('⚠️ Sanity client not available in browser');
            return [];
        }

        try {
            console.log('🔍 Fetching posts from Sanity...');

            const query = `*[_type == "post"]{
                title,
                slug,
                content,
                publishedAt,
                _id,
                _createdAt
            } | order(publishedAt desc)`;

            const posts = await this.sanityClient.fetch(query);
            console.log('✅ Fetched', posts.length, 'posts from Sanity');

            return posts;
        } catch (error) {
            console.error('❌ Error fetching Sanity posts:', error);
            return [];
        }
    }

    formatSanityPost(sanityPost) {
        const slug = sanityPost.slug?.current || sanityPost.title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 60);

        return {
            id: sanityPost._id,
            title: sanityPost.title,
            slug: slug,
            excerpt: sanityPost.content ? sanityPost.content.substring(0, 150) + '...' : 'No excerpt available',
            author: 'OptiScale360 Team',
            authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
            category: 'Business Strategy',
            date: sanityPost.publishedAt || sanityPost._createdAt,
            readTime: Math.max(1, Math.ceil((sanityPost.content || '').length / 1000)) + ' min read',
            image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop',
            url: `./blog/posts/sanity-${slug}.html`,
            tags: ['Business', 'Strategy', 'Growth'],
            source: 'sanity'
        };
    }

    async addSanityPostsToManager() {
        if (typeof window === 'undefined' || !window.blogManager) {
            console.log('⚠️ Blog manager not available');
            return;
        }

        try {
            const sanityPosts = await this.fetchSanityPosts();

            if (sanityPosts.length > 0) {
                console.log('📝 Adding Sanity posts to blog manager...');

                const formattedPosts = sanityPosts.map(post => this.formatSanityPost(post));

                // Add to beginning of posts array
                window.blogManager.posts = [...formattedPosts, ...window.blogManager.posts];

                // Re-render the blog
                window.blogManager.renderPosts();

                console.log('✅ Added', formattedPosts.length, 'Sanity posts to blog');
            }
        } catch (error) {
            console.error('❌ Error adding Sanity posts:', error);
        }
    }
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.sanityBlogIntegration = new SanityBlogIntegration();
}