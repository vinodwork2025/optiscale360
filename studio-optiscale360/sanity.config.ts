import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

// Define schemas for OptiScale 360
const schemaTypes = [
  {
    name: 'businessTemplate',
    title: 'Business Template',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Template Title',
        type: 'string',
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
        options: {
          list: [
            {title: 'Strategic Planning', value: 'strategic'},
            {title: 'Financial Templates', value: 'financial'},
            {title: 'Operations', value: 'operations'},
            {title: 'Marketing', value: 'marketing'},
            {title: 'HR & People', value: 'hr'},
            {title: 'Project Management', value: 'project'}
          ]
        },
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text'
      },
      {
        name: 'downloadUrl',
        title: 'Download URL',
        type: 'url'
      },
      {
        name: 'featured',
        title: 'Featured Template',
        type: 'boolean',
        initialValue: false
      },
      {
        name: 'publishedAt',
        title: 'Published at',
        type: 'datetime',
        initialValue: () => new Date().toISOString()
      }
    ],
    preview: {
      select: {
        title: 'title',
        category: 'category'
      },
      prepare(selection: any) {
        const {title, category} = selection;
        return {
          title: title,
          subtitle: category || 'Uncategorized'
        };
      }
    }
  },
  {
    name: 'bestPractice',
    title: 'Best Practice',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Practice Title',
        type: 'string',
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96
        },
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'summary',
        title: 'Summary',
        type: 'text',
        rows: 3
      },
      {
        name: 'content',
        title: 'Content',
        type: 'array',
        of: [
          {
            type: 'block'
          },
          {
            type: 'image',
            options: {hotspot: true}
          }
        ]
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
        options: {
          list: [
            {title: 'Strategic Planning', value: 'strategy'},
            {title: 'Operations Excellence', value: 'operations'},
            {title: 'Process Improvement', value: 'process'},
            {title: 'Leadership', value: 'leadership'},
            {title: 'Technology', value: 'technology'},
            {title: 'Performance Metrics', value: 'metrics'}
          ]
        }
      },
      {
        name: 'publishedAt',
        title: 'Published at',
        type: 'datetime',
        initialValue: () => new Date().toISOString()
      }
    ]
  },
  {
    name: 'industryInsight',
    title: 'Industry Insight',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Insight Title',
        type: 'string',
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96
        }
      },
      {
        name: 'summary',
        title: 'Summary',
        type: 'text',
        rows: 3
      },
      {
        name: 'content',
        title: 'Full Content',
        type: 'array',
        of: [
          {
            type: 'block'
          },
          {
            type: 'image',
            options: {hotspot: true}
          }
        ]
      },
      {
        name: 'industry',
        title: 'Industry',
        type: 'string',
        options: {
          list: [
            {title: 'Technology', value: 'tech'},
            {title: 'Healthcare', value: 'healthcare'},
            {title: 'Manufacturing', value: 'manufacturing'},
            {title: 'Finance', value: 'finance'},
            {title: 'Retail', value: 'retail'},
            {title: 'General', value: 'general'}
          ]
        }
      },
      {
        name: 'featured',
        title: 'Featured Insight',
        type: 'boolean',
        initialValue: false
      },
      {
        name: 'publishedAt',
        title: 'Published at',
        type: 'datetime',
        initialValue: () => new Date().toISOString()
      }
    ]
  },
  {
    name: 'webinar',
    title: 'Webinar/Training',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Event Title',
        type: 'string',
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text'
      },
      {
        name: 'eventDate',
        title: 'Event Date',
        type: 'datetime',
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'duration',
        title: 'Duration',
        type: 'string',
        placeholder: 'e.g., 2 hours'
      },
      {
        name: 'type',
        title: 'Event Type',
        type: 'string',
        options: {
          list: [
            {title: 'Webinar', value: 'webinar'},
            {title: 'Workshop', value: 'workshop'},
            {title: 'Masterclass', value: 'masterclass'},
            {title: 'Training Session', value: 'training'}
          ]
        }
      },
      {
        name: 'registrationUrl',
        title: 'Registration URL',
        type: 'url'
      },
      {
        name: 'featured',
        title: 'Featured Event',
        type: 'boolean',
        initialValue: false
      }
    ]
  },
  {
    name: 'faq',
    title: 'FAQ',
    type: 'document',
    fields: [
      {
        name: 'question',
        title: 'Question',
        type: 'string',
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'answer',
        title: 'Answer',
        type: 'array',
        of: [{type: 'block'}]
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
        options: {
          list: [
            {title: 'General', value: 'general'},
            {title: 'Services', value: 'services'},
            {title: 'Pricing', value: 'pricing'},
            {title: 'Support', value: 'support'},
            {title: 'Technical', value: 'technical'}
          ]
        }
      },
      {
        name: 'order',
        title: 'Display Order',
        type: 'number',
        initialValue: 10
      }
    ],
    orderings: [
      {
        title: 'Display Order',
        name: 'displayOrder',
        by: [
          {field: 'order', direction: 'asc'}
        ]
      }
    ]
  }
]

export default defineConfig({
  name: 'optiscale360',
  title: 'OptiScale 360 CMS',
  projectId: 'qxn2e29n',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Business Templates')
              .child(
                S.documentTypeList('businessTemplate')
                  .title('Business Templates')
              ),
            S.listItem()
              .title('Best Practices')
              .child(
                S.documentTypeList('bestPractice')
                  .title('Best Practices')
              ),
            S.listItem()
              .title('Industry Insights')
              .child(
                S.documentTypeList('industryInsight')
                  .title('Industry Insights')
              ),
            S.listItem()
              .title('Webinars & Training')
              .child(
                S.documentTypeList('webinar')
                  .title('Webinars & Training')
              ),
            S.listItem()
              .title('FAQs')
              .child(
                S.documentTypeList('faq')
                  .title('FAQs')
              ),
          ])
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes
  }
})