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
    const products = [
      'elora',
      'juliette-dress',
      'june-gown',
      'shelley-jumpsuit',
    ]
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
        <WhyRent />
        <div className="h-8" />
        <ProductItems products={products} />
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
      <span className="relative font-subheader text-5xl text-center">
        {block && (
          <div
            className="absolute w-full bottom-0 h-10 bg-pri-light"
            style={{
              transform: 'translate(0.4em, -0.5em)',
            }}
          />
        )}
        <h2 className="relative">{children}</h2>
      </span>
    </div>
  )
}

const Introduction = () => (
  <div
    className="relative w-full"
    style={{
      height: 'calc(100vh - 152px)',
    }}
  >
    <Image
      priority={true}
      src="/media/home/enjoy-life.png"
      alt="Women enjoying stylish rental dresses"
      layout="fill"
      objectFit="cover"
      objectPosition="top center"
    />
    <div
      className="absolute inset-0 xl:hidden"
      style={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
    />
    <div className="justify-center sm:justify-start m-8 sm:m-16 relative max-w-md h-full">
      <IntroductionText />
    </div>
  </div>
)

const IntroductionText = () => (
  <div className="text-white">
    <h1
      className="font-bold text-5xl md:text-6xl mb-6"
      style={{
        lineHeight: '1',
      }}
    >
      Change The Way You Get Dressed
    </h1>
    <span className="mb-12 text-xl leading-tight">
      Discover and create your dream wardrobe by renting independent and
      sustainable brands, without breaking the bank.
    </span>
    <span>
      <Link href="/products/clothing">
        <a>
          <Button role="primary" className="p-4 text-lg md:text-xl">
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
    className="relative items-center w-full md:flex-row mt-16 md:my-16"
    id="why-rent"
    style={{
      minHeight: '40vh',
    }}
  >
    <div className="h-96 w-96 sm:h-128 sm:w-128 md:w-96 md:h-full lg:w-1/3 relative">
      <Image
        src="/media/home/feel-good.png"
        alt=""
        layout="fill"
        objectFit="cover"
        objectPosition="right top"
      />
    </div>
    <div
      className="w-full py-8 items-start
      md:w-2/3 lg:py-32 space-y-8
      "
    >
      <Heading>Why Rent?</Heading>
      <div
        className="w-full
        flex gap-y-8
        lg:grid grid-cols-2 px-8 gap-x-8 xl:gap-x-16 lg:gap-y-8 auto-cols-fr lg:max-w-screen-lg
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
      <Heading block={false}>How It Works</Heading>
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
