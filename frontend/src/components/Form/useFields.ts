import React from 'react'

import { FieldsConfig, Field, Fields, Valid } from './types'

// TODO: this should be an object of functions
export const validate = (
  field: string,
  value: string,
  constraints: string,
): Valid[] => {
  const isValid = (value: string, constraint: string): Valid => {
    const [type, ...props] = constraint.split(':')
    switch (type) {
      case 'email':
        return (
          /^.+@.+\..+$/.test(value) ||
          `Please enter a valid ${field.toLowerCase()}`
        )
      case 'required':
        return Boolean(value) || `Please include your ${field.toLowerCase()}`
      case 'number':
        return /^\d*$/.test(value) || `${field} must be a number`
      case 'max-width':
        return (
          value.length <= Number(props[0]) ||
          `${field} must be at most ${props[0]} characters long`
        )
      case 'min-width':
        return (
          value.length >= Number(props[0]) ||
          `${field} must be at least ${props[0]} characters long`
        )
      case 'regex':
        return (
          RegExp(props[0]).test(value) ||
          `${field} does not have the correct format`
        )
      case '':
        return true
      default:
        return true
    }
  }

  return constraints
    .split(' ')
    .map((constraint) => isValid(value, constraint))
    .filter((v) => v !== true)
}

export const validateField = (field: Field) =>
  validate(field.field, field.value, field.constraints)

export const isValid = (fields: Fields): boolean => {
  return Object.values(fields)
    .map((field) => validate(field.label, field.value, field.constraints))
    .every((v) => v.length === 0)
}

export const cleanFields = (fields: Fields): { [field: string]: any } => {
  return Object.entries(fields).reduce((acc, [k, v]) => {
    if (typeof v.value === 'string') acc[k] = v.value.trim()
    else acc[k] = v.value
    return acc
  }, {})
}

// TODO: take an optional object which sets the default values?
// TODO: preserve order of fields?
export const useFields: (config: FieldsConfig) => Fields = (config) => {
  const initialState = Object.keys(config).reduce(
    (acc, k) => ((acc[k] = config[k].defaultValue ?? ''), acc),
    {},
  )
  const reducer = (state, { type, payload }) => ({ ...state, [type]: payload })
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const fields = Object.entries(config).reduce((acc, [field, v]) => {
    v = Object.assign(
      {
        label: toTitleCase(field),
        type: 'text',
        constraints: '',
        onChange: () => {},
      },
      v,
    )
    acc[field] = {
      field,
      label: v.label,
      type: v.type,
      value: state[field],
      constraints: v.constraints,
      onChange: (value: string) => {
        dispatch({ type: field, payload: value })
        v.onChange(value)
      },
    }
    return acc
  }, {})

  return fields
}
export default useFields

const toTitleCase = (value: string) => {
  let titlecase = value.replace(/([A-Z])/g, ' $1')
  titlecase = titlecase.charAt(0).toUpperCase() + titlecase.slice(1)
  return titlecase
}
