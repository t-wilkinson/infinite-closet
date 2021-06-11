import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import dayjs from 'dayjs'
import Head from 'next/head'
import Image from 'next/image'

import { getURL } from '@/utils/api'
import Header from '@/Layout/Header'
import Footer from '@/Layout/Footer'
import { ScrollUp } from '@/components'
import { readingTime } from '@/Markdown'
import { fetchMarkdown, components as _components } from '@/Markdown'

export const components = {
  ..._components,
  li: ({ node, children }) => {
    try {
      if (node.children[1].children[0].tagName !== 'strong') {
        throw new Error()
      } else {
        return <li className="list-inside mb-2 mt-8" children={children} />
      }
    } catch {
      return <li className="ml-8 my-2" children={children} />
    }
  },

  center: ({ children }) => (
    <p className="my-2 flex justify-center" children={children} />
  ),

  p: ({ children }) => <p className="my-2 inline-block" children={children} />,

  figure: ({ children }) => (
    <figure className="flex flex-col items-center my-8" children={children} />
  ),

  img: ({ src }) => (
    <div className="max-w-md relative">
      <img src={getURL(src)} />
    </div>
  ),
}

const Blog = ({ published_at, updated_at, name, content, subtitle, image }) => {
  updated_at = dayjs(updated_at).format('MM/DD/YY')
  const [minutes] = readingTime(content)

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <Header />
      <div className="w-full items-center my-10">
        <div className="w-full max-w-screen-md">
          <div className="items-left mb-10">
            <span className="font-bold text-left text-4xl">{name}</span>
            <span className="text-gray text-left text-lg">{subtitle}</span>
            <span className="text-gray-dark text-sm mt-2">
              {dayjs(published_at).format('MMM DD')} · {minutes} min read
            </span>
          </div>
          <div className="relative w-full h-128">
            <Image src={getURL(image.url)} layout="fill" objectFit="contain" />
          </div>
          <div className="w-full px-4 lg:px-0">
            <ReactMarkdown
              className="markdown"
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[gfm]}
              components={components}
              children={content}
            />
          </div>
        </div>
      </div>
      <Footer />
      <ScrollUp />
    </>
  )
}

export const Page = ({ data }) => {
  return <Blog {...data} name={data.title} />
}
export const getServerSideProps = fetchMarkdown({ path: '/blogs' })
export default Page
