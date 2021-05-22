import React from 'react'
import Image from 'next/image'

import { useSelector } from '@/utils/store'

export const Home = () => {
  const layout = useSelector((state) => state.account)

  return (
    <div className="items-center">
      <div className="relative w-full h-128">
        <Image
          src="/images/home/Website-Banner---Homepage-.png"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <HowItWorks />
      <WhyRent />
    </div>
  )
}

const howItWorks = {
  book: {
    label: 'Discover',
    icon: 'how-it-works-1.svg',
    header: ({ selected }) => <div>Discover</div>,
    content: ({ selected }) => (
      <div>
        Our platform allows you to rent our closet with a 4- or 8-day rental
        period. You can filter by color, style, occasion, and more. We know
        we’ll have a dress that fits your special occasion!{' '}
      </div>
    ),
  },
  work: {
    label: 'Rent',
    icon: 'how-it-works-2.svg',
    header: ({ selected }) => <div>Rent</div>,
    content: ({ selected }) => (
      <div>
        You’ve found a dress you love -- amazing! Now check out our calendar for
        your delivery date options. Remember, we recommend choosing a rental
        beginning two days before your event. Select your dates and size and
        check out! It’s no different than your regular online shopping
        experience.{' '}
      </div>
    ),
  },
  return: {
    label: 'Love',
    icon: 'how-it-works-3.svg',
    header: ({ selected }) => <div>Love</div>,
    content: ({ selected }) => (
      <div>
        Look great, feel great. Not only do you look amazing, but you’ve
        supported an independent designer, and reduced your carbon footprint by
        renting! Now that's what we call a win-win-win.{' '}
      </div>
    ),
  },
}

const HowItWorks = () => {
  const [selected, setSelected] = React.useState<'book' | 'work' | 'return'>(
    'book',
  )

  return (
    <div className="w-full bg-gray-light items-center px-4 py-12">
      <Heading>How It Works</Heading>
      <div className="max-w-screen-lg w-full items-center">
        <div className="flex-row justify-between w-full p-4">
          {Object.entries(howItWorks).map(([k, v]) => (
            <HowItWorksHeader
              key={k}
              header={k}
              icon={v.icon}
              selected={selected}
              onClick={() => setSelected(k)}
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
          className="h-24 w-24 m-8 relative"
          // style={{
          //   filter:
          //     'invert(56%) sepia(36%) saturate(482%) hue-rotate(4deg) brightness(97%) contrast(94%)',
          // }}
        >
          <Image
            src={`/images/home/${icon}`}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div>
          <span className="my-1 text-2xl font-bold">
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
    <div className="h-32 sm:h-24 md:h-16">
      {howItWorks[header].content({ selected: header === selected })}
    </div>
  )

const whyRent = [
  {
    icon: 'why-rent-1.svg',
    label: 'Totally Flexible',
    content:
      'Ever changing styles, sizes, and brands. We’ve got you covered for every occasion, delivered right to your door.',
  },
  {
    icon: 'why-rent-2.svg',
    label: 'Reduce Your Carbon Footprint',
    content:
      'Experiment with your style, not the planet (or your wallet)! Join the sharing economy and rent instead.',
  },
  {
    icon: 'why-rent-3.svg',
    label: 'Reclaim Your Time',
    content:
      'The only laundry that cleans itself -- simply rent, wear, and return. We’ll take care of the rest.',
  },
  {
    icon: 'why-rent-4.svg',
    label: '#SupportSmallBusinesses',
    content:
      'We’ll introduce you to new brands we know you’ll love - and promise to only partner with brands who share our vision of a more sustainable and ethical tomorrow.',
  },
]

const WhyRent = ({}) => (
  <div className="my-8 w-full items-center">
    <Heading>Why Rent?</Heading>
    <div className="flex-row justify-between flex-wrap w-full">
      {whyRent.map((item) => (
        <div key={item.label} className="flex-grow items-center my-20">
          <div className="w-64 items-center">
            <div className="w-32 h-32 relative">
              <Image
                src={`/images/home/${item.icon}`}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <span className="text-center font-bold text-2xl my-2">
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
  <div className="flex-row w-full items-center">
    <div className="h-px bg-pri rounded-full flex-grow mx-8" />
    <span className="font-subheader text-4xl">{children}</span>
    <div className="h-px bg-pri rounded-full flex-grow mx-8" />
  </div>
)

export default Home
