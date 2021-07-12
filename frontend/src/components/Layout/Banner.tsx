import React from 'react'
import Link from 'next/link'

export const Banner = () => {
  const [joined, setJoined] = React.useState(false)

  React.useEffect(() => {
    setJoined(JSON.parse(window.localStorage.getItem('launch-party')))
  }, [])

  //   if (process.env.NODE_ENV === 'production') {
  //     return (
  //       <div className="items-center px-2 py-1 bg-sec text-white flex-row w-full justify-center text-center">
  //         <q className="inline">
  //           <strong className="inline">Give Your Best</strong>
  //         </q>
  //         &nbsp; launch party coming August 7th
  //       </div>
  //     )
  //   }

  return (
    <div className="items-center px-2 py-1 bg-sec text-white flex-row w-full justify-center">
      <Link href="/launch-party">
        <a className="text-center">
          <q>
            <strong>Give Your Best</strong>
          </q>{' '}
          {joined ? (
            'launch party coming August 7th'
          ) : (
            <>
              launch party tickets:&nbsp;
              <span className="text-norm underline block md:inline">
                Now available
              </span>
            </>
          )}
        </a>
      </Link>
    </div>
  )
}

export default Banner
