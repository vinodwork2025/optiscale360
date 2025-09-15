/**
 * GitHub API Publisher for Cloudflare Pages
 * Enables direct commits from the blog creator to trigger auto-deployment
 */

class GitHubPublisher {
    constructor() {
        this.token = localStorage.getItem('github_token');
        this.owner = localStorage.getItem('github_owner') || 'vinodwork2025';
        this.repo = localStorage.getItem('github_repo') || 'optiscale360';
        this.branch = localStorage.getItem('github_branch') || 'main';
        this.baseUrl = `https://api.github.com/repos/${this.owner}/${this.repo}`;
    }

    // Check if GitHub token is configured
    isConfigured() {
        return !!this.token;
    }

    // Set GitHub configuration
    configure(token, owner, repo, branch = 'main') {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
        this.branch = branch;
        this.baseUrl = `https://api.github.com/repos/${this.owner}/${this.repo}`;

        // Save to localStorage
        localStorage.setItem('github_token', token);
        localStorage.setItem('github_owner', owner);
        localStorage.setItem('github_repo', repo);
        localStorage.setItem('github_branch', branch);
    }

    // Get headers for GitHub API
    getHeaders() {
        return {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
    }

    // Test GitHub connection
    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}`, {
                headers: this.getHeaders()
            });

            if (response.ok) {
                const repo = await response.json();
                return {
                    success: true,
                    message: `Connected to ${repo.full_name}`,
                    repo: repo
                };
            } else {
                return {
                    success: false,
                    message: `GitHub API error: ${response.status} ${response.statusText}`
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Connection failed: ${error.message}`
            };
        }
    }

    // Get file SHA (required for updates)
    async getFileSHA(path) {
        try {
            const response = await fetch(`${this.baseUrl}/contents/${path}?ref=${this.branch}`, {
                headers: this.getHeaders()
            });

            if (response.ok) {
                const file = await response.json();
                return file.sha;
            }
            return null; // File doesn't exist
        } catch (error) {
            return null;
        }
    }

    // Create or update a file
    async createOrUpdateFile(path, content, message, isBase64 = false) {
        try {
            const sha = await this.getFileSHA(path);
            const encodedContent = isBase64 ? content : btoa(unescape(encodeURIComponent(content)));

            const data = {
                message: message,
                content: encodedContent,
                branch: this.branch
            };

            if (sha) {
                data.sha = sha; // Required for updates
            }

            const response = await fetch(`${this.baseUrl}/contents/${path}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                return {
                    success: true,
                    message: `${sha ? 'Updated' : 'Created'} ${path}`,
                    commit: result.commit
                };
            } else {
                const error = await response.json();
                return {
                    success: false,
                    message: `Failed to ${sha ? 'update' : 'create'} ${path}: ${error.message}`
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Error: ${error.message}`
            };
        }
    }

    // Upload media file (base64 encoded)
    async uploadMediaFile(filename, dataUrl) {
        try {
            // Extract base64 data from data URL
            const base64Data = dataUrl.split(',')[1];
            const path = `blog/media/images/${filename}`;

            return await this.createOrUpdateFile(
                path,
                base64Data,
                `Add media file: ${filename}`,
                true
            );
        } catch (error) {
            return {
                success: false,
                message: `Failed to upload ${filename}: ${error.message}`
            };
        }
    }

    // Update posts.json database
    async updatePostsDatabase(newPost) {
        try {
            // Get current posts.json
            const response = await fetch(`${this.baseUrl}/contents/blog/posts.json?ref=${this.branch}`, {
                headers: this.getHeaders()
            });

            let postsData = {
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

            if (response.ok) {
                const file = await response.json();
                const content = atob(file.content);
                postsData = JSON.parse(content);
            }

            // Remove existing post with same slug
            postsData.posts = postsData.posts.filter(post => post.slug !== newPost.slug);

            // Add new post at the beginning
            postsData.posts.unshift(newPost);

            // Ensure category exists
            const existingCategories = postsData.categories.map(cat => cat.name);
            if (!existingCategories.includes(newPost.category)) {
                postsData.categories.push({
                    name: newPost.category,
                    slug: newPost.category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                    description: `${newPost.category} related articles`
                });
            }

            // Update posts.json
            return await this.createOrUpdateFile(
                'blog/posts.json',
                JSON.stringify(postsData, null, 2),
                `Update blog database: Add post "${newPost.title}"`
            );

        } catch (error) {
            return {
                success: false,
                message: `Failed to update posts database: ${error.message}`
            };
        }
    }

    // Publish complete blog post
    async publishPost(postData) {
        const results = [];
        let commitMessage = `Publish blog post: "${postData.title}"`;

        try {
            // 1. Upload media files first
            if (postData.mediaFiles && postData.mediaFiles.length > 0) {
                for (const media of postData.mediaFiles) {
                    if (media.data && media.name) {
                        const result = await this.uploadMediaFile(media.name, media.data);
                        results.push(result);

                        if (!result.success) {
                            throw new Error(`Media upload failed: ${result.message}`);
                        }
                    }
                }
            }

            // 2. Create HTML file
            const htmlResult = await this.createOrUpdateFile(
                `blog/posts/${postData.slug}.html`,
                postData.htmlContent,
                `Add blog post HTML: ${postData.title}`
            );
            results.push(htmlResult);

            if (!htmlResult.success) {
                throw new Error(`HTML creation failed: ${htmlResult.message}`);
            }

            // 3. Update posts.json database
            const dbResult = await this.updatePostsDatabase(postData);
            results.push(dbResult);

            if (!dbResult.success) {
                throw new Error(`Database update failed: ${dbResult.message}`);
            }

            // 4. Get the final commit URL for Cloudflare Pages webhook
            const deployUrl = `https://optiscale360.pages.dev/blog/posts/${postData.slug}.html`;

            return {
                success: true,
                message: 'Blog post published successfully!',
                postUrl: deployUrl,
                results: results,
                commit: dbResult.commit
            };

        } catch (error) {
            return {
                success: false,
                message: error.message,
                results: results
            };
        }
    }

    // Trigger Cloudflare Pages deployment (webhook)
    async triggerDeployment() {
        // Cloudflare Pages automatically deploys on GitHub push
        // This method is for future webhook integration if needed
        return {
            success: true,
            message: 'Cloudflare Pages will auto-deploy from GitHub push'
        };
    }
}

// Export for use in other files
window.GitHubPublisher = GitHubPublisher;