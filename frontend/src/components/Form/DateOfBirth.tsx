import React from 'react'
import dayjs from 'dayjs'

import {UseField, DateOfBirthFields} from './types'
import Input from './Input'

export const DateOfBirth = ({bday, bmonth, byear}: DateOfBirthFields) => (
  <fieldset className="mt-2">
    <legend>Date Of Birth</legend>
    <div className="flex flex-row space-x-4">
      <Input field={bday} />
      <Input field={bmonth} />
      <Input field={byear} />
    </div>
  </fieldset>
)

export const dobFields = {
  bday: { label: 'DD', constraints: 'integer', autocomplete: 'bday-day', },
  bmonth: { label: 'MM', constraints: 'integer', autocomplete: 'bday-month'},
  byear: { label: 'YYYY', constraints: 'integer', autocomplete: 'bday-year',},
}

export const toDate = ({ bday, bmonth, byear }: DateOfBirthFields) => {
  const norm = (field: UseField<number>) => field.clean()
  return dayjs(`${norm(byear)}-${norm(bmonth)}-${norm(bday)}`).toJSON()
}
