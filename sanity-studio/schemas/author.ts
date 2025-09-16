export default {
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
}