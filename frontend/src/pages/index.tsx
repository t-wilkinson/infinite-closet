import React from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

import Layout from '@/Layout'
import { Product } from '@/Products/ProductItems'

export const Home = () => {
  const [products, setProducts] = React.useState([])

  React.useEffect(() => {
    axios
      .get(
        '/products?slug_in=camilla-dress&slug_in=etude-wrap&slug_in=shelley-jumpsuit&slug_in=monique-plunged-cross-back-maxi-dress'
      )
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <>
      {process.env.NODE_ENV === 'production' && <FacebookMessenger />}
      <div className="items-center w-full max-w-screen-xl">
        <div className="relative w-full max-w-screen-xl h-128 mb-8">
          <div
            className="relative w-full flex-grow justify-center"
            style={{ transform: 'scaleX(-1)' }}
          >
            <Image
              src="/media/home/banner.jpg"
              alt=""
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="absolute left-0 md:max-w-2xl lg:max-w-4xl w-full h-128">
            <Link href="/products/clothing">
              <a>
                <Image
                  src="/media/home/discover-rent-love-gold.svg"
                  alt="Discover, Rent, Love"
                  layout="fill"
                  objectFit="contain"
                />
              </a>
            </Link>
          </div>
        </div>
        <HowItWorks />
        <ProductItems products={products} />
        <WhyRent />
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

const howItWorks = {
  book: {
    label: 'Discover',
    icon: 'discover.svg',
    header: ({ selected }) => <div>Discover</div>,
    content: ({ selected }) => (
      <div>
        Our platform allows you to rent our closet with a 4- or 8-day rental
        period. You can filter by color, style, occasion, and more. We know
        we’ll have a dress that fits any occasion!
      </div>
    ),
  },
  work: {
    label: 'Rent',
    icon: 'rent.svg',
    header: ({ selected }) => <div>Rent</div>,
    content: ({ selected }) => (
      <div>
        You’ve found a dress you love -- amazing! Now check out our calendar for
        your delivery date options. Remember, we recommend choosing a rental
        beginning two days before your event. Select your dates and size and
        check out! It’s no different than your regular online shopping
        experience.
      </div>
    ),
  },
  return: {
    label: 'Love',
    icon: 'love.svg',
    header: ({ selected }) => <div>Love</div>,
    content: ({ selected }) => (
      <ul>
        <li>
          Look great, feel great. Not only do you look amazing, but you’ve
          supported a small business owner, and reduced your carbon footprint by
          renting! Now that's what we call a win-win-win.
        </li>
        <li>
          Simply return the item using our prepaid return label and leave a
          review on our website for the next person! We’ll handle the dry
          cleaning, so all you have to do is shop with us again! It’s that easy.
        </li>
      </ul>
    ),
  },
}

const HowItWorks = () => {
  const [selected, setSelected] = React.useState<'book' | 'work' | 'return'>(
    'book'
  )

  return (
    <div
      className="w-full bg-pri-light items-center px-4 py-12"
      id="how-it-works"
    >
      <Heading>How It Works</Heading>
      <div className="max-w-screen-lg w-full items-center">
        <div className="flex-row justify-between w-full p-4">
          {Object.entries(howItWorks).map(([k, v]) => (
            <HowItWorksHeader
              key={k}
              header={k}
              icon={v.icon}
              selected={selected}
              onClick={() => setSelected(k as any)}
            />
          ))}
        </div>
        <div className="flex-row justify-between w-full p-4 items-center max-w-screen-md my-8">
          {Object.entries(howItWorks).map(([k, v]) => (
            <HowItWorksContent key={k} header={k} selected={selected} />
          ))}
        </div>
      </div>
    </div>
  )
}

const HowItWorksHeader = ({ icon, selected, header, ...props }) => {
  const label = howItWorks[header].label

  return (
    <div className="w-full items-center flex-shrink">
      <button aria-label={`Show ${label}`} {...props}>
        <div
          className="h-16 w-16 md:h-24 md:w-24 md:m-8 relative"
          // style={{
          //   filter:
          //     'invert(56%) sepia(36%) saturate(482%) hue-rotate(4deg) brightness(97%) contrast(94%)',
          // }}
        >
          <Image
            src={`/media/home/${icon}`}
            alt={label}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div>
          <span className="my-1 text-lg font-bold">
            {howItWorks[header].header({ selected: header === selected })}
          </span>
          {header === selected ? (
            <div className="h-1 bg-sec rounded-full" />
          ) : null}
        </div>
      </button>
    </div>
  )
}

const HowItWorksContent = ({ selected, header }) =>
  selected === header && (
    <div className="sm:h-32 sm:h-24 md:h-16 flex-shrink">
      {howItWorks[header].content({ selected: header === selected })}
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

const ProductItems = ({ products }) => {
  return (
    <div className="my-8 w-full items-center" id="our-pick">
      <Heading>Our Pick</Heading>
      <div className="px-4 my-8 w-full flex-wrap max-w-screen-sm lg:max-w-none lg:flex-no-wrap flex-row">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

const WhyRent = ({}) => (
  <div className="my-8 w-full items-center" id="why-rent">
    <Heading>Why Rent?</Heading>
    <div className="flex-row justify-around flex-wrap w-full my-12 px-4 lg:px-0">
      {whyRent.map((item) => (
        <div key={item.label} className="items-center my-4 md:my-8 mx-4">
          <div className="w-96 items-start flex-row">
            <div className="w-24 h-24 relative">
              <Image
                alt={item.label}
                src={`/media/home/${item.icon}`}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="w-full ml-6">
              <span className="text-left font-bold text-lg">{item.label}</span>
              <span className="text-left text-gray">{item.content}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const Heading = ({ children }) => (
  <div className="flex-row w-full max-w-screen-xl items-center">
    <div className="hidden md:flex h-px bg-pri rounded-full flex-grow mr-8" />
    <h2 className="font-subheader text-4xl text-center w-full md:w-auto">
      {children}
    </h2>
    <div className="hidden md:flex h-px bg-pri rounded-full flex-grow ml-8" />
  </div>
)

export const Page = () => {
  return (
    <Layout>
      <Home />
    </Layout>
  )
}

export default Page
