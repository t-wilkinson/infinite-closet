import React from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import gfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import dayjs from 'dayjs'
import Head from 'next/head'

import Header from '@/Layout/Header'
import Footer from '@/Layout/Footer'
import { ScrollUp } from '@/components'

export const components = {
  h2: ({ children }) => (
    <>
      <h2 className="font-subheader text-xl mt-8" children={children} />
      <span className="block h-px bg-pri w-full my-2" />
    </>
  ),
  a: ({ children, href }) => (
    <a href={href}>
      <span className="cursor-pointer text-blue-500">{children}</span>
    </a>
  ),
  h3: ({ children }) => (
    <h3 className="block mt-4 mb-2 font-bold" children={children} />
  ),
  p: ({ children }) => <p className="my-2" children={children} />,
  pre: ({ children }) => <p className="my-2" children={children} />,
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

export const MarkdownWrapper = ({ updated_at, name, content }) => {
  updated_at = dayjs(updated_at).format('MM/DD/YY')

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <Header />
      <main className="flex flex-col w-full items-center my-10">
        <div className="items-center mb-10">
          <h1 className="font-subheader text-center text-4xl">{name}</h1>
          <span className="text-gray-dark text-sm">
            Last Updated: {updated_at}
          </span>
        </div>
        <Markdown content={content} />
      </main>
      <Footer />
      <ScrollUp />
    </>
  )
}

export const Markdown = ({ content }) => (
  <div className="w-full px-4 lg:px-0 lg:max-w-screen-lg">
    <ReactMarkdown
      className="markdown"
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[gfm]}
      // @ts-ignore
      components={components}
      children={content}
    />
  </div>
)

export const fetchMarkdown =
  ({ slug = undefined, path = '/documents' }) =>
  async ({ query, resolvedUrl }) => {
    if (!slug && query.slug) {
      slug = query.slug
    } else if (!slug) {
      slug = resolvedUrl.split('/').slice(-1)[0]
    }

    return {
      props: {
        data: {
          ...(await axios.get(`${path}?slug=${slug}`)).data[0],
        },
      },
    }
  }

export const readingTime = (content: string) => {
  const words = content.split(/[ \n]/).filter((v) => v).length
  const wordsPerMinute = words / 200
  const [minutes, _seconds] = wordsPerMinute.toString().split('.').map(Number)
  const seconds = Math.floor(_seconds * 0.6)
  return [minutes, seconds]
}

export default Markdown
