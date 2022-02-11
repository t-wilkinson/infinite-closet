import React from 'react'

export const Hover = ({
  type = 'info',
  children,
  position = 'left-0',
  className = '',
}) => {
  const [hover, setHover] = React.useState(false)
  return (
    <div
      className={`relative z-20 p-1 ml-1 w-5 h-5 rounded-full items-center justify-center text-sm
        ${type === 'caution' ? 'border border-gray' : 'bg-sec-light'}
        ${className}
      `}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span
        className={`text-xs
        ${type === 'caution' ? 'text-warning' : 'text-black'}
        `}
      >
        {type === 'caution' ? '!' : '?'}
      </span>
      <div
        className={`p-2 z-10 border-gray border rounded-md bg-white absolute m-4 w-64 text-norm text-left
        ${position}
        ${hover ? '' : 'invisible'}
        `}
      >
        {children}
      </div>
    </div>
  )
}


