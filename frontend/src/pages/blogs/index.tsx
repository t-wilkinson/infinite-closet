import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'

import axios, { getURL } from '@/utils/axios'
import { StrapiBlog } from '@/utils/models'
import { readingTime } from '@/Markdown'
import Layout from '@/Layout'

export const Page = ({ blogs }) => {
  return (
    <Layout title="Blogs" className="py-8 space-y-4">
      {blogs.map((blog: StrapiBlog) => {
        const [minutes] = readingTime(blog.content)
        return (
          <Link key={blog.id} href={`/blogs/${blog.slug}`}>
            <a>
              <div className="flex-row max-w-xl items-center rounded-md p-4 border border-gray-light">
                <div className="w-full mr-2">
                  <span className="text-xl font-bold">{blog.title}</span>
                  <span className="text-gray text-sm">{blog.subtitle}</span>
                  <span className="text-gray text-xs mt-2">
                    {dayjs(blog.published_at).format('MMM DD')} · {minutes} min
                    read
                  </span>
                </div>
                <div className="w-48 h-48 relative">
                  <Image
                    src={getURL(
                      (blog.thumbnail || blog.image).formats.small.url
                    )}
                    alt={blog.image.alternativeText}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
            </a>
          </Link>
        )
      })}
    </Layout>
  )
}
export default Page

export async function getServerSideProps({}) {
  const [blogs] = await Promise.all([
    axios.get('/blogs', { withCredentials: false }),
  ])

  return {
    props: {
      blogs,
    },
  }
}
