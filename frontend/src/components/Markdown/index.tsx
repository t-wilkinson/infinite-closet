import React from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import gfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import dayjs from 'dayjs'
import Link from 'next/link'

import Layout from '@/Layout'
import { ScrollUp, Divider } from '@/components'

const headingToID = (heading: string): string =>
  heading.toLowerCase().replace(/ /g, '-')

export const components = {
  h2: ({ children }) => (
    <>
      <h2
        id={headingToID(children[0])}
        className="font-subheader text-xl mt-8"
        children={children}
      />
      <span className="block h-px bg-pri w-full my-2" />
    </>
  ),
  a: ({ children, href }) => (
    <a href={href}>
      <span className="cursor-pointer text-blue-500">{children}</span>
    </a>
  ),
  h3: ({ children }) => (
    <h3
      id={headingToID(children[0])}
      className="block mt-4 mb-2 font-bold"
      children={children}
    />
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

export const MarkdownWrapper = ({
  updated_at,
  name,
  content,
  children = null,
}) => {
  updated_at = dayjs(updated_at).format('MM/DD/YY')

  return (
    <Layout title={name}>
      <div className="my-10">
        <div className="items-center mb-10">
          <h1 className="font-subheader text-center text-4xl">{name}</h1>
          <span className="text-gray-dark text-sm">
            Last Updated: {updated_at}
          </span>
        </div>
        <div className="sm:flex-row">
          <TableOfContents />
          <div className="w-full items-center">
            <Markdown content={content} />
            {children}
          </div>
        </div>
      </div>
      <ScrollUp />
    </Layout>
  )
}

export const TableOfContents = () => {
  const [headings, setHeadings] = React.useState([])
  const [selected, setSelected] = React.useState(null)

  React.useEffect(() => {
    const headings = []

    const toc = (hier, heading) => {
      const lvl = Number(heading.tagName.match(/\d+/)[0]) - 1
      if (lvl === 2 && headings[hier]) {
        headings[hier].children.push(heading.innerText)
      } else if (lvl === 1) {
        hier = headings.length
        headings.push({ heading: heading.innerText, children: [] })
      }
      return hier

      // if (lvl < hier.length) {
      //   hier = hier.slice(0, lvl)
      // } else if (lvl > hier.length) {
      // } else {
      // }
    }

    Array.from(document.querySelectorAll('h2,h3')).reduce(
      (hier, heading) => toc(hier, heading),
      -1
    ),
      setHeadings(headings)
  }, [])

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="w-full sm:w-1/3 items-start p-4 space-y-2">
      <Divider />
      <nav className="flex flex-col items-center sm:items-start w-full space-y-2">
        {headings.map(({ heading, children }) => (
          <React.Fragment key={heading}>
            <Link href={`#${headingToID(heading)}`}>
              <a onClick={() => setSelected(heading)}>
                <span className="text-lg font-subheader hover:underline">
                  {heading}
                </span>
              </a>
            </Link>
            {/* {selected === heading && */}
            {/*   children.map((heading) => ( */}
            {/*     <Link key={heading} href={`#${headingToID(heading)}`}> */}
            {/*       <a> */}
            {/*         <span className="text-lg hover:underline">{heading}</span> */}
            {/*       </a> */}
            {/*     </Link> */}
            {/*   ))} */}
          </React.Fragment>
        ))}
      </nav>
      <Divider />
    </div>
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

// Odd bug: seems `props.data.slug` is passed back in and used for similar calls
export const fetchMarkdown =
  ({ slug = null, path = '/documents' }) =>
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
