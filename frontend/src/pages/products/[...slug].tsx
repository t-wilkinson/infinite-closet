import React from 'react'
import { useRouter } from 'next/router'
import qs from 'qs'

import useData from '@/Layout/useData'
import { useDispatch } from '@/utils/store'
import { fetchAPI } from '@/utils/api'
import { Filters, Filter, ProductRoutes, SortBy } from '@/Products/types'
import Products from '@/Products'
import { sortData } from '@/Products/constants'
import { productsActions } from '@/Products/slice'
import { QUERY_LIMIT } from '@/Products/constants'
import Layout from '@/Layout'

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
      switch (typeof query[filter]) {
        case 'string':
          acc[filter] = [query[filter]]
          break
        case 'object':
          acc[filter] = query[filter]
          break
        default:
          acc[filter] = []
          break
      }
      return acc
    }, {})

    dispatch(productsActions.setPanelFilters(filters as Filters))
  }, [data])

  return (
    <>
      <Layout title="Rent Products | Infinite Closet">
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
  const sort = sortData[query.sort]?.value ?? 'created_by:ASC'
  const _paging = str({
    start: (page - 1) * QUERY_LIMIT,
    limit: QUERY_LIMIT,
  })
  const _filters = Filter.map((filter) => str({ [filter]: query[filter] }))
    .filter((v) => v)
    .join('&')

  let _where = str({
    sort: sort,
    categories: query.slug,
  })
  _where = [_where, _filters].join('&')

  const { products, count, filters } = await fetchAPI(
    `/products/filters?${_paging}&${_where}`,
  )

  return {
    props: {
      data: {
        products,
        productsCount: count,
        ...filters,
      },
    },
  }
}

const str = (props: object) =>
  qs.stringify(props, { encode: false, indices: false, allowDots: true })
