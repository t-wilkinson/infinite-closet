import React from 'react'

import { CallToAction } from '@/components'
import Image from 'next/image'

const Home = ({ products }) => {
  return (
    <div className="w-full items-center w-full">
      <Introduction />
      <WhyRent />
    </div>
  )
}

const Introduction = () => (
  <div className="w-full flex-row">
    <div
      style={{
        background: `linear-gradient(90deg, #E1CAC0 0%, #DBC4BA 100%)`,
        width: 'calc(25% + 300px)',
      }}
      className="p-24 items-end"
    >
      <div
        style={{
          width: '300px',
        }}
      >
        <span className="font-subheader">Rent items you</span>
        <span className="font-bold text-5xl mb-4 leading-tight">
          Love, <br />
          Guilt Free
        </span>
        <span className="mb-12">
          Support sustainable fashion without breaking the bank by renting with
          us.
        </span>
        <CallToAction className="font-subheader">Find Your Look</CallToAction>
      </div>
    </div>

    <div
      className="relative w-full flex-grow justify-center"
      style={{ transform: 'scaleX(-1)' }}
    >
      <Image
        priority={true}
        src="/media/home/banner.jpg"
        alt=""
        layout="fill"
        objectFit="cover"
      />
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
        className="relative w-full flex-grow justify-center"
        style={{ transform: 'scaleX(-1)' }}
      >
        <Image
          src="/media/header/clothing-menu-image.jpg"
          alt=""
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="items-start flex-wrap w-full pl-12 space-y-8 pt-8 pb-4">
        <Heading right>Why Rent?</Heading>
        {whyRent.map((item) => (
          <div key={item.label} className="items-center my-4 md:my-4">
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

const Heading = ({ left = false, right = false, children }) => (
  <div className="flex-row w-full max-w-screen-xl items-center">
    {left && (
      <div className="hidden md:flex h-px bg-pri rounded-full flex-grow mr-8" />
    )}
    <h2 className="font-subheader text-4xl text-center w-full md:w-auto">
      {children}
    </h2>
    {right && (
      <div className="hidden md:flex h-px bg-pri rounded-full flex-grow ml-8" />
    )}
  </div>
)

export default Home
