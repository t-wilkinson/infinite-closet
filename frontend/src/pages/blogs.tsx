import React from 'react'
import axios from 'axios'

export const Page = ({ blogs }) => {
  return (
    <>
      {blogs.map((blog) => (
        <span key={blog.id}>{blog.title}</span>
      ))}
    </>
  )
}
export default Page

export async function getServerSideProps({ query }) {
  const [blogs] = await Promise.all([
    axios.get('/blogs').then((res) => res.data),
  ])

  return {
    props: {
      blogs,
    },
  }
}
