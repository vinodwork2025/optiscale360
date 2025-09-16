// Simple script to add a new blog post
// Usage: node add-blog-post.js

const fs = require('fs');

// Configure your new post here
const newPost = {
    title: "10 AI Tools Every Small Business Should Use in 2025",
    slug: "ai-tools-small-business-2025", // URL-friendly version
    excerpt: "Discover the most powerful AI tools that can transform your small business operations, from customer service automation to content creation and data analysis.",
    author: "Sarah Tech",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b567?w=80&h=80&fit=crop&crop=face",
    category: "AI & ML", // Business, AI & ML, Web Design, SEO, Development, Healthcare Technology
    publishDate: "2025-01-16", // Today's date
    readTime: 7, // Estimated reading time in minutes
    content: `
        <h2>Why Small Businesses Need AI in 2025</h2>
        <p>The AI revolution isn't just for tech giants anymore. Small businesses that adopt AI tools today will have a massive competitive advantage tomorrow. Here are the 10 essential AI tools every small business should consider.</p>

        <h2>1. ChatGPT for Content Creation</h2>
        <p>Generate blog posts, social media content, and marketing copy in minutes. Perfect for businesses without dedicated content teams.</p>

        <h2>2. Canva AI for Design</h2>
        <p>Create professional graphics, logos, and marketing materials without hiring a designer. The AI suggestions make even beginners look like pros.</p>

        <h2>3. Zapier for Automation</h2>
        <p>Connect your apps and automate repetitive tasks. Save hours every week by letting AI handle routine workflows.</p>

        <h2>4. Grammarly for Professional Writing</h2>
        <p>Ensure all your business communications are polished and professional. Essential for emails, proposals, and documentation.</p>

        <h2>5. HubSpot AI for Customer Service</h2>
        <p>Automate customer support with intelligent chatbots that can handle common questions 24/7.</p>

        <h2>Key Benefits for Small Businesses</h2>
        <ul>
            <li><strong>Cost Savings:</strong> Reduce the need for specialized staff</li>
            <li><strong>Time Efficiency:</strong> Automate repetitive tasks</li>
            <li><strong>Professional Quality:</strong> Compete with larger companies</li>
            <li><strong>24/7 Operations:</strong> AI never sleeps</li>
        </ul>

        <h2>Getting Started</h2>
        <p>Start with one tool that addresses your biggest pain point. Most AI tools offer free trials, so you can test them without risk. The key is to start small and gradually expand your AI toolkit as you see results.</p>

        <blockquote>
            <p>"The businesses that embrace AI today will be the market leaders of tomorrow. Don't wait – start experimenting now."</p>
        </blockquote>
    `
};

// Category color mapping
const categoryColors = {
    'Business': 'from-indigo-500 to-blue-600',
    'AI & ML': 'from-green-500 to-teal-600',
    'Web Design': 'from-blue-500 to-purple-600',
    'SEO': 'from-purple-500 to-pink-600',
    'Development': 'from-orange-500 to-red-600',
    'Healthcare Technology': 'from-emerald-500 to-cyan-600'
};

// HTML template for individual blog post
const postTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${newPost.title} - OptiScale 360 Blog</title>
    <meta name="description" content="${newPost.excerpt}">
    <link rel="stylesheet" href="../../styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
    <!-- Header -->
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="../../" class="logo-link">
                        <img src="../../Optiscale360_logo.svg" alt="OptiScale 360" class="logo-image">
                    </a>
                </div>
                <ul class="nav-menu nav-tabs">
                    <li class="nav-tab"><a href="../../" class="nav-link">Home</a></li>
                    <li class="nav-tab"><a href="../../services.html" class="nav-link">Services</a></li>
                    <li class="nav-tab"><a href="../../case-studies.html" class="nav-link">Case Studies</a></li>
                    <li class="nav-tab"><a href="../../blog.html" class="nav-link active">Blog</a></li>
                    <li class="nav-tab"><a href="../../contact.html" class="nav-link">Contact</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <main class="pt-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <a href="../../blog.html" class="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-8">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Blog
            </a>
        </div>

        <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <header class="mb-12">
                <div class="mb-6">
                    <span class="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                        ${newPost.category}
                    </span>
                </div>

                <h1 class="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                    ${newPost.title}
                </h1>

                <div class="flex items-center gap-6 text-gray-600 mb-8">
                    <div class="flex items-center gap-3">
                        <img src="${newPost.authorImage}" alt="${newPost.author}" class="w-12 h-12 rounded-full">
                        <div>
                            <div class="font-semibold text-gray-900">${newPost.author}</div>
                        </div>
                    </div>
                    <div class="text-sm">
                        <div>${new Date(newPost.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <div>${newPost.readTime} min read</div>
                    </div>
                </div>
            </header>

            <div class="blog-content prose prose-lg max-w-none">
                ${newPost.content}
            </div>
        </article>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3>OptiScale 360</h3>
                    <p>Next-Gen Website Design & Development</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 OptiScale 360. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../../script.js"></script>
</body>
</html>`;

// Blog card template for blog.html
const blogCardTemplate = `
                    <!-- Blog Post: ${newPost.title} -->
                    <article class="blog-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                        <div class="aspect-video bg-gradient-to-br ${categoryColors[newPost.category]} relative">
                            <div class="absolute inset-0 bg-black/20"></div>
                            <div class="absolute top-4 left-4">
                                <span class="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">${newPost.category}</span>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="text-sm text-gray-500 mb-3">${new Date(newPost.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • ${newPost.readTime} min read</div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3 leading-tight">
                                <a href="./blog/posts/${newPost.slug}.html" class="hover:text-blue-600 transition-colors">
                                    ${newPost.title}
                                </a>
                            </h3>
                            <p class="text-gray-600 mb-4 leading-relaxed">
                                ${newPost.excerpt}
                            </p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <img src="${newPost.authorImage}" alt="${newPost.author}" class="w-8 h-8 rounded-full">
                                    <span class="text-sm font-medium text-gray-700">${newPost.author}</span>
                                </div>
                                <a href="./blog/posts/${newPost.slug}.html" class="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                    Read More →
                                </a>
                            </div>
                        </div>
                    </article>`;

console.log('🚀 Creating new blog post...');

try {
    // 1. Create the individual blog post HTML file
    const postPath = `./blog/posts/${newPost.slug}.html`;
    fs.writeFileSync(postPath, postTemplate);
    console.log(`✅ Created blog post: ${postPath}`);

    // 2. Show the blog card template to add to blog.html
    console.log('\n📋 Copy this blog card and add it to blog.html:');
    console.log('=' .repeat(50));
    console.log(blogCardTemplate);
    console.log('=' .repeat(50));

    console.log('\n📝 Next steps:');
    console.log('1. Edit the post content in:', postPath);
    console.log('2. Copy the blog card above and add it to blog.html');
    console.log('3. Push to GitHub: git add . && git commit -m "Add new blog post" && git push');

} catch (error) {
    console.error('❌ Error:', error.message);
}