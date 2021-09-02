import React from 'react'
import axios from 'axios'

import Layout from '@/Layout'
import { SizeChart } from '@/Shop/Size'

export const Page = () => {
  const [sizeChart, setSizeChart] = React.useState()

  React.useEffect(() => {
    axios
      .get('/size-chart')
      .then((res) => res.data)
      .then(setSizeChart)
      .catch((err) => console.error(err))
  }, [])

  return (
    <Layout title="Size Charts">
      {sizeChart && <SizeChart {...sizeChart} />}
    </Layout>
  )
}

export default Page
