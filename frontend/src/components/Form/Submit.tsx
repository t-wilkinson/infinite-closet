import { Icon, iconLoading } from '@/Components/Icons'

import Warning from './Warning'

export const Submit = ({
  form,
  children = 'Submit' as any,
  disabled = false,
  className = '',
  role = 'primary',
}) => {
  disabled = disabled || form.value === 'submitting'
  return (
    <>
      <button
        aria-label="Submit form"
        className={`flex flex-row justify-center items-center
        p-3 rounded-sm border transition duration-200 font-bold
        ${
          form.value === 'submitting'
            ? 'cursor-progress'
            : disabled
            ? 'cursor-not-allowed'
            : ''
        }
        ${
          disabled
            ? 'border-gray bg-gray text-white'
            : role === 'primary'
            ? 'bg-gray-black text-white hover:bg-gray'
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
