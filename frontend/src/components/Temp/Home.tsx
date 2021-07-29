import React from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { CallToAction } from '@/components'
import { Product } from '@/Products/ProductItems'

let homeColor
let homeVariant
let homeAccent

const Home = ({}) => {
  const [products, setProducts] = React.useState([])
  const router = useRouter()
  homeColor = (router.query.color as string) || 'sec-light'
  homeVariant = (router.query.variant as string) || 'bold'
  homeAccent = (router.query.accent as string) || 'block'

  // TODO: use preRender
  React.useEffect(() => {
    axios
      .get(
        '/products?slug_in=camilla-dress&slug_in=etude-wrap&slug_in=shelley-jumpsuit&slug_in=monique-plunged-cross-back-maxi-dress'
      )
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div className="w-full items-center w-full">
      <Introduction />
      <WhyRent />
      <div className="h-8" />
      <ProductItems products={products} />
      <HowItWorks />
      {/* <div className="fixed bottom-0 left-0 bg-white border shadow-lg mb-2 ml-2"> */}
      {/*   <Options */}
      {/*     type="variant" */}
      {/*     options={['original', 'bold']} */}
      {/*     router={router} */}
      {/*   /> */}
      {/*   <Options */}
      {/*     type="accent" */}
      {/*     options={['original', 'line', 'block', 'none']} */}
      {/*     router={router} */}
      {/*   /> */}
      {/*   <Options */}
      {/*     type="color" */}
      {/*     options={['pri', 'pri-light', 'sec', 'sec-light']} */}
      {/*     router={router} */}
      {/*   /> */}
      {/* </div> */}
    </div>
  )
}

const Options = ({ type, options, router }) => (
  <div className="flex-row">
    {options.map((option) => (
      <button
        key={option}
        className="p-1 hover:underline"
        style={{
          fontWeight: router.query[type] === option ? 800 : 500,
        }}
        onClick={() => {
          router.push({ query: { ...router.query, [type]: option } })
        }}
      >
        {option}
      </button>
    ))}
  </div>
)

const linearGradient = 'linear-gradient(90deg, #D9C6BC 0%, #D7CDC7 100%)'

const Heading = ({ left = false, right = false, children, text = '' }) => {
  return <div className="w-full">{children}</div>
  return (
    <div
      className={`${
        homeVariant === 'bold' ? 'flex-col' : 'flex-row'
      } w-full items-center relative`}
    >
      {homeAccent === 'original' && left ? (
        <div className="hidden md:flex h-px bg-pri rounded-full flex-grow mr-8" />
      ) : (
        <div className="flex-grow" />
      )}

      {homeVariant === 'bold' && (
        <span className="font-subheader text-normal -mb-3">{children}</span>
      )}
      <h2
        className={`relative ${
          homeVariant === 'bold'
            ? 'font-bold text-4xl'
            : 'font-subheader text-5xl'
        } text-center w-full md:w-auto`}
      >
        {homeAccent === 'block' && (
          <div
            className={`absolute left-0 bottom-0 right-0 ${
              homeVariant === 'bold' ? 'h-6' : 'h-8'
            } bg-${homeColor}`}
            style={{
              transform:
                homeVariant === 'bold'
                  ? `translate(14px, -18px)`
                  : `translate(24px, -24px)`,
            }}
          />
        )}
        <span className="relative z-10">
          {homeVariant === 'bold' ? text : children}
        </span>
        {homeAccent === 'line' && (
          <div className={`h-1 -mt-2 bg-${homeColor} w-full`} />
        )}
      </h2>
      {homeAccent === 'original' && right ? (
        <div className="hidden md:flex h-px bg-pri rounded-full flex-grow ml-8" />
      ) : (
        <div className="flex-grow" />
      )}
    </div>
  )
}

const Introduction = () => (
  <div
    className="items-center sm:items-stretch w-full flex-row"
    style={{
      background: '#D9C6BC',
    }}
  >
    <div
      style={{
        width: 'calc(25% + 300px)',
      }}
      className="pl-8 py-8 sm:p-16 md:p-24 items-end max-w-3xs sm:max-w-none"
    >
      <div
        style={{
          width: '300px',
        }}
        className="max-w-3xs sm:max-w-none"
      >
        <span className="font-subheader">CHANGE THE WAY YOU GET DRESSED</span>
        <span
          className="font-bold text-4xl md:text-5xl mb-8"
          style={{
            lineHeight: '1',
          }}
        >
          Create your dream wardrobe without the guilt.
        </span>
        <span className="mb-12">
          Discover and rent independent and sustainable brands
        </span>
        <CallToAction className="font-bold">Find Your Look</CallToAction>
      </div>
    </div>

    <div
      className="relative w-full flex-grow justify-center"
      style={{ transform: 'scaleX(-1)' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: '#D9C6BC',
        }}
      />
      <div className="hidden sm:block">
        <Image
          priority={true}
          src="/media/home/banner.jpg"
          alt=""
          layout="fill"
          objectFit="cover"
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
        className="relative w-full flex-grow justify-center max-w-screen-md hidden sm:flex"
        style={{}}
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
        className="items-center flex-col sm:items-start sm:flex-row flex-wrap w-full px-3 sm:pl-12
        space-y-8 py-10 md:py-12 lg:py-40 lg:justify-center max-w-screen-xl"
      >
        <Heading left right text="It's Awesome">
          Why Rent?
        </Heading>
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
      <Heading left right text="Fast & Easy">
        How It Works
      </Heading>
    </div>
    <div className="w-full lg:flex-row items-center lg:items-stretch sm:p-16 space-y-4 sm:space-y-16 lg:space-y-0 lg:space-x-8 xl:space-x-16 max-w-screen-xl">
      {howItWorks.map((props) => (
        <HowItWorksCard key={props.title} {...props} />
      ))}
    </div>
  </div>
)

const HowItWorksCard = ({ title, img, text }) => (
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
      <Heading left right text="Find Your Look">
        Our Pick
      </Heading>
      <div className="px-4 my-8 w-full flex-wrap max-w-screen-sm lg:max-w-none lg:flex-no-wrap flex-row">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Home
