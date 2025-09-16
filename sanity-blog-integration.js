/**
 * Sanity Blog Integration - Simple and Direct
 * Fetches posts from Sanity and adds them to the blog
 */

// Simple function to add Sanity posts directly to the DOM
async function addSanityPostsToBlog() {
    console.log('🚀 Starting Sanity blog integration...');

    try {
        // Check if Sanity client is available
        if (!window.sanityClient) {
            console.error('❌ Sanity client not available');
            return;
        }

        console.log('🔍 Fetching posts from Sanity...');

        // Fetch posts from Sanity
        const query = '*[_type == "post"]{title, slug, content, publishedAt, _id} | order(publishedAt desc)';
        const sanityPosts = await window.sanityClient.fetch(query);

        console.log('✅ Fetched', sanityPosts.length, 'posts from Sanity');

        if (sanityPosts.length === 0) {
            console.log('⚠️ No posts found in Sanity');
            return;
        }

        // Get the blog posts container
        const blogContainer = document.getElementById('blog-posts-container');
        if (!blogContainer) {
            console.error('❌ Blog posts container not found');
            return;
        }

        // Create HTML for each Sanity post
        const sanityPostsHTML = sanityPosts.map(post => {
            const slug = post.slug?.current || post.title.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 60);

            const excerpt = post.content ? post.content.substring(0, 150) + '...' : 'No excerpt available';
            const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently published';

            return `
                <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div class="relative">
                        <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
                             alt="${post.title}"
                             class="w-full h-48 object-cover">
                        <div class="absolute top-4 left-4">
                            <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                ✨ From Sanity CMS
                            </span>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center space-x-2 mb-3">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                                 alt="Author"
                                 class="w-8 h-8 rounded-full">
                            <span class="text-gray-600 text-sm">OptiScale360 Team</span>
                            <span class="text-gray-400">•</span>
                            <span class="text-gray-600 text-sm">${date}</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                            <a href="./blog/posts/sanity-${slug}.html" class="hover:text-blue-600 transition-colors">
                                ${post.title}
                            </a>
                        </h3>
                        <p class="text-gray-600 mb-4 line-clamp-3">${excerpt}</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Business Strategy</span>
                                <span class="text-gray-500 text-sm">5 min read</span>
                            </div>
                            <a href="./blog/posts/sanity-${slug}.html"
                               class="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                Read More →
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        // Add Sanity posts to the beginning of the blog container
        blogContainer.innerHTML = sanityPostsHTML + blogContainer.innerHTML;

        console.log('✅ Successfully added', sanityPosts.length, 'Sanity posts to blog');

    } catch (error) {
        console.error('❌ Error in Sanity blog integration:', error);
    }
}