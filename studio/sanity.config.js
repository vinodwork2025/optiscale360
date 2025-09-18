import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemas } from '../sanity.config.js'

export default defineConfig({
  name: 'optiscale360',
  title: 'OptiScale 360 CMS',
  projectId: 'n8rucjn3',
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
    types: schemas
  }
})