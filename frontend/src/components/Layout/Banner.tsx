import React from 'react'
import Link from 'next/link'

export const Banner = () => (
  <div className="items-center px-2 py-1 width-full bg-sec text-white">
    <Link href="/launch-party">
      <a>
        <span className="text-norm underline">
          JOIN OUR LAUNCH PARTY ON TODO
        </span>
      </a>
    </Link>
  </div>
)

export default Banner
