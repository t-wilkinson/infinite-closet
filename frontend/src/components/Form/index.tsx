import React from 'react'
import { useRouter } from 'next/router'

import { Icon } from '@/components'
import { iconLoading } from '@/components/Icons'

import Warning from './Warning'
import { UseFields } from './fields'

export * from './Checkbox'
export * from './Coupon'
export * from './DateOfBirth'
export * from './Dropdown'
export * from './ImageUpload'
export * from './Input'
export * from './Password'
export * from './Rating'
export * from './Warning'
export * from './fields'
export * from './types'

export const OR = () => (
  <div className="flex-row items-center">
    <div className="h-px bg-gray flex-grow" />
    <span className="mx-5 my-2 text-gray">OR</span>
    <div className="h-px bg-gray flex-grow" />
  </div>
)

// TODO: differentiate between client and server error
export const Form = ({
  fields,
  Success = null,
  onSubmit = () => null,
  className = 'max-w-md',
  outerClassName = '',
  successClassName = '',
  children = null,
  resubmit = false,
  redirect,
  ...props
}: {
  redirect?: string
  fields: UseFields | UseFields[]
  Success?: React.FunctionComponent
  onSubmit: (..._: any[]) => Promise<any> | void
  className?: string
  outerClassName?: string
  successClassName?: string
  children: React.ReactNode
  resubmit?: boolean
  [x: string]: any
}) => {
  if (!Array.isArray(fields)) {
    fields = [fields]
  }
  const form = fields[0].form
  const router = useRouter()

  const onSubmitInternal = (e: React.SyntheticEvent) => {
    e.preventDefault()
    ;(fields as UseFields[]).forEach((fields) => fields.clearErrors())
    const cantResubmit = form.value === 'success' && !resubmit
    if (form.value === 'submitting' || cantResubmit) {
      return
    }
    form.setValue('submitting')

    const valid = (fields as UseFields[])
      .map((fields: UseFields) => fields.update())
      .every((v) => v)
    if (!valid) {
      form.setValue('error')
      form.setErrors('Please ensure the form is filled out correctly')
      return
    }

    const res = onSubmit(e) || Promise.resolve()
    res
      .then(() => {
        form.setValue('success')
        form.setErrors()
        // @ts-ignore
        document.activeElement?.blur()
        if (redirect) {
          router.push(redirect)
        }
      })
      .catch((err) => {
        form.setValue('error')
        form.setErrors(
          err.message ||
            err ||
            "Looks like something's not working... Please try again later"
        )
      })
  }

  return (
    <FormWrapper className={outerClassName}>
      <form
        className={`flex flex-col relative w-full space-y-4 ${className}`}
        onSubmit={onSubmitInternal}
        {...props}
      >
        {fields[0].form.value === 'success' && Success && (
          <div
            className={`z-20 items-center justify-center absolute inset-0 font-bold ${successClassName}`}
          >
            <Success />
          </div>
        )}
        {children}
      </form>
    </FormWrapper>
  )
}

export const FormWrapper = ({ className = '', children }) => (
  <div className={`relative items-center w-full ${className}`}>{children}</div>
)

export const FormHeader = ({ label }) => (
  <span className="text-center font-bold text-2xl mt-2 mb-6">{label}</span>
)

export const Submit = ({
  field,
  children = 'Submit' as any,
  disabled = false,
  className = '',
  type = 'primary',
}) => {
  disabled = disabled || field.value === 'submitting'
  return (
    <>
      <button
        aria-label="Submit form"
        className={`flex flex-row justify-center items-center
        p-3 rounded-sm border transition duration-200 font-bold
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
        disabled={disabled}
        onClick={() => {}}
      >
        {field.value === 'submitting' && (
          <Icon
            size={20}
            className="animate-spin h-5 w-5 mr-3"
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
