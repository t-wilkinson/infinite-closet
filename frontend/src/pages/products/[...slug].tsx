import React from 'react'
import { useRouter } from 'next/router'
import qs from 'qs'

import useData from '@/Layout/useData'
import { useDispatch } from '@/utils/store'
import { fetchAPI } from '@/utils/api'
import { Filter, Filters, ProductRoutes, SortBy } from '@/Products/types'
import Products from '@/Products'
import { sortData, filterData } from '@/Products/constants'
import { productsActions } from '@/Products/slice'
import { QUERY_LIMIT } from '@/Products/constants'
import Layout from '@/Layout'

export const Page = ({ data }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const query = router.query
  const loading = useData(data)

  React.useEffect(() => {
    if (SortBy.includes(query.sort as any))
      dispatch(productsActions.setPanelSortBy(query.sort as any))

    const filters = Filter.reduce((acc, filter) => {
      const { filterName } = filterData[filter]
      switch (typeof query[filterName]) {
        case 'string':
          acc[filter] = [query[filterName]]
          break
        case 'object':
          acc[filter] = query[filterName]
          break
        default:
          acc[filter] = []
          break
      }
      return acc
    }, {})
    dispatch(productsActions.setPanelFilters(filters as Filters))
  }, [loading, data])

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
    _start: (page - 1) * QUERY_LIMIT,
    _limit: QUERY_LIMIT,
  })
  const _filters = Filter.map((filter) => {
    const { filterName } = filterData[filter]
    return str({ [filterName + '.slug_in']: query[filterName] })
  })
    .filter((v) => v)
    .join('&')

  let _where = str({
    _sort: sort,
    'categories.slug_in': query.slug,
  })
  _where = [_where, _filters].join('&')

  const [productsCount, products, designers] = await Promise.all([
    fetchAPI(`/products/count?${_where}`),
    fetchAPI(`/products?${_paging}&${_where}`),
    fetchAPI(`/designers`), // TODO: this includes all of designers relations
  ])

  // TODO: could also move this to backend
  //   // TODO: should maybe do this async
  //   products.reduce((filters, product) => {
  //     for (const filter in filters) {
  //       for (const item of product[filter]) {
  //         if (!(item.slug in filters[filter])) {
  //           filters[filter][item.slug] = item
  //         }
  //       }
  //     }
  //     return filters
  //   }, Filter.reduce((acc, filter) => (acc[filter.toLowerCase()] = {}, acc), {}))

  return {
    props: {
      data: { products, productsCount, designers },
    },
  }
}

const str = (props: object) =>
  qs.stringify(props, { encode: false, indices: false, allowDots: true })
