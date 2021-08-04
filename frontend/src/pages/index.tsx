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

  // TODO: use preRender
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
      <h2 className="relative font-subheader text-5xl text-center">
        {block && (
          <div
            className="absolute w-full bottom-0 h-10 bg-pri-light"
            style={{
              transform: 'translate(0.4em, -0.5em)',
            }}
          />
        )}
        <span className="relative">{children}</span>
      </h2>
    </div>
  )
}

const Introduction = () => (
  <div
    className="items-center sm:items-stretch w-full flex-row py-16 sm:py-0 sm:h-80vh"
    style={{
      background: '#D9C6BC',
    }}
  >
    <div
      style={{
        width: 'calc(25% + 18rem)',
      }}
      className="py-8 sm:p-16 md:p-24 ml-8 sm:ml-16 md:ml-0 items-end sm:max-w-none justify-center"
    >
      <div style={{}} className="w-72">
        <span
          className="font-bold text-4xl md:text-5xl mb-6"
          style={{
            lineHeight: '1',
          }}
        >
          Change The Way You Get Dressed
        </span>
        <span className="mb-12">
          Discover and create your dream wardrobe by renting independent and
          sustainable brands, without breaking the bank.
        </span>
        <span>
          <Link href="/products/clothing">
            <a>
              <Button role="cta">Find Your Look</Button>
            </a>
          </Link>
        </span>
      </div>
    </div>

    <div className="relative w-full flex-grow justify-center">
      <div
        className="absolute inset-0"
        style={{
          background: '#D9C6BC',
        }}
      />
      <div className="hidden sm:block">
        <Image
          priority={true}
          src="/media/wine-toast.jpg"
          alt=""
          layout="fill"
          objectFit="cover"
          objectPosition="top center"
        />
      </div>
    </div>
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

const WhyRent = ({}) => (
  <div className="w-full items-center" id="why-rent">
    <div className="flex-row w-full">
      <div
        className="relative w-1/2 flex-grow justify-center max-w-screen-md hidden sm:flex"
        style={{
          maxHeight: '80vh',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: '#D9C6BC',
          }}
        />
        <Image
          src="/media/header/clothing-menu-image.jpg"
          alt=""
          layout="fill"
          objectFit="cover"
          objectPosition="right top"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #D9C6BC 0%, #D9C6BC00 5%)',
          }}
        />
      </div>

      <div
        className="items-center flex-col sm:items-start sm:flex-row flex-wrap w-full px-3 sm:pl-12 lg:pl-8
        space-y-8 py-10 md:py-12 lg:pt-40 lg:pt-16 lg:justify-center max-w-screen-xl"
      >
        <div className="lg:w-full sm:ml-24 lg:ml-16 xl:ml-0">
          <Heading>Why Rent?</Heading>
        </div>
        {whyRent.map((item) => (
          <div key={item.label} className="items-center my-4 md:my-4">
            <div className="w-full sm:w-96 items-start flex-row">
              <div className="w-24 h-24 relative">
                <Image
                  alt={item.label}
                  src={`/media/home/${item.icon}`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="w-full ml-3 sm:ml-6">
                <span className="text-left font-bold text-lg">
                  {item.label}
                </span>
                <span className="text-left text-gray leading-tight">
                  {item.content}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
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
    {/* <span className="absolute top-0 left-0 font-header text-3xl transform ml-8 -translate-y-1/2"> */}
    {/*   {title} */}
    {/* </span> */}
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
