export default {
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
}