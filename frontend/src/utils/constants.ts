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
        href: null,
        data: [
          { label: 'How It Works', href: '/#how-it-works' },
          { label: 'Why Rent?', href: '/#why-rent' },
          { label: 'About Us', href: '/about-us' },
          { label: 'Customer Feedback', href: null },
          { label: 'Ambassador Program', href: null },
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
        data: [
          { label: 'Dresses', href: '/products/clothing/dresses' }, // TODO: more dynamic href
          { label: 'Jumpsuits', href: '/products/clothing/jumpsuits' },
          { label: 'Gowns', href: '/products/clothing/gowns' },
          { label: 'Tops', href: null },
          { label: 'Outerwear', href: null },
          { label: 'Pants', href: null },
          { label: 'Skirts', href: null },
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
    label: 'Trending',
    value: 'trending',
    href: null,
    type: 'path',
    img: 'trending-menu-image.jpg',
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
    label: 'Accessories',
    value: 'accessories',
    href: null,
    img: 'accessories-menu-image.jpg',
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
