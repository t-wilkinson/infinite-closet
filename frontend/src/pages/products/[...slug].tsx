import React from 'react'
import { useRouter } from 'next/router'

import Layout from '@/Layout'
import useData from '@/Layout/useData'
import { StrapiSize } from '@/types/models'
import axios from '@/utils/axios'
import * as sizing from '@/utils/sizing'
import { useDispatch } from '@/utils/store'

import Products from '@/Product'
import { sortData, QUERY_LIMIT } from '@/Product/constants'
import { productsActions } from '@/Product/slice'
import { Filters, Filter, ProductRoutes, SortBy } from '@/Product/types'

export const Page = ({ data }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const query = router.query
  const loading = useData(data)

  React.useEffect(() => {
    if (SortBy.includes(query.sort as any)) {
      dispatch(productsActions.setPanelSortBy(query.sort as any))
    }
  }, [loading, data])

  React.useEffect(() => {
    const filters = Filter.reduce((acc, filter) => {
      // prettier-ignore
      switch (typeof query[filter]) {
        case 'string': acc[filter] = [query[filter]]; break
        case 'object': acc[filter] = query[filter]; break
        default:       acc[filter] = []; break
      }
      return acc
    }, {})

    dispatch(productsActions.setPanelFilters(filters as Filters))
  }, [data])

  return (
    <>
      <Layout title="Clothing">
        <Products data={data} loading={loading} />
      </Layout>
    </>
  )
}
export default Page

export async function getServerSideProps({ params, query }) {
  if (params.slug.length === 0 || !ProductRoutes.includes(params.slug[0])) {
    return {
      notFound: true,
    }
  }

  const page = query.page > 0 ? query.page : 1
  const sort = sortData[query.sort]?.value ?? sortData.Alphabetical.value
  const { products, count, filters, categories } = await axios.get(
    `/products/filters`,
    {
      params: {
        sort,
        start: (page - 1) * QUERY_LIMIT,
        limit: QUERY_LIMIT,
        categories: query.slug,
        ...Filter.reduce((acc, filter) => (acc[filter] = query[filter], acc), {})
      },
      withCredentials: false,
    }
  )

  for (const product of products) {
    for (const [key, size] of Object.entries(product.sizes as StrapiSize[])) {
      product.sizes[key].size = sizing.normalize(size.size || '')
      product.sizes[key].sizeRange = sizing.normalize(size.sizeRange || '')
    }
  }

  return {
    props: {
      data: {
        products,
        productsCount: count,
        ...filters,
        categories,
      },
    },
  }
}
