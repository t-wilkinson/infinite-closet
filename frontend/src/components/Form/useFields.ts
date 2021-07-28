import React from 'react'

import { FieldsConfig, Field, Fields, Valid } from './types'

export const fieldChanged = (field: Field) => field.default !== field.value
export const fieldsChanged = (fields: Fields) =>
  Object.values(fields).map(fieldChanged)
export const changedFields = (fields: Fields) =>
  Object.entries(fields).reduce((acc, [k, field]) => {
    if (fieldChanged(field)) {
      acc[k] = field
    }
    return acc
  }, {})

export const validateField = (field: Field) =>
  validate(field.field, field.value, field.constraints)

export const isValid = (fields: Fields, include?: string[]): boolean => {
  return Object.entries(fields)
    .filter(([field, _]) => (include ? include.includes(field) : true))
    .map(([_, field]) => validate(field.label, field.value, field.constraints))
    .every((v) => v.length === 0)
}

export const cleanField = (field: Field): Field['value'] => {
  if (typeof field.value === 'string') return field.value.trim()
  else return field.value
}

export const cleanFields = (fields: Fields): { [field: string]: any } => {
  return Object.entries(fields).reduce((acc, [k, field]) => {
    acc[k] = cleanField(field)
    return acc
  }, {})
}

// TODO: this should be an object of functions
export const validate = (
  field: string,
  value: string,
  constraints: string
): Valid[] => {
  const isValid = (value: string, constraint: string): Valid => {
    constraint = constraint.replace(/<space>/g, ' ')
    const [type, ...props] = constraint.split(':')

    // prettier-ignore
    switch (type) {
      case 'email': return /^.+@.+\..+$/.test(value)            || `Please enter a valid ${field.toLowerCase()}`
      case 'required': return Boolean(value)                    || `Please include your ${field.toLowerCase()}`
      case 'decimal': return /^\d*\.?\d{0,2}$/.test(value)      || `${field} must be a number`
      case 'integer': return /^\d*$/.test(value)                || `${field} must be a number`
      case 'number': return /^\d*\.?\d*$/.test(value)           || `${field} must be a number`
      case 'max-width': return value.length <= Number(props[0]) || `${field} must be at most ${props[0]} characters long`
      case 'min-width': return value.length >= Number(props[0]) || `${field} must be at least ${props[0]} characters long`
      case 'regex': return RegExp(props[0]).test(value)         || `${field} does not have the correct format`
      case 'contains': return RegExp(`[${props[0].replace(']', '\\]')}]`).test(value)           || `${field} must contain one of ${props[0].split('').join(' ')}`
      case '!contains': return !RegExp(`[${props[0].replace(']', '\\]')}]`).test(value)           || `${field} must not contain any of ${props[0].split('').join(' ')}`
      case '': return true
      default: return true
    }
  }

  constraints = constraints.replace(
    'password',
    'min-width:8 max-width:30 contains:~!@#$%^*-_=+[{]}/;,.?'
  )
  return constraints
    .split(' ')
    .map((constraint) => isValid(value, constraint))
    .filter((v) => v !== true)
}

type UseField = (field: string, config: FieldsConfig['number']) => Field
export const useField: UseField = (field, config) => {
  const [state, setState] = React.useState(config.default ?? '')

  config = Object.assign(
    {
      label: toTitleCase(field),
      type: 'text',
      constraints: '',
      onChange: () => {},
      default: '',
      placeholder: '',
    },
    config
  )

  return {
    field,
    label: config.label,
    type: config.type,
    value: state,
    default: config.default,
    constraints: config.constraints,
    placeholder: config.placeholder,
    onChange: (value: string) => {
      setState(value)
      config.onChange(value)
    },
  }
}

type UseFields = (config: FieldsConfig) => Fields
export const useFields: UseFields = (config) => {
  //   const initialState = Object.keys(config).reduce(
  //     (acc, k) => ((acc[k] = config[k].default ?? ''), acc),
  //     {}
  //   )
  //   const reducer = (state, { type, payload }) => ({ ...state, [type]: payload })
  //   const [state, dispatch] = React.useReducer(reducer, initialState)

  const fields = Object.entries(config).reduce((acc, [field, fieldConfig]) => {
    acc[field] = useField(field, fieldConfig)
    return acc

    // fieldConfig = Object.assign(
    //   {
    //     label: toTitleCase(field),
    //     type: 'text',
    //     constraints: '',
    //     onChange: () => {},
    //     default: '',
    //     placeholder: '',
    //   },
    //   fieldConfig
    // )
    // acc[field] = {
    //   field,
    //   label: fieldConfig.label,
    //   type: fieldConfig.type,
    //   value: state[field],
    //   default: fieldConfig.default,
    //   constraints: fieldConfig.constraints,
    //   placeholder: fieldConfig.placeholder,
    //   onChange: (value: string) => {
    //     dispatch({ type: field, payload: value })
    //     fieldConfig.onChange(value)
    //   },
    // }
    // return acc
  }, {})

  return fields
}
export default useFields

const toTitleCase = (value: string) => {
  let titlecase = value.replace(/([A-Z])/g, ' $1')
  titlecase = titlecase.charAt(0).toUpperCase() + titlecase.slice(1)
  return titlecase
}
