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

export const dobFields: FieldsConfig<{
  bday: number
  bmonth: number
  byear: number
}>= {
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
