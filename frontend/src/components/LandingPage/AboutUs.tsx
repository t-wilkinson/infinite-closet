import React from 'react'
import { values } from './constants'

export const AboutUs = () => (
  <div className="items-center w-full pb-6 mx-2">
    <span className="items-center my-4 text-4xl font-subheader-light">
      Discover. Rent. Love.
    </span>
    <AboutItem header="Our Mission">
      <span className="max-w-sm text-lg text-center ">
        To help women feel confident and fashionable while creating a more
        sustainable future.
      </span>
    </AboutItem>
    <AboutItem header="Our Vision">
      <span className="max-w-sm text-center font-xl ">
        Our platform allows customers to hire independent brands while cutting
        their carbon footprint and supporting “slow” fashion – making it
        affordable for the average consumer. We take the guesswork out of the
        fashion industry by only partnering with brands who are sustainable,
        ethical, and minority and/or women owned. By creating an “unlimited”
        designer closet, we allow women to feel great every day.
      </span>
    </AboutItem>
    <AboutItem header="Our Values">
      <div className="flex-wrap items-center justify-center w-full max-w-xl m-4 md:flex-row">
        {values.map(({ header, text }) => (
          <ValueItem key={header} header={header} text={text} />
        ))}
      </div>
    </AboutItem>
  </div>
)
export default AboutUs

const AboutItem = ({ header, children }) => (
  <div className="items-center my-4">
    <span className="text-3xl font-subheader text-pri-light">{header}</span>
    {children}
  </div>
)

const ValueItem = ({ header, text }) => (
  <div className="items-center w-56 h-56 p-6 m-2 shadow-md bg-gray-light">
    <span className="mb-4 text-lg font-bold text-pri-light">{header}</span>
    <span className="text-center">{text}</span>
  </div>
)
