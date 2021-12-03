import React from 'react'

import { toTitleCase } from '@/utils/helpers'

import {
  FieldsConfig,
  Field,
  Fields,
  FieldConfig,
  FieldError,
  FieldErrors,
  Valid,
  DateOfBirthField,
} from './types'

export const toDate = ({ day, month, year }: DateOfBirthField) => {
  const norm = (field: Field) => field.value.trim()
  return new Date(`${norm(year)}-${norm(month)}-${norm(day)}`)
}

// Detect when fields changed
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

// Return failures to meet field contraints
export const fieldError = (field: Field): FieldError[] =>
  validate(field.field, field.value, field.constraints)
export const fieldErrors = (fields: Fields): FieldErrors =>
  Object.fromEntries(
    Object.entries(fields).map(([k, field]) => [k, fieldError(field)])
  )

export const attachErrors = (fields: Fields, fieldErrors: FieldErrors) => {
  for (const field in fields) {
    fields[field].setErrors(fieldErrors[field])
  }
}

export const hasErrors = (fieldErrors: FieldErrors): boolean =>
  Object.values(fieldErrors).every(
    (errors: FieldError[]) => errors.length === 0
  )
export const isError = (fields: Fields, include?: string[]): boolean => {
  return Object.entries(fields)
    .filter(([field, _]) => (include ? include.includes(field) : true))
    .map(([_, field]) => validate(field.label, field.value, field.constraints))
    .every((v) => v.length === 0)
}

// Attaches any field errors and returns true if there are any errors
export const updateErrors = (fields: Fields): boolean => {
  const errors = fieldErrors(fields)
  attachErrors(fields, errors)
  return hasErrors(errors)
}

// Clean fields
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

// TODO: should this be an object of functions?
export const validate = (
  field: string,
  value: string,
  constraints: string
): FieldError[] => {
  const isError = (value: string, constraint: string): Valid => {
    constraint = constraint.replace(/<space>/g, ' ')
    const [type, ...props] = constraint.split(':')

    // prettier-ignore
    switch (type) {
      case 'enum': return props[0].split(',').includes(value) || `Value must be one of ${props[0]}`
      case 'between': return RegExp(`[${props[0]}-${props[1]}]`).test(value) || `Value must be between ${props[0]} and ${props[1]}`
      case 'email': return /^.+@.+\..+$/.test(value)            || `Please enter a valid ${field.toLowerCase()}`
      case 'required': return Boolean(value)                    || `Missing ${field.toLowerCase()}`
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

  return constraints
    .split(' ')
    .map((constraint) => isError(value, constraint))
    .filter((v) => v !== true) as FieldError[]
}

// TODO: This would probably work better as a class
type UseField = (field: string, config: FieldConfig) => Field
export const useField: UseField = (field, config) => {
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

  const [state, setState] = React.useState(config.default)
  const [errors, setErrors] = React.useState([])
  config.constraints = config.constraints.replace(
    'password',
    'min-width:8 max-width:30 contains:~!@#$%^*-_=+[{]}/;,.?'
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
    errors,
    setErrors,
  }
}

type UseFields = (config: FieldsConfig) => Fields
export const useFields: UseFields = (config) => {
  const fields: Fields = Object.entries(config).reduce(
    (acc, [field, fieldConfig]) => {
      acc[field] = useField(field, fieldConfig)
      return acc
    },
    {}
  )
  fields.submit = useField('submit', {})

  return fields
}

export const useDateOfBirth = () =>
  useFields({
    day: { label: 'DD', constraints: 'integer' },
    month: { label: 'MM', constraints: 'integer' },
    year: { label: 'YYYY', constraints: 'integer' },
  }) as DateOfBirthField

export default useFields
