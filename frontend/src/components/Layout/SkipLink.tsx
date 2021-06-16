import React from 'react'
import Link from 'next/link'

export const SkipLink = () => {
  return (
    <Link href="#main">
      <a
        tabIndex={0}
        className="transform -translate-y-full focus:translate-y-0 fixed top-0 left-0 bg-pri rounded-sm border-gray p-2"
      >
        Skip to main content
      </a>
    </Link>
  )
}
export default SkipLink
