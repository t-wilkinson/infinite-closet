import React from 'react'

export const Tooltip = ({ children, info, position = 'left-0' }) => {
  const [hover, setHover] = React.useState(false)
  return (
    <div
      className={`relative items-center justify-center`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      <div
        className={`p-1 m-4 z-10 border-gray border rounded-sm bg-white absolute text-norm text-left
        ${position}
        ${hover ? '' : 'invisible'}
        `}
      >
        {info}
      </div>
    </div>
  )
}

