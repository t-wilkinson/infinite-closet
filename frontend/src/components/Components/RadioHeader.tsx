import React from 'react'

export const RadioHeader = ({className='', field, components, props={}}) => {
  return (
    <section className={`flex-row border-gray border rounded-md divide-x divide-gray overflow-hidden ${className}`}>
      {Object.keys(components).map((key: string) => {
        return (
          <button
            key={key}
            style={{ flex: 1 }}
            type="button"
            onClick={() => field.setValue(key)}
          >
            <div
              className={`flex-grow p-2 h-full
                ${key === field.value ? 'bg-pri-light' : ''}
                `}
            >
              <div className="flex-grow items-center justify-between">
                {components[key](props)}
              </div>
            </div>
          </button>
        )
      })}
    </section>
  )
}

export default RadioHeader
