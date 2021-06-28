import React from 'react'
import axios from 'axios'

import { Input, Submit, Password, Dropdown } from '@/Form'
import { Field as FieldType } from '@/Form/types'
import useFields, {
  cleanFields,
  changedFields,
  fieldsChanged,
} from '@/Form/useFields'
import { Divider } from '@/components'
import { Size } from '@/Products/constants'
import { useDispatch, useSelector } from '@/utils/store'
import { userActions } from '@/User/slice'

export const Profile = () => {
  const user = useSelector((state) => state.user.data)
  const [status, setStatus] = React.useState(null)
  const dispatch = useDispatch()

  React.useEffect(() => {
    axios
      .post('/account/signin', {}, { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          dispatch(userActions.signin(res.data.user))
        }
      })
      .catch((err) => {
        setStatus('error')
        console.error(err)
      })
    document.getElementById('_app').scrollTo({ top: 0 })
  }, [status])

  return (
    <div className="">
      {status === 'changed' ? (
        <div className="w-full max-w-screen-sm h-12 mb-2 bg-sec-light justify-center items-center text-black font-bold rounded-sm">
          <span className="">Your changes were saved</span>
        </div>
      ) : status === 'error' ? (
        <div className="w-full max-w-screen-sm h-12 mb-2 bg-sec-light justify-center items-center text-black font-bold rounded-sm">
          <span className="">Unable to make changes</span>
        </div>
      ) : null}
      <span className="font-subheader text-2xl">Profile</span>
      <AccountDetails user={user} setStatus={setStatus} />
      <FitsAndPreferences user={user} setStatus={setStatus} />
      {/* <Addresses user={user} setStatus={setStatus} /> */}
      {/* <ResetPassword /> */}
    </div>
  )
}

const updateUser = (user, fields, setStatus) => {
  const changed = changedFields(fields)
  const cleaned = cleanFields(changed)
  axios
    .put(`/users/${user.id}`, cleaned, {
      withCredentials: true,
    })
    .then((res) => setStatus('changed'))
    .catch((err) => {
      setStatus('error')
      console.error(err)
    })
}

const AccountDetails = ({ setStatus, user }) => {
  const fields = useFields({
    firstName: { default: user.firstName || '' },
    lastName: { default: user.lastName || '' },
    email: { default: user.email || '' },
    phoneNumber: {
      default: user.phoneNumber || '',
      label: 'Mobile Phone Number',
    },
    dateOfBirth: { default: user.dateOfBirth || '', label: 'Date of Birth' },
  })

  return (
    <Fieldset name="Account Details">
      <Field disabled={true} {...fields.email} />
      <Field {...fields.firstName} />
      <Field {...fields.lastName} />
      <Field {...fields.phoneNumber} />
      <Field {...fields.dateOfBirth} />
      <SubmitFields
        onSubmit={() => updateUser(user, fields, setStatus)}
        disabled={fieldsChanged(fields).length === 0}
      />
    </Fieldset>
  )
}

const toSizes = (start: number, end: number) =>
  Array(end - start + 1)
    .fill(0)
    .map((_, i) => i + start)
    .map((v) => ({ key: v, label: v }))

const heights = [4, 5, 6]
  .map((feet) =>
    Array(12)
      .fill(0)
      .map((_, i) => i + 1)
      .map((inches) => ({
        label: `${feet}' ${inches}"`,
        key: `${feet}-${inches}`,
      })),
  )
  .flat()
  .slice(5, -6)

const FitsAndPreferences = ({ user, setStatus }) => {
  const fields = useFields({
    height: { default: user.height },
    weight: { default: user.weight, label: 'Weight (kgs.)' },
    chestSize: { default: user.chestSize },
    waistSize: { default: user.waistSize },
    hipsSize: { default: user.hipsSize },
    dressSize: { default: user.dressSize },
  })

  return (
    <Fieldset name="Fits & Preferences">
      <Dropdown {...fields.height} values={heights} />
      <Field {...fields.weight} />
      <Dropdown {...fields.chestSize} values={toSizes(85, 165)} />
      <Dropdown {...fields.hipsSize} values={toSizes(85, 155)} />
      <Dropdown {...fields.waistSize} values={toSizes(70, 140)} />
      <Dropdown
        {...fields.dressSize}
        values={Size.map((size) => ({ label: size, key: size }))}
      />
      <SubmitFields
        onSubmit={() => updateUser(user, fields, setStatus)}
        disabled={fieldsChanged(fields).length === 0}
      />
    </Fieldset>
  )
}

const ResetPassword = ({ user, setStatus }) => {
  const fields = useFields({
    currentPassword: {},
    password: { constraints: 'password' },
    confirmPassword: { constraints: 'password' },
  })

  const onSubmit = () => {}

  return (
    <Fieldset name="Reset Password">
      <Field {...fields.currentPassword} type="password" />
      <Password className="col-start-1" {...fields.password} />
      <Password {...fields.confirmPassword} />
      <SubmitFields
        onSubmit={onSubmit}
        disabled={fields.password.value !== fields.confirmPassword.value}
      />
    </Fieldset>
  )
}

const Addresses = ({ user, setStatus }) => {
  return <></>
}

const SubmitFields = ({ onSubmit, disabled }) => (
  <>
    {/* <div className="w-full col-span-full" /> */}

    <div className="w-full col-start-1">
      <Submit disabled={disabled} onSubmit={onSubmit}>
        Save Changes
      </Submit>
    </div>
  </>
)

const Fieldset = ({ name, children }) => (
  <div className="my-4">
    <span className="text-gray font-bold">{name}</span>
    <Divider className="my-2" />
    <fieldset
      className="grid grid-cols-2 w-full gap-x-4 max-w-screen-sm"
      name={name}
    >
      {children}
    </fieldset>
  </div>
)

const Field = ({
  className = '',
  ...props
}: FieldType & { disabled?: boolean; className?: string }) => (
  <Input {...props} className={className} />
)

export default Profile
