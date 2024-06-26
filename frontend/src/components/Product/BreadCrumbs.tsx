import Link from 'next/link'

import { StrapiCategory } from '@/types/models'
import { capitalize } from '@/utils/helpers'

export const BreadCrumbs = ({ href = '/products', categories }) => {
  const category = categories[0]

  return (
    <div className="items-start mb-2 w-full px-1 hidden sm:flex">
      <span className="mb-4">
        <Crumbs
          href={href}
          slugs={categories.map((v) => v.slug)}
          className="hidden sm:flex text-sm"
        />
      </span>

      {category && (
        <BreadCrumb
          {...category}
          categories={categories}
          href={
            category.slug === 'root' ? `${href}` : `${href}/${category.slug}`
          }
          level={0}
        />
      )}
    </div>
  )
}

export const Crumbs = ({ href = '/products', slugs = [], ...props }) => {
  return (
    <div {...props} style={{ flexDirection: 'row' }}>
      <Link href={href}>
        <a>
          <span className="text-gray whitespace-pre">Browse</span>
        </a>
      </Link>
      {slugs.map((v, i) => (
        <Link
          key={v}
          href={
            v === 'root'
              ? `${href}`
              : `${href}/${slugs.slice(0, i + 1).join('/')}`
          }
        >
          <a>
            {i === slugs.length - 1 ? (
              <span>
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <span className="hover:underline">
                  {v === 'root' ? '' : capitalize(v)}
                </span>
              </span>
            ) : (
              <span>
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <span className="text-gray whitespace-pre hover:underline">
                  {capitalize(v)}
                </span>
              </span>
            )}
          </a>
        </Link>
      ))}
    </div>
  )
}

const BreadCrumb = ({ slug, name, href, level, categories }) => {
  const nextLevel = categories[level]
  const isNextLevel = nextLevel?.slug === slug
  const isMaxLevel = level >= categories.length
  const shouldNest = isNextLevel && !isMaxLevel
  const selectedSlug = categories.slice(-1)[0].slug

  return (
    <div key={slug} className="text-sm">
      <span className={`${selectedSlug === slug ? 'font-bold' : ''}`}>
        {level !== 0 && <BreadCrumbLink key={slug} href={href} label={name} />}
      </span>
      <div style={{ marginLeft: level * 16 }}>
        {shouldNest &&
          nextLevel?.categories.map((category: StrapiCategory) => (
            <BreadCrumb
              key={slug + category.slug}
              {...category}
              href={`${href}/${category.slug}`}
              level={level + 1}
              categories={categories}
            />
          ))}
      </div>
    </div>
  )
}

const BreadCrumbLink = ({ href, label }) => {
  if (href) {
    return (
      <Link key={label} href={href}>
        <a>
          <span className="cursor-pointer hover:underline mb-1">{label}</span>
        </a>
      </Link>
    )
  } else {
    return (
      <span key={label} className="mb-1 text-gray">
        {label}
      </span>
    )
  }
}

export default BreadCrumbs
