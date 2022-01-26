import React from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import { Icon } from '@/components'
import { iconLoading } from '@/components/Icons'

import Warning from './Warning'
import { UseFields } from './fields'

export * from './Checkbox'
export * from './DiscountCode'
export * from './DateOfBirth'
export * from './Dropdown'
export * from './ImageUpload'
export * from './Input'
export * from './Money'
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
/**
 * Helper for which supplies validation, submitting, redirection, submitting animation, etc.
 */
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
  notify = false,
  ...props
}: {
  notify?: boolean
  redirect?: string
  fields: UseFields | UseFields[]
  Success?: React.FunctionComponent
  onSubmit: (e: React.FormEvent) => Promise<any> | void
  className?: string
  outerClassName?: string
  successClassName?: string
  children: React.ReactNode
  resubmit?: boolean
  id?: string
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
        form.clearErrors()
        // @ts-ignore
        document.activeElement?.blur()
        if (redirect) {
          router.push(redirect)
        }
      })
      .catch((err) => {
        const error =
          err?.message ||
          err ||
          "Looks like something's not working... Please try again later"
        form.setValue('error')
        if (notify) {
          toast.error(error, {
            hideProgressBar: true,
            closeButton: false,
          })
        } else {
          form.setErrors(error)
        }
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
  form,
  children = 'Submit' as any,
  disabled = false,
  className = '',
  type = 'primary',
}) => {
  disabled = disabled || form.value === 'submitting'
  return (
    <>
      <button
        aria-label="Submit form"
        className={`flex flex-row justify-center items-center
        p-3 rounded-sm border transition duration-200 font-bold
        ${
          disabled && type === 'secondary'
            ? 'border-gray bg-gray text-white'
              : disabled
                ? 'border-pri-light bg-pri-light text-white'
            : type === 'primary'
            ? 'border-pri bg-pri hover:border-sec hover:bg-sec text-white'
            : type === 'secondary'
            ? 'bg-gray-black text-white'
            : 'text-black'
        }
        ${className}
        `}
        type="submit"
        disabled={disabled}
        onClick={() => {}}
      >
        {form.value === 'submitting' && (
          <Icon
            size={20}
            className="animate-spin h-5 w-5 mr-3"
            icon={iconLoading}
          />
        )}
        {children}
      </button>
      <Warning warnings={form.errors} />
    </>
  )
}

export const Fieldset = ({ label, className = 'my-2', children }) => (
  <fieldset className={`flex flex-col ${className}`}>
    <h3 className="font-bold text-lg mb-2">{label}</h3>
    {children}
  </fieldset>
)

export const BodyWrapper = ({ label, children = null }) => (
  <section className="w-full items-center h-full justify-start bg-white rounded-sm pt-32 pb-16">
    <h3 className="font-bold text-xl flex flex-col items-center">{label}</h3>
    {children}
  </section>
)

export default Form
