import React from 'react'

import { Icon } from '@/components'
import { iconLoading } from '@/components/Icons'

import { DateOfBirthField } from './types'
import Warning from './Warning'
import Input from './Input'
import { UseFields } from './fields'

export * from './Input'
export * from './Password'
export * from './Dropdown'
export * from './Checkbox'
export * from './Coupon'
export * from './Warning'
export * from './Rating'
export * from './ImageUpload'
export * from './fields'

export const OR = () => (
  <div className="flex-row items-center">
    <div className="h-px bg-gray flex-grow" />
    <span className="mx-5 my-4 text-gray">OR</span>
    <div className="h-px bg-gray flex-grow" />
  </div>
)

export const DateOfBirth = ({ day, month, year }: DateOfBirthField) => (
  <fieldset className="mt-2">
    <legend>Date Of Birth</legend>
    <div className="flex flex-row space-x-4">
      <Input {...day} />
      <Input {...month} />
      <Input {...year} />
    </div>
  </fieldset>
)

export const Form = ({
  fields,
  Success = null,
  onSubmit = () => null,
  className = 'max-w-md',
  outerClassName = '',
  children = null,
  ...props
}: {
  fields: UseFields
  Success?: React.FunctionComponent
  onSubmit: (..._: any[]) => Promise<any> | null | void
  className: string
  outerClassName?: string
  children: React.ReactNode
}) => {
  const form = fields.form
  if (fields.form.value === 'success') {
    return (
      <div className={`items-center justify-center relative w-full h-128 ${outerClassName}`}>
          <Success />
      </div>
    )
  }

  return (
    <div className={`items-center w-full ${outerClassName}`}>
      <form
        className={`w-full relative ${className}`}
        onSubmit={(e) => {
          e.preventDefault()
          if (form.value === 'submitting') {
            return
          }
          form.setValue('submitting')

          const valid = fields.update()
          if (!valid) {
            form.setValue('error')
            return
          }

          const res = onSubmit(e) || Promise.resolve()
          res
            .then(() => form.setValue('success'))
            .catch((err) => {
              form.setValue('error')
              form.setErrors(err.message || err)
            })
        }}
        {...props}
      >
        <div className="w-full p-6 bg-white rounded-lg">{children}</div>
      </form>
    </div>
  )
}

export const FormHeader = ({ label }) => (
  <>
    <span className="text-center font-bold text-2xl mb-4">{label}</span>
  </>
)

export const Submit = ({
  field,
  children = 'Submit' as any,
  disabled = false,
  className = '',
  onSubmit = () => {},
  type = 'primary',
}) => {
  disabled = disabled || field.value === 'submitting'
  return (
    <>
      <button
        aria-label="Submit form"
        className={`flex flex-row justify-center items-center
        p-3 mt-2 rounded-sm border transition duration-200 font-bold
        ${
          disabled
            ? 'border-pri-light bg-pri-light text-white'
            : type === 'primary'
            ? 'border-pri bg-pri hover:border-sec hover:bg-sec text-white'
            : 'text-black'
        }
        ${className}
        `}
        type="submit"
        onClick={onSubmit}
        disabled={disabled}
      >
        {field.value === 'submitting' && (
          <Icon
            size={20}
            className="animate-spin h-5 w-5 mr-3 ..."
            icon={iconLoading}
          />
        )}
        {children}
      </button>
      <Warning warnings={field.errors} />
    </>
  )
}

export default Form
