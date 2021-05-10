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
        <FieldRow>
          <Field {...accountDetailFields.firstName} />
          <Field {...accountDetailFields.lastName} />
        </FieldRow>
        <div className="flex-row space-x-4">
          <Field {...accountDetailFields.mobile} />
        </div>
        <SubmitFields onSubmit={() => {}} disabled={false} />
      </Fieldset>

      <Fieldset name="Fits & Preferences">
        <FieldRow>
          <Field {...preferenceFields.height} />
          <Field {...preferenceFields.weight} />
        </FieldRow>
        <FieldRow>
          <Field {...preferenceFields.bustSize} />
          <Field {...preferenceFields.bodyType} />
        </FieldRow>
        <FieldRow>
          <Field {...preferenceFields.dressSize} />
        </FieldRow>
        <SubmitFields onSubmit={() => {}} disabled={false} />
      </Fieldset>

      <Fieldset name="Reset Password">
        <FieldRow>
          <Field {...resetPasswordFields.currentPassword} />
        </FieldRow>
        <FieldRow>
          <Field {...resetPasswordFields.password} />
          <Field {...resetPasswordFields.confirmPassword} />
        </FieldRow>
        <SubmitFields onSubmit={() => {}} disabled={false} />
      </Fieldset>
    </div>
  )
}

const SubmitFields = ({ onSubmit, disabled }) => (
  <div className="w-full max-w-xs">
    <Submit disabled={disabled} onSubmit={onSubmit}>
      Save Changes
    </Submit>
  </div>
)

const Fieldset = ({ name, children }) => (
  <fieldset className="flex flex-col" name={name}>
    <span className="">{name}</span>
    <Divider className="my-2" />
    {children}
  </fieldset>
)

const FieldRow = ({ children }) => (
  <div className="flex-row space-x-4">{children}</div>
)

const Field = ({ ...props }: FieldType) => (
  <Input {...props} className="max-w-xs" />
)

export default Profile
