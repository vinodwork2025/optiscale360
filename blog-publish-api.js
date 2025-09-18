#!/usr/bin/env node

// Blog Publishing API - Real file operations and Git automation
// This provides the actual backend functionality for direct publishing

const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Paths
const POSTS_DIR = path.join(__dirname, 'blog', 'posts');
const BLOG_DIR = path.join(__dirname, 'blog');

// Ensure directories exist
if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
}

// Utility: Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Utility: Execute command with logging
function executeCommand(command, description) {
    console.log(`📋 ${description}...`);
    try {
        const result = execSync(command, {
            cwd: __dirname,
            encoding: 'utf8',
            stdio: 'pipe'
        });
        console.log(`✅ ${description} completed`);
        return { success: true, output: result };
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        return { success: false, error: error.message, output: error.stdout };
    }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Serve admin interface
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog-admin-enhanced.html'));
});

// Get all posts
app.get('/api/posts', (req, res) => {
    try {
        const files = fs.readdirSync(POSTS_DIR)
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filePath = path.join(POSTS_DIR, file);
                const stats = fs.statSync(filePath);
                const content = fs.readFileSync(filePath, 'utf8');

                // Parse frontmatter
                const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
                const frontmatter = frontmatterMatch ? parseFrontmatter(frontmatterMatch[1]) : {};

                return {
                    filename: file,
                    slug: file.replace('.md', ''),
                    title: frontmatter.title || 'Untitled',
                    description: frontmatter.description || '',
                    date: frontmatter.date || stats.mtime.toISOString().split('T')[0],
                    category: frontmatter.category || 'Uncategorized',
                    tags: frontmatter.tags || [],
                    author: frontmatter.author || 'Unknown',
                    modified: stats.mtime,
                    status: frontmatter.draft ? 'draft' : 'published'
                };
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            success: true,
            posts: files
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Simple frontmatter parser
function parseFrontmatter(yamlText) {
    const result = {};
    const lines = yamlText.split('\n');

    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue;

        if (line.includes(':')) {
            const [key, ...valueParts] = line.split(':');
            let value = valueParts.join(':').trim();

            // Remove quotes
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            // Handle arrays
            if (value.startsWith('[') && value.endsWith(']')) {
                const arrayContent = value.slice(1, -1);
                result[key.trim()] = arrayContent
                    .split(',')
                    .map(item => item.trim().replace(/^"|"$/g, ''))
                    .filter(item => item);
            } else {
                result[key.trim()] = value;
            }
        }
    }

    return result;
}

// Get single post
app.get('/api/posts/:filename', (req, res) => {
    try {
        const filePath = path.join(POSTS_DIR, req.params.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);

        if (!frontmatterMatch) {
            return res.status(400).json({
                success: false,
                error: 'Invalid post format'
            });
        }

        const frontmatter = parseFrontmatter(frontmatterMatch[1]);
        const postContent = frontmatterMatch[2];

        res.json({
            success: true,
            frontmatter,
            content: postContent,
            filename: req.params.filename
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Publish new post (complete workflow)
app.post('/api/publish', async (req, res) => {
    const { frontmatter, content, commitMessage } = req.body;

    if (!frontmatter || !content) {
        return res.status(400).json({
            success: false,
            error: 'Frontmatter and content are required'
        });
    }

    if (!frontmatter.title) {
        return res.status(400).json({
            success: false,
            error: 'Post title is required'
        });
    }

    try {
        const results = [];

        // Step 1: Generate filename and content
        const slug = generateSlug(frontmatter.title);
        const filename = `${slug}.md`;
        const filePath = path.join(POSTS_DIR, filename);

        // Generate YAML frontmatter
        const yamlFrontmatter = generateYAMLFrontmatter(frontmatter);
        const fullContent = `---\n${yamlFrontmatter}---\n\n${content}`;

        results.push({
            step: 1,
            description: 'Validate content',
            status: 'completed',
            details: `Generated slug: ${slug}`
        });

        // Step 2: Save to posts directory
        fs.writeFileSync(filePath, fullContent, 'utf8');
        results.push({
            step: 2,
            description: 'Save to posts directory',
            status: 'completed',
            details: `Saved: blog/posts/${filename}`
        });

        // Step 3: Build blog
        const buildResult = executeCommand('node blog-generator.js', 'Build blog site');
        results.push({
            step: 3,
            description: 'Build blog site',
            status: buildResult.success ? 'completed' : 'error',
            details: buildResult.success ? 'Blog built successfully' : buildResult.error
        });

        if (!buildResult.success) {
            throw new Error(`Build failed: ${buildResult.error}`);
        }

        // Step 4: Commit to Git
        const finalCommitMessage = commitMessage || `📝 Add new blog post: ${frontmatter.title}

Published via Blog Admin Pro

🤖 Generated with Claude Code (https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

        const gitAddResult = executeCommand('git add .', 'Stage changes for commit');
        if (!gitAddResult.success) {
            throw new Error(`Git add failed: ${gitAddResult.error}`);
        }

        const commitResult = executeCommand(`git commit -m "${finalCommitMessage.replace(/"/g, '\\"')}"`, 'Commit changes');
        results.push({
            step: 4,
            description: 'Commit to Git',
            status: commitResult.success ? 'completed' : 'error',
            details: commitResult.success ? 'Changes committed successfully' : commitResult.error
        });

        if (!commitResult.success) {
            throw new Error(`Git commit failed: ${commitResult.error}`);
        }

        // Step 5: Push to remote
        const pushResult = executeCommand('git push', 'Push to remote repository');
        results.push({
            step: 5,
            description: 'Deploy to Cloudflare Pages',
            status: pushResult.success ? 'completed' : 'error',
            details: pushResult.success ? 'Pushed to GitHub - Cloudflare Pages will auto-deploy' : pushResult.error
        });

        if (!pushResult.success) {
            throw new Error(`Git push failed: ${pushResult.error}`);
        }

        // Success response
        res.json({
            success: true,
            message: 'Post published successfully!',
            slug: slug,
            filename: filename,
            url: `https://optiscale360.pages.dev/blog/${slug}/`,
            results: results
        });

    } catch (error) {
        console.error('Publishing error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            results: results
        });
    }
});

// Save draft (create/update post without publishing)
app.post('/api/save-draft', (req, res) => {
    const { frontmatter, content, filename } = req.body;

    if (!frontmatter || !content) {
        return res.status(400).json({
            success: false,
            error: 'Frontmatter and content are required'
        });
    }

    try {
        // Generate filename if not provided
        let finalFilename = filename;
        if (!finalFilename && frontmatter.title) {
            const slug = generateSlug(frontmatter.title);
            finalFilename = `${slug}.md`;
        }

        if (!finalFilename) {
            return res.status(400).json({
                success: false,
                error: 'Filename or title is required'
            });
        }

        // Ensure filename ends with .md
        if (!finalFilename.endsWith('.md')) {
            finalFilename += '.md';
        }

        const filePath = path.join(POSTS_DIR, finalFilename);

        // Mark as draft
        const draftFrontmatter = { ...frontmatter, draft: true };

        // Generate YAML frontmatter
        const yamlFrontmatter = generateYAMLFrontmatter(draftFrontmatter);
        const fullContent = `---\n${yamlFrontmatter}---\n\n${content}`;

        // Save file
        fs.writeFileSync(filePath, fullContent, 'utf8');

        res.json({
            success: true,
            message: 'Draft saved successfully',
            filename: finalFilename,
            path: `blog/posts/${finalFilename}`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete post
app.delete('/api/posts/:filename', (req, res) => {
    try {
        const filePath = path.join(POSTS_DIR, req.params.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        fs.unlinkSync(filePath);

        res.json({
            success: true,
            message: `Post deleted: ${req.params.filename}`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Build blog only
app.post('/api/build', (req, res) => {
    try {
        const buildResult = executeCommand('node blog-generator.js', 'Build blog');

        if (buildResult.success) {
            res.json({
                success: true,
                message: 'Blog built successfully',
                output: buildResult.output
            });
        } else {
            res.status(500).json({
                success: false,
                error: buildResult.error,
                output: buildResult.output
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Generate YAML frontmatter
function generateYAMLFrontmatter(frontmatter) {
    let yaml = '';

    // Required fields
    yaml += `title: "${frontmatter.title}"\n`;
    yaml += `description: "${frontmatter.description}"\n`;
    yaml += `date: "${frontmatter.date}"\n`;

    // Optional fields
    if (frontmatter.author) yaml += `author: "${frontmatter.author}"\n`;
    if (frontmatter.category) yaml += `category: "${frontmatter.category}"\n`;
    if (frontmatter.image) yaml += `image: "${frontmatter.image}"\n`;
    if (frontmatter.type) yaml += `type: "${frontmatter.type}"\n`;
    if (frontmatter.schema) yaml += `schema: "${frontmatter.schema}"\n`;
    if (frontmatter.totalTime) yaml += `totalTime: "${frontmatter.totalTime}"\n`;
    if (frontmatter.serviceName) yaml += `serviceName: "${frontmatter.serviceName}"\n`;
    if (frontmatter.serviceType) yaml += `serviceType: "${frontmatter.serviceType}"\n`;
    if (frontmatter.draft) yaml += `draft: true\n`;

    // Tags array
    if (frontmatter.tags && frontmatter.tags.length > 0) {
        yaml += 'tags: [';
        yaml += frontmatter.tags.map(tag => `"${tag}"`).join(', ');
        yaml += ']\n';
    }

    // FAQs array
    if (frontmatter.faqs && frontmatter.faqs.length > 0) {
        yaml += 'faqs: [\n';
        frontmatter.faqs.forEach((faq, index) => {
            yaml += '  {\n';
            yaml += `    "question": "${faq.question}",\n`;
            yaml += `    "answer": "${faq.answer}"\n`;
            yaml += '  }';
            if (index < frontmatter.faqs.length - 1) yaml += ',';
            yaml += '\n';
        });
        yaml += ']\n';
    }

    // Steps array (for HowTo)
    if (frontmatter.steps && frontmatter.steps.length > 0) {
        yaml += 'steps: [\n';
        frontmatter.steps.forEach((step, index) => {
            yaml += '  {\n';
            yaml += `    "@type": "HowToStep",\n`;
            yaml += `    "name": "${step.name}",\n`;
            yaml += `    "text": "${step.text}"\n`;
            yaml += '  }';
            if (index < frontmatter.steps.length - 1) yaml += ',';
            yaml += '\n';
        });
        yaml += ']\n';
    }

    return yaml;
}

// Get blog statistics
app.get('/api/stats', (req, res) => {
    try {
        const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));

        const posts = files.map(file => {
            const filePath = path.join(POSTS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
            const frontmatter = frontmatterMatch ? parseFrontmatter(frontmatterMatch[1]) : {};

            return {
                filename: file,
                ...frontmatter,
                status: frontmatter.draft ? 'draft' : 'published'
            };
        });

        const stats = {
            totalPosts: posts.length,
            publishedPosts: posts.filter(p => p.status === 'published').length,
            draftPosts: posts.filter(p => p.status === 'draft').length,
            categories: [...new Set(posts.map(p => p.category).filter(Boolean))],
            tags: [...new Set(posts.flatMap(p => p.tags || []))],
            latestPost: posts.sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null,
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

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('API Error:', error);
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
🚀 Blog Publishing API Started!

📝 Admin Interface: http://localhost:${PORT}/admin
🔧 API Base URL:    http://localhost:${PORT}/api/
📊 Health Check:    http://localhost:${PORT}/api/health

🎯 Key Features:
✅ Direct publish to live site
✅ Real file operations
✅ Git automation
✅ Cloudflare Pages integration
✅ Draft management
✅ Blog statistics

Available API Endpoints:
- GET    /api/posts           - List all posts
- GET    /api/posts/:filename - Get single post
- POST   /api/publish         - Publish post (full workflow)
- POST   /api/save-draft      - Save as draft
- DELETE /api/posts/:filename - Delete post
- POST   /api/build           - Build blog only
- GET    /api/stats           - Get blog statistics

🚀 Ready to publish directly to optiscale360.pages.dev!

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