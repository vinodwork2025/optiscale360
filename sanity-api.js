// Sanity API integration for OptiScale 360
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
  return client.fetch(`
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
  `)
}

// Fetch single post by slug
export async function getPostBySlug(slug) {
  return client.fetch(`
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
  `, { slug })
}

// Fetch all categories
export async function getCategories() {
  return client.fetch(`
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      color
    }
  `)
}

export default client