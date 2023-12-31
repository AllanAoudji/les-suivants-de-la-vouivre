import { defineField, defineType } from 'sanity';
import { BiDetail } from 'react-icons/bi';

export default defineType({
  name: 'post',
  title: 'Posts',
  type: 'document',
  icon: BiDetail,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'headerImage',
      title: 'Image de header',
      type: 'image',
      description:
        "image 3:5 (ex. 1080x648). L'image principale sera utiliser si l'image de header est vide.",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
  orderings: [
    {
      title: 'Date de publication, new',
      name: 'publishedAtDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' },
        { field: 'slug.current', direction: 'desc' },
      ],
    },
    {
      title: 'Date de publication, old',
      name: 'publishedAtAsc',
      by: [
        { field: 'publishedAt', direction: 'asc' },
        { field: 'slug.current', direction: 'desc' },
      ],
    },
    {
      title: 'Titre, asc',
      name: 'SlugAsc',
      by: [{ field: 'slug.current', direction: 'asc' }],
    },
    {
      title: 'Title, desc',
      name: 'SlugDesc',
      by: [{ field: 'slug.current', direction: 'desc' }],
    },
  ],
});
