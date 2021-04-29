export const socialMediaLinks = {
  facebook: 'https://www.facebook.com/InfiniteClosetUK',
  instagram: 'https://www.instagram.com/infinitecloset.uk',
  twitter: 'https://twitter.com/_infinitecloset',
  tiktok: 'https://www.tiktok.com/@infinitecloset',
}

// TODO: if href starts with `/`, consider it absolute, otherwise, hrefs.join('/')
const routes = [
  {
    label: 'Plans',
    value: 'plans',
    href: '/coming-soon',
    img: null,
    data: [
      {
        label: 'Category',
        href: '/coming-soon',
        data: [
          { label: 'How it works', href: '/coming-soon' },
          { label: 'Membership', href: '/coming-soon' },
          { label: 'Pick a plan', href: '/coming-soon' },
          { label: 'Customer feedback', href: '/coming-soon' },
          { label: 'Ambassador program', href: '/coming-soon' },
          { label: 'University partners', href: '/coming-soon' },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
  {
    label: 'Trending',
    value: 'trending',
    href: '/coming-soon',
    type: 'path',
    img: null,
    data: [
      {
        label: 'Category',
        href: '/coming-soon',
        type: 'query',
        data: [
          { label: 'Popular', href: '/coming-soon' },
          { label: 'New In', href: '/coming-soon' },
          { label: 'Top rated', href: '/coming-soon' },
          { label: 'Our edit picks', href: '/coming-soon' },
          { label: 'Brand spotlight', href: '/coming-soon' },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
  {
    label: 'Clothing',
    value: 'clothing',
    href: 'clothing',
    img: null,
    data: [
      {
        label: 'Category',
        href: '/coming-soon',
        type: 'query',
        data: [
          { label: 'Dresses', href: '/coming-soon' },
          { label: 'Tops', href: '/coming-soon' },
          { label: 'Outerwear', href: '/coming-soon' },
          { label: 'Pants', href: '/coming-soon' },
          { label: 'Skirts', href: '/coming-soon' },
          { label: 'Gowns', href: '/coming-soon' },
          { label: 'Jumpsuits', href: '/coming-soon' },
          { label: 'Maternity', href: '/coming-soon' },
          { label: 'Jumpers', href: '/coming-soon' },
        ],
      },
      {
        label: 'Occasions',
        href: '/coming-soon',
        data: [
          { label: 'Wedding', href: '/products/clothing?occasions=wedding' },
          {
            label: 'Night Out',
            href: '/products/clothing?occasions=night_out',
          },
          { label: 'Dinner', href: '/products/clothing?occasions=dinner' },
          {
            label: 'Date night',
            href: '/products/clothing?occasions=date_night',
          },
          { label: 'Office', href: '/products/clothing?occasions=office' },
          {
            label: 'WFH & Loungewear',
            href: '/products/clothing?occasions=wfh',
          },
          { label: 'Brunch', href: '/products/clothing?occasions=brunch' },
          { label: 'Party', href: '/products/clothing?occasions=party' },
          { label: 'Weekend', href: '/products/clothing?occasions=weekend' },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
  {
    label: 'Accessories',
    value: 'accessories',
    href: '/coming-soon',
    img: null,
    data: [
      {
        label: 'Category',
        href: '/coming-soon',
        data: [
          { label: 'Bags', href: '/coming-soon' },
          { label: 'Jewelry', href: '/coming-soon' },
          { label: 'Bridal', href: '/coming-soon' },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
  // {
  //   label: 'Designers',
  //   value: 'designers',
  //   href: '/coming-soon',
  //   img: null,
  //   data: [
  //     {
  //       label: 'Category',
  //       href: '/coming-soon',
  //       data: [],
  //     },
  //     {
  //       label: 'Trending Now',
  //       href: '/coming-soon',
  //       data: [],
  //     },
  //     { label: 'More coming soon!', href: '/coming-soon', data: [] },
  //   ],
  // },
  {
    label: 'Sale',
    value: 'sale',
    href: '/coming-soon',
    img: null,
    data: [
      {
        label: 'Category',
        href: '/coming-soon',
        data: [
          { label: 'Under £50', href: '/coming-soon' },
          { label: 'Under £100', href: '/coming-soon' },
          { label: 'Under £150', href: '/coming-soon' },
          { label: 'Under £200', href: '/coming-soon' },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
  {
    label: 'Blog',
    value: 'blog',
    href: '/coming-soon',
    img: null,
    data: [
      {
        label: 'Category',
        href: '/coming-soon',
        data: [
          { label: 'Featured', href: '/coming-soon' },
          { label: 'Popular', href: '/coming-soon' },
        ],
      },
      { label: 'More coming soon!', href: '/coming-soon', data: [] },
    ],
  },
] as const

export { routes }
export type Routes = typeof routes
