/**
 * Node.js Blog Publishing Server
 * Alternative to PHP for direct blog post publishing
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..')));

// Utility functions
function sanitizeText(text) {
    return text ? text.toString().trim().replace(/[<>]/g, '') : '';
}

function sanitizeSlug(slug) {
    return slug.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50)
        .replace(/^-|-$/g, '');
}

// Generate HTML from template
async function generateBlogPostHTML(postData) {
    try {
        const templatePath = path.join(__dirname, 'post-template.html');
        let template = await fs.readFile(templatePath, 'utf8');

        const replacements = {
            '[POST_TITLE]': postData.title,
            '[POST_DESCRIPTION]': postData.metaDescription,
            '[POST_KEYWORDS]': postData.keywords,
            '[POST_AUTHOR]': postData.author,
            '[POST_DATE]': postData.publishDate,
            '[POST_SLUG]': postData.slug,
            '[POST_CATEGORY]': postData.category,
            '[POST_READ_TIME]': postData.readTime,
            '[POST_EXCERPT]': postData.excerpt,
            '[POST_CONTENT]': postData.content,
            '[POST_FEATURED_IMAGE]': postData.featuredImage,
            '[POST_IMAGE]': postData.featuredImage,
            '[AUTHOR_IMAGE]': postData.authorImage,
            '[AUTHOR_TITLE]': postData.authorTitle,
            '[AUTHOR_BIO]': postData.authorBio,
            '[AUTHOR_TWITTER]': postData.authorTwitter,
            '[AUTHOR_LINKEDIN]': postData.authorLinkedIn,
            '[POST_TAGS]': postData.tags.map(tag => `<span class="tag">${tag}</span>`).join(''),
            '[RELATED_POSTS]': '<!-- Related posts will be populated dynamically -->'
        };

        for (const [placeholder, value] of Object.entries(replacements)) {
            template = template.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
        }

        return template;
    } catch (error) {
        throw new Error(`Template generation failed: ${error.message}`);
    }
}

// Save media files
async function saveMediaFiles(mediaFiles, slug) {
    if (!mediaFiles || mediaFiles.length === 0) return;

    const mediaDir = path.join(__dirname, 'media', 'images');

    try {
        await fs.mkdir(mediaDir, { recursive: true });

        for (let i = 0; i < mediaFiles.length; i++) {
            const mediaFile = mediaFiles[i];
            if (mediaFile.data && mediaFile.name) {
                // Remove data URL prefix
                const base64Data = mediaFile.data.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');

                const extension = path.extname(mediaFile.name) || '.jpg';
                const filename = `${slug}-${mediaFile.type}-${i + 1}${extension}`;
                const filepath = path.join(mediaDir, filename);

                await fs.writeFile(filepath, buffer);
                console.log(`Saved media file: ${filename}`);
            }
        }
    } catch (error) {
        console.error('Error saving media files:', error);
    }
}

// Update posts database
async function updatePostsDatabase(postData) {
    const postsFile = path.join(__dirname, 'posts.json');

    try {
        let postsData;
        try {
            const content = await fs.readFile(postsFile, 'utf8');
            postsData = JSON.parse(content);
        } catch (error) {
            // Create new structure if file doesn't exist
            postsData = {
                posts: [],
                categories: [
                    { name: 'All Posts', slug: 'all', description: 'All blog posts' },
                    { name: 'Web Design', slug: 'web-design', description: 'Latest trends and techniques in web design' },
                    { name: 'AI & ML', slug: 'ai-ml', description: 'Artificial Intelligence and Machine Learning insights' },
                    { name: 'Development', slug: 'development', description: 'Web development tips and best practices' },
                    { name: 'SEO', slug: 'seo', description: 'Search engine optimization strategies' },
                    { name: 'Business', slug: 'business', description: 'Business optimization and growth strategies' }
                ]
            };
        }

        // Remove existing post with same slug
        postsData.posts = postsData.posts.filter(post => post.slug !== postData.slug);

        // Add new post at the beginning
        postsData.posts.unshift(postData);

        // Ensure category exists
        const existingCategories = postsData.categories.map(cat => cat.name);
        if (!existingCategories.includes(postData.category)) {
            postsData.categories.push({
                name: postData.category,
                slug: sanitizeSlug(postData.category),
                description: `${postData.category} related articles`
            });
        }

        // Save updated data
        await fs.writeFile(postsFile, JSON.stringify(postsData, null, 2));
        console.log('Posts database updated successfully');
    } catch (error) {
        throw new Error(`Database update failed: ${error.message}`);
    }
}

// Publish endpoint
app.post('/api/publish-post', async (req, res) => {
    try {
        const data = req.body;

        // Validate required fields
        const required = ['title', 'slug', 'content', 'author', 'category', 'excerpt'];
        for (const field of required) {
            if (!data[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Sanitize and prepare data
        const postData = {
            id: sanitizeSlug(data.slug),
            title: sanitizeText(data.title),
            slug: sanitizeSlug(data.slug),
            excerpt: sanitizeText(data.excerpt),
            content: data.content,
            author: sanitizeText(data.author),
            authorTitle: sanitizeText(data.authorTitle || 'Content Specialist'),
            authorImage: data.authorImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
            authorBio: sanitizeText(data.authorBio || ''),
            authorTwitter: data.authorTwitter || '#',
            authorLinkedIn: data.authorLinkedIn || '#',
            category: sanitizeText(data.category),
            tags: Array.isArray(data.tags) ? data.tags.map(tag => sanitizeText(tag)) : [],
            publishDate: data.publishDate || new Date().toISOString().split('T')[0],
            readTime: parseInt(data.readTime) || 5,
            featured: Boolean(data.featured),
            featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=400&fit=crop',
            metaDescription: sanitizeText(data.metaDescription),
            keywords: sanitizeText(data.keywords || ''),
            status: sanitizeText(data.status || 'published'),
            seoScore: parseInt(data.seoScore) || 0
        };

        // Generate HTML content
        const htmlContent = await generateBlogPostHTML(postData);
        const htmlFilePath = path.join(__dirname, 'posts', `${postData.slug}.html`);

        // Ensure posts directory exists
        await fs.mkdir(path.dirname(htmlFilePath), { recursive: true });

        // Save HTML file
        await fs.writeFile(htmlFilePath, htmlContent);

        // Save media files
        await saveMediaFiles(data.mediaFiles, postData.slug);

        // Update database
        await updatePostsDatabase(postData);

        res.json({
            success: true,
            message: 'Blog post published successfully!',
            postUrl: `/blog/posts/${postData.slug}.html`,
            slug: postData.slug
        });

    } catch (error) {
        console.error('Publishing error:', error);
        res.status(500).json({
            error: `Publishing failed: ${error.message}`
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', server: 'Blog Publishing Server' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Blog Publishing Server running on http://localhost:${PORT}

Available endpoints:
- POST /api/publish-post - Publish blog posts
- GET /api/health - Health check

Ready to publish blog posts directly to your website!
    `);
});

module.exports = app;