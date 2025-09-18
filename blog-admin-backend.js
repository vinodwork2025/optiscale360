// Blog Admin Backend Handler
// This script provides server-side functionality for the blog admin interface

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BlogAdminBackend {
    constructor() {
        this.postsDir = path.join(__dirname, 'blog', 'posts');
        this.blogDir = path.join(__dirname, 'blog');

        // Ensure directories exist
        if (!fs.existsSync(this.postsDir)) {
            fs.mkdirSync(this.postsDir, { recursive: true });
        }
    }

    // Save a new blog post
    savePost(frontmatter, content, filename = null) {
        try {
            // Generate filename if not provided
            if (!filename) {
                const slug = this.generateSlug(frontmatter.title);
                filename = `${slug}.md`;
            }

            // Ensure filename ends with .md
            if (!filename.endsWith('.md')) {
                filename += '.md';
            }

            const filePath = path.join(this.postsDir, filename);

            // Generate YAML frontmatter
            const yamlFrontmatter = this.generateYAMLFrontmatter(frontmatter);
            const fullContent = `---\n${yamlFrontmatter}---\n\n${content}`;

            // Write file
            fs.writeFileSync(filePath, fullContent, 'utf8');

            return {
                success: true,
                filename,
                path: filePath,
                message: `Post saved: ${filename}`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Load an existing post
    loadPost(filename) {
        try {
            const filePath = path.join(this.postsDir, filename);

            if (!fs.existsSync(filePath)) {
                return {
                    success: false,
                    error: 'Post not found'
                };
            }

            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { frontmatter, content } = this.parseFrontmatter(fileContent);

            return {
                success: true,
                frontmatter,
                content,
                filename
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get list of all posts
    getAllPosts() {
        try {
            const files = fs.readdirSync(this.postsDir)
                .filter(file => file.endsWith('.md'))
                .map(file => {
                    const filePath = path.join(this.postsDir, file);
                    const stats = fs.statSync(filePath);
                    const content = fs.readFileSync(filePath, 'utf8');
                    const { frontmatter } = this.parseFrontmatter(content);

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

            return {
                success: true,
                posts: files
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Delete a post
    deletePost(filename) {
        try {
            const filePath = path.join(this.postsDir, filename);

            if (!fs.existsSync(filePath)) {
                return {
                    success: false,
                    error: 'Post not found'
                };
            }

            fs.unlinkSync(filePath);

            return {
                success: true,
                message: `Post deleted: ${filename}`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Build the blog
    buildBlog() {
        try {
            console.log('🚀 Building blog...');

            // Run the blog generator
            execSync('node blog-generator.js', {
                cwd: __dirname,
                stdio: 'inherit'
            });

            return {
                success: true,
                message: 'Blog built successfully'
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Deploy to Git (commit and push)
    deployToGit(commitMessage = null) {
        try {
            // Build blog first
            const buildResult = this.buildBlog();
            if (!buildResult.success) {
                return buildResult;
            }

            // Generate commit message if not provided
            if (!commitMessage) {
                const timestamp = new Date().toISOString().split('T')[0];
                commitMessage = `📝 Update blog content - ${timestamp}`;
            }

            console.log('📦 Committing changes...');

            // Git commands
            execSync('git add .', { cwd: __dirname, stdio: 'inherit' });
            execSync(`git commit -m "${commitMessage}"`, { cwd: __dirname, stdio: 'inherit' });
            execSync('git push', { cwd: __dirname, stdio: 'inherit' });

            return {
                success: true,
                message: 'Successfully deployed to Git!'
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Utility: Generate slug from title
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Utility: Generate YAML frontmatter
    generateYAMLFrontmatter(frontmatter) {
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

    // Utility: Parse frontmatter from file content
    parseFrontmatter(content) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);

        if (!match) {
            return {
                frontmatter: {},
                content: content
            };
        }

        try {
            // Simple YAML parser for our use case
            const frontmatterText = match[1];
            const frontmatter = this.parseSimpleYAML(frontmatterText);
            const bodyContent = match[2];

            return {
                frontmatter,
                content: bodyContent
            };

        } catch (error) {
            console.error('Error parsing frontmatter:', error);
            return {
                frontmatter: {},
                content: content
            };
        }
    }

    // Simple YAML parser (basic implementation)
    parseSimpleYAML(yamlText) {
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
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogAdminBackend;
}

// Example usage if run directly
if (require.main === module) {
    const admin = new BlogAdminBackend();

    // Example: List all posts
    const posts = admin.getAllPosts();
    console.log('All posts:', posts);

    // Example: Save a new post
    const frontmatter = {
        title: 'Test Post from Backend',
        description: 'A test post created from the backend system',
        date: '2024-03-18',
        author: 'Admin',
        category: 'Test',
        tags: ['test', 'backend']
    };

    const content = `# Test Post

This is a test post created from the backend system.

## Features

- Backend integration
- Automatic file generation
- Git deployment

Great work!`;

    const result = admin.savePost(frontmatter, content);
    console.log('Save result:', result);
}