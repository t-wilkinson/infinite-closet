import React from 'react'

import Input from './Input'

export const Money = ({field}) => {
  return <Input
    field={field}
    before={
      <div className="bg-gray-light h-full px-2 items-center">
        $
      </div>
    }
  />
}
export default Money
