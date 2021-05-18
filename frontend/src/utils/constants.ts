export const socialMediaLinks = {
  facebook: 'https://www.facebook.com/InfiniteClosetUK',
  instagram: 'https://www.instagram.com/infinitecloset.uk',
  twitter: 'https://twitter.com/_infinitecloset',
  tiktok: 'https://www.tiktok.com/@infinitecloset',
}

const clothingPath = process.env.NEXT_PUBLIC_RELEASE
  ? '/products/clothing'
  : null

// TODO: if href starts with `/`, consider it absolute, otherwise, hrefs.join('/')
const routes = [
  {
    label: 'Plans',
    value: 'plans',
    href: null,
    img: null,
    data: [
      {
        label: 'Category',
        href: null,
        data: [
          { label: 'How it works', href: null },
          { label: 'Membership', href: null },
          { label: 'Pick a plan', href: null },
          { label: 'Customer feedback', href: null },
          { label: 'Ambassador program', href: null },
          { label: 'University partners', href: null },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
  {
    label: 'Trending',
    value: 'trending',
    href: null,
    type: 'path',
    img: null,
    data: [
      {
        label: 'Category',
        href: null,
        type: 'query',
        data: [
          { label: 'Popular', href: null },
          { label: 'New In', href: null },
          { label: 'Top rated', href: null },
          { label: 'Our edit picks', href: null },
          { label: 'Brand spotlight', href: null },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
  {
    label: 'Clothing',
    value: 'clothing',
    href: clothingPath,
    img: null,
    data: [
      {
        label: 'Category',
        href: clothingPath,
        type: 'query',
        data: [
          { label: 'Dresses', href: clothingPath },
          { label: 'Tops', href: clothingPath },
          { label: 'Outerwear', href: clothingPath },
          { label: 'Pants', href: clothingPath },
          { label: 'Skirts', href: clothingPath },
          { label: 'Gowns', href: clothingPath },
          { label: 'Jumpsuits', href: clothingPath },
          { label: 'Maternity', href: clothingPath },
          { label: 'Jumpers', href: clothingPath },
        ],
      },
      {
        label: 'Occasions',
        href: null,
        data: [
          { label: 'Wedding', href: null },
          {
            label: 'Night Out',
            href: null,
          },
          { label: 'Dinner', href: null },
          {
            label: 'Date night',
            href: null,
          },
          { label: 'Office', href: null },
          {
            label: 'WFH & Loungewear',
            href: null,
          },
          { label: 'Brunch', href: null },
          { label: 'Party', href: null },
          { label: 'Weekend', href: null },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
  {
    label: 'Accessories',
    value: 'accessories',
    href: null,
    img: null,
    data: [
      {
        label: 'Category',
        href: null,
        data: [
          { label: 'Bags', href: null },
          { label: 'Jewelry', href: null },
          { label: 'Bridal', href: null },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
  // {
  //   label: 'Designers',
  //   value: 'designers',
  //   href: null,
  //   img: null,
  //   data: [
  //     {
  //       label: 'Category',
  //       href: null,
  //       data: [],
  //     },
  //     {
  //       label: 'Trending Now',
  //       href: null,
  //       data: [],
  //     },
  //     { label: 'More coming soon!', href: '/coming-soon', data: [] },
  //   ],
  // },
  {
    label: 'Sale',
    value: 'sale',
    href: null,
    img: null,
    data: [
      {
        label: 'Category',
        href: null,
        data: [
          { label: 'Under £50', href: null },
          { label: 'Under £100', href: null },
          { label: 'Under £150', href: null },
          { label: 'Under £200', href: null },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
  {
    label: 'Blog',
    value: 'blog',
    href: null,
    img: null,
    data: [
      {
        label: 'Category',
        href: null,
        data: [
          { label: 'Featured', href: null },
          { label: 'Popular', href: null },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
] as const

export { routes }
export type Routes = typeof routes
