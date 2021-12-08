import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

export const Page = () => {
  const [designers, setDesigners] = React.useState([])

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
      <div className="h-96 w-full relative items-center justify-center">
        <div className="relative z-10 p-4 bg-sec text-white">
          <h1 className="font-subheader text-5xl">Designers</h1>
        </div>
        <Image
          alt=""
          src="/media/brand/facebook-banner.png"
          layout="fill"
          objectFit="cover"
          objectPosition="top center"
        />
      </div>
      <div className="w-full max-w-screen-md my-4 px-4 lg:px-0">
        <div className="flex-row flex-wrap">
          {designers.map(({ firstLetter }) => (
            <button
              key={firstLetter}
              onClick={() =>
                document.querySelector(`#${firstLetter}`).scrollIntoView()
              }
              className="text-pri mr-4"
            >
              {firstLetter}
            </button>
          ))}
        </div>
        {designers.map(({ firstLetter, designers }) => (
          <Designers
            key={firstLetter}
            firstLetter={firstLetter}
            designers={designers}
          />
        ))}
      </div>
    </Layout>
  )
}

const Designers = ({ firstLetter, designers }) => (
  <div className="flex-row w-full justify-end pl-8 my-8">
    <h2 id={firstLetter} className="font-bold text-xl w-32">
      {firstLetter}
    </h2>
    <div className="md:flex-row flex-wrap w-full ml:16 md:ml-32">
      {designers.map((designer) => (
        <div key={designer.id} className="w-1/2">
          <Link href={`/designers/${designer.slug}`}>
            <a className="text-pri">{designer.name}</a>
          </Link>
        </div>
      ))}
    </div>
  </div>
)

export default Page
