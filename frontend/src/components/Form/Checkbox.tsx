import { Icon } from '@/components'
import { iconCheck } from '@/components/Icons'

import Warning from './Warning'

export const Checkbox = ({
  field,
  color = undefined,
  children = undefined,
  className = 'flex-wrap',
  size = 20,
}) => {
  const value = field.value || false

  return (
    <button
      onClick={() => field.setValue(!value)}
      aria-label={`Toggle ${field.label} checkbox`}
    >
      <input
        className="hidden"
        type="checkbox"
        checked={value}
        readOnly={true}
      />
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
        <span className="inline">{field.label}</span>
        {children}
      </div>
      <Warning warnings={field.errors} />
    </button>
  )
}

export default Checkbox
