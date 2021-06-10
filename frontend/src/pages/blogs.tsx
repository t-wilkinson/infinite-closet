import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import Image from 'next/image'
import dayjs from 'dayjs'

import { getURL } from '@/utils/api'
import { StrapiBlog } from '@/utils/models'
import { readingTime } from '@/Markdown'
import Header from '@/Layout/Header'
import Footer from '@/Layout/Footer'

export const Page = ({ blogs }) => {
  return (
    <>
      <Header />
      <div className="items-center py-8 space-y-4 h-full">
        {blogs.map((blog: StrapiBlog) => {
          const [minutes] = readingTime(blog.content)
          return (
            <Link key={blog.id} href={`/blogs/${blog.slug}`}>
              <a>
                <div className="flex-row max-w-xl items-center rounded-md p-4">
                  <div className="w-full">
                    <span className="text-xl font-bold">{blog.title}</span>
                    <span className="text-gray text-sm">{blog.subtitle}</span>
                    <span className="text-gray text-xs mt-2">
                      {dayjs(blog.published_at).format('MMM DD')} · {minutes}{' '}
                      min read
                    </span>
                  </div>
                  <div className="w-48 h-48 relative">
                    <Image
                      src={getURL(blog.image.url)}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
              </a>
            </Link>
          )
        })}
      </div>
      <Footer />
    </>
  )
}
export default Page

export async function getServerSideProps({}) {
  const [blogs] = await Promise.all([
    axios.get('/blogs').then((res) => res.data),
  ])

  return {
    props: {
      blogs,
    },
  }
}
