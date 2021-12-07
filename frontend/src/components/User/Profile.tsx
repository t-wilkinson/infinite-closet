import React from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

import useAnalytics from '@/utils/useAnalytics'
import { useFields, Form, Input, Dropdown, Submit, dobFields, DateOfBirth, toDate} from '@/Form/index_'
import { UseField, UseFields } from '@/Form/types'
import { Divider } from '@/components'
import { Size } from '@/Products/types'
import * as sizing from '@/utils/sizing'
import { useSelector } from '@/utils/store'
import { SizeChartPopup } from '@/Shop/Size'
import { StrapiUser } from '@/utils/models'

import { useSignin } from './'
// import { AddAddress } from './Address'

type Status = 'changed' | 'error'

export const Profile = () => {
  const user = useSelector((state) => state.user.data)
  const [status, setStatus] = React.useState(null)
  const signin = useSignin()

  React.useEffect(() => {
    signin().catch(() => {
      setStatus('error')
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

const updateUser = async (
  user: StrapiUser,
  fields: UseFields,
  setStatus: (status: Status) => void,
  analytics: any
) => {
  const cleaned = fields.changed()
  const dateOfBirth = fields.bday && fields.bmonth && fields.byear
    ? toDate({bday: fields.bday, bmonth: fields.bmonth, byear: fields.byear})
    : undefined

  return axios
    .put(`/users/${user.id}`, {
      ...cleaned,
      dateOfBirth
    }, { withCredentials: true })
    .then(() => setStatus('changed'))
    .then(() =>
      analytics.logEvent('update_details', {
        user: user.email,
        fields: cleaned,
      })
    )
    .catch(() => {
      setStatus('error')
      throw 'Unable to update details'
    })
}

const AccountDetails = ({ setStatus, user }) => {
  const analytics = useAnalytics()
  const dateOfBirth = dayjs(user.dateOfBirth)
  const fields = useFields({
    firstName: { default: user.firstName },
    lastName: { default: user.lastName },
    email: { default: user.email },
    phoneNumber: { default: user.phoneNumber },
    bday: {...dobFields.bday, default: dateOfBirth.date()},
    bmonth: {...dobFields.bmonth, default: dateOfBirth.month() + 1},
    byear: {...dobFields.byear, default: dateOfBirth.year()},
  })
  const onSubmit = () => updateUser(user, fields, setStatus, analytics)

  return (
    <Fieldset fields={fields} onSubmit={onSubmit} name="Account Details">
      <Field disabled={true} field={fields.email} />
      <Field field={fields.phoneNumber} />
      <Field field={fields.firstName} />
      <Field field={fields.lastName} />
      <DateOfBirth bday={fields.bday} bmonth={fields.bmonth} byear={fields.byear} />
      <SubmitFields
        field={fields.form}
        disabled={Object.values(fields.changed()).length === 0}
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
      }))
  )
  .flat()
  .slice(5, -6)

const FitsAndPreferences = ({ user, setStatus }) => {
  const analytics = useAnalytics()
  const [chartOpen, setChartOpen] = React.useState(false)
  const fields = useFields({
    height: { default: user.height },
    weight: { default: user.weight, label: 'Weight (kgs.)' },
    chestSize: { default: user.chestSize, label: 'Chest Size (cm)' },
    waistSize: { default: user.waistSize, label: 'Waist Size (cm)' },
    hipsSize: { default: user.hipsSize, label: 'Hips Size (cm)' },
    dressSize: { default: user.dressSize, label: 'Dress Size (cm)' },
  })
  const onSubmit = () => updateUser(user, fields, setStatus, analytics)

  return (
    <Fieldset onSubmit={onSubmit} fields={fields} name="Fits & Preferences">
      <Dropdown field={fields.height} values={heights} />
      <Field field={fields.weight} />
      <Dropdown field={fields.chestSize} values={toSizes(75, 125)} />
      <Dropdown field={fields.hipsSize} values={toSizes(80, 125)} />
      <Dropdown field={fields.waistSize} values={toSizes(60, 95)} />
      <Dropdown
        field={fields.dressSize}
        values={Size.map((size) => ({
          label: size,
          key: sizing.unnormalize(size),
        }))}
      />

      <div className="relative py-2">
        <button onClick={() => setChartOpen(() => true)} type="button">
          <span className="underline">Size Chart</span>
        </button>
        <SizeChartPopup state={chartOpen} setState={setChartOpen} />
      </div>

      <SubmitFields
        field={fields.form}
        disabled={Object.values(fields.changed()).length === 0}
      />
    </Fieldset>
  )
}

// const ResetPassword = ({ user, setStatus }) => {
//   const fields = useFields({
//     currentPassword: {},
//     password: { constraints: 'password' },
//     confirmPassword: { constraints: 'password' },
//   })

//   const onSubmit = () => {}

//   return (
//     <Fieldset name="Reset Password">
//       <Field {...fields.currentPassword} type="password" />
//       <Password className="col-start-1" {...fields.password} />
//       <Password {...fields.confirmPassword} />
//       <SubmitFields
//         field={fields.form}
//         onSubmit={onSubmit}
//         disabled={fields.password.value !== fields.confirmPassword.value}
//       />
//     </Fieldset>
//   )
// }

// const Addresses = ({ user, setStatus }) => {
//   return (
//     <>
//       <AddAddress user={user} onSubmit={() => {}} />
//     </>
//   )
// }

const SubmitFields = ({ field, disabled }) => (
  <div className="w-full mt-3 col-start-1">
    <Submit field={field} disabled={disabled}>
      Save Changes
    </Submit>
  </div>
)

const Fieldset = ({ name, children, onSubmit, fields }) => (
  <Form fields={fields} className="my-4" onSubmit={onSubmit}>
    <span className="text-gray font-bold">{name}</span>
    <Divider className="my-2" />
    <fieldset
      className="grid grid-cols-2 w-full gap-x-4 max-w-screen-sm"
      name={name}
    >
      {children}
    </fieldset>
  </Form>
)

const Field = ({
  className = '',
  field,
  ...props
}: {
  disabled?: boolean
  className?: string
  field: UseField<any>
}) => <Input {...props} field={field} className={className} />

export default Profile
