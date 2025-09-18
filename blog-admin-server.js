#!/usr/bin/env node

// Simple Express server for blog admin interface
// Run with: node blog-admin-server.js

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const BlogAdminBackend = require('./blog-admin-backend');

const app = express();
const PORT = process.env.PORT || 3001;
const admin = new BlogAdminBackend();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'images', 'blog');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).toLowerCase().replace(/[^a-z0-9]/g, '-');
        cb(null, `${name}-${timestamp}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Routes

// Serve admin interface
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog-admin.html'));
});

// API Routes

// Get all posts
app.get('/api/posts', (req, res) => {
    const result = admin.getAllPosts();
    res.json(result);
});

// Get single post
app.get('/api/posts/:filename', (req, res) => {
    const result = admin.loadPost(req.params.filename);
    res.json(result);
});

// Save new post
app.post('/api/posts', (req, res) => {
    const { frontmatter, content, filename } = req.body;

    if (!frontmatter || !content) {
        return res.status(400).json({
            success: false,
            error: 'Frontmatter and content are required'
        });
    }

    const result = admin.savePost(frontmatter, content, filename);
    res.json(result);
});

// Update existing post
app.put('/api/posts/:filename', (req, res) => {
    const { frontmatter, content } = req.body;

    if (!frontmatter || !content) {
        return res.status(400).json({
            success: false,
            error: 'Frontmatter and content are required'
        });
    }

    const result = admin.savePost(frontmatter, content, req.params.filename);
    res.json(result);
});

// Delete post
app.delete('/api/posts/:filename', (req, res) => {
    const result = admin.deletePost(req.params.filename);
    res.json(result);
});

// Build blog
app.post('/api/build', (req, res) => {
    const result = admin.buildBlog();
    res.json(result);
});

// Deploy to Git
app.post('/api/deploy', (req, res) => {
    const { message } = req.body;
    const result = admin.deployToGit(message);
    res.json(result);
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        const imageUrl = `/images/blog/${req.file.filename}`;

        res.json({
            success: true,
            url: imageUrl,
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get blog statistics
app.get('/api/stats', (req, res) => {
    try {
        const postsResult = admin.getAllPosts();
        if (!postsResult.success) {
            return res.status(500).json(postsResult);
        }

        const posts = postsResult.posts;
        const stats = {
            totalPosts: posts.length,
            publishedPosts: posts.filter(p => p.status === 'published').length,
            draftPosts: posts.filter(p => p.status === 'draft').length,
            categories: [...new Set(posts.map(p => p.category))],
            tags: [...new Set(posts.flatMap(p => p.tags))],
            latestPost: posts[0] || null,
            postsThisMonth: posts.filter(p => {
                const postDate = new Date(p.date);
                const now = new Date();
                return postDate.getMonth() === now.getMonth() &&
                       postDate.getFullYear() === now.getFullYear();
            }).length
        };

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Export post as markdown file
app.get('/api/posts/:filename/export', (req, res) => {
    const result = admin.loadPost(req.params.filename);

    if (!result.success) {
        return res.status(404).json(result);
    }

    const yamlFrontmatter = admin.generateYAMLFrontmatter(result.frontmatter);
    const fullContent = `---\n${yamlFrontmatter}---\n\n${result.content}`;

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
    res.send(fullContent);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Blog Admin Server Started!

📝 Admin Interface: http://localhost:${PORT}/admin
🌐 API Endpoints:   http://localhost:${PORT}/api/
📊 Health Check:    http://localhost:${PORT}/api/health

Available API Endpoints:
- GET    /api/posts           - List all posts
- GET    /api/posts/:filename - Get single post
- POST   /api/posts           - Create new post
- PUT    /api/posts/:filename - Update post
- DELETE /api/posts/:filename - Delete post
- POST   /api/upload          - Upload image
- POST   /api/build           - Build blog
- POST   /api/deploy          - Deploy to Git
- GET    /api/stats           - Get blog statistics
- GET    /api/posts/:filename/export - Export post

Press Ctrl+C to stop the server.
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Server shutting down gracefully...');
    process.exit(0);
});

module.exports = app;