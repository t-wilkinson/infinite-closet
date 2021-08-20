import React from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

import { Product } from '@/Products/ProductItems'
import { Button } from '@/components'
import Layout from '@/Layout'
import { StrapiProduct } from '@/utils/models'

export const Home = () => {
  const [products, setProducts] = React.useState([])

  React.useEffect(() => {
    const products = ['asher', 'etude-wrap', 'elora', 'juliette-dress']
    axios
      .get(`/products?slug_in=${products.join('&slug_in=')}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <>
      {process.env.NODE_ENV === 'production' && <FacebookMessenger />}
      <div className="w-full items-center w-full">
        <Introduction />
        <ProductItems products={products} />
        <WhyRent />
        <ProductCategories />
        <HowItWorks />
      </div>
    </>
  )
}

const FacebookMessenger = () => (
  <>
    <div id="fb-root" />
    <div id="fb-customer-chat" className="fb-customerchat" />
    <script
      dangerouslySetInnerHTML={{
        __html: `
          var chatbox = document.getElementById('fb-customer-chat');
          chatbox.setAttribute("page_id", "106359464321550");
          chatbox.setAttribute("attribution", "biz_inbox");

          window.fbAsyncInit = function() {
          FB.init({
          xfbml            : true,
          version          : 'v11.0'
          });
          };

          (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = 'https://connect.facebook.net/en_GB/sdk/xfbml.customerchat.js';
          fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));

          `,
      }}
    />
  </>
)

const Heading = ({ block = true, children }) => {
  return (
    <div className="w-full items-center">
      <span className="relative font-bold uppercase text-5xl text-center">
        <h2 className="relative">{children}</h2>
        {block && (
          <div className="w-3/4 bg-pri h-2 -mt-3 absolute bottom-0 right-0" />
        )}
      </span>
    </div>
  )
}

const Introduction = () => (
  <div
    className="relative w-full"
    style={{
      height: '70vh',
    }}
  >
    <Image
      priority={true}
      src="/media/home/sustainable-fashion-rental.png"
      alt="Women enjoying stylish rental dresses"
      layout="fill"
      objectFit="cover"
      objectPosition="center bottom"
    />
    <div
      className="absolute inset-0 xl:hidden"
      style={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
    />
    <div className="justify-start m-8 sm:m-16 relative max-w-md h-full">
      <IntroductionText />
    </div>
  </div>
)

const IntroductionText = () => (
  <div className="text-white">
    <h1
      className="font-bold uppercase text-5xl md:text-5xl mb-4"
      style={{
        lineHeight: '1',
      }}
    >
      Change The Way You Get Dressed
    </h1>
    <span className="mb-8 text-xl leading-tight">
      Support sustainable fashion without breaking the bank by renting with us.
    </span>
    <span>
      <Link href="/products/clothing">
        <a>
          <Button role="cta" className="p-4 text-lg md:text-lg font-bold">
            Find Your Look
          </Button>
        </a>
      </Link>
    </span>
  </div>
)

const whyRent = [
  {
    icon: 'complete-flexibility.svg',
    label: 'Complete Flexibility',
    content:
      'Ever changing styles, sizes, and brands. We’ve got you covered for every occasion, delivered right to your door.',
  },
  {
    icon: 'reduce-carbon-footprint.svg',
    label: 'Reduce Your Carbon Footprint',
    content:
      'Experiment with your style, not the planet (or your wallet)! Save money by joining the sharing economy and rent instead.',
  },
  {
    icon: 'reclaim-your-time.svg',
    label: 'Reclaim Your Time',
    content:
      'The only laundry that cleans itself - simply rent, wear, return, repeat. We’ll take care of the rest.',
  },
  {
    icon: 'independent-designers.svg',
    label: 'Independent Designers',
    content:
      'We’ll introduce you to new brands we know you’ll love - #SupportSmallBusinesses never looked so good.',
  },
  {
    icon: 'free-delivery.svg',
    label: 'Free Delivery',
    content:
      'Free 2-day delivery and return is always included in our prices with our zero-emissions delivery partner.',
  },
  {
    icon: 'instant-booking.svg',
    label: 'Instant Booking',
    content:
      'Whether you’ve got a last minute party or an event 3 months from now - instantly book your look with confidence.',
  },
]

const WhyRent = () => (
  <div
    className="relative items-center w-full"
    id="why-rent"
    style={{
      minHeight: '40vh',
    }}
  >
    <div
      className="relative w-full"
      style={{
        height: '50vh',
        minHeight: '300px',
      }}
    >
      <Image
        src="/media/home/why-rent.png"
        alt="Feel good"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
      <div className="absolute mt-8 mr-8 right-0 left-0 md:m-0 items-end md:justify-center md:items-center top-0 bottom-0 text-white">
        <div className="md:transform md:translate-x-full">
          <Heading>Why Rent</Heading>
        </div>
      </div>
    </div>
    <div className="w-full py-16 items-center">
      <div
        className="w-full
        flex max-w-md md:max-w-none
        md:grid gap-y-8 auto-cols-fr grid-cols-2 px-8
        gap-x-8 xl:gap-x-16 lg:gap-y-8 lg:max-w-screen-lg
        "
      >
        {whyRent.map((item) => (
          <WhyRentItem key={item.label} item={item} />
        ))}
      </div>
    </div>
  </div>
)

const WhyRentItem = ({ item }) => (
  <div className="w-full items-start flex-row">
    <div className="w-20 h-20 lg:w-24 lg:h-24 relative">
      <Image
        alt={item.label}
        src={`/media/home/${item.icon}`}
        layout="fill"
        objectFit="contain"
      />
    </div>
    <div className="w-full ml-3 sm:ml-6">
      <span className="text-left font-bold text-lg">{item.label}</span>
      <span className="text-left text-gray leading-tight">{item.content}</span>
    </div>
  </div>
)

const productCategories = [
  {
    title: 'Oh My Gown',
    text: 'The Formal Edit',
    src: '/media/home/formal-clothing.png',
    alt: 'Pink dress for formal occasions',
    href: '/products/clothing/gowns',
    position: 'center 20%',
  },
  {
    title: 'Say I (HEN) Do',
    text: 'Find Your Wedding Bliss',
    src: '/media/home/wedding-dresses.png',
    alt: 'White wedding dress for your wedding',
    href: '/products/clothing?occasions=bridal',
    position: 'center',
  },
]

const ProductCategories = () => (
  <div className="w-full flex-row space-x-8 md:space-x-16 mb-8">
    {productCategories.map((data) => (
      <div key={data.title} className="w-full items-center">
        <Link href={data.href}>
          <a className="w-full h-96 md:h-128 relative">
            <Image
              alt={data.alt}
              src={data.src}
              layout="fill"
              objectFit="cover"
              objectPosition={data.position}
            />
          </a>
        </Link>
        <div className="w-full items-center my-4">
          <span className="font-bold uppercase">{data.title}</span>
          <span>{data.text}</span>
        </div>
      </div>
    ))}
  </div>
)

const howItWorks = [
  {
    title: 'Discover',
    img: 'discover',
    text: `
        Our platform allows you to rent our closet with a 4- or 8-day rental
        period. You can filter by color, style, occasion, and more. We know
        we’ll have a dress that fits any occasion!
    `,
  },
  {
    title: 'Rent',
    img: 'rent',
    text: `
        You’ve found a dress you love -- amazing! Now check out our calendar for
        your delivery date options. Remember, we recommend choosing a rental
        beginning two days before your event. Select your dates and size and
        check out! It’s no different than your regular online shopping
        experience.
      `,
  },
  {
    title: 'Love',
    img: 'love',
    text: `
          Look great, feel great. Not only do you look amazing, but you’ve
          supported a small business owner, and reduced your carbon footprint by
          renting! Now that's what we call a win-win-win.
      `,
  },
] as const

const howItWorksGradient =
  'linear-gradient(58.39deg, #DAC7C0 0%, #E7DDCB 99.37%)'
const HowItWorks = () => (
  <div
    className="p-4 pb-24 sm:p-16 lg:p-8 xl:p-16 w-full items-center"
    id="how-it-works"
    style={{
      background: howItWorksGradient,
    }}
  >
    <div className="my-8 w-full">
      <Heading>How It Works</Heading>
    </div>
    <div className="w-full lg:flex-row items-center lg:items-stretch sm:p-16 space-y-4 sm:space-y-16 lg:space-y-0 lg:space-x-8 xl:space-x-16 max-w-screen-xl">
      {howItWorks.map((props) => (
        <HowItWorksCard key={props.title} {...props} />
      ))}
    </div>
  </div>
)

const HowItWorksCard = ({ img, text }) => (
  <div className="bg-white rounded-lg space-y-8 items-center w-full p-4 sm:p-12 md:p-12 lg:p-8 sm:w-96 lg:w-1/3 relative shadow-lg">
    <div
      className="p-3 rounded-md"
      style={{
        background: howItWorksGradient,
      }}
    >
      <div className="w-24 h-24 relative">
        <Image
          src={`/media/home/${img}.svg`}
          layout="fill"
          objectFit="contain"
        />
      </div>
    </div>
    <span>{text}</span>
  </div>
)

const ProductItems = ({ products }) => {
  return (
    <div className="my-16 w-full items-center max-w-screen-xl" id="our-pick">
      <Heading>Just Dropped</Heading>
      <div className="px-4 my-8 w-full flex-wrap max-w-screen-sm lg:max-w-none lg:flex-no-wrap flex-row">
        {products.map((product: StrapiProduct) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export const Page = () => {
  return (
    <Layout spacing={false}>
      <Home />
    </Layout>
  )
}

export default Page
