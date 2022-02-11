import React from 'react'

import Layout from '@/Layout'
import { Divider } from '@/Components'

// const textSection = [
//   { title: 'Our Mission', text: 'To help women feel confident and fashionable while creating a more sustainable future.', },
//   { title: 'Our Vision', text: 'Our eCommerce platform allows customers to rent independent brands while cutting their carbon footprint and supporting “slow” fashion – making it affordable for the average consumer. We take the guesswork out of the fashion industry by partnering with sustainable, ethical, and minority and/or women-owned independent brands. Not only do we encourage consumers to focus on renting, but we encourage them to show their own closet by mixing their favorite pieces with our own. By creating an “unlimited” designer closet, we allow shoppers to feel great every day.', },
// ]

// const imageSection = [
//   { title: 'Sustainability', text: 'Create less waste and work with designers who share our vision of a better tomorrow',  },
//   { title: 'Inclusivity', text: 'Cultivate a culture that people to freely express themselves' },
//   { title: 'Diversity', text: 'Create a platform to promote and support idependent women and minority owned brands' },
//   { title: 'Affordability', text: 'Make sustainable fashion more accessible to everyone' },
// ]

const values = [
  {
    header: 'Sustainability',
    text: 'Create less waste and work with designers who share our vision',
  },
  {
    header: 'Inclusivity',
    text: 'Cultivate a culture that allows all women to freely express themselves',
  },
  {
    header: 'Diversity',
    text: 'Create a platform to promote independent women and minority owned brands',
  },
  {
    header: 'Affordability',
    text: 'Make sustainable fashion accessible to everyone',
  },
]

export const AboutUs = () => (
  <>
    <h1 className="items-center text-center my-4 text-3xl font-bold">
      Discover. Rent. Love.
    </h1>
    <AboutItem header="Our Mission">
      <span className="max-w-sm text-lg text-center mx-2">
        To help women feel confident and fashionable while creating a more
        sustainable future.
      </span>
    </AboutItem>

    <Divider className="my-2 max-w-xs" />

    <AboutItem header="Our Vision">
      <span className="max-w-sm text-lg text-center mx-2">
        Our platform allows customers to hire independent brands while cutting
        their carbon footprint and supporting “slow” fashion – making it
        affordable for the average consumer. We take the guesswork out of the
        fashion industry by only partnering with brands who are sustainable,
        ethical, and minority and/or women owned. By creating an “unlimited”
        designer closet, we allow women to feel great every day.
      </span>
    </AboutItem>

    <Divider className="my-2 max-w-xs" />

    <AboutItem header="Our Values">
      <div className="flex-wrap items-center justify-center w-full max-w-screen-lg m-4 md:flex-row">
        {values.map(({ header, text }) => (
          <ValueItem key={header} header={header} text={text} />
        ))}
      </div>
    </AboutItem>
  </>
)

const AboutItem = ({ header, children }) => (
  <div className="items-center my-4">
    <h2 className="text-3xl font-subheader">{header}</h2>
    {children}
  </div>
)

const ValueItem = ({ header, text }) => (
  <div className="rounded-sm items-center w-56 h-56 p-6 m-2 shadow-md bg-gray-light">
    <h3 className="mb-4 text-lg font-bold text-pri">{header}</h3>
    <span className="text-center">{text}</span>
  </div>
)

export const Page = () => {
  return (
    <Layout title="About Us" className="pb-8">
      <AboutUs />
    </Layout>
  )
}

export default Page
