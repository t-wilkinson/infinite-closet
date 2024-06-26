import React from 'react'

import axios from '@/utils/axios'
import Layout from '@/Layout'
import { SizeChart } from '@/Product/SizeChart'

export const Page = () => {
  const [sizeChart, setSizeChart] = React.useState()

  React.useEffect(() => {
    axios
      .get('/size-chart', { withCredentials: false })
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
