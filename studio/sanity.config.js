import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

export default defineConfig({
  name: 'default',
  title: 'OptilScale360',

  projectId: 'n8rucjn3',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [
      {
        name: 'post',
        title: 'Post',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
          },
          {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
              source: 'title',
              maxLength: 96,
            },
          },
          {
            name: 'content',
            title: 'Content',
            type: 'text',
          },
          {
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
          },
        ],
      },
    ],
  },

  api: {
    projectId: 'n8rucjn3',
    dataset: 'production'
  }
})