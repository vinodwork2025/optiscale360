#!/usr/bin/env node
/**
 * SANITY CMS SETUP FOR OPTISCALE 360 BLOG
 * Professional content management with beautiful admin interface
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Sanity CMS for OptiScale 360...');

// Create Sanity project structure
const createSanityProject = () => {
    // Create sanity directory
    const sanityDir = './sanity-studio';
    if (!fs.existsSync(sanityDir)) {
        fs.mkdirSync(sanityDir, { recursive: true });
    }

    // Create schemas directory
    const schemasDir = `${sanityDir}/schemas`;
    if (!fs.existsSync(schemasDir)) {
        fs.mkdirSync(schemasDir, { recursive: true });
    }

    console.log('✅ Created Sanity project structure');
};

// Sanity configuration
const sanityConfig = `import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {imageUrlBuilder} from '@sanity/image-url'

import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'optiscale360-blog',
  title: 'OptiScale 360 Blog',

  projectId: 'your-project-id', // Get this from sanity.io
  dataset: 'production',

  plugins: [
    deskTool(),
    visionTool(),
    colorInput()
  ],

  schema: {
    types: schemaTypes,
  },

  studio: {
    components: {
      navbar: () => null // Clean interface
    }
  }
})`;

// Blog post schema
const blogPostSchema = `export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  icon: () => '📝',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().max(100).warning('Keep titles under 100 characters for SEO')
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(160).warning('Keep meta descriptions under 160 characters')
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().max(300)
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: Rule => Rule.required()
        }
      ]
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(60)
    },
    {
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Mark this post as featured to highlight it'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }
          ]
        },
        {
          type: 'code',
          options: {
            language: 'javascript',
            languageAlternatives: [
              {title: 'JavaScript', value: 'javascript'},
              {title: 'HTML', value: 'html'},
              {title: 'CSS', value: 'css'},
              {title: 'Python', value: 'python'},
              {title: 'JSON', value: 'json'}
            ]
          }
        }
      ]
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}]
        },
        {
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean',
          description: 'Prevent search engines from indexing this post'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'featuredImage',
      category: 'category.title'
    },
    prepare(selection) {
      const {author, category} = selection
      return Object.assign({}, selection, {
        subtitle: \`by \${author} in \${category}\`
      })
    }
  }
}`;

// Category schema
const categorySchema = `export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: () => '🏷️',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'color',
      title: 'Color',
      type: 'color',
      options: {
        disableAlpha: true
      }
    }
  ]
}`;

// Author schema
const authorSchema = `export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: () => '👤',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      }
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      }
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text'
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },
    {
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'url'
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url'
        },
        {
          name: 'website',
          title: 'Website',
          type: 'url'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image'
    }
  }
}`;

// Schema index
const schemaIndex = `import blogPost from './blogPost'
import category from './category'
import author from './author'

export const schemaTypes = [
  blogPost,
  category,
  author
]`;

// Package.json for Sanity
const sanityPackageJson = `{
  "name": "optiscale360-sanity-studio",
  "private": true,
  "version": "1.0.0",
  "description": "Sanity Studio for OptiScale 360 Blog",
  "main": "package.json",
  "scripts": {
    "dev": "sanity dev",
    "start": "sanity dev",
    "build": "sanity build",
    "deploy": "sanity deploy"
  },
  "keywords": [
    "sanity"
  ],
  "dependencies": {
    "@sanity/color-input": "^3.0.0",
    "@sanity/image-url": "^1.0.2",
    "@sanity/vision": "^3.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sanity": "^3.0.0"
  },
  "devDependencies": {
    "@sanity/eslint-config-studio": "^3.0.0"
  }
}`;

// Environment variables template
const envTemplate = `# Sanity Configuration
SANITY_PROJECT_ID=your-project-id-here
SANITY_DATASET=production
SANITY_API_VERSION=2023-05-03

# Get these from https://sanity.io/manage
# 1. Create new project
# 2. Get Project ID
# 3. Create API token with Editor permissions`;

// API integration script
const sanityApiScript = `// Sanity API integration for OptiScale 360
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
  apiVersion: '2023-05-03',
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// Fetch all published blog posts
export async function getAllPosts() {
  return client.fetch(\`
    *[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishDate desc) {
      _id,
      title,
      slug,
      metaDescription,
      excerpt,
      featuredImage,
      category->{
        title,
        slug,
        color
      },
      tags,
      author->{
        name,
        image,
        bio,
        social
      },
      publishDate,
      readTime,
      featured,
      content,
      seo
    }
  \`)
}

// Fetch single post by slug
export async function getPostBySlug(slug) {
  return client.fetch(\`
    *[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      metaDescription,
      excerpt,
      featuredImage,
      category->{
        title,
        slug,
        color
      },
      tags,
      author->{
        name,
        image,
        bio,
        social
      },
      publishDate,
      readTime,
      featured,
      content,
      seo
    }
  \`, { slug })
}

// Fetch all categories
export async function getCategories() {
  return client.fetch(\`
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      color
    }
  \`)
}

export default client`;

// Create all files
createSanityProject();

// Write configuration files
fs.writeFileSync('./sanity-studio/sanity.config.ts', sanityConfig);
fs.writeFileSync('./sanity-studio/package.json', sanityPackageJson);
fs.writeFileSync('./sanity-studio/.env.template', envTemplate);

// Write schemas
fs.writeFileSync('./sanity-studio/schemas/index.ts', schemaIndex);
fs.writeFileSync('./sanity-studio/schemas/blogPost.ts', blogPostSchema);
fs.writeFileSync('./sanity-studio/schemas/category.ts', categorySchema);
fs.writeFileSync('./sanity-studio/schemas/author.ts', authorSchema);

// Write API integration
fs.writeFileSync('./sanity-api.js', sanityApiScript);

console.log('\n🎉 SANITY CMS SETUP COMPLETE!');
console.log('\n📁 Created Files:');
console.log('✅ ./sanity-studio/ - Complete Sanity Studio');
console.log('✅ ./sanity-studio/schemas/ - Content schemas');
console.log('✅ ./sanity-api.js - API integration');

console.log('\n🚀 NEXT STEPS:');
console.log('1. Go to https://sanity.io/manage');
console.log('2. Create new project "OptiScale 360 Blog"');
console.log('3. Copy Project ID to .env file');
console.log('4. cd sanity-studio && npm install');
console.log('5. npm run dev (starts Sanity Studio)');
console.log('6. Add content through beautiful admin interface');

console.log('\n🎯 BENEFITS:');
console.log('✅ Professional admin interface');
console.log('✅ Rich text editor with SEO optimization');
console.log('✅ Image management and optimization');
console.log('✅ Real-time content updates');
console.log('✅ Multi-author support');
console.log('✅ Category and tag management');
console.log('✅ SEO fields built-in');
console.log('✅ Mobile-friendly editing');

console.log('\n💡 ADMIN URL: http://localhost:3333 (after setup)');