import React from 'react'
import axios from 'axios'

import { Icon } from '@/components'
import { StrapiCoupon } from '@/utils/models'

import { DateOfBirthField, Coupon, Field } from './types'
import { validate, cleanField } from './useFields'
import { iconEye } from '@/components/Icons'
import { iconEyeHidden } from '@/components/Icons'
import { iconDown } from '@/components/Icons'
import { iconCheck } from '@/components/Icons'

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

export const Checkbox = ({
  value = false,
  onChange,
  label,
  color = undefined,
  children = undefined,
  className = 'flex-wrap',
  size = 20,
}) => (
  <button
    onClick={() => onChange(!value)}
    aria-label={`Toggle ${label} checkbox`}
  >
    <input className="hidden" type="checkbox" checked={value} readOnly={true} />
    <div className={`flex-row items-center ${className}`}>
      <div
        className="items-center flex-shrink-0 justify-center bg-white border border-black"
        style={{ width: size, height: size, borderRadius: size / 8 }}
      >
        {value && (
          <Icon icon={iconCheck} size={(size * 2) / 3} style={{ color }} />
        )}
      </div>
      &nbsp;&nbsp;
      <span className="inline">{label}</span>
      {children}
    </div>
  </button>
)

export const Input = ({
  label,
  onChange,
  value,
  field = label,
  constraints = '',
  type = 'text',
  before = null,
  after = null,
  children = null,
  className = '',
  disabled = false,
  ...props
}) => {
  const [changed, setChanged] = React.useState(false)
  const [focus, setFocus] = React.useState(false)
  // Only show outline when navigating by keyboard
  const [focused, setFocused] = React.useState(false)
  const [mouse, setMouse] = React.useState(false)
  const onChange_ = (e) => {
    setChanged(true)
    onChange(e.target.value)
  }
  const validations = validate(label, value, constraints)
  const required = /required/.test(constraints)

  return (
    <div
      className={`relative my-2 w-full
        ${className}
        ${focus ? 'outline-black' : ''}
        `}
      onFocus={() => {
        setFocused(true)
      }}
      onBlur={() => {
        setFocused(false)
      }}
    >
      <label
        htmlFor={field}
        className={`rounded-sm border-sec absolute z-10 left-0 px-2 transform duration-200 pointer-events-none w-full h-full flex items-center overflow-hidden
          ${focused ? 'text-sec' : 'text-gray'}
          `}
        style={{
          ...(focused || value
            ? { transform: 'translate(-5%, -50%) scale(0.9)' }
            : { transform: 'translate(-0px, -0px) ' }),
        }}
      >
        <span
          className={`px-1 leading-none
         ${disabled ? 'bg-gray-light' : 'bg-white'} `}
        >
          {changed && validations.length ? (
            <Warning>{validations[0]}</Warning>
          ) : (
            <>
              {label}
              {required ? <span className="text-base">*</span> : null}
            </>
          )}
        </span>
      </label>

      <div
        className={`w-full h-full flex-row justify-between items-center border rounded-sm transform duration-200
          ${disabled ? 'bg-gray-light' : 'bg-white'}
          ${focused ? 'border-sec' : ''}
          ${
            changed && validations.length > 0 ? 'border-warning' : 'border-gray'
          }
          `}
      >
        {before && <div>{before}</div>}
        <input
          {...props}
          disabled={disabled}
          className={`p-2 py-3 w-full h-full outline-none `}
          id={field}
          name={field}
          type={type}
          value={value}
          onChange={onChange_}
          // Only show outline when navigating by keyboard
          onMouseDown={() => setMouse(true)}
          onMouseUp={() => setMouse(false)}
          onFocus={() => !mouse && setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        {children}
        {after && <div>{after}</div>}
      </div>
    </div>
  )
}

export const Warnings = ({ warnings }) =>
  warnings.map((warning) => <Warning key={warning}>{warning}</Warning>)

export const Warning = ({ children }) => (
  <span className="font-bold text-sm text-warning">{children}</span>
)

export const Form = ({
  onSubmit = (..._: any[]) => {},
  className = '',
  children=null,
  ...props
}) => (
  <div className={`items-center ${className}`}>
    <form
      className="w-full max-w-sm relative"
      onSubmit={(e) => {
        onSubmit(e)
        e.preventDefault()
      }}
      {...props}
    >
      <div className="w-full p-6 bg-white rounded-lg">{children}</div>
    </form>
  </div>
)

export const FormHeader = ({ label }) => (
  <>
    <span className="text-center font-subheader-light text-3xl mb-4">
      {label}
    </span>
  </>
)

// TODO: should this prevent default?
export const Submit = ({
  children = 'Submit' as any,
  disabled = false,
  className = '',
  onSubmit = (..._: any) => {},
  type = 'primary',
}) => (
  <button
    aria-label="Submit form"
    className={`p-3 mt-2 rounded-sm border transition duration-200 font-bold
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
    {children}
  </button>
)

export const OR = () => (
  <div className="flex-row items-center">
    <div className="h-px bg-gray flex-grow" />
    <span className="mx-5 my-4 text-gray">OR</span>
    <div className="h-px bg-gray flex-grow" />
  </div>
)

export const Password = (props) => {
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

export const Dropdown = ({
  value,
  onChange,
  values,
  ...props
}: {
  value: string
  onChange: (value: string) => void
  values: { key: string; label: string }[]
}) => {
  const [dropdown, setDropdown] = React.useState(false)

  return (
    <div
      className="relative w-full"
      tabIndex={0}
      onBlur={(e) => {
        // @ts-ignore
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setDropdown(false)
        }
      }}
    >
      <div
        className="relative"
        onClick={() => {
          setDropdown((state) => !state)
        }}
      >
        <Input
          {...(props as any)}
          onChange={onChange}
          value={values.find((v) => v.key === value)?.label || ''}
          after={<Icon icon={iconDown} size={16} className="mt-1 mr-2" />}
          className="cursor-pointer"
        />
        <div className="absolute inset-0 cursor-pointer" />
      </div>
      <div
        className={`
        w-full absolute bg-white divide-y transform translate-y-full border border-gray z-20 overflow-y-auto
        ${dropdown ? '' : 'hidden'}
        `}
        style={{ bottom: 9, maxHeight: 256 }}
      >
        {values.map((value) => (
          <button
            key={value.key}
            tabIndex={0}
            aria-label="Dropdown sizes"
            onClick={() => {
              setDropdown(false)
              onChange(value.key)
            }}
            className="flex cursor-pointer bg-white px-2 hover:bg-gray-light"
          >
            {value.label}
          </button>
        ))}
      </div>
    </div>
  )
}

type CouponStatus = undefined | 'success' | 'failure'

export const CouponCode = ({
  user,
  context,
  price,
  setCoupon,
  field,
}: {
  user?: string
  context: StrapiCoupon['context']
  price: number
  setCoupon: (coupon: Coupon) => void
  field: Field
}) => {
  const [status, setStatus] = React.useState<CouponStatus>()
  const [message, setMessage] = React.useState<string>()

  const checkPromo = async () => {
    const code = cleanField(field)
    return axios
      .post(`/coupons/discount`, {
        user,
        code,
        context,
        price,
      })
      .then((res) => res.data)
      .then((coupon) => {
        if (coupon.valid) {
          setCoupon(coupon)
          setStatus('success')
        } else {
          setStatus('failure')
          setMessage('Could not find coupon code')
        }
      })
      .catch((err) => {
        if (err.valid === false) {
          setStatus('failure')
          setMessage(err.reason)
        }
      })
  }

  if (status === undefined) {
    return (
      <Input
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            e.preventDefault()
            checkPromo()
          }
        }}
        {...field}
        after={
          <button
            className="flex px-4 py-3 border-l border-gray"
            onClick={checkPromo}
            type="button"
          >
            Apply
          </button>
        }
      />
    )
  } else if (status === 'success') {
    return (
      <span className="w-full p-2 mb-2 text-sec bg-gray-light">
        Successfully applied promo code!
      </span>
    )
  } else {
    return (
      <span className="text-warning w-full p-2 mb-2 bg-gray-light">
        {message === 'not-found'
          ? `Unable to find promo code matching ${field.value}.`
          : message === 'maxed-out'
          ? 'You have already used this coupon.'
          : `Unable to find promo code matching ${field.value}.`}{' '}
        <button
          className="underline text-black"
          onClick={() => {
            field.onChange('')
            setStatus(undefined)
          }}
        >
          Try Again?
        </button>
      </span>
    )
  }
}

export default Form
