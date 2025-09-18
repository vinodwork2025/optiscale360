#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const { markedHighlight } = require('marked-highlight');
const hljs = require('highlight.js');

// Configure marked with syntax highlighting
marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
}));

const BLOG_DIR = path.join(__dirname, 'blog');
const POSTS_DIR = path.join(BLOG_DIR, 'posts');
const SITE_URL = 'https://optiscale360.pages.dev';
const SITE_NAME = 'OptiScale 360';
const AUTHOR = {
    name: 'OptiScale 360 Team',
    email: 'info@optiscale360.com',
    url: 'https://optiscale360.pages.dev/about'
};

// Ensure directories exist
if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
}
if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
}

// Read all markdown files from posts directory
function getAllPosts() {
    const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));

    return files.map(file => {
        const filePath = path.join(POSTS_DIR, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        const slug = file.replace('.md', '');
        const readingTime = estimateReadingTime(content);

        return {
            slug,
            frontmatter: data,
            content,
            readingTime,
            filePath
        };
    }).filter(post => !post.frontmatter.draft) // Filter out draft posts
      .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
}

// Estimate reading time
function estimateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}

// Generate JSON-LD structured data
function generateJSONLD(post, type = 'BlogPosting') {
    const baseSchema = {
        "@context": "https://schema.org",
        "@type": type,
        "headline": post.frontmatter.title,
        "description": post.frontmatter.description,
        "image": post.frontmatter.image || `${SITE_URL}/Optiscale360_logo.svg`,
        "author": {
            "@type": "Person",
            "name": post.frontmatter.author || AUTHOR.name,
            "url": AUTHOR.url
        },
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/Optiscale360_logo.svg`
            }
        },
        "datePublished": post.frontmatter.date,
        "dateModified": post.frontmatter.updated || post.frontmatter.date,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${post.slug}/`
        }
    };

    // Add specific schemas based on post type
    const schemas = [baseSchema];

    if (post.frontmatter.type === 'how-to' || post.frontmatter.schema === 'HowTo') {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": post.frontmatter.title,
            "description": post.frontmatter.description,
            "image": post.frontmatter.image || `${SITE_URL}/Optiscale360_logo.svg`,
            "totalTime": post.frontmatter.totalTime || "PT30M",
            "estimatedCost": {
                "@type": "MonetaryAmount",
                "currency": "USD",
                "value": post.frontmatter.cost || "0"
            },
            "step": post.frontmatter.steps || []
        });
    }

    if (post.frontmatter.faqs && post.frontmatter.faqs.length > 0) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": post.frontmatter.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        });
    }

    if (post.frontmatter.category === 'service' || post.frontmatter.schema === 'Service') {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": post.frontmatter.serviceName || post.frontmatter.title,
            "description": post.frontmatter.description,
            "provider": {
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL
            },
            "areaServed": "Worldwide",
            "serviceType": post.frontmatter.serviceType || "SEO Consulting"
        });
    }

    // Organization schema
    schemas.push({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL,
        "logo": `${SITE_URL}/Optiscale360_logo.svg`,
        "description": "AI-powered SEO agency delivering 300% more organic traffic through advanced LLM-driven optimization strategies.",
        "sameAs": [
            "https://twitter.com/optiscale360",
            "https://linkedin.com/company/optiscale360"
        ]
    });

    // BreadcrumbList schema
    schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": SITE_URL
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${SITE_URL}/blog/`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.frontmatter.title,
                "item": `${SITE_URL}/blog/${post.slug}/`
            }
        ]
    });

    return schemas;
}

// Generate HTML template
function generatePostHTML(post) {
    const schemas = generateJSONLD(post);
    const htmlContent = marked(post.content);
    const publishDate = new Date(post.frontmatter.date).toLocaleDateString();

    // Generate table of contents
    const toc = generateTableOfContents(post.content);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.frontmatter.title} | ${SITE_NAME}</title>
    <meta name="description" content="${post.frontmatter.description}">
    <meta name="keywords" content="${(post.frontmatter.tags || []).join(', ')}">
    <meta name="author" content="${post.frontmatter.author || AUTHOR.name}">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${SITE_URL}/blog/${post.slug}/">
    <meta property="og:title" content="${post.frontmatter.title}">
    <meta property="og:description" content="${post.frontmatter.description}">
    <meta property="og:image" content="${post.frontmatter.image || `${SITE_URL}/Optiscale360_logo.svg`}">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="article:published_time" content="${post.frontmatter.date}">
    <meta property="article:modified_time" content="${post.frontmatter.updated || post.frontmatter.date}">
    <meta property="article:author" content="${post.frontmatter.author || AUTHOR.name}">
    <meta property="article:section" content="${post.frontmatter.category || 'SEO'}">
    ${(post.frontmatter.tags || []).map(tag => `<meta property="article:tag" content="${tag}">`).join('\n    ')}

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${SITE_URL}/blog/${post.slug}/">
    <meta property="twitter:title" content="${post.frontmatter.title}">
    <meta property="twitter:description" content="${post.frontmatter.description}">
    <meta property="twitter:image" content="${post.frontmatter.image || `${SITE_URL}/Optiscale360_logo.svg`}">

    <!-- Canonical URL -->
    <link rel="canonical" href="${SITE_URL}/blog/${post.slug}/">

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="${SITE_NAME} Blog RSS Feed" href="${SITE_URL}/blog/feed.xml">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="../../styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- JSON-LD Structured Data -->
    ${schemas.map(schema => `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`).join('\n    ')}
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="/" class="logo-link">
                        <img src="../../Optiscale360_logo.svg" alt="OptiScale 360" class="logo-image">
                    </a>
                </div>
                <ul class="nav-menu nav-tabs">
                    <li class="nav-tab"><a href="/" class="nav-link">Home</a></li>
                    <li class="nav-tab"><a href="/services.html" class="nav-link">Services</a></li>
                    <li class="nav-tab"><a href="/case-studies.html" class="nav-link">Case Studies</a></li>
                    <li class="nav-tab"><a href="/resources.html" class="nav-link">Resources</a></li>
                    <li class="nav-tab"><a href="/blog/" class="nav-link">Blog</a></li>
                    <li class="nav-tab"><a href="/contact.html" class="nav-link">Contact</a></li>
                </ul>
                <div class="nav-cta">
                    <a href="/Free-AI-Ready-Website.html" class="cta-btn">Build Your Next-Gen Website</a>
                </div>
                <div class="nav-toggle">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
        </nav>
    </header>

    <main class="blog-post-main">
        <article class="blog-post-container">
            <header class="blog-post-header">
                <div class="blog-breadcrumbs">
                    <a href="/">Home</a>
                    <span>›</span>
                    <a href="/blog/">Blog</a>
                    <span>›</span>
                    <span>${post.frontmatter.title}</span>
                </div>

                <div class="blog-post-meta">
                    <span class="post-category">${post.frontmatter.category || 'SEO'}</span>
                    <time class="post-date" datetime="${post.frontmatter.date}">${publishDate}</time>
                    <span class="post-reading-time">${post.readingTime}</span>
                </div>

                <h1 class="blog-post-title">${post.frontmatter.title}</h1>
                <p class="blog-post-excerpt">${post.frontmatter.description}</p>

                <div class="blog-post-author">
                    <span>By ${post.frontmatter.author || AUTHOR.name}</span>
                </div>

                ${post.frontmatter.tags ? `
                <div class="blog-post-tags">
                    ${post.frontmatter.tags.map(tag => `<span class="tag" itemProp="keywords">${tag}</span>`).join('')}
                </div>
                ` : ''}
            </header>

            ${toc ? `
            <div class="table-of-contents">
                <h3>Table of Contents</h3>
                ${toc}
            </div>
            ` : ''}

            <div class="blog-content">
                ${htmlContent}
            </div>

            <footer class="blog-post-footer">
                <div class="blog-post-share">
                    <h4>Share this post</h4>
                    <div class="share-buttons">
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE_URL + '/blog/' + post.slug + '/')}&text=${encodeURIComponent(post.frontmatter.title)}" target="_blank" rel="noopener">Twitter</a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL + '/blog/' + post.slug + '/')}" target="_blank" rel="noopener">LinkedIn</a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL + '/blog/' + post.slug + '/')}" target="_blank" rel="noopener">Facebook</a>
                    </div>
                </div>
            </footer>
        </article>
    </main>

    <script src="../../script.js"></script>
</body>
</html>`;
}

// Generate table of contents from markdown content
function generateTableOfContents(content) {
    const headingRegex = /^(#{2,4})\s+(.+)$/gm;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const title = match[2];
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        headings.push({ level, title, id });
    }

    if (headings.length === 0) return '';

    let tocHTML = '<ul class="toc-list">';
    let currentLevel = 2;

    headings.forEach(heading => {
        if (heading.level > currentLevel) {
            tocHTML += '<ul>';
        } else if (heading.level < currentLevel) {
            tocHTML += '</ul>';
        }

        tocHTML += `<li><a href="#${heading.id}">${heading.title}</a></li>`;
        currentLevel = heading.level;
    });

    tocHTML += '</ul>';
    return tocHTML;
}

// Generate blog index page
function generateBlogIndex(posts) {
    const recentPosts = posts.slice(0, 10);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI SEO Blog - Latest Insights & Strategies | ${SITE_NAME}</title>
    <meta name="description" content="Stay ahead with the latest AI SEO strategies, case studies, and industry insights from OptiScale 360. Expert tips to dominate search results.">
    <meta name="keywords" content="AI SEO, search engine optimization, digital marketing, organic traffic, SEO strategies">
    <meta name="robots" content="index, follow">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE_URL}/blog/">
    <meta property="og:title" content="AI SEO Blog - Latest Insights & Strategies">
    <meta property="og:description" content="Stay ahead with the latest AI SEO strategies, case studies, and industry insights from OptiScale 360.">
    <meta property="og:image" content="${SITE_URL}/Optiscale360_logo.svg">
    <meta property="og:site_name" content="${SITE_NAME}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${SITE_URL}/blog/">
    <meta property="twitter:title" content="AI SEO Blog - Latest Insights & Strategies">
    <meta property="twitter:description" content="Stay ahead with the latest AI SEO strategies, case studies, and industry insights from OptiScale 360.">
    <meta property="twitter:image" content="${SITE_URL}/Optiscale360_logo.svg">

    <!-- Canonical URL -->
    <link rel="canonical" href="${SITE_URL}/blog/">

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="${SITE_NAME} Blog RSS Feed" href="${SITE_URL}/blog/feed.xml">

    <link rel="stylesheet" href="../styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- JSON-LD for Blog -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "${SITE_NAME} Blog",
        "description": "AI SEO insights and strategies from OptiScale 360",
        "url": "${SITE_URL}/blog/",
        "publisher": {
            "@type": "Organization",
            "name": "${SITE_NAME}",
            "logo": {
                "@type": "ImageObject",
                "url": "${SITE_URL}/Optiscale360_logo.svg"
            }
        },
        "blogPost": [
            ${recentPosts.map(post => `{
                "@type": "BlogPosting",
                "headline": "${post.frontmatter.title}",
                "description": "${post.frontmatter.description}",
                "url": "${SITE_URL}/blog/${post.slug}/",
                "datePublished": "${post.frontmatter.date}",
                "author": {
                    "@type": "Person",
                    "name": "${post.frontmatter.author || AUTHOR.name}"
                }
            }`).join(',\n            ')}
        ]
    }
    </script>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="/" class="logo-link">
                        <img src="../Optiscale360_logo.svg" alt="OptiScale 360" class="logo-image">
                    </a>
                </div>
                <ul class="nav-menu nav-tabs">
                    <li class="nav-tab"><a href="/" class="nav-link">Home</a></li>
                    <li class="nav-tab"><a href="/services.html" class="nav-link">Services</a></li>
                    <li class="nav-tab"><a href="/case-studies.html" class="nav-link">Case Studies</a></li>
                    <li class="nav-tab"><a href="/resources.html" class="nav-link">Resources</a></li>
                    <li class="nav-tab"><a href="/blog/" class="nav-link active">Blog</a></li>
                    <li class="nav-tab"><a href="/contact.html" class="nav-link">Contact</a></li>
                </ul>
                <div class="nav-cta">
                    <a href="/Free-AI-Ready-Website.html" class="cta-btn">Build Your Next-Gen Website</a>
                </div>
                <div class="nav-toggle">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
        </nav>
    </header>

    <main class="blog-main">
        <div class="blog-container">
            <header class="blog-header">
                <div class="breadcrumbs">
                    <a href="/">Home</a>
                    <span>›</span>
                    <span>Blog</span>
                </div>
                <h1 class="blog-title">AI SEO Insights & Strategies</h1>
                <p class="blog-description">Stay ahead of the curve with cutting-edge AI SEO strategies, case studies, and industry insights that deliver real results.</p>
            </header>

            <div class="blog-posts-grid">
                ${posts.map(post => `
                <article class="blog-post-card">
                    <div class="post-card-meta">
                        <span class="post-category">${post.frontmatter.category || 'SEO'}</span>
                        <time class="post-date" datetime="${post.frontmatter.date}">${new Date(post.frontmatter.date).toLocaleDateString()}</time>
                    </div>
                    <h2 class="post-card-title">
                        <a href="/blog/${post.slug}/">${post.frontmatter.title}</a>
                    </h2>
                    <p class="post-card-excerpt">${post.frontmatter.description}</p>
                    <div class="post-card-footer">
                        <span class="post-reading-time">${post.readingTime}</span>
                        <a href="/blog/${post.slug}/" class="post-read-more">Read More →</a>
                    </div>
                    ${post.frontmatter.tags ? `
                    <div class="post-card-tags">
                        ${post.frontmatter.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ` : ''}
                </article>
                `).join('')}
            </div>
        </div>
    </main>

    <script src="../script.js"></script>
</body>
</html>`;
}

// Generate RSS feed
function generateRSSFeed(posts) {
    const recentPosts = posts.slice(0, 20);
    const buildDate = new Date().toUTCString();

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>${SITE_NAME} Blog</title>
    <description>AI SEO insights and strategies from OptiScale 360</description>
    <link>${SITE_URL}/blog/</link>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>

    ${recentPosts.map(post => `
    <item>
        <title><![CDATA[${post.frontmatter.title}]]></title>
        <description><![CDATA[${post.frontmatter.description}]]></description>
        <link>${SITE_URL}/blog/${post.slug}/</link>
        <guid>${SITE_URL}/blog/${post.slug}/</guid>
        <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
        <author>${AUTHOR.email} (${post.frontmatter.author || AUTHOR.name})</author>
        ${post.frontmatter.category ? `<category>${post.frontmatter.category}</category>` : ''}
    </item>
    `).join('')}
</channel>
</rss>`;
}

// Main build function
function buildBlog() {
    console.log('🚀 Building blog...');

    const posts = getAllPosts();
    console.log(`📝 Found ${posts.length} posts`);

    // Generate individual post pages
    posts.forEach(post => {
        const postDir = path.join(BLOG_DIR, post.slug);
        if (!fs.existsSync(postDir)) {
            fs.mkdirSync(postDir, { recursive: true });
        }

        const html = generatePostHTML(post);
        fs.writeFileSync(path.join(postDir, 'index.html'), html);
        console.log(`✅ Generated: /blog/${post.slug}/`);
    });

    // Generate blog index
    const indexHTML = generateBlogIndex(posts);
    fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), indexHTML);
    console.log('✅ Generated: /blog/index.html');

    // Generate RSS feed
    const rssXML = generateRSSFeed(posts);
    fs.writeFileSync(path.join(BLOG_DIR, 'feed.xml'), rssXML);
    console.log('✅ Generated: /blog/feed.xml');

    console.log('🎉 Blog build complete!');
}

// Run if called directly
if (require.main === module) {
    buildBlog();
}

module.exports = { buildBlog, getAllPosts };