import React from 'react'
import ReactMarkdown from 'react-markdown'
import Head from 'next/head'
import axios from 'axios'
import dayjs from 'dayjs'
import gfm from 'remark-gfm'

import { StrapiDocument } from '@/utils/models'

import Header from './Header'
import Footer from './Footer'

export const useMarkdown = (src: string) => {
  const [data, setData] = React.useState<StrapiDocument | null>()

  React.useEffect(() => {
    axios
      .get(`/documents?slug=${src}`)
      .then((res) => {
        if (res.data[0]) {
          setData(res.data[0])
        } else {
        }
      })
      .catch((err) => console.error(err))
  }, [])

  return data
}

export const components = {
  h2: ({ children }) => (
    <>
      <strong className="font-subheader text-xl mt-8" children={children} />
      <span className="block h-px bg-pri w-full my-2" />
    </>
  ),

  h3: ({ children }) => (
    <span className="block mt-4 mb-2 font-bold" children={children} />
  ),

  p: ({ children }) => <p className="my-2" children={children} />,
  ul: ({ children }) => <ul className="mb-4 list-disc" children={children} />,
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal" children={children} />
  ),
  li: ({ node, children }) => {
    try {
      if (node.children[1].children[0].tagName !== 'strong') {
        throw new Error()
      } else {
        return <li className="ml-4 mb-2 mt-8" children={children} />
      }
    } catch {
      return <li className="ml-8 my-2" children={children} />
    }
  },
  strong: ({ children }) => (
    <strong className="font-bold" children={children} />
  ),
  hr: () => <hr className="h-px bg-pri w-full my-2" />,
  em: ({ children }) => <em children={children} />,
  blockquote: ({ children }) => (
    <blockquote className="ml-8" children={children} />
  ),
  table: ({ children }) => (
    <table className="my-4 border border-gray" children={children} />
  ),
  th: ({ children }) => (
    <th className="border border-gray p-2 bg-gray-light" children={children} />
  ),
  td: ({ children }) => (
    <td className="border border-gray p-2" children={children} />
  ),
}

export const Markdown = ({ src }) => {
  const data = useMarkdown(src)
  const updated_at = data && dayjs(data.updated_at).format('MM/DD/YY')

  return (
    <>
      <Head>
        <title>{data?.name || 'Infinite Closet'}</title>
      </Head>
      <Header />
      <div className="w-full items-center my-10">
        <div className="items-center mb-10">
          <span className="font-subheader text-center text-4xl">
            {data?.name}
          </span>
          <span className="text-gray-dark text-sm">
            Last Updated: {updated_at}
          </span>
        </div>
        <div className="w-full px-4 lg:px-0 lg:max-w-screen-lg">
          <ReactMarkdown
            className="markdown"
            remarkPlugins={[gfm]}
            components={components}
            children={data?.content}
          />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Markdown
