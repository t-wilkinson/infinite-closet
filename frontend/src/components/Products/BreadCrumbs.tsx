import Link from 'next/link'
import { useRouter } from 'next/router'

import { capitalize } from '@/utils/helpers'
import { routes } from '@/utils/constants'

export const Crumbs = ({ slug, ...props }) => {
  return (
    <div {...props} style={{ flexDirection: 'row' }}>
      {['browse', ...slug].map((v, i) => {
        if (i === slug.length) return <span key={v}>{capitalize(v)}</span>
        else
          return (
            <span key={v} className="text-gray-dark whitespace-pre">
              {capitalize(v)} /{' '}
            </span>
          )
      })}
    </div>
  )
}

export const BreadCrumbs = ({}) => {
  // TODO: remove .slice()
  const slug = useRouter().query.slug.slice(0, 1) as string[]

  return (
    <div className="items-start mb-2 w-full px-1 hidden sm:flex">
      <span className="mb-4">
        <Crumbs slug={slug} className="hidden sm:flex text-sm" />
      </span>
      {routes
        .find((el) => el.value === slug[0])
        ?.data[0].data.map((el: { label: string; href: string }) => {
          if (el.href) {
            return (
              <Link key={el.label} href={el.href}>
                <a>
                  <span className="cursor-pointer hover:underline mb-1">
                    {el.label}
                  </span>
                </a>
              </Link>
            )
          } else {
            return (
              <span key={el.label} className="mb-1 text-gray">
                {el.label}
              </span>
            )
          }
        })}
    </div>
  )
}

export default BreadCrumbs
