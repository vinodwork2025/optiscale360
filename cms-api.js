import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'n8rucjn3',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true
});

// Content API functions
export class ContentAPI {

  // Business Templates
  async getBusinessTemplates() {
    return await client.fetch(`
      *[_type == "businessTemplate"] | order(publishedAt desc) {
        _id,
        title,
        category,
        description,
        downloadUrl,
        featured,
        publishedAt
      }
    `);
  }

  async getBusinessTemplatesByCategory() {
    const templates = await this.getBusinessTemplates();
    return templates.reduce((acc, template) => {
      const category = template.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(template);
      return acc;
    }, {});
  }

  // Best Practices
  async getBestPractices() {
    return await client.fetch(`
      *[_type == "bestPractice"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        summary,
        content,
        category,
        publishedAt
      }
    `);
  }

  async getBestPracticeBySlug(slug) {
    return await client.fetch(`
      *[_type == "bestPractice" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        summary,
        content,
        category,
        publishedAt
      }
    `, { slug });
  }

  // Industry Insights
  async getIndustryInsights() {
    return await client.fetch(`
      *[_type == "industryInsight"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        summary,
        content,
        industry,
        featured,
        publishedAt
      }
    `);
  }

  async getFeaturedInsights() {
    return await client.fetch(`
      *[_type == "industryInsight" && featured == true] | order(publishedAt desc) {
        _id,
        title,
        slug,
        summary,
        industry,
        publishedAt
      }
    `);
  }

  // Webinars & Training
  async getUpcomingWebinars() {
    return await client.fetch(`
      *[_type == "webinar" && eventDate > now()] | order(eventDate asc) {
        _id,
        title,
        description,
        eventDate,
        duration,
        type,
        registrationUrl,
        featured
      }
    `);
  }

  async getAllWebinars() {
    return await client.fetch(`
      *[_type == "webinar"] | order(eventDate desc) {
        _id,
        title,
        description,
        eventDate,
        duration,
        type,
        registrationUrl,
        featured
      }
    `);
  }

  // FAQ
  async getFAQs() {
    return await client.fetch(`
      *[_type == "faq"] | order(order asc) {
        _id,
        question,
        answer,
        category,
        order
      }
    `);
  }

  async getFAQsByCategory() {
    const faqs = await this.getFAQs();
    return faqs.reduce((acc, faq) => {
      const category = faq.category || 'general';
      if (!acc[category]) acc[category] = [];
      acc[category].push(faq);
      return acc;
    }, {});
  }

  // Utility function to convert Sanity block content to HTML
  blockToHtml(blocks) {
    if (!blocks) return '';

    return blocks.map(block => {
      if (block._type === 'block') {
        const style = block.style || 'normal';
        const children = block.children.map(child => {
          let text = child.text || '';

          if (child.marks) {
            child.marks.forEach(mark => {
              switch (mark) {
                case 'strong':
                  text = `<strong>${text}</strong>`;
                  break;
                case 'em':
                  text = `<em>${text}</em>`;
                  break;
                case 'code':
                  text = `<code>${text}</code>`;
                  break;
              }
            });
          }

          return text;
        }).join('');

        switch (style) {
          case 'h1':
            return `<h1>${children}</h1>`;
          case 'h2':
            return `<h2>${children}</h2>`;
          case 'h3':
            return `<h3>${children}</h3>`;
          case 'h4':
            return `<h4>${children}</h4>`;
          case 'blockquote':
            return `<blockquote>${children}</blockquote>`;
          default:
            return `<p>${children}</p>`;
        }
      } else if (block._type === 'image') {
        return `<img src="${this.getImageUrl(block)}" alt="${block.alt || ''}" />`;
      }

      return '';
    }).join('\n');
  }

  // Generate image URL from Sanity asset
  getImageUrl(image) {
    if (!image.asset) return '';
    const ref = image.asset._ref;
    const [id, dimensions, format] = ref.replace('image-', '').split('-');
    return `https://cdn.sanity.io/images/n8rucjn3/production/${id}-${dimensions}.${format}`;
  }
}

// Global instance
export const contentAPI = new ContentAPI();