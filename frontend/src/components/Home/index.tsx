import React from 'react'
import axios from 'axios'
import Image from 'next/image'

import { Product } from '@/Products/ProductItems'

export const Home = () => {
  const [products, setProducts] = React.useState([])

  React.useEffect(() => {
    axios
      .get('/products?designer.slug=retrofete&_limit=4')
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err))
  }, [])

  return (
    <div className="w-full items-center">
      <div className="items-center w-full max-w-screen-xl">
        <div className="relative w-full max-w-screen-xl h-128 mb-8">
          <div className="w-full h-full" style={{ transform: 'scaleX(-1)' }}>
            <Image
              src="/images/home-page/banner-image.jpg"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="absolute left-0 md:max-w-2xl lg:max-w-4xl w-full h-128">
            <Image
              src="/images/home-page/discover-rent-love-gold.svg"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        <HowItWorks />
        <ProductItems products={products} />
        <WhyRent />
      </div>
    </div>
  )
}

const howItWorks = {
  book: {
    label: 'Discover',
    icon: '1.svg',
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
    icon: '2.svg',
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
    icon: '3.svg',
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
    'book',
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
    <div className="w-full items-center">
      <button aria-label={label} {...props}>
        <div
          className="h-16 w-16 md:h-24 md:w-24 md:m-8 relative"
          // style={{
          //   filter:
          //     'invert(56%) sepia(36%) saturate(482%) hue-rotate(4deg) brightness(97%) contrast(94%)',
          // }}
        >
          <Image
            src={`/images/home-page/how-it-works/${icon}`}
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
    <div className="sm:h-32 sm:h-24 md:h-16">
      {howItWorks[header].content({ selected: header === selected })}
    </div>
  )

const whyRent = [
  {
    icon: '1.svg',
    label: 'Complete Flexibility',
    content:
      'Ever changing styles, sizes, and brands. We’ve got you covered for every occasion, delivered right to your door.',
  },
  {
    icon: '2.svg',
    label: 'Reduce Your Carbon Footprint',
    content:
      'Experiment with your style, not the planet (or your wallet)! Join the sharing economy and rent instead.',
  },
  {
    icon: '3.svg',
    label: 'Reclaim Your Time',
    content:
      'The only laundry that cleans itself -- simply rent, wear, and return. We’ll take care of the rest.',
  },
  {
    icon: '4.svg',
    label: '#SupportSmallBusinesses',
    content:
      'We’ll introduce you to new brands we know you’ll love - and promise to only partner with brands who share our vision of a more sustainable and ethical tomorrow.',
  },
]

const ProductItems = ({ products }) => {
  return (
    <div className="my-8 w-full" id="our-pick">
      <Heading>Our Pick</Heading>
      <div className="my-8 w-full flex-wrap lg:flex-no-wrap flex-row">
        {products.map((product) => (
          <Product key={product.id} item={product} />
        ))}
      </div>
    </div>
  )
}

const WhyRent = ({}) => (
  <div className="my-8 w-full items-center" id="why-rent">
    <Heading>Why Rent?</Heading>
    <div className="flex-row justify-between flex-wrap w-full">
      {whyRent.map((item) => (
        <div key={item.label} className="flex-grow items-center my-4 md:my-20">
          <div className="w-64 items-center">
            <div className="w-24 h-24 relative">
              <Image
                src={`/images/home-page/why-rent/${item.icon}`}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <span className="text-center font-bold text-lg my-2">
              {item.label}
            </span>
            <span className="text-center">{item.content}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const Heading = ({ children }) => (
  <div className="flex-row w-full max-w-screen-xl items-center">
    <div className="hidden md:flex h-px bg-pri rounded-full flex-grow mr-8" />
    <span className="font-subheader text-4xl text-center w-full md:w-auto">
      {children}
    </span>
    <div className="hidden md:flex h-px bg-pri rounded-full flex-grow ml-8" />
  </div>
)

export default Home
