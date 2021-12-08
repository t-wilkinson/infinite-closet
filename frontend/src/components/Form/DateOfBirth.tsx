import React from 'react'
import dayjs from 'dayjs'

import { FieldsConfig, UseField, DateOfBirthFields } from './types'
import Input from './Input'

export const DateOfBirth = ({ bday, bmonth, byear }: DateOfBirthFields) => (
  <fieldset>
    <legend className="mb-2">Date Of Birth</legend>
    <div className="flex flex-row space-x-4">
      <Input field={bday} />
      <Input field={bmonth} />
      <Input field={byear} />
    </div>
  </fieldset>
)

// const changed = (field): [boolean, number?] => {
//   const clean = field.clean()
//   if (clean != field.default + (field.name === 'bmonth' ? 1 : 0)) {
//     return [true, clean]
//   } else {
//     return [false]
//   }
// }

export const dobFields: FieldsConfig = {
  bday: { label: 'DD', constraints: 'integer', autocomplete: 'bday-day', },
  bmonth: { label: 'MM', constraints: 'integer', autocomplete: 'bday-month', },
  byear: { label: 'YYYY', constraints: 'integer', autocomplete: 'bday-year', },
}

export const toDate = ({ bday, bmonth, byear }: DateOfBirthFields): string | void => {
  const norm = (field: UseField<any>) => {
    let year = Number(byear.value)
    if (year.toString().length === 2) {
      year = year > Number(new Date().getFullYear().toString().slice(-2))
        ? 1900 + year
        : 2000 + year
      byear.setValue(year)
    } else {
      return field.clean()
    }
  }
  const date = dayjs(`${norm(byear)}-${norm(bmonth)}-${norm(bday)}`)
  if (date.isValid()) {
    return date.toJSON()
  }
}

// export const dobChangedFields = ({dob, bday, bmonth, byear}: DateOfBirthFields & {dob: any}) => {
//   const dobKeys = ['byear', 'bmonth', 'bday'] as const
//   const dobFieldEq = (key: any, field: any) =>
//        dateOfBirth.get(key) + (key === 'month' ? 1 : 0) !== fields.value(field)
//       ? field
//       : undefined
//   const dobChangedFields = dob.isValid()
//     ? [dobFieldEq('year', 'byear'), dobFieldEq('month', 'bmonth'), dobFieldEq('date', 'bday'), ].filter(v => v)
//     : dobKeys.every((f) => isNaN(dobField.value(f) as number))
//     ? ['byear', 'bmonth', 'bday']
//     : []
// }

// TODO:
// extend UseFields to take sub UseFields and operates as expected
