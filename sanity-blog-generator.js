#!/usr/bin/env node
/**
 * SANITY CMS INTEGRATION FOR OPTISCALE 360
 * Generates static blog pages from Sanity CMS content
 */

const fs = require('fs');
const path = require('path');

// Mock Sanity client (replace with real API calls once Sanity is set up)
const mockSanityData = {
  posts: [
    {
      _id: 'post-1',
      title: 'Complete Guide to AI-Powered SEO: 15 Strategies That Actually Work in 2025',
      slug: { current: 'ai-powered-seo-complete-guide-2025' },
      metaDescription: 'Master AI-powered SEO with 15 proven strategies for 2025. Boost organic traffic, improve rankings, and dominate search results with cutting-edge AI tools and techniques.',
      excerpt: 'Discover the most effective AI-powered SEO strategies that are driving massive organic traffic in 2025. From AI content optimization to automated technical SEO.',
      featuredImage: {
        asset: {
          url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&h=630&fit=crop'
        },
        alt: 'AI-powered SEO dashboard showing organic traffic growth'
      },
      category: {
        title: 'SEO',
        slug: { current: 'seo' },
        color: { hex: '#8B5CF6' }
      },
      tags: ['AI SEO', 'Search Engine Optimization', 'Organic Traffic', 'AI Tools'],
      author: {
        name: 'Alex Chen',
        image: {
          asset: {
            url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          }
        },
        bio: 'SEO specialist with 8+ years experience in AI-powered optimization strategies.',
        social: {
          linkedin: 'https://linkedin.com/in/alexchen-seo',
          twitter: 'https://twitter.com/alexchen_seo'
        }
      },
      publishDate: '2025-01-16T12:00:00Z',
      readTime: 12,
      featured: true,
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'The SEO landscape has fundamentally changed in 2025. Traditional keyword stuffing and basic optimization tactics are no longer enough. Today\'s successful websites leverage AI-powered SEO strategies that work with search engines\' machine learning algorithms, not against them.'
            }
          ]
        }
      ]
    }
  ],
  categories: [
    {
      _id: 'cat-1',
      title: 'SEO',
      slug: { current: 'seo' },
      description: 'Search engine optimization strategies and techniques',
      color: { hex: '#8B5CF6' }
    },
    {
      _id: 'cat-2',
      title: 'AI & ML',
      slug: { current: 'ai-ml' },
      description: 'Artificial Intelligence and Machine Learning insights',
      color: { hex: '#10B981' }
    }
  ]
};

// Convert Sanity block content to HTML
function blockContentToHtml(blocks) {
  if (!blocks) return '';

  return blocks.map(block => {
    if (block._type === 'block') {
      const style = block.style || 'normal';
      const text = block.children?.map(child => child.text).join('') || '';

      switch (style) {
        case 'h2':
          return `<h2>${text}</h2>`;
        case 'h3':
          return `<h3>${text}</h3>`;
        case 'h4':
          return `<h4>${text}</h4>`;
        case 'blockquote':
          return `<blockquote><p>${text}</p></blockquote>`;
        default:
          return `<p>${text}</p>`;
      }
    } else if (block._type === 'image') {
      const alt = block.alt || '';
      const url = block.asset?.url || '';
      return `<img src="${url}" alt="${alt}" />`;
    }
    return '';
  }).join('\n');
}

// Generate HTML template for blog post from Sanity data
function generatePostFromSanity(post) {
  const config = {
    siteName: "OptiScale 360",
    siteUrl: "https://optiscale360.pages.dev"
  };

  const publishedDate = new Date(post.publishDate).toISOString();
  const categorySlug = post.category.slug.current;
  const slug = post.slug.current;

  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

    <title>${post.title} | ${config.siteName}</title>
    <meta name="description" content="${post.metaDescription}">
    <meta name="keywords" content="${post.tags.join(', ')}">
    <meta name="author" content="${post.author.name}">

    <link rel="canonical" href="${config.siteUrl}/blog/posts/${slug}.html">

    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.metaDescription}">
    <meta property="og:image" content="${post.featuredImage.asset.url}">
    <meta property="og:image:alt" content="${post.featuredImage.alt}">
    <meta property="og:url" content="${config.siteUrl}/blog/posts/${slug}.html">
    <meta property="og:site_name" content="${config.siteName}">
    <meta property="article:published_time" content="${publishedDate}">
    <meta property="article:author" content="${post.author.name}">
    <meta property="article:section" content="${post.category.title}">
    ${post.tags.map(tag => `<meta property="article:tag" content="${tag}">`).join('\n    ')}

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${post.title}">
    <meta name="twitter:description" content="${post.metaDescription}">
    <meta name="twitter:image" content="${post.featuredImage.asset.url}">
    <meta name="twitter:image:alt" content="${post.featuredImage.alt}">

    <link rel="stylesheet" href="../../styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        .blog-content {
            line-height: 1.8;
        }
        .blog-content h2 {
            font-size: 2rem;
            font-weight: 700;
            margin: 3rem 0 1.5rem 0;
            color: #1F2937;
        }
        .blog-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 2.5rem 0 1rem 0;
            color: #374151;
        }
        .blog-content p {
            margin-bottom: 1.5rem;
            color: #4B5563;
        }
        .blog-content blockquote {
            border-left: 4px solid #10B981;
            padding-left: 1.5rem;
            margin: 2rem 0;
            font-style: italic;
            color: #059669;
            background: #F0FDF4;
            padding: 1.5rem;
            border-radius: 0 8px 8px 0;
        }
        .blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 2rem 0;
        }
    </style>
</head>
<body class="antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
    <!-- Header -->
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="../../" class="logo-link">
                        <img src="../../Optiscale360_logo.svg" alt="${config.siteName}" class="logo-image">
                    </a>
                </div>
                <ul class="nav-menu nav-tabs">
                    <li class="nav-tab"><a href="../../" class="nav-link">Home</a></li>
                    <li class="nav-tab"><a href="../../services.html" class="nav-link">Services</a></li>
                    <li class="nav-tab"><a href="../../case-studies.html" class="nav-link">Case Studies</a></li>
                    <li class="nav-tab"><a href="../../blog.html" class="nav-link active">Blog</a></li>
                    <li class="nav-tab"><a href="../../contact.html" class="nav-link">Contact</a></li>
                </ul>
                <div class="nav-cta">
                    <a href="../../Free-AI-Ready-Website.html" class="cta-btn">Build Your Next-Gen Website</a>
                </div>
            </div>
        </nav>
    </header>

    <main class="pt-20">
        <!-- Breadcrumb -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <nav class="breadcrumb text-sm mb-4">
                <a href="../../" class="text-gray-600 hover:text-blue-600">Home</a>
                <span class="mx-2">/</span>
                <a href="../../blog.html" class="text-gray-600 hover:text-blue-600">Blog</a>
                <span class="mx-2">/</span>
                <a href="../../blog.html?category=${categorySlug}" class="text-gray-600 hover:text-blue-600">${post.category.title}</a>
                <span class="mx-2">/</span>
                <span class="text-gray-900">${post.title}</span>
            </nav>

            <a href="../../blog.html" class="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-8">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Blog
            </a>
        </div>

        <!-- Article -->
        <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <header class="mb-12">
                <div class="mb-6">
                    <span class="px-4 py-2 rounded-full text-sm font-semibold" style="background-color: ${post.category.color.hex}20; color: ${post.category.color.hex};">
                        ${post.category.title}
                    </span>
                    ${post.featured ? '<span class="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold ml-2">FEATURED</span>' : ''}
                </div>

                <h1 class="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                    ${post.title}
                </h1>

                <div class="flex items-center gap-6 text-gray-600 mb-8">
                    <div class="flex items-center gap-3">
                        <img src="${post.author.image.asset.url}" alt="${post.author.name}" class="w-12 h-12 rounded-full">
                        <div>
                            <div class="font-semibold text-gray-900">${post.author.name}</div>
                            <div class="text-sm">${post.author.bio.split('.')[0]}</div>
                        </div>
                    </div>
                    <div class="text-sm">
                        <time datetime="${post.publishDate}">${new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                        <div>${post.readTime} min read</div>
                    </div>
                </div>

                <div class="aspect-video bg-gray-200 rounded-xl overflow-hidden mb-8">
                    <img src="${post.featuredImage.asset.url}" alt="${post.featuredImage.alt}" class="w-full h-full object-cover">
                </div>
            </header>

            <div class="blog-content prose prose-lg max-w-none">
                ${blockContentToHtml(post.content)}
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mt-8 mb-8">
                ${post.tags.map(tag => `<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">${tag}</span>`).join(' ')}
            </div>

            <!-- Author Bio -->
            <div class="bg-gray-50 rounded-xl p-6 mt-8">
                <div class="flex items-start gap-4">
                    <img src="${post.author.image.asset.url}" alt="${post.author.name}" class="w-16 h-16 rounded-full">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">${post.author.name}</h3>
                        <p class="text-gray-600 mb-4">${post.author.bio}</p>
                        <div class="flex gap-4">
                            ${post.author.social.linkedin ? `<a href="${post.author.social.linkedin}" class="text-blue-600 hover:text-blue-700">LinkedIn</a>` : ''}
                            ${post.author.social.twitter ? `<a href="${post.author.social.twitter}" class="text-blue-600 hover:text-blue-700">Twitter</a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3>${config.siteName}</h3>
                    <p>Next-Gen AI-Ready Websites & Business Optimization</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 ${config.siteName}. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../../script.js"></script>

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "${post.title}",
        "description": "${post.metaDescription}",
        "image": "${post.featuredImage.asset.url}",
        "author": {
            "@type": "Person",
            "name": "${post.author.name}",
            "description": "${post.author.bio}"
        },
        "publisher": {
            "@type": "Organization",
            "name": "${config.siteName}",
            "logo": "${config.siteUrl}/Optiscale360_logo.svg"
        },
        "datePublished": "${publishedDate}",
        "mainEntityOfPage": "${config.siteUrl}/blog/posts/${slug}.html",
        "articleSection": "${post.category.title}",
        "keywords": "${post.tags.join(', ')}",
        "timeRequired": "PT${post.readTime}M"
    }
    </script>
</body>
</html>`;
}

// Generate blog cards for homepage/blog listing
function generateBlogCard(post) {
  const categoryColors = {
    'SEO': 'from-purple-500 to-pink-600',
    'AI & ML': 'from-green-500 to-teal-600',
    'Web Design': 'from-blue-500 to-purple-600',
    'Business': 'from-indigo-500 to-blue-600',
    'Development': 'from-orange-500 to-red-600',
    'Healthcare Technology': 'from-emerald-500 to-cyan-600'
  };

  const gradientClass = categoryColors[post.category.title] || 'from-gray-500 to-gray-600';
  const featuredBadge = post.featured ? '<span class="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold ml-2">FEATURED</span>' : '';

  return `<article class="blog-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
    <div class="aspect-video bg-gradient-to-br ${gradientClass} relative">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="absolute top-4 left-4">
            <span class="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">${post.category.title}</span>
            ${featuredBadge}
        </div>
    </div>
    <div class="p-6">
        <div class="text-sm text-gray-500 mb-3">${new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • ${post.readTime} min read</div>
        <h3 class="text-xl font-bold text-gray-900 mb-3 leading-tight">
            <a href="./blog/posts/${post.slug.current}.html" class="hover:text-blue-600 transition-colors">
                ${post.title}
            </a>
        </h3>
        <p class="text-gray-600 mb-4 leading-relaxed">
            ${post.excerpt}
        </p>
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img src="${post.author.image.asset.url}" alt="${post.author.name}" class="w-8 h-8 rounded-full">
                <span class="text-sm font-medium text-gray-700">${post.author.name}</span>
            </div>
            <a href="./blog/posts/${post.slug.current}.html" class="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Read More →
            </a>
        </div>
    </div>
</article>`;
}

// Main execution
console.log('🚀 Generating blog from Sanity CMS...');

try {
    // Use mock data (replace with real Sanity API calls)
    const posts = mockSanityData.posts;

    console.log(`✅ Found ${posts.length} posts from Sanity`);

    // Generate individual blog post HTML files
    posts.forEach(post => {
        const htmlContent = generatePostFromSanity(post);
        const fileName = `${post.slug.current}.html`;
        const filePath = path.join('./blog/posts', fileName);

        fs.writeFileSync(filePath, htmlContent);
        console.log(`✅ Generated: ${fileName}`);
    });

    // Generate blog cards for homepage
    const blogCards = posts.slice(0, 3).map(generateBlogCard).join('\n\n');

    console.log('\n📋 BLOG CARDS FOR HOMEPAGE:');
    console.log('=' .repeat(60));
    console.log(blogCards);
    console.log('=' .repeat(60));

    console.log('\n🎯 SANITY CMS INTEGRATION BENEFITS:');
    console.log('✅ Professional content editing interface');
    console.log('✅ Rich text editor with real-time preview');
    console.log('✅ SEO fields built into content model');
    console.log('✅ Image optimization and CDN');
    console.log('✅ Multi-author workflow');
    console.log('✅ Content scheduling and drafts');
    console.log('✅ API-driven content delivery');

    console.log('\n📝 NEXT STEPS:');
    console.log('1. Set up Sanity project at https://sanity.io/manage');
    console.log('2. cd sanity-studio && npm install && npm run dev');
    console.log('3. Replace mock data with real Sanity API calls');
    console.log('4. Add content through Sanity Studio');
    console.log('5. Run this script to generate static pages');

} catch (error) {
    console.error('❌ Error:', error.message);
}