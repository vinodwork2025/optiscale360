#!/usr/bin/env node

// Cloudflare Pages Build Script for OptiScale 360 Blog
// This script runs during Cloudflare Pages deployment to generate the blog

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting OptiScale 360 Blog Build...');

try {
    // Ensure dependencies are installed
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Build the blog
    console.log('📝 Generating blog content...');
    execSync('npm run build:blog', { stdio: 'inherit' });

    // Update navigation to include blog link
    console.log('🔗 Updating site navigation...');
    updateNavigation();

    console.log('✅ Build completed successfully!');

    // List generated files
    console.log('\n📋 Generated files:');
    listBlogFiles();

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

function updateNavigation() {
    // Update main site pages to include blog in navigation
    const pages = [
        'index.html',
        'services.html',
        'case-studies.html',
        'resources.html',
        'contact.html',
        'about.html'
    ];

    pages.forEach(page => {
        const filePath = path.join(__dirname, page);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Check if blog link already exists
            if (!content.includes('href="/blog/"') && !content.includes('href="/blog/index.html"')) {
                // Add blog link to navigation
                content = content.replace(
                    /<li class="nav-tab"><a href="\/resources\.html" class="nav-link">/,
                    '<li class="nav-tab"><a href="/resources.html" class="nav-link">Resources</a></li>\n                    <li class="nav-tab"><a href="/blog/" class="nav-link">Blog</a></li>\n                    <li class="nav-tab"><a href="/contact.html" class="nav-link"'
                );

                // Fix the broken tag
                content = content.replace(
                    /<li class="nav-tab"><a href="\/contact\.html" class="nav-link"/,
                    '<li class="nav-tab"><a href="/contact.html" class="nav-link">Contact</a>'
                );

                fs.writeFileSync(filePath, content);
                console.log(`   Updated navigation in ${page}`);
            }
        }
    });
}

function listBlogFiles() {
    const blogDir = path.join(__dirname, 'blog');

    if (fs.existsSync(blogDir)) {
        // List main blog files
        const blogFiles = fs.readdirSync(blogDir);
        blogFiles.forEach(file => {
            const filePath = path.join(blogDir, file);
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                console.log(`   📄 /blog/${file}`);
            } else if (stats.isDirectory() && file !== 'posts') {
                console.log(`   📁 /blog/${file}/`);
                // List index.html in subdirectories
                const indexFile = path.join(filePath, 'index.html');
                if (fs.existsSync(indexFile)) {
                    console.log(`      📄 /blog/${file}/index.html`);
                }
            }
        });

        // Count posts
        const postsDir = path.join(blogDir, 'posts');
        if (fs.existsSync(postsDir)) {
            const posts = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
            console.log(`   📚 Generated ${posts.length} blog posts`);
        }
    }
}