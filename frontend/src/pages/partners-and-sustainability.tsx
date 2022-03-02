import React from 'react'
import Image from 'next/image'

import Layout from '@/Layout'
import { Heading, ScrollUp } from '@/Components'

import acsImage from '@/media/sustainability/acs.png'
import kingstonUniversityLondonImage from '@/media/sustainability/kingston-university-london.jpg'
import bloominoImage from '@/media/sustainability/bloomino.png'
import giveYourBestImage from '@/media/sustainability/give-your-best.jpg'
import sustainbilityImage from '@/media/sustainability/sustainability.jpg'
import aboutUsBannerImage from '@/media/about-us/about-us-banner.jpg'

const Banner = () => (
  <section className="w-full relative items-center justify-center">
    <div className="w-full h-96 sm:h-128 relative">
      <Image src={aboutUsBannerImage} layout="fill" objectFit="cover" />
    </div>
    <h1 className="text-center absolute font-bold text-2xl sm:text-4xl md:text-5xl text-white uppercase">
      Partners & Sustainbility
    </h1>
  </section>
)

const Page = () => (
  <Layout title="Partners & Sustainability">
      <ScrollUp />
    <div className="px-4 space-y-24 max-w-screen-lg mb-8">
      <Banner />
      <Sustainability />
      <Partnerships />
      <AmbassadorProgram />
    </div>
  </Layout>
)

const Sustainability = () => (
  <section>
    <div className="mt-4 flex-row">
      <div className="space-y-8 text-start items-start grow-0">
        <div className="relative h-64 w-full md:hidden">
          <Image src={sustainbilityImage} objectFit="contain" layout="fill" />
        </div>
        <Heading>Sustainability</Heading>
        <p>
          Sustainability is top of mind for a lot of companies, and as a
          circular business model, creating a more sustainble fashion industry
          is our number one goal.
        </p>

        <p>
          At Infinite Closet, we have pledged to commit the following UN
          Sustainability Goals:
        </p>

        <ul className="list-disc list-inside">
          <li>Responsible Consumption and production </li>
          <li>Gender equality</li>
          <li>Decent work and Economic growth</li>
          <li>Industry, innovation and infrastructure</li>
        </ul>
      </div>
      <div className="md:w-32" />
      <div className="grow-0 hidden md:flex">
        <div className="relative h-96 w-128">
          <Image src={sustainbilityImage} objectFit="contain" layout="fill" />
        </div>
      </div>
    </div>
  </section>
)

const Partnerships = () => (
  <section className="space-y-8 items-center">
    <Heading>Partnerships</Heading>
    <p className="max-w-screen-md text-center">
      At Infinite Closet, we aim to make significant partnerships that help the
      planet, our customers and the fashion industry. We’re always looking to
      find fashion’s rising stars.
    </p>
    <div className="w-32 sm:w-full sm:flex-row space-y-8 py-8">
      {[
        acsImage,
        kingstonUniversityLondonImage,
        bloominoImage,
        giveYourBestImage,
      ].map((image, i) => (
        <div className="mx-4 justify-center">
          <Image key={i} src={image} objectFit="contain" />
        </div>
      ))}
    </div>
    <p>For any partnership enquiries please email info@infinitecloset.co.uk</p>
  </section>
)

const AmbassadorProgram = () => (
  <section className="space-y-8" id="ambassador">
    <Heading>Ambassador Programme</Heading>
    <p>
      Do you share our passion for fashion? Are you constantly teaching people
      how to make more sustainable shopping choices? Are you a lover of tech and
      innovation? Then we want to hear from you! We’re looking to partner with
      people who dream of a better tomorrow and want to join our ambassador
      programme.
      <br />
      Ready to join our community? Read on!
    </p>

    <p>
      WHAT WE ASK OF YOU:
      <ol className="list-decimal list-inside">
        <li>
          A Love Of Fashion Rental: An account on the Infinite Closet site/app
          with at least 3 uploads to your digital closet.
        </li>
        <li>
          Promote Infinite Closet: Spread the word organically across social
          platforms with your family and friends.
        </li>
        <li>
          Regular Posts: At least 1 feed posts & 2 stories per month on
          Instagram or Tiktok, covering the rental experience and sharing your
          digital wardrobe.
        </li>
      </ol>
    </p>

    <p>
      WHAT’S IN IT FOR YOU:
      <ul>
        <li>
          Complimentary Rentals - One rental per month from in-house inventory.
        </li>
        <li>Get Featured: Regular exposure across our social media an.</li>
        <li>
          Your Personal Code - Share with your followers & get app credit when
          they sign up and rent their first piece.
        </li>
      </ul>
    </p>

    <p className="text-sm">
      Terms & Conditions:
      <ul className="list-disc list-inside">
        <li>
          This is not a paid role. Limited ambassador roles are available at
          this time and are accepted on a rolling basis.
        </li>
        <li>
          Ambassadors to be reviewed every 6 months so as to allow others the
          opportunity.
        </li>
        <li>
          Complimentary loans must be selected from our in-house inventory (this
          does not include presale items).
        </li>
        <li>
          Infinite Closet has to right to share content created as an ambassador
          across our marketing channels.
        </li>
      </ul>
    </p>
  </section>
)

export default Page
