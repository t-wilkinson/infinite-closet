import React from 'react'
import Image from 'next/image'

import Layout from '@/Layout'
import { Heading, BlueLink, ScrollUp } from '@/Components'

import aboutUsImage from '@/media/about-us/about-us.jpg'
import aboutUsBannerImage from '@/media/about-us/about-us-banner.jpg'
import coFoundersImage from '@/media/about-us/co-founders-landscape.jpg'
import coFoundersSignaturesImage from '@/media/about-us/co-founder-signatures.png'

import inclusionImage from '@/media/about-us/inclusion.jpg'
import sustainabilityImage from '@/media/about-us/sustainability.jpg'
import affordabilityImage from '@/media/about-us/affordability.jpg'
import diversityImage from '@/media/about-us/diversity.jpg'

// const imageSection = [
//   { title: 'Sustainability', text: 'Create less waste and work with designers who share our vision of a better tomorrow',  },
//   { title: 'Inclusivity', text: 'Cultivate a culture that people to freely express themselves' },
//   { title: 'Diversity', text: 'Create a platform to promote and support idependent women and minority owned brands' },
//   { title: 'Affordability', text: 'Make sustainable fashion more accessible to everyone' },
// ]

const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 100}`
  // return `https://infinitecloset.treywilkinson.com/_next/image?url=${encodeURIComponent(
  //   src,
  // )}&w=${width}&q=${quality || 75}`
}


const values = [
  {
    image: sustainabilityImage,
    header: 'Sustainability',
    text: <span>
      Create less waste and work with designers who share our vision of a better tomorrow. To learn more about our sustainability efforts,
      {' '}<BlueLink href="/partners-and-sustainability" label="click here"/>
      .
    </span>,
  },
  {
    image: inclusionImage,
    header: 'Inclusivity',
    text: 'Cultivate a culture that allows people to freely express themselves',
  },
  {
    image: diversityImage,
    header: 'Diversity',
    text: 'Create a platform to promote and support idependent women and minority owned brands',
  },
  {
    image: affordabilityImage,
    header: 'Affordability',
    text: 'Make sustainable fashion more accessible to everyone',
  },
]

export const AboutUs = () => (
  <div className="px-4 space-y-8 w-full max-w-screen-lg">
    <Banner />
    <AboutUsSection />

    <AboutItem header="Our Mission">
      <span className="text-lg text-center w-full mx-2">
        To help people feel <em>confident</em> and <em>fashionable</em> while
        creating a more sustainable future.
      </span>
    </AboutItem>

    <AboutItem header="Our Vision">
      <span className="text-lg w-full text-center mx-2">
        Our eCommerce platform allows customers to rent independent brands while
        cutting their carbon footprint and supporting “slow” fashion – making it
        affordable for the average consumer. We take the guesswork out of the
        fashion industry by partnering with sustainable, ethical, and minority
        and/or women-owned independent brands. Not only do we encourage
        consumers to focus on renting, but we encourage them to show their own
        closet by mixing their favorite pieces with our own. By creating the
        “unlimited” dream closet, we help shoppers feel great every day.
      </span>
    </AboutItem>

    <AboutItem header="Our Values">
      <div className="w-full max-w-screen-md pt-8 space-y-16">
        {values.map(({ image, header, text }, i) => (
          <ValueItem
            key={header}
            index={i}
            image={image}
            header={header}
            text={text}
          />
        ))}
      </div>
    </AboutItem>

    <CoFoundersSection />
    <strong className="font-bold text-center pt-8 w-full text-lg">
      Interested in working with us? <br className="sm:hidden" /> Drop us a line at info@infinitecloset.co.uk
    </strong>

    <ScrollUp />
  </div>
)

const AboutItem = ({ header, children }) => (
  <section className="space-y-4 w-full items-center py-8">
    <Heading>{header}</Heading>
    {children}
  </section>
)

const Banner = () => (
  <section className="w-full relative items-center justify-center">
    <Image src={aboutUsBannerImage} objectFit="contain"
      loader={myLoader}
    />
    <h1 className="absolute font-bold text-2xl sm:text-4xl md:text-5xl text-white uppercase">
      Who Are We?
    </h1>
  </section>
)

const AboutUsSection = () => (
  <section>
    <div className="mt-4 flex-row">
      <div className="space-y-8 text-start items-start grow-0">
        <Heading>About Us</Heading>
        <p>
          Infinite Closet is a clothing rental service focused on independent
          ethical and sustainable designer brands, delivered right to your door.
          Our curated, premium independent brand has quickly become a go-to
          resource to help shoppers create a more sustainable wardrobe.
        </p>
        <p>
          Our platform take’s the guesswork out of the fashion industry by
          allowing our shoppers to discover and rent from sustainable, ethical,
          minority and/or women-owned brands. But our “closet in the clouds”
          doesn’t stop there. Our closet upload helps our clients to upload and
          mix their pieces with our own, allowing them to create their
          “unlimited” dream closet.
        </p>
        <p>To learn more about our partners,
          {' '}<BlueLink href="/partners-and-sustainability" label="click here"/>
        .</p>
      </div>
      <div className="md:w-128" />
      <div className="grow-0 hidden md:flex">
        <div className="relative h-96 w-96">
          <Image src={aboutUsImage} objectFit="contain" layout="fill" />
        </div>
        <span className="font-bold text-right text-lg mt-2">
          Discover. Rent. Love
        </span>
      </div>
    </div>
  </section>
)

const ValueItem = ({ header, text, image, index }) => (
  <div
    className={`
      w-full
      flex-col
      ${index % 2 ? 'sm:flex-row-reverse' : 'sm:flex-row'}
    `}
  >
    <div className="relative sm:w-1/2 h-64">
      <Image src={image} objectFit="cover" layout="fill" />
    </div>
    <div className="sm:w-24 sm:block h-8 sm:h-0" />
    <div className="sm:w-1/2 justify-center items-center">
      <h3 className="mb-4 text-lg font-bold uppercase">{header}</h3>
      <span className="text-center">{text}</span>
    </div>
  </div>
)

const CoFoundersSection = () => (
  <section className="sm:flex-row w-full sm:space-x-8">
    <div className="w-full h-128 relative">
      <Image src={coFoundersImage} layout="fill" objectFit="cover" />
    </div>
    <div className="py-8 sm:w-1/2 md:w-2/5 space-y-4 text-lg leading-snug font-bold">
      <span className="uppercase font-bold text-center">Thank You!</span>
      <span className="text-justify">
        Our dream closet couldn’t exist without you. We’re working hard every
        day to help support the circular economy and offer a variety of ways to
        help you on your sustainable fashion journey. This is just the
        beginning. Welcome to the fashion revolution. We’re so glad you’re here.
      </span>
      <div className="self-end">
        <Image
          src={coFoundersSignaturesImage}
          objectFit="contain"
          height={80}
          width={200}
        />
      </div>
    </div>
  </section>
)


export const Page = () => {
  return (
    <Layout title="About Us" className="pb-8">
      <AboutUs />
    </Layout>
  )
}

export default Page
