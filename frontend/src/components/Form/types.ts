// TODO: better types
export type Field = {
  field: string
  label: string
  type: string
  value: any
  constraints: string
  onChange: (value: any) => void
}

export type Fields = {
  [field: string]: Field
}

export type FieldsConfig = {
  [field: string]: {
    default?: any
    constraints?: string
    label?: string
    onChange?: (value: string) => void
    type?: string
  }
}

export type Valid = true | string
