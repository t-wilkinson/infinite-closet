export const socialMediaLinks = {
  facebook: 'https://www.facebook.com/InfiniteClosetUK',
  instagram: 'https://www.instagram.com/infinitecloset.uk',
  twitter: 'https://twitter.com/_infinitecloset',
  tiktok: 'https://www.tiktok.com/@infinitecloset',
}

export const rentalLengths = {
  short: 4 - 1,
  long: 8 - 1,
}

export const routes = [
  {
    label: 'How It Works',
    value: 'howitworks',
    href: '/#how-it-works',
    img: 'how-it-works.png',
    data: [
      {
        label: null,
        href: '/',
        value: 'howitworks',
        type: 'href',
        data: [
          { name: 'How It Works', slug: '#how-it-works' },
          { name: 'Why Rent?', slug: '#why-rent' },
          { name: 'About Us', slug: 'about-us' },
          { name: 'Customer Feedback', slug: '/#reviews' },
          { name: 'Ambassador Program', slug: null },
        ],
      },
    ],
  },
  {
    label: 'Clothing',
    value: 'clothing',
    href: '/products/clothing',
    img: 'clothing.png',
    data: [
      {
        label: 'All Clothing',
        href: '/products/clothing',
        value: 'clothing',
        type: 'slug',
        data: [
          { name: 'Dresses', slug: 'dresses' },
          { name: 'Jumpsuits', slug: 'jumpsuits' },
          { name: 'Gowns', slug: 'gowns' },
          { name: 'Tops', slug: 'tops' },
          { name: 'Outerwear', slug: 'outerwear' },
          { name: 'Pants', slug: 'pants' },
          { name: 'Skirts', slug: 'skirts' },
          { name: 'Maternity', slug: 'maternity' },
        ],
      },
      {
        label: 'All Occasions',
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
    href: '/products/accessories',
    img: 'accessories.png',
    data: [
      {
        label: 'All Accessories',
        href: '/products/accessories',
        value: 'accessories',
        type: 'slug',
        data: [
          { name: 'Jewelry', slug: 'jewelry' },
          { name: 'Bags', slug: 'bags' },
        ],
      },
    ],
  },
  {
    label: 'Trending',
    value: 'trending',
    href: null,
    img: 'trending.png',
    data: [
      {
        label: null,
        href: '/products',
        type: 'slug',
        data: [
          { name: 'New In', slug: null /* 'new-in' */ },
          { name: 'Our Picks', slug: null /* 'our-picks' */ },
          { name: 'Top Rated', slug: null },
          { name: 'Brand Spotlight', slug: null },
        ],
      },
    ],
  },
  {
    label: 'Designers',
    value: 'designers',
    href: '/designers',
    img: null, // '/media/brand/facebook-banner.png',
    data: [],
  },
  {
    label: 'Blogs',
    value: 'blogs',
    href: '/blogs',
    img: 'how-it-works.png',
    data: [],
  },
] as const

export type Routes = typeof routes
