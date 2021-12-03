import React from 'react'
import { toTitleCase } from '@/utils/helpers'
import {
  FieldsConfig,
  FieldConfig,
  FieldError,
  FieldErrors,
  Valid,
} from './types'

export class UseField {
  name: string
  label: string
  value: any
  default: any
  constraints: string
  placeholder: string
  setValue: (value: string) => void
  errors: string[]
  setErrors: (...errors: (string | string[])[]) => void

  constructor(field: string, config: FieldConfig) {
    config = Object.assign(
      {
        label: toTitleCase(field),
        constraints: '',
        onChange: () => {},
        default: '',
        placeholder: '',
      },
      config
    )
    config.constraints = config.constraints.replace(
      'password',
      'min-width:8 max-width:30 contains:~!@#$%^*-_=+[{]}/;,.?'
    )

    const [state, setState] = React.useState(config.default)
    const [errors, setErrors] = React.useState([])

    this.name = field
    this.label = config.label
    this.value = state
    this.default = config.default
    this.constraints = config.constraints
    this.placeholder = config.placeholder
    this.setValue = (value: string) => {
      setState(value)
      config.onChange(value)
    }
    this.errors = errors
    this.setErrors = (...errors) => {
      setErrors(errors.flat())
    }
  }

  getErrors(): FieldError[] {
    const isError = (value: string, constraint: string): Valid => {
      constraint = constraint.replace(/<space>/g, ' ')
      const [type, ...props] = constraint.split(':')
      const field = this.name

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

    return this.constraints
      .split(' ')
      .map((constraint) => isError(this.value, constraint))
      .filter((v) => v !== true) as FieldError[]
  }

  hasErrors(): boolean {
    return this.getErrors().length === 0
  }

  clean(): typeof this.value {
    if (typeof this.value === 'string') {
      return this.value.trim()
    } else {
      return this.value
    }
  }
}

type Fields = {
  [field: string]: UseField
}

export class UseFields {
  [field: string]: any
  fields: Fields

  constructor(config: FieldsConfig) {
    const fields: Fields = Object.entries(config).reduce(
      (acc, [field, fieldConfig]) => {
        acc[field] = new UseField(field, fieldConfig)
        return acc
      },
      {}
    )
    fields.form = new UseField('form', {})

    this.fields = fields
    for (const field in fields) {
      this[field] = fields[field]
    }
  }

  getErrors(): FieldErrors {
    return Object.fromEntries(
      Object.entries(this.fields).map(([k, field]) => [k, field.getErrors()])
    )
  }

  hasErrors(fieldErrors: FieldErrors = {}): boolean {
    if (!fieldErrors) {
      return Object.entries(this.fields)
        .map(([_, field]) => field.getErrors())
        .every((v) => v.length === 0)
    } else {
      return Object.values(fieldErrors).every(
        (errors: FieldError[]) => errors.length === 0
      )
    }
  }

  attachErrors(fieldErrors: FieldErrors) {
    for (const field in this.fields) {
      this.fields[field].setErrors(fieldErrors[field])
    }
  }

  updateErrors(): boolean {
    const fieldErrors = this.getErrors()
    this.attachErrors(fieldErrors)
    return this.hasErrors(fieldErrors)
  }

  clearErrors() {
    for (const field in this.fields) {
      this.fields[field].setErrors([])
    }
  }

  clean(): { [field: string]: UseField['value'] } {
    return Object.entries(this.fields).reduce((acc, [k, field]) => {
      acc[k] = field.clean()
      return acc
    }, {})
  }
}
