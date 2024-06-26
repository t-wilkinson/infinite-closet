import React from 'react'

import { Icon, iconUp, iconDown, iconCheck } from '@/Components/Icons'

import { Drawer } from './Drawer'
import { UseField, FieldValue } from './types'
import Warning from './Warning'

export const Checkboxes = ({
  field,
  values,
  single,
}: {
  field: UseField<Set<string>>
  values: { name: string; slug: string }[]
  single?: boolean
}) => {
  const toggleKey = (key: string) => {
    if (single) {
      field.setValue(new Set([key]))
    } else if (field.value.has(key)) {
      let newValue = new Set(field.value)
      newValue.delete(key)
      field.setValue(newValue)
    } else {
      let newValue = new Set(field.value)
      newValue.add(key)
      field.setValue(newValue)
    }
  }

  return <Drawer label={field.label} size={field.value.size}>
      {values.sort((v1, v2) => v1.name < v2.name ? -1 : v1.name > v2.name ? 1 : 0).map(({name, slug}) =>
      <Checkbox
        key={slug}
        label={name}
        size={16}
        onChange={() => toggleKey(slug)}
        value={field.value.has(slug)}
      />
                 )}
  </Drawer>
}

export const Checkbox = ({
  field = {} as UseField<boolean>,
  color = undefined,
  children = undefined,
  className = 'flex-wrap',
  size = 20,

  onChange = (_: any) => {},
  value = false,
  label = '' as string,
  labelClassName = '',
}) => {
  label = field.label || label
  value = field.value || value
  onChange = field.setValue || onChange

  return (
    <button
      onClick={() => onChange(!value)}
      type="button"
      aria-label={`Toggle ${field.label} checkbox`}
    >
      <input
        className="hidden"
        type="checkbox"
        checked={Boolean(value)}
        readOnly={true}
        onChange={onChange}
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
        <span className={`inline ${labelClassName}`}>{label}</span>
        {children}
      </div>
      <Warning warnings={field.errors} />
    </button>
  )
}

export const Toggle = ({
  values,
  field,
}: {
  values: { key: string; label: string }[]
  field: UseField<FieldValue>
}) => {
  return (
    <>
      {values.map((v) => (
        <Checkbox
          key={v.key}
          value={field.value === v.key}
          onChange={() => field.setValue(v.key)}
          label={field.label}
        >
          <span>&nbsp;&nbsp;{v.label}</span>
        </Checkbox>
      ))}
    </>
  )
}

export default Checkbox
