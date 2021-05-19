import React from 'react'

export const Addresses = ({ fields, addresses, state}) => {
  return <div>
    <span>Addresses</span>
    {JSON.stringify(addresses)}
  </div>
}

export const AddAddress = ({ fields }) => {
  return (
    <div className="grid grid-flow-row grid-cols-2 w-full gap-x-4">
      {Object.keys(fields).map((field) => (
        <Input key={field} {...fields[field]} />
      ))}
    </div>
  )
}

