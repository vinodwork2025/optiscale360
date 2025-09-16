import {defineConfig} from 'sanity'
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
})