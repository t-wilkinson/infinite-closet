import React from 'react'
import dayjs from 'dayjs'

import { UseField, DateOfBirthFields } from './types'
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

export const dobFields = {
  bday: { label: 'DD', constraints: 'integer', autocomplete: 'bday-day' },
  bmonth: { label: 'MM', constraints: 'integer', autocomplete: 'bday-month' },
  byear: { label: 'YYYY', constraints: 'integer', autocomplete: 'bday-year' },
}

export const toDate = ({ bday, bmonth, byear }: DateOfBirthFields): string | void => {
  const norm = (field: UseField<any>) => field.clean()
  const date = dayjs(`${norm(byear)}-${norm(bmonth)}-${norm(bday)}`)
  if (date.isValid()) {
    return date.toJSON()
  }
}

// TODO:
// extend UseFields to take sub UseFields and operates as expected
