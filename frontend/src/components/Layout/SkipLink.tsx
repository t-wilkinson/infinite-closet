import React from 'react'

export const SkipLink = () => {
  const onClick = (e) => {
    const main = document.querySelector('main')
    if (main) {
      main.focus()
    }
  }

  return (
    <button
      onClick={onClick}
      className="transform -translate-y-full focus:translate-y-0 fixed top-0 left-0 bg-pri rounded-sm border-gray p-2"
    >
      Skip to main content
    </button>
  )
}
export default SkipLink
