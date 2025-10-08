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

// Configure marked to handle custom heading IDs
marked.use({
    renderer: {
        heading(text, level) {
            // Check if text contains custom ID syntax {#custom-id}
            const customIdMatch = text.match(/^(.+?)\s+\{#([a-z0-9-]+)\}$/);
            let actualText = text;
            let id;

            if (customIdMatch) {
                actualText = customIdMatch[1].trim();
                id = customIdMatch[2];
            } else {
                id = actualText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            }

            return `<h${level} id="${id}">${actualText}</h${level}>\n`;
        }
    }
});

const BLOG_DIR = path.join(__dirname, 'blog');
const POSTS_DIR = path.join(BLOG_DIR, 'posts');
const SITE_URL = 'https://optiscale360.pages.dev';
const SITE_NAME = 'OptiScale Advisors';
const AUTHOR = {
    name: 'OptiScale Advisors Team',
    email: 'info@optiscaleadvisors.com',
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

// Estimate reading time and word count
function estimateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}

function getWordCount(content) {
    return content.split(/\s+/).length;
}

// Generate JSON-LD structured data
function generateJSONLD(post, type = 'BlogPosting') {
    const wordCount = getWordCount(post.content);

    // Enhanced Author schema with social profiles
    const authorSchema = {
        "@type": "Person",
        "name": post.frontmatter.author || AUTHOR.name,
        "url": AUTHOR.url,
        "email": AUTHOR.email,
        "jobTitle": "SEO Consultant",
        "worksFor": {
            "@type": "Organization",
            "name": SITE_NAME
        },
        "sameAs": [
            "https://twitter.com/optiscale360",
            "https://linkedin.com/company/optiscale360"
        ]
    };

    const baseSchema = {
        "@context": "https://schema.org",
        "@type": type,
        "headline": post.frontmatter.title,
        "description": post.frontmatter.description,
        "image": post.frontmatter.image || `${SITE_URL}/360_logo.svg`,
        "author": authorSchema,
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/360_logo.svg`
            }
        },
        "datePublished": post.frontmatter.date,
        "dateModified": post.frontmatter.updated || post.frontmatter.date,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${post.slug}/`
        },
        "wordCount": wordCount,
        "articleSection": post.frontmatter.category || "SEO Strategy",
        "articleBody": post.content.substring(0, 500) + "...",
        "keywords": (post.frontmatter.tags || []).join(', '),
        "inLanguage": "en-US",
        "isAccessibleForFree": true,
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".blog-post-title", ".blog-post-excerpt", ".blog-content h2", ".blog-content h3"]
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
            "image": post.frontmatter.image || `${SITE_URL}/360_logo.svg`,
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

    // Review/Rating schema for tool reviews
    if (post.frontmatter.reviews && post.frontmatter.reviews.length > 0) {
        post.frontmatter.reviews.forEach(review => {
            schemas.push({
                "@context": "https://schema.org",
                "@type": "Review",
                "itemReviewed": {
                    "@type": review.itemType || "SoftwareApplication",
                    "name": review.itemName,
                    "description": review.itemDescription || "",
                    "url": review.itemUrl || ""
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": review.rating,
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "author": authorSchema,
                "reviewBody": review.body || ""
            });
        });
    }

    // VideoObject schema for posts with video content
    if (post.frontmatter.video) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": post.frontmatter.video.title || post.frontmatter.title,
            "description": post.frontmatter.video.description || post.frontmatter.description,
            "thumbnailUrl": post.frontmatter.video.thumbnail || post.frontmatter.image,
            "uploadDate": post.frontmatter.video.uploadDate || post.frontmatter.date,
            "duration": post.frontmatter.video.duration || "PT10M",
            "contentUrl": post.frontmatter.video.url || "",
            "embedUrl": post.frontmatter.video.embedUrl || ""
        });
    }

    // ItemList schema for list-based posts (e.g., "Top 10 Tools")
    if (post.frontmatter.listItems && post.frontmatter.listItems.length > 0) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": post.frontmatter.listItems.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "description": item.description || "",
                "url": item.url || ""
            }))
        });
    }

    // Organization schema
    schemas.push({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL,
        "logo": `${SITE_URL}/360_logo.svg`,
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
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y1J0TYF857"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-Y1J0TYF857');
    </script>

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
    <meta property="og:image" content="${post.frontmatter.image || `${SITE_URL}/360_logo.svg`}">
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
    <meta property="twitter:image" content="${post.frontmatter.image || `${SITE_URL}/360_logo.svg`}">

    <!-- Canonical URL -->
    <link rel="canonical" href="${SITE_URL}/blog/${post.slug}/">

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="${SITE_NAME} Blog RSS Feed" href="${SITE_URL}/blog/feed.xml">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="../../styles.css?v=${Date.now()}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- JSON-LD Structured Data -->
    ${schemas.map(schema => `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`).join('\n    ')}
</head>
<body>
    <!-- Global Header -->
    <div id="header-placeholder"></div>

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
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE_URL + '/blog/' + post.slug + '/')}&text=${encodeURIComponent(post.frontmatter.title)}" target="_blank" rel="noopener" class="share-btn share-twitter" title="Share on Twitter">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <span>Twitter</span>
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL + '/blog/' + post.slug + '/')}" target="_blank" rel="noopener" class="share-btn share-linkedin" title="Share on LinkedIn">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            <span>LinkedIn</span>
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL + '/blog/' + post.slug + '/')}" target="_blank" rel="noopener" class="share-btn share-facebook" title="Share on Facebook">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span>Facebook</span>
                        </a>
                    </div>
                </div>
            </footer>
        </article>
    </main>

    <!-- Global Footer -->
    <div id="footer-placeholder"></div>

    <script src="../../components/loader.js"></script>
    <script src="../../script.js"></script>
</body>
</html>`;
}

// Generate table of contents from markdown content
function generateTableOfContents(content) {
    const headingRegex = /^(#{2,4})\s+(.+?)(?:\s+\{#([a-z0-9-]+)\})?$/gm;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        let title = match[2].trim();
        // Use custom ID if provided, otherwise generate from title
        const id = match[3] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
    // Read the enhanced blog template
    const templatePath = path.join(__dirname, 'blog', 'index.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Prepare posts data for JavaScript injection
    const postsData = posts.map(post => ({
        slug: post.slug,
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        date: post.frontmatter.date,
        category: post.frontmatter.category || 'SEO Strategy',
        tags: post.frontmatter.tags || ['SEO'],
        author: post.frontmatter.author || AUTHOR.name,
        readingTime: post.readingTime,
        image: post.frontmatter.image || `${SITE_URL}/360_logo.svg`
    }));

    // Create categories and tags from real data
    const categories = [...new Set(postsData.map(post => post.category))];
    const allTags = postsData.flatMap(post => post.tags);
    const uniqueTags = [...new Set(allTags)];

    // Update filter buttons to match real categories
    const categoryFilters = categories.map(category =>
        `<button class="filter-btn" data-filter="${category}">${category}</button>`
    ).join('\n                    ');

    // Replace filter buttons in template
    template = template.replace(
        /<button class="filter-btn" data-filter="SEO Strategy">SEO Strategy<\/button>[\s\S]*?<button class="filter-btn" data-filter="Technical SEO">Technical<\/button>/,
        categoryFilters
    );

    // Replace the mock data function with real data
    const realDataFunction = `
        function getMockPosts() {
            return ${JSON.stringify(postsData, null, 16)};
        }`;

    template = template.replace(
        /function getMockPosts\(\) \{[\s\S]*?\];[\s\S]*?\}/,
        realDataFunction.trim()
    );

    return template;
}

// Generate RSS feed
function generateRSSFeed(posts) {
    const recentPosts = posts.slice(0, 20);
    const buildDate = new Date().toUTCString();

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>${SITE_NAME} Blog</title>
    <description>AI SEO insights and strategies from OptiScale Advisors</description>
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