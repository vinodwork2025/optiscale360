#!/usr/bin/env node

// Simple build script to ensure static files are ready for deployment
const fs = require('fs');
const path = require('path');

console.log('🚀 Building static site...');

// Ensure all required files exist
const requiredFiles = [
    'index.html',
    'blog.html',
    'blog/posts-light.json',
    'blog/blog-manager.js'
];

console.log('📋 Checking required files...');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING!`);
        process.exit(1);
    }
});

// Count blog posts
const postsDir = './blog/posts';
if (fs.existsSync(postsDir)) {
    const posts = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));
    console.log(`📄 Found ${posts.length} blog post HTML files`);
} else {
    console.log('❌ Blog posts directory missing!');
    process.exit(1);
}

// Check posts-light.json content
if (fs.existsSync('./blog/posts-light.json')) {
    const data = JSON.parse(fs.readFileSync('./blog/posts-light.json', 'utf8'));
    console.log(`📊 posts-light.json contains ${data.posts.length} posts`);
} else {
    console.log('❌ posts-light.json missing!');
    process.exit(1);
}

console.log('✅ Build complete - static site ready for deployment!');