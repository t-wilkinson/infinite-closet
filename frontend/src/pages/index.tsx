import React from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

import { Product } from '@/Products/ProductItems'
import { FacebookMessenger, Button } from '@/components'
import Layout from '@/Layout'
import { StrapiProduct } from '@/utils/models'

// import whyRentPic from '@/media/home/why-rent.png'
// import formalClothingPic from '@/media/home/formal-clothing.png'
// import sustainableFashionRentalPic from '@/media/home/sustainable-fashion-rental.png'
import holidaysTreatsPic from '@/media/home/holidays-treats.png'
import reviewImage1 from  '@/media/home/review-image.jpg'
import reviewImage2 from  '@/media/home/review-image-1.jpg'
import reviewImage3 from  '@/media/home/review-image-2.jpg'

export const Home = ({ products }) => {
  return (
    <>
      {process.env.NODE_ENV === 'production' && <FacebookMessenger />}
      <div className="w-full items-center w-full">
        <Introduction />
        <ProductItems products={products} />
        <WhyRent />
        <ProductCategories />
        <HowItWorks />
        <UserReviews />
        {/* <InstagramSlider /> */}
      </div>
    </>
  )
}

const Heading = ({ block = true, children }) => {
  return (
    <div className="w-full items-center">
      <span className="relative font-bold uppercase text-5xl text-center">
        <h2 className="relative">{children}</h2>
        {block && (
          <div className="w-3/4 bg-pri h-2 -mt-3 absolute bottom-0 right-0" />
        )}
      </span>
    </div>
  )
}

const Introduction = () => (
  <div
    className="relative w-full lg:items-center"
    style={{
      height: '70vh',
    }}
  >
    {/* <Image */}
    {/*   priority={true} */}
    {/*   src={sustainableFashionRentalPic} */}
    {/*   placeholder="blur" */}
    {/*   alt="Women enjoying stylish rental dresses" */}
    {/*   layout="fill" */}
    {/*   objectFit="cover" */}
    {/*   objectPosition="center bottom" */}
    {/* /> */}
    <div
      className="absolute inset-0"
      style={{ backgroundColor: 'rgb(0 0 0 / 50%)' }}
    />
    <div className="justify-start m-8 sm:m-16 relative max-w-md h-full">
      <IntroductionText />
    </div>
  </div>
)

const IntroductionText = () => (
  <div className="text-white transform lg:-translate-x-40 lg:translate-y-8">
    <h1
      className="font-bold uppercase text-5xl md:text-5xl mb-4"
      style={{
        lineHeight: '1',
      }}
    >
      Change The Way You Get Dressed
    </h1>
    <span className="mb-8 text-xl leading-tight">
      Create your dream wardrobe without the guilt.
      <br />
      Discover and rent independent and sustainable brands.
    </span>
    <span>
      <Link href="/products/clothing">
        <a>
          <Button role="cta" className="p-4 text-lg md:text-lg font-bold">
            Find Your Look
          </Button>
        </a>
      </Link>
    </span>
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

const WhyRent = () => (
  <div
    className="relative items-center w-full"
    id="why-rent"
    style={{
      minHeight: '60vh',
    }}
  >
    <div
      className="relative w-full"
      style={{
        height: '60vh',
        minHeight: '300px',
      }}
    >
      {/* <Image */}
      {/*   src={whyRentPic} */}
      {/*   alt="Feel good" */}
      {/*   layout="fill" */}
      {/*   placeholder="blur" */}
      {/*   objectFit="cover" */}
      {/*   objectPosition="center" */}
      {/* /> */}
      <div className="absolute mt-8 mr-8 right-0 left-0 md:m-0 items-end md:justify-center md:items-center top-0 bottom-0 text-white">
        <div className="md:transform md:translate-x-full">
          <Heading>Why Rent</Heading>
        </div>
      </div>
    </div>
    <div className="w-full py-16 items-center">
      <div
        className="w-full
        flex max-w-md md:max-w-none
        md:grid gap-y-8 auto-cols-fr grid-cols-2 px-8
        gap-x-8 xl:gap-x-16 lg:gap-y-8 lg:max-w-screen-lg
        "
      >
        {whyRent.map((item) => (
          <WhyRentItem key={item.label} item={item} />
        ))}
      </div>
    </div>
  </div>
)

const WhyRentItem = ({ item }) => (
  <div className="w-full items-start flex-row">
    <div className="w-20 h-20 lg:w-24 lg:h-24 relative">
      <Image
        alt={item.label}
        src={`/media/home/${item.icon}`}
        layout="fill"
        objectFit="contain"
      />
    </div>
    <div className="w-full ml-3 sm:ml-6">
      <span className="text-left font-bold text-lg">{item.label}</span>
      <span className="text-left text-gray leading-tight">{item.content}</span>
    </div>
  </div>
)

const productCategories = [
  // {
  //   title: 'Oh My Gown',
  //   text: 'The Formal Edit',
  //   src: formalClothingPic,
  //   alt: 'Pink dress for formal occasions',
  //   href: '/products/clothing/gowns',
  //   position: 'center 20%',
  // },
  {
    title: 'Our Holidays Treats',
    text: 'Sparkle season has arrived',
    src: holidaysTreatsPic,
    alt: 'Dress fit for holidays',
    href: '/products/clothing?occasions=holiday',
    position: 'center',
  },
  // {
  //   title: 'Say I (HEN) Do',
  //   text: 'Find Your Wedding Bliss',
  //   src: weddingDressesPic,
  //   alt: 'White wedding dress for your wedding',
  //   href: '/products/clothing?occasions=bridal',
  //   position: 'center',
  // },
]

const ProductCategories = () => (
  <div className="w-full flex-row space-x-8 md:space-x-16 mb-8">
    {productCategories.map((data) => (
      <div key={data.title} className="w-full items-center">
        <Link href={data.href}>
          <a className="w-full h-96 md:h-128 relative">
            <Image
              alt={data.alt}
              src={data.src}
              layout="fill"
              objectFit="cover"
              objectPosition={data.position}
            />
          </a>
        </Link>
        <div className="w-full items-center my-4">
          <Link href={data.href}>
            <a>
              <span className="font-bold uppercase underline">
                {data.title}
              </span>
            </a>
          </Link>
          <Link href={data.href}>
            <a>
              <span>{data.text}</span>
            </a>
          </Link>
        </div>
      </div>
    ))}
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
      <Heading>How It Works</Heading>
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

export const Page = ({ products }) => {
  return (
    <Layout spacing={false}>
      <Home products={products} />
    </Layout>
  )
}

const reviews = [
  {
    quote: `I contacted Infinite Closet regarding a very last minute dress request. At the time the dress in question wasn’t available to rent, so Infinite Closet very kindly shipped the dress in for me. What’s more, I’m not based in London- so they sent the dress via next day delivery so it arrived the day before my event.
      I cannot recommend this company enough! They bent over backwards to ensure I got the dress I wanted & in time. Communication throughout was fantastic. Very grateful. 10/10`,
    name: 'Ella McNulty',
    image: reviewImage1,
  },
  {
    quote: `I stumbled across Infinite Closet on instagram and had to check it out with upcoming weddings!
      I hate spending loads of money on a dress only to wear it once so this was a perfect solution. I fell in love with a stunning Rat & Boa dress but wasn't sure what size to get so emailed the team and they were friendly and helpful.
      I got the perfect size, the perfect dress, and for such an amazing price. Can't wait to order again!`,
    name: 'Rachel Benson',
    smallPosition: 'bottom center',
    image: reviewImage2,
  },
  {
    quote: `The process was really seamless!! Amazing dress options and easy to find one for a wedding I went to. The value was amazing and customer service is top notch.
      Even the delivery company, Hive, is sustainable and went above and beyond to make sure I received my package on time.
      I would definitely recommend for anytime a dress is needed for an event. Not only will you look good, but you will feel good about making a more sustainable fashion choice.`,
    name: 'Julia Donlin',
    image: reviewImage3,
  },
]

const UserReviews = () => {
  return (
    <div className="my-16 w-full items-center max-w-screen-xl" id="instagram">
      <Heading>Reviews</Heading>
      <div className="relative mt-6">
        <TrustPilotReviews />
      </div>
      <div className="px-8 w-full lg:justify-center overflow-x-auto md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-16 mb-8 md:h-128">
        {reviews.map((review) => (
          <Review key={review.name} {...review} />
        ))}
      </div>
    </div>
  )
}

const Review = ({ quote, name, image, smallPosition="center"}) => {
  const [hover, setHover] = React.useState(null)

  return (
    <>
      <div
        className="w-1/3 relative hidden md:flex"
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <Image
          alt={name}
          src={image}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          placeholder="blur"
        />
        <div className={`h-full w-full relative transition-all duration-300
          ${hover ? 'opacity-100' : 'opacity-0'}
          `}>
          <div className={`absolute inset-0
            `}
            style={{
              ...(hover
                ? { backgroundColor: '#DDDDDDAA', backdropFilter: 'blur(4px)' }
                : {}),
            }}
          />
          <span
            className="absolute top-0 left-0 ml-6 -mt-8 text-sec"
            style={{ fontSize: '1000%' }}
          >
            &ldquo;
          </span>
          <div className="absolute bottom-0 right-0 p-4 font-bold text-xl">
            - {name}
          </div>
          <div
            className={`justify-center px-4 lg:px-8 transition-all duration-300 relative z-10 mt-20 lg:mt-24
              ${hover ? 'opacity-100' : 'opacity-0'}
              `}
          >
            <span className="text-sm lg:text-base">&emsp;{quote}</span>
          </div>
        </div>
      </div>

      <div className="w-full sm:hidden relative">
        <div className="w-full h-72 relative">
          <Image
            alt={name}
            src={image}
            layout="fill"
            objectFit="cover"
            objectPosition={smallPosition}
            placeholder="blur"
          />
        </div>
        <div className="h-full w-full relative transition-all duration-300">
          <div className="absolute inset-0"
            style={{ backgroundColor: '#DDDDDDAA', backdropFilter: 'blur(4px)' }}
          />
          <span
            className="absolute top-0 left-0 ml-6 -mt-20 text-sec"
            style={{ fontSize: '1000%' }}
          >
            &ldquo;
          </span>
          <div className="justify-center px-8 transition-all duration-300 relative z-10 mt-12">
            <span className="text-sm sm:text-base">&emsp;{quote}</span>
          </div>
          <div className="absolute bottom-0 right-0 p-4 font-bold text-xl">
            - {name}
          </div>
        </div>
      </div>

      <div className="w-full hidden sm:flex md:hidden relative">
        <Image
          alt={name}
          src={image}
          layout="fill"
          objectFit="cover"
          objectPosition={smallPosition}
          placeholder="blur"
        />
        <div className="mt-48 h-full w-full relative transition-all duration-300">
          <div className="absolute inset-0"
            style={{ backgroundColor: '#DDDDDDAA', backdropFilter: 'blur(4px)' }}
          />
          <span
            className="absolute top-0 left-0 ml-6 -mt-20 text-sec"
            style={{ fontSize: '1000%' }}
          >
            &ldquo;
          </span>
          <div className="absolute bottom-0 right-0 p-4 font-bold text-xl">
            - {name}
          </div>
          <div className="justify-center px-8 transition-all duration-300 relative z-10 mt-12 mb-16">
            <span className="">&emsp;{quote}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  let products = [
    'greta-outer-space-dress',
    'illegal-halter',
    'polka-blue-dots',
    'simone-night-fall',
  ]
  products = await axios
    .get(`/products?slug_in=${products.join('&slug_in=')}`)
    .then((res) => res.data)
    .then((res) =>
      res.sort(
        (p1, p2) => products.indexOf(p1.slug) - products.indexOf(p2.slug)
      )
    )
  return {
    props: {
      products,
    },
  }
}

export default Page

const InstagramSlider = () => {
  return (
    <div className="my-16 w-full items-center max-w-screen-xl" id="instagram">
      <Heading>What's Happening</Heading>
      <div className="px-8 w-full lg:justify-center overflow-x-auto flex-row space-x-4 mt-16 mb-8">
        <InstgramEmbedding link="https://www.instagram.com/p/CWdN-DugTBE/?utm_source=ig_embed&amp;utm_campaign=loading" />
        <InstgramEmbedding link="https://www.instagram.com/p/CWOQZQPgweH/?utm_source=ig_embed&amp;utm_campaign=loading" />
        <InstgramEmbedding link="https://www.instagram.com/p/CV-lpmlAfW_/?utm_source=ig_embed&amp;utm_campaign=loading" />
      </div>
    </div>
  )
}

const TrustPilotReviews = () => (
  <div
    className="trustpilot-widget"
    data-locale="en-GB"
    data-template-id="5419b6a8b0d04a076446a9ad"
    data-businessunit-id="6086b3b957503000011370f7"
    data-style-height="24px"
    data-style-width="100%"
    data-theme="light"
    data-stars="1,2,3,4,5"
    data-no-reviews="hide"
    data-scroll-to-list="true"
    data-allow-robots="true"
    data-min-review-count="10"
  >
    <a
      href="https://uk.trustpilot.com/review/infinitecloset.co.uk"
      target="_blank"
      rel="noopener"
    >
      Trustpilot
    </a>
  </div>
)

const InstgramEmbedding = ({ link }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<blockquote class="instagram-media" data-instgrm-permalink="${link}" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15);
        margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;">
        <a href="https://www.instagram.com/p/CWdN-DugTBE/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none;
          width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/CWdN-DugTBE/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by UK’s Fashion Rental Platform (@infinitecloset.uk)</a></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script>`,
      }}
    />
  )
}
