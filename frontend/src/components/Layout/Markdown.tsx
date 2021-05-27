import React from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import dayjs from 'dayjs'

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

// TODO: abstract this
export const components = {
  p: ({ children }) => <p className="my-2" children={children} />,
  ul: ({ children }) => <ul className="mb-4" children={children} />,
  li: ({ children }) => (
    <li className="ml-8 my-2 list-disc" children={children} />
  ),
  strong: ({ children }) => (
    <span className="block mt-4 mb-2 font-bold" children={children} />
  ),
  hr: () => <hr className="h-px bg-pri w-full my-2" />,
  em: ({ node, children }) => {
    if (node.children[0].tagName === 'strong') {
      return <strong className="font-subheader text-xl" children={children} />
    } else {
      return <em children={children} />
    }
  },
}

export const Markdown = ({ src }) => {
  const data = useMarkdown(src)
  const updated_at = data && dayjs(data.updated_at).format('MM/DD/YY')

  return (
    <>
      <Header />
      <div className="w-full items-center my-4">
        <div className="items-center mb-4">
          <span className="font-subheader text-center text-3xl">
            {data?.name}
          </span>
          <span className="text-gray-dark text-sm">
            Last Updated: {updated_at}
          </span>
        </div>
        <div className="w-full max-w-screen-lg">
          <ReactMarkdown className="markdown" components={components}>
            {data?.content}
          </ReactMarkdown>
        </div>
      </div>
      <Footer />
    </>
  )
}
export default Markdown
