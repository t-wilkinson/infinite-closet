import React from 'react'
import Link from 'next/link'

import axios from '@/utils/axios'
import { StrapiDesigner } from '@/types/models'
import Layout from '@/Layout'

type Name = { name: string }

const alphabeticalSort = (v1: Name, v2: Name) => {
  if (v1.name < v2.name) {
    return -1
  }
  if (v1.name > v2.name) {
    return 1
  }
  return 0
}

const groupAlphabetically = (values: Name[]) => {
  return values.sort(alphabeticalSort).reduce(
    ([curLetter, groups], designer) => {
      const firstLetter = designer.name[0].toUpperCase()
      // @ts-ignore
      if (curLetter !== firstLetter) {
        // @ts-ignore
        curLetter = firstLetter
        groups.push({ firstLetter, designers: [] })
      }

      const curGroup = groups.slice(-1)[0]
      curGroup.designers.push(designer)
      return [curLetter, groups]
    },
    [null, []]
  )[1]
}

const ChangeTab = ({ currentPage, setPage, page, label }) =>
  <button onClick={() => setPage(page)} className={`
  ${currentPage === page ? 'underline' : ''}
  font-bold text-xl uppercase
  `}>
    {label}
  </button>

export const Page = () => {
  const [designers, setDesigners] = React.useState([])
  const [page, setPage] = React.useState(null)
  // categories slug === 'clothing'

  React.useEffect(() => {
    axios
      .get<StrapiDesigner[]>('/designers', { withCredentials: false })
      .then((designers) => {
        setDesigners(groupAlphabetically(designers))
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <Layout title="Designers" spacing={false}>
      <div className="my-16 relative font-bold uppercase text-3xl sm:text-4xl text-center items-center">
        <h2 className="relative">Designers</h2>
        <div className="w-1/2 sm:w-3/4 bg-pri h-2 -mt-3 absolute bottom-0 sm:right-0 mr-4 sm:mr-0" />
      </div>
      <div className="flex-row w-full max-w-screen-md justify-evenly mb-8">
        <ChangeTab currentPage={page} setPage={setPage} page={null} label="All" />
        <ChangeTab currentPage={page} setPage={setPage} page="clothing" label="Clothing" />
        <ChangeTab currentPage={page} setPage={setPage} page="accessories" label="Accessories" />
      </div>
      <div className="w-full max-w-screen-md my-4 px-0 sm:px-4 lg:px-0">
        <div className="grid grid-cols-3"
        >
          {designers.filter(({designers}) => {
            if (!page) {
              return true
            } else {
              return designers.some(designer => designer.products.some(product => product.categories.some(category => category.slug === page)))
            }
          }).map(({ firstLetter, designers }) => (
            <Designers
              key={firstLetter}
              firstLetter={firstLetter}
              designers={designers}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}

const Designers = ({ firstLetter, designers }) => (
  // <div className="flex-row w-full justify-end pl-8 my-8">
  <div className="pl-4 my-8">
    <h2 id={firstLetter} className="font-bold text-xl w-32">
      {firstLetter}
    </h2>
    <div className="flex-wrap w-full">
      {designers.map((designer) => (
        <div key={designer.id} className="w-1/2">
          <Link href={`/designers/${designer.slug}`}>
            <a className="">{designer.name}</a>
          </Link>
        </div>
      ))}
    </div>
  </div>
)

export default Page
