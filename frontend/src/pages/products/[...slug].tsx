import React from 'react'
import { useRouter } from 'next/router'

import { useDispatch } from '@/utils/store'
import { fetchAPI } from '@/utils/api'
import {
  Filter,
  Filters,
  ProductRoutes,
  FilterFields,
  SortBy,
} from '@/Products/types'
import Products from '@/Products'
import { sortData, filterData } from '@/Products/constants'
import { productsActions } from '@/Products/slice'
import { QUERY_LIMIT } from '@/Products/constants'

export const Page = ({ data }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const query = router.query

  const [loading, setLoading] = React.useState(false)
  const startLoading = () => setLoading(true)
  const stopLoading = () => setLoading(false)

  React.useEffect(() => {
    dispatch(productsActions.dataReceived(data))
    dispatch(productsActions.setLoading(loading))
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

  React.useEffect(() => {
    router.events.on('routeChangeStart', startLoading)
    router.events.on('routeChangeComplete', stopLoading)
    return () => {
      router.events.off('routeChangeStart', startLoading)
      router.events.off('routeChangeComplete', stopLoading)
    }
  }, [])

  return <Products />
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
  const filters = `_sort=${sort}&categories.slug_in=${params.slug}`
  const paging = `_start=${(page - 1) * QUERY_LIMIT}&_limit=${QUERY_LIMIT}`

  let where = Filter.reduce((acc, filter) => {
    const { filterName } = filterData[filter]
    const contains = '&' + filterName + '_contains' + '='
    if (!FilterFields.includes(filterName)) return acc
    switch (typeof query[filterName]) {
      case 'string':
        return acc + contains + query[filterName]
      case 'object':
        return acc + contains + query[filterName].join(contains)
      default:
        return acc
    }
  }, '')

  const [productsCount, products] = await Promise.all([
    fetchAPI(`/products/count?${filters}&${where}`),
    fetchAPI(`/products?${paging}&${filters}&${where}`),
  ])

  return {
    props: {
      data: { products, productsCount },
    },
  }
}
