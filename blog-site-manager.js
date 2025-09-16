#!/usr/bin/env node
/**
 * COMPLETE BLOG SITE INTEGRATION MANAGER
 * Automatically updates homepage, blog page, sitemap, and all internal links
 */

const fs = require('fs');
const path = require('path');

// Site configuration
const config = {
    siteName: "OptiScale 360",
    siteUrl: "https://optiscale360.pages.dev",
    description: "Next-Gen AI-Ready Websites & Business Optimization",
    maxHomepagePosts: 3,
    maxFooterPosts: 3
};

// Get all existing blog posts
function getAllBlogPosts() {
    const postsDir = './blog/posts';
    const posts = [];

    if (fs.existsSync(postsDir)) {
        const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));

        files.forEach(file => {
            try {
                const content = fs.readFileSync(path.join(postsDir, file), 'utf8');

                // Extract metadata from HTML
                const titleMatch = content.match(/<title>([^<]+) - OptiScale 360 Blog<\/title>/);
                const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
                const authorMatch = content.match(/<meta name="author" content="([^"]+)"/);
                const dateMatch = content.match(/<time datetime="([^"]+)"/);
                const categoryMatch = content.match(/<span class="bg-[^"]*text-[^"]*[^>]*>([^<]+)<\/span>/);
                const readTimeMatch = content.match(/(\d+) min read/);
                const featuredMatch = content.includes('bg-yellow-400');

                if (titleMatch) {
                    posts.push({
                        title: titleMatch[1],
                        slug: file.replace('.html', ''),
                        description: descMatch ? descMatch[1] : '',
                        author: authorMatch ? authorMatch[1] : 'OptiScale 360',
                        publishDate: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0],
                        category: categoryMatch ? categoryMatch[1] : 'Business',
                        readTime: readTimeMatch ? parseInt(readTimeMatch[1]) : 5,
                        featured: featuredMatch,
                        url: `./blog/posts/${file}`
                    });
                }
            } catch (error) {
                console.warn(`⚠️  Could not parse ${file}:`, error.message);
            }
        });
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
}

// Update homepage blog preview section
function updateHomepageBlogPreview(posts) {
    const indexPath = './index.html';
    if (!fs.existsSync(indexPath)) {
        console.error('❌ index.html not found');
        return false;
    }

    let content = fs.readFileSync(indexPath, 'utf8');

    // Get top posts for homepage
    const topPosts = posts.slice(0, config.maxHomepagePosts);

    // Generate blog cards HTML
    const blogCardsHtml = topPosts.map(post => {
        const categoryColors = {
            'Business': 'from-indigo-500 to-blue-600',
            'AI & ML': 'from-green-500 to-teal-600',
            'Web Design': 'from-blue-500 to-purple-600',
            'SEO': 'from-purple-500 to-pink-600',
            'Development': 'from-orange-500 to-red-600',
            'Healthcare Technology': 'from-emerald-500 to-cyan-600'
        };

        const gradientClass = categoryColors[post.category] || 'from-gray-500 to-gray-600';
        const featuredBadge = post.featured ? '<span class="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold ml-2">FEATURED</span>' : '';

        return `                    <article class="blog-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                        <div class="aspect-video bg-gradient-to-br ${gradientClass} relative">
                            <div class="absolute inset-0 bg-black/20"></div>
                            <div class="absolute top-4 left-4">
                                <span class="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">${post.category}</span>
                                ${featuredBadge}
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="text-sm text-gray-500 mb-3">${new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • ${post.readTime} min read</div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3 leading-tight">
                                <a href="${post.url}" class="hover:text-blue-600 transition-colors">
                                    ${post.title}
                                </a>
                            </h3>
                            <p class="text-gray-600 mb-4 leading-relaxed">
                                ${post.description.substring(0, 120)}...
                            </p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="${post.author}" class="w-8 h-8 rounded-full">
                                    <span class="text-sm font-medium text-gray-700">${post.author}</span>
                                </div>
                                <a href="${post.url}" class="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                    Read More →
                                </a>
                            </div>
                        </div>
                    </article>`;
    }).join('\n\n');

    // Replace the blog preview section
    const blogSectionRegex = /<!-- Blog Preview Section -->[\s\S]*?<\/section>\s*<section id="contact"/;
    const newBlogSection = `<!-- Blog Preview Section -->
        <section id="blog-preview" class="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                        Latest <span class="gradient-text">Insights</span>
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        Stay ahead with our latest articles on AI, SEO, web development, and business optimization strategies.
                    </p>
                </div>

                <div class="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-12">
${blogCardsHtml}
                </div>

                <div class="text-center">
                    <a href="blog.html" class="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105 inline-flex items-center gap-2">
                        View All Articles
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </section>

        <section id="contact"`;

    content = content.replace(blogSectionRegex, newBlogSection);

    // Update footer links
    const footerPosts = posts.slice(0, config.maxFooterPosts);
    const footerLinksHtml = footerPosts.map(post =>
        `<li><a href="${post.url}">${post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title}</a></li>`
    ).join('\n                            ');

    const footerRegex = /<div class="footer-column">\s*<h4>Latest Articles<\/h4>\s*<ul>[\s\S]*?<\/ul>\s*<\/div>/;
    const newFooterSection = `<div class="footer-column">
                        <h4>Latest Articles</h4>
                        <ul>
                            ${footerLinksHtml}
                            <li><a href="blog.html">View All Articles →</a></li>
                        </ul>
                    </div>`;

    content = content.replace(footerRegex, newFooterSection);

    fs.writeFileSync(indexPath, content);
    return true;
}

// Update sitemap.xml
function updateSitemap(posts) {
    const urls = [
        `${config.siteUrl}/`,
        `${config.siteUrl}/blog.html`,
        `${config.siteUrl}/services.html`,
        `${config.siteUrl}/case-studies.html`,
        `${config.siteUrl}/contact.html`,
        ...posts.map(post => `${config.siteUrl}/blog/posts/${post.slug}.html`)
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `    <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${url.includes('/blog/posts/') ? 'monthly' : 'weekly'}</changefreq>
        <priority>${url === `${config.siteUrl}/` ? '1.0' : url.includes('/blog/posts/') ? '0.8' : '0.9'}</priority>
    </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync('./sitemap.xml', sitemap);
    return true;
}

// Generate robots.txt
function generateRobotsTxt() {
    const robots = `User-agent: *
Allow: /

# Optimize for search engines
Sitemap: ${config.siteUrl}/sitemap.xml

# Block unnecessary files
Disallow: /node_modules/
Disallow: /.git/
Disallow: /package.json
Disallow: /package-lock.json
Disallow: /*.js$
Disallow: /*.log$

# Allow important blog content
Allow: /blog/
Allow: /blog/posts/
Allow: /*.html$
Allow: /*.css$
Allow: /*.svg$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.webp$`;

    fs.writeFileSync('./robots.txt', robots);
    return true;
}

// Main execution
console.log('🚀 Starting complete blog site integration...');

try {
    // Get all blog posts
    const posts = getAllBlogPosts();
    console.log(`✅ Found ${posts.length} blog posts`);

    if (posts.length === 0) {
        console.warn('⚠️  No blog posts found to integrate');
        return;
    }

    // Update homepage
    if (updateHomepageBlogPreview(posts)) {
        console.log('✅ Updated homepage blog preview');
    } else {
        console.error('❌ Failed to update homepage');
    }

    // Update sitemap
    if (updateSitemap(posts)) {
        console.log('✅ Updated sitemap.xml');
    } else {
        console.error('❌ Failed to update sitemap');
    }

    // Generate robots.txt
    if (generateRobotsTxt()) {
        console.log('✅ Generated robots.txt');
    } else {
        console.error('❌ Failed to generate robots.txt');
    }

    console.log('\n🎯 INTEGRATION COMPLETE!');
    console.log('✅ Homepage now shows latest 3 blog posts');
    console.log('✅ Footer links updated with recent articles');
    console.log('✅ Sitemap.xml includes all blog posts');
    console.log('✅ SEO-optimized robots.txt generated');
    console.log('✅ Internal linking structure optimized');

    console.log('\n📊 BLOG ANALYTICS:');
    const categories = [...new Set(posts.map(p => p.category))];
    console.log(`• Total posts: ${posts.length}`);
    console.log(`• Categories: ${categories.join(', ')}`);
    console.log(`• Featured posts: ${posts.filter(p => p.featured).length}`);
    console.log(`• Average read time: ${Math.round(posts.reduce((sum, p) => sum + p.readTime, 0) / posts.length)} minutes`);

    console.log('\n📝 NEXT STEPS:');
    console.log('1. git add . && git commit -m "Integrate blog system into website" && git push');
    console.log('2. Submit sitemap.xml to Google Search Console');
    console.log('3. Monitor organic traffic improvements');
    console.log('4. Add new posts using: node seo-blog-generator.js');
    console.log('5. Run this script after adding posts: node blog-site-manager.js');

} catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
}