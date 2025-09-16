import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'n8rucjn3',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

export default client