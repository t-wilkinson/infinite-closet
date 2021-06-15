import React from 'react'
import Link from 'next/link'

export const Banner = () => (
  <div className="items-center px-2 py-1 bg-sec text-white flex-row w-full justify-center">
    <Link href="/launch-party">
      <a>
        <q>
          <strong>Give Your Best</strong>
        </q>{' '}
        launch party tickets:&nbsp;
        <span className="text-norm underline">Now available</span>
      </a>
    </Link>
  </div>
)

export default Banner
