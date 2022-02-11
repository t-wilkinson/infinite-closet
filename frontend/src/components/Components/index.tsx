import React from 'react'
import Link from 'next/link'

import { Icon, iconUp } from '@/Components/Icons'
export * from './Rating'
export * from './FacebookMessenger'
export * from './Clipboard'
export * from './Hover'
export * from './Tooltip'

export const BlueLink = ({ href, label }) => (
  <Link href={href}>
    <a>
      <span className="cursor-pointer text-blue-500">{label}</span>
    </a>
  </Link>
)

const buttonClassName = ({ role = 'primary', className = '', disabled=false}) => `
      p-3 transition duration-200
      ${className}
      ${disabled ? 'cursor-not-allowed' : ''}
      ${
          role === 'primary'
          ? 'text-white bg-gray-black hover:bg-gray rounded-sm'
          : role === 'secondary'
          ? 'text-black bg-white border border-black'
          : role === 'cta'
          ? 'text-white bg-sec hover:bg-pri rounded-sm font-bold'
          : ''
      }
`

export const ButtonLink = ({ className = '', href, children }) => (
  <Link href={href}>
    <a className={buttonClassName({ className })}>{children}</a>
  </Link>
)

export const Button = ({
  onClick = (..._: any[]): void => {},
  children,
  role = 'primary' as 'primary' | 'secondary' | 'payment' | 'cta',
  className = '',
  type = 'button',
  disabled =false,
  ...props
}) => (
  <button
    onClick={onClick}
    type={type as 'button' | 'submit'}
    disabled={disabled}
    className={buttonClassName({ role, className, disabled })}
    {...props}
  >
    {children}
  </button>
)

export const Divider = ({
  visible = true,
  className = '',
  border = 'border-gray-light',
}) => visible && <div className={`${border} border-b-2 w-full ${className}`} />

export const ScrollUp = () => (
  <button
    aria-label="Scroll up"
    className="flex fixed bottom-0 right-0 items-center justify-center w-12 h-12 bg-white border border-gray rounded-full mr-2 md:mr-4 mb-2"
    onClick={() => {
      document
        .getElementById('_app')
        .scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }}
  >
    <Icon icon={iconUp} size={18} />
  </button>
)
