import React from 'react'

import {Icon, iconEye, iconEyeHidden} from '@/Components/Icons'

import Input from './Input'

export const Password = (props: Input) => {
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)

  return (
    <Input
      {...props}
      type={passwordVisible ? 'text' : 'password'}
      after={
        <div className="mr-2">
          <PasswordVisible
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
          />
        </div>
      }
    />
  )
}

export const PasswordVisible = ({ passwordVisible, setPasswordVisible }) => (
  <button
    aria-label="Toggle password visibility"
    className="flex flex-row items-center h-full"
    type="button"
    onClick={() => setPasswordVisible(!passwordVisible)}
  >
    {passwordVisible ? (
      <Icon icon={iconEye} size={24} />
    ) : (
      <Icon icon={iconEyeHidden} size={24} />
    )}
  </button>
)

export default Password
