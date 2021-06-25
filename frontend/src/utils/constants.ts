export const socialMediaLinks = {
  facebook: 'https://www.facebook.com/InfiniteClosetUK',
  instagram: 'https://www.instagram.com/infinitecloset.uk',
  twitter: 'https://twitter.com/_infinitecloset',
  tiktok: 'https://www.tiktok.com/@infinitecloset',
}

export const rentalLengths = {
  short: 4,
  long: 8,
}

const routes = [
  {
    label: 'How It Works',
    value: 'howitworks',
    href: '/#how-it-works',
    img: 'how-it-works-menu-image.jpg',
    data: [
      {
        label: null,
        href: '',
        value: 'howitworks',
        type: 'href',
        data: [
          { name: 'How It Works', slug: '#how-it-works' },
          { name: 'Why Rent?', slug: '#why-rent' },
          { name: 'About Us', slug: 'about-us' },
          { name: 'Customer Feedback', slug: null },
          { name: 'Ambassador Program', slug: null },
        ],
      },
    ],
  },
  {
    label: 'Clothing',
    value: 'clothing',
    href: '/products/clothing',
    img: 'clothing-menu-image.jpg',
    data: [
      {
        label: 'Category',
        href: '/products/clothing',
        value: 'clothing',
        type: 'slug',
        data: [
          { name: 'Dresses', slug: 'dresses' }, // TODO: more dynamic href
          { name: 'Jumpsuits', slug: 'jumpsuit' },
          { name: 'Gowns', slug: 'gowns' },
          { name: 'Tops', slug: 'tops' },
          { name: 'Outerwear', slug: 'outerwear' },
          { name: 'Pants', slug: 'pants' },
          { name: 'Skirts', slug: 'skirts' },
          { name: 'Maternity', slug: 'maternity' },
        ],
      },
      {
        label: 'Occasions',
        value: 'occasions',
        href: '/products/clothing',
        type: 'query',
        data: [],
      },
    ],
  },
  {
    label: 'Accessories',
    value: 'accessories',
    href: null,
    img: 'accessories-menu-image.jpg',
    type: null,
    data: [
      {
        label: 'Category',
        href: null,
        data: [
          { name: 'Bags', slug: null },
          { name: 'Jewelry', slug: null },
        ],
      },
    ],
  },
  {
    label: 'Trending',
    value: 'trending',
    href: null,
    type: null,
    img: 'trending-menu-image.jpg',
    data: [
      {
        label: null,
        href: null,
        data: [
          { name: 'New In', slug: null },
          { name: 'Top Rated', slug: null },
          { name: 'Our Picks', slug: null },
          { name: 'Brand Spotlight', slug: null },
        ],
      },
    ],
  },
  {
    label: 'Blogs',
    value: 'blogs',
    href: '/blogs',
    img: 'how-it-works-menu-image.jpg',
    data: [],
  },
] as const

export { routes }
export type Routes = typeof routes
