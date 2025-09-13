#!/usr/bin/env node

/**
 * OptiScale 360 Blog Post Creator
 * Automated blog post generation script
 *
 * Usage:
 * node blog/create-post.js --title "Your Post Title" --author "Author Name" --category "Web Design"
 * node blog/create-post.js --interactive
 * node blog/create-post.js --from-json post-data.json
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

class BlogPostCreator {
    constructor() {
        this.postsJsonPath = path.join(__dirname, 'posts.json');
        this.templatePath = path.join(__dirname, 'post-template.html');
        this.postsDir = path.join(__dirname, 'posts');

        this.categories = [
            'Web Design',
            'AI & ML',
            'Development',
            'SEO',
            'Business',
            'AI & Web Design'
        ];
    }

    // Main entry point
    async run() {
        try {
            const args = process.argv.slice(2);

            if (args.includes('--interactive')) {
                await this.interactiveMode();
            } else if (args.includes('--from-json')) {
                const jsonFile = args[args.indexOf('--from-json') + 1];
                await this.createFromJson(jsonFile);
            } else if (args.includes('--ai-generate')) {
                await this.aiGenerateMode();
            } else {
                await this.createFromArgs(args);
            }
        } catch (error) {
            console.error('❌ Error creating blog post:', error.message);
            process.exit(1);
        }
    }

    // Interactive mode - asks user for input
    async interactiveMode() {
        console.log('🎨 OptiScale 360 Blog Post Creator - Interactive Mode\n');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

        try {
            const postData = {
                title: await question('📝 Post title: '),
                author: await question('👤 Author name: '),
                authorTitle: await question('💼 Author title: '),
                category: await this.selectCategory(rl),
                excerpt: await question('📄 Brief excerpt (1-2 sentences): '),
                readTime: parseInt(await question('⏱️  Estimated read time (minutes): ')) || 5,
                tags: (await question('🏷️  Tags (comma-separated): ')).split(',').map(t => t.trim()),
                featured: (await question('⭐ Featured post? (y/n): ')).toLowerCase() === 'y',
                authorImage: await question('🖼️  Author image URL (optional): ') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
                featuredImage: await question('🖼️  Featured image URL: ') || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=400&fit=crop',
                content: await question('📖 Article content (HTML or plain text): ') || this.getDefaultContent()
            };

            rl.close();
            await this.createPost(postData);
        } catch (error) {
            rl.close();
            throw error;
        }
    }

    // Create from command line arguments
    async createFromArgs(args) {
        const postData = {
            title: this.getArgValue(args, '--title') || 'New Blog Post',
            author: this.getArgValue(args, '--author') || 'OptiScale 360 Team',
            authorTitle: this.getArgValue(args, '--author-title') || 'Content Specialist',
            category: this.getArgValue(args, '--category') || 'Business',
            excerpt: this.getArgValue(args, '--excerpt') || 'This is a new blog post about business optimization and AI-powered solutions.',
            readTime: parseInt(this.getArgValue(args, '--read-time')) || 5,
            tags: this.getArgValue(args, '--tags')?.split(',').map(t => t.trim()) || ['Business', 'AI'],
            featured: args.includes('--featured'),
            authorImage: this.getArgValue(args, '--author-image') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
            featuredImage: this.getArgValue(args, '--featured-image') || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=400&fit=crop',
            content: this.getArgValue(args, '--content') || this.getDefaultContent()
        };

        await this.createPost(postData);
    }

    // Create from JSON file
    async createFromJson(jsonFile) {
        const jsonPath = path.resolve(jsonFile);
        const jsonData = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

        if (Array.isArray(jsonData)) {
            // Batch create multiple posts
            for (const postData of jsonData) {
                await this.createPost(postData);
                console.log(`✅ Created post: ${postData.title}`);
            }
        } else {
            // Single post
            await this.createPost(jsonData);
        }
    }

    // AI-powered content generation mode
    async aiGenerateMode() {
        console.log('🤖 AI Content Generation Mode');
        console.log('This would integrate with OpenAI/Claude API to generate content');
        console.log('For now, creating a sample post with AI-focused content...\n');

        const aiPost = {
            title: "AI-Powered Business Automation: 5 Tools That Will Transform Your Workflow in 2024",
            author: "AI Content Generator",
            authorTitle: "Automation Specialist",
            category: "AI & ML",
            excerpt: "Discover the cutting-edge AI tools that successful businesses are using to automate repetitive tasks and boost productivity by 300%.",
            readTime: 8,
            tags: ["AI", "Automation", "Business", "Productivity", "Workflow"],
            featured: false,
            authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
            featuredImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
            content: this.getAIGeneratedContent()
        };

        await this.createPost(aiPost);
    }

    // Create the actual blog post
    async createPost(postData) {
        // Generate slug from title
        const slug = this.generateSlug(postData.title);
        postData.slug = slug;
        postData.id = slug;
        postData.publishDate = new Date().toISOString().split('T')[0];

        // Set metadata
        postData.metaDescription = postData.excerpt.substring(0, 160);
        postData.keywords = postData.tags.join(', ').toLowerCase();
        postData.authorBio = postData.authorBio || `${postData.author} is a specialist in ${postData.category.toLowerCase()} and has been helping businesses optimize their operations for over 5 years.`;

        // Create HTML file
        await this.createHtmlFile(postData);

        // Update posts.json
        await this.updatePostsJson(postData);

        console.log('🎉 Blog post created successfully!');
        console.log(`📁 File: blog/posts/${slug}.html`);
        console.log(`🔗 URL: /blog/posts/${slug}.html`);
        console.log(`📊 Database updated: blog/posts.json`);

        if (postData.featured) {
            console.log('⭐ This post is set as FEATURED');
        }
    }

    // Create HTML file from template
    async createHtmlFile(postData) {
        let template = await fs.readFile(this.templatePath, 'utf8');

        // Replace all placeholders
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
            '[AUTHOR_TWITTER]': postData.authorTwitter || '#',
            '[AUTHOR_LINKEDIN]': postData.authorLinkedIn || '#',
            '[POST_TAGS]': this.generateTagsHtml(postData.tags),
            '[RELATED_POSTS]': this.generateRelatedPostsHtml(postData.category)
        };

        for (const [placeholder, value] of Object.entries(replacements)) {
            template = template.replace(new RegExp(placeholder, 'g'), value);
        }

        const filePath = path.join(this.postsDir, `${postData.slug}.html`);
        await fs.writeFile(filePath, template, 'utf8');
    }

    // Update posts.json database
    async updatePostsJson(postData) {
        let postsData;

        try {
            const jsonContent = await fs.readFile(this.postsJsonPath, 'utf8');
            postsData = JSON.parse(jsonContent);
        } catch (error) {
            // Create new posts.json if it doesn't exist
            postsData = { posts: [], categories: this.getDefaultCategories() };
        }

        // If this is a featured post, unfeature others
        if (postData.featured) {
            postsData.posts.forEach(post => post.featured = false);
        }

        // Add new post
        const postEntry = {
            id: postData.id,
            title: postData.title,
            slug: postData.slug,
            excerpt: postData.excerpt,
            author: postData.author,
            authorTitle: postData.authorTitle,
            authorImage: postData.authorImage,
            authorBio: postData.authorBio,
            authorTwitter: postData.authorTwitter,
            authorLinkedIn: postData.authorLinkedIn,
            category: postData.category,
            tags: postData.tags,
            publishDate: postData.publishDate,
            readTime: postData.readTime,
            featured: postData.featured,
            featuredImage: postData.featuredImage,
            metaDescription: postData.metaDescription,
            keywords: postData.keywords
        };

        postsData.posts.unshift(postEntry); // Add to beginning

        await fs.writeFile(this.postsJsonPath, JSON.stringify(postsData, null, 2), 'utf8');
    }

    // Helper methods
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    getArgValue(args, flag) {
        const index = args.indexOf(flag);
        return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
    }

    async selectCategory(rl) {
        console.log('\nAvailable categories:');
        this.categories.forEach((cat, index) => {
            console.log(`${index + 1}. ${cat}`);
        });

        const choice = await new Promise(resolve =>
            rl.question('Select category (number): ', resolve)
        );

        const categoryIndex = parseInt(choice) - 1;
        return this.categories[categoryIndex] || this.categories[0];
    }

    generateTagsHtml(tags) {
        return tags.map(tag => `<span class="tag">${tag}</span>`).join('\n                        ');
    }

    generateRelatedPostsHtml(category) {
        return `<!-- Related posts for ${category} would be dynamically generated here -->`;
    }

    getDefaultContent() {
        return `
            <h2>Introduction</h2>
            <p>Welcome to this comprehensive guide on business optimization and AI-powered solutions. In this article, we'll explore the latest trends and strategies that can transform your business operations.</p>

            <h2>Key Benefits</h2>
            <ul>
                <li>Increased operational efficiency by up to 40%</li>
                <li>Reduced manual tasks through intelligent automation</li>
                <li>Enhanced decision-making with data-driven insights</li>
                <li>Improved customer experience and satisfaction</li>
            </ul>

            <h2>Implementation Strategy</h2>
            <p>Successful implementation requires a strategic approach that considers your unique business needs and objectives. Here's how to get started:</p>

            <ol>
                <li><strong>Assessment:</strong> Analyze current processes and identify optimization opportunities</li>
                <li><strong>Planning:</strong> Develop a comprehensive roadmap for transformation</li>
                <li><strong>Execution:</strong> Implement solutions in phases with continuous monitoring</li>
                <li><strong>Optimization:</strong> Refine and improve based on performance data</li>
            </ol>

            <h2>Conclusion</h2>
            <p>By leveraging AI-powered optimization strategies, businesses can achieve significant improvements in efficiency, productivity, and profitability. The key is to start with a clear strategy and implement solutions that align with your specific objectives.</p>
        `;
    }

    getAIGeneratedContent() {
        return `
            <h2>The AI Revolution in Business Automation</h2>
            <p>The landscape of business automation has fundamentally shifted in 2024. What once required extensive manual configuration and programming can now be achieved through intelligent AI systems that learn, adapt, and optimize themselves.</p>

            <p>In this comprehensive guide, we'll explore five cutting-edge AI tools that are transforming how businesses operate, enabling them to achieve unprecedented levels of efficiency and productivity.</p>

            <h2>1. Intelligent Process Mining: Celonis AI</h2>
            <p>Process mining has evolved beyond simple workflow visualization. Celonis AI now uses machine learning to automatically identify bottlenecks, predict process failures, and suggest optimizations in real-time.</p>

            <h3>Key Features:</h3>
            <ul>
                <li>Automated process discovery and mapping</li>
                <li>Predictive analytics for process optimization</li>
                <li>Real-time monitoring and alerts</li>
                <li>AI-powered recommendations for improvement</li>
            </ul>

            <blockquote>
                "Celonis AI reduced our process analysis time from weeks to hours, while identifying $2M in annual savings we never knew existed." - Sarah Johnson, COO at TechFlow Industries
            </blockquote>

            <h2>2. Conversational AI for Customer Service</h2>
            <p>Modern AI chatbots have transcended simple FAQ responses. Tools like ChatGPT Enterprise and Claude for Business can handle complex customer inquiries, process orders, and even resolve technical issues with human-like understanding.</p>

            <h2>3. Automated Document Processing: UiPath Document AI</h2>
            <p>Gone are the days of manual data entry. UiPath's Document AI can process invoices, contracts, forms, and reports with 99.7% accuracy, extracting relevant information and routing it to appropriate systems automatically.</p>

            <h2>4. Predictive Inventory Management</h2>
            <p>AI-powered inventory systems now predict demand fluctuations with remarkable accuracy, automatically adjusting stock levels, predicting supply chain disruptions, and optimizing procurement schedules.</p>

            <h2>5. Intelligent Financial Planning: Anaplan AI</h2>
            <p>Financial planning has become proactive rather than reactive. Anaplan AI analyzes market trends, internal performance data, and external factors to provide accurate forecasting and scenario planning.</p>

            <h2>Implementation Best Practices</h2>
            <p>Successfully implementing these AI tools requires strategic planning:</p>

            <ol>
                <li><strong>Start with high-impact, low-complexity processes</strong> to build confidence and demonstrate ROI</li>
                <li><strong>Ensure data quality</strong> - AI tools are only as good as the data they process</li>
                <li><strong>Invest in employee training</strong> to maximize adoption and effectiveness</li>
                <li><strong>Monitor and optimize continuously</strong> - AI systems improve with feedback and usage</li>
            </ol>

            <h2>Measuring Success</h2>
            <p>Track these key metrics to measure the impact of your AI automation initiatives:</p>

            <ul>
                <li>Process cycle time reduction</li>
                <li>Error rate decrease</li>
                <li>Employee productivity increase</li>
                <li>Customer satisfaction improvements</li>
                <li>Cost savings and ROI</li>
            </ul>

            <h2>Looking Ahead: The Future of AI Automation</h2>
            <p>As we move through 2024, we can expect even more sophisticated AI tools that will further blur the line between human and machine capabilities. The businesses that start implementing these solutions now will have a significant competitive advantage.</p>

            <p>The key is not to automate for the sake of automation, but to strategically implement AI tools that solve real business problems and create measurable value.</p>
        `;
    }

    getDefaultCategories() {
        return [
            { name: "All Posts", slug: "all", description: "All blog posts" },
            { name: "Web Design", slug: "web-design", description: "Latest trends in web design" },
            { name: "AI & ML", slug: "ai-ml", description: "Artificial Intelligence insights" },
            { name: "Development", slug: "development", description: "Web development tips" },
            { name: "SEO", slug: "seo", description: "Search engine optimization" },
            { name: "Business", slug: "business", description: "Business optimization strategies" }
        ];
    }
}

// Run the script
if (require.main === module) {
    const creator = new BlogPostCreator();
    creator.run();
}

module.exports = BlogPostCreator;