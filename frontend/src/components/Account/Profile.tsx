import React from 'react'

import { Input, Submit } from '@/Form'
import { Field as FieldType } from '@/Form/types'
import useFields from '@/Form/useFields'
import { Divider } from '@/components'

export const Profile = () => {
  const accountDetailFields = useFields({
    firstName: {},
    lastName: {},
    mobile: { label: 'Mobile Phone Number' },
  })

  const preferenceFields = useFields({
    height: {},
    weight: {},
    bustSize: {},
    bodyType: {},
    dressSize: {},
  })

  const resetPasswordFields = useFields({
    currentPassword: {},
    password: {},
    confirmPassword: {},
  })

  return (
    <div className="space-y-4">
      <span className="font-subheader text-2xl">Profile</span>
      <Fieldset name="Account Details">
        <Field {...accountDetailFields.firstName} />
        <Field {...accountDetailFields.lastName} />
        <Field {...accountDetailFields.mobile} />
        <SubmitFields onSubmit={() => {}} disabled={false} />
      </Fieldset>

      <Fieldset name="Fits & Preferences">
        <Field {...preferenceFields.height} />
        <Field {...preferenceFields.weight} />
        <Field {...preferenceFields.bustSize} />
        <Field {...preferenceFields.bodyType} />
        <Field {...preferenceFields.dressSize} />
        <SubmitFields onSubmit={() => {}} disabled={false} />
      </Fieldset>

      <Fieldset name="Reset Password">
        <Field {...resetPasswordFields.currentPassword} />
        <Field {...resetPasswordFields.password} />
        <Field {...resetPasswordFields.confirmPassword} />
        <SubmitFields onSubmit={() => {}} disabled={false} />
      </Fieldset>
    </div>
  )
}

const SubmitFields = ({ onSubmit, disabled }) => (
  <div className="w-full col-span-full">
    <Submit disabled={disabled} onSubmit={onSubmit}>
      Save Changes
    </Submit>
  </div>
)

const Fieldset = ({ name, children }) => (
  <>
    <span className="">{name}</span>
    <Divider />
    <fieldset
      className="grid grid-cols-2 w-full gap-x-4 max-w-screen-sm"
      name={name}
    >
      {children}
    </fieldset>
  </>
)

const Field = ({ ...props }: FieldType) => (
  <Input {...props} className="max-w-xs" />
)

export default Profile
