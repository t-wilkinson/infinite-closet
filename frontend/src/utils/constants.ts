export const socialMediaLinks = {
  facebook: 'https://www.facebook.com/InfiniteClosetUK',
  instagram: 'https://www.instagram.com/infinitecloset.uk',
  twitter: 'https://twitter.com/_infinitecloset',
  tiktok: 'https://www.tiktok.com/@infinitecloset',
}

const imgs = [
  'Elegant-pieces-you_ll-keep-forever-1.png',
  'Elegant-pieces-you_ll-keep-forever-2.png',
  'IMG_0457.jpg',
  'IMG_0461.jpg',
  'IMG_0459.jpg',
  'IMG_0458.jpg',
]

const routes = [
  {
    label: 'How It Works',
    value: 'howitworks',
    href: null,
    img: imgs[0],
    data: [
      {
        label: null,
        href: null,
        data: [
          { label: 'How it works', href: null },
          { label: 'About Us', href: null },
          { label: 'Customer feedback', href: null },
          { label: 'Ambassador program', href: null },
        ],
      },
    ],
  },
  {
    label: 'Trending',
    value: 'trending',
    href: null,
    type: 'path',
    img: imgs[1],
    data: [
      {
        label: null,
        href: null,
        data: [
          { label: 'New In', href: null },
          { label: 'Top Rated', href: null },
          { label: 'Our Picks', href: null },
          { label: 'Brand Spotlight', href: null },
        ],
      },
    ],
  },
  {
    label: 'Clothing',
    value: 'clothing',
    href: '/products/clothing',
    img: imgs[2],
    data: [
      {
        label: 'Category',
        href: '/products/clothing',
        data: [
          { label: 'Dresses', href: '/products/clothing/dresses' }, // TODO: more dynamic href
          { label: 'Jumpsuits', href: '/products/clothing/jumpsuits' },
          { label: 'Tops', href: null },
          { label: 'Outerwear', href: null },
          { label: 'Pants', href: null },
          { label: 'Skirts', href: null },
          { label: 'Gowns', href: null },
          { label: 'Maternity', href: null },
        ],
      },
      {
        label: 'Occasions',
        href: null,
        data: [
          { label: 'Wedding', href: null },
          { label: 'Date Night', href: null },
          { label: 'Party', href: null },
          { label: 'Brunch', href: null },
          { label: 'Office', href: null },
          { label: 'Cocktail', href: null },
        ],
      },
    ],
  },
  {
    label: 'Accessories',
    value: 'accessories',
    href: null,
    img: imgs[3],
    data: [
      {
        label: 'Category',
        href: null,
        data: [
          { label: 'Bags', href: null },
          { label: 'Jewelry', href: null },
        ],
      },
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
  //   ],
  // },
  {
    label: 'Blog',
    value: 'blog',
    href: null,
    img: imgs[4],
    data: [],
  },
] as const

export { routes }
export type Routes = typeof routes
