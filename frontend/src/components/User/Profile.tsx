import React from 'react'
import dayjs from 'dayjs'

import axios from '@/utils/axios'
import useAnalytics from '@/utils/useAnalytics'
import {
  DateOfBirth,
  Dropdown,
  Form,
  Input,
  Submit,
  UseField,
  UseFields,
  dobFields,
  toDate,
  useFields,
} from '@/Form'
import { Divider } from '@/components'
import { Size } from '@/Products/types'
import * as sizing from '@/utils/sizing'
import { useSelector } from '@/utils/store'
import { SizeChartPopup } from '@/Shop/Size'
import { StrapiUser } from '@/types/models'

import { useSignin } from './'

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
        <div
          className="w-full max-w-screen-sm justify-center items-center rounded-sm
         h-12 mb-2 bg-sec-light text-black font-bold "
        >
          <span className="">Your changes were saved</span>
        </div>
      ) : status === 'error' ? (
        <div
          className="w-full max-w-screen-sm justify-center items-center rounded-sm
          h-12 mb-2 bg-warning-light text-black font-bold"
        >
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

const useUpdateUser = () => {
  const analytics = useAnalytics()
  const signin = useSignin()

  const updateUser = async (
    user: StrapiUser,
    fields: UseFields,
    setStatus: (status: Status) => void
  ) => {
    const cleaned = fields.changed()
    const dateOfBirth =
      fields.get('bday') && fields.get('bmonth') && fields.get('byear')
        ? toDate({
            bday: fields.get('bday'),
            bmonth: fields.get('bmonth'),
            byear: fields.get('byear'),
          })
        : undefined
    return axios
        .put<void>(
        `/users/${user.id}`,
        {
          ...cleaned,
          dateOfBirth,
        }
      )
      .then(() => setStatus('changed'))
      .then(() =>
        analytics.logEvent('update_details', {
          user: user.email,
          fields: cleaned,
        })
      )
      .then(() => signin())
      .catch(() => {
        setStatus('error')
        throw 'Unable to update details'
      })
  }

  return updateUser
}

const AccountDetails = ({ setStatus, user }) => {
  const dateOfBirth = dayjs(user.dateOfBirth)
  const fields = useFields({
    firstName: { default: user.firstName },
    lastName: { default: user.lastName },
    email: { default: user.email },
    phoneNumber: { default: user.phoneNumber },
    bday: { ...dobFields.bday, default: dateOfBirth.date() },
    bmonth: { ...dobFields.bmonth, default: dateOfBirth.month() + 1 },
    byear: { ...dobFields.byear, default: dateOfBirth.year() },
  })
  const updateUser = useUpdateUser()

  return (
    <Fieldset
      fields={fields}
      onSubmit={() => updateUser(user, fields, setStatus)}
      name="Account Details"
    >
      <Field disabled={true} field={fields.get('email')} />
      <Field field={fields.get('phoneNumber')} />
      <Field field={fields.get('firstName')} />
      <Field field={fields.get('lastName')} />
      <DateOfBirth
        bday={fields.get('bday')}
        bmonth={fields.get('bmonth')}
        byear={fields.get('byear')}
      />
      <SubmitFields
        field={fields.form}
        disabled={
          Object.values(fields.changed()).length > 3 ||
          (['bday', 'bmonth', 'byear'] as const).some((f) =>
            isNaN(fields.value(f) as number)
          )
        }
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
  const [chartOpen, setChartOpen] = React.useState(false)
  const fields = useFields({
    height: { default: user.height },
    weight: { default: user.weight, label: 'Weight (kgs.)' },
    chestSize: { default: user.chestSize, label: 'Chest Size (cm)' },
    waistSize: { default: user.waistSize, label: 'Waist Size (cm)' },
    hipsSize: { default: user.hipsSize, label: 'Hips Size (cm)' },
    dressSize: { default: user.dressSize, label: 'Dress Size (cm)' },
  })
  const updateUser = useUpdateUser()

  return (
    <Fieldset
      onSubmit={() => updateUser(user, fields, setStatus)}
      fields={fields}
      name="Fits & Preferences"
    >
      <Dropdown field={fields.get('height')} values={heights} />
      <Field field={fields.get('weight')} />
      <Dropdown field={fields.get('chestSize')} values={toSizes(75, 125)} />
      <Dropdown field={fields.get('hipsSize')} values={toSizes(80, 125)} />
      <Dropdown field={fields.get('waistSize')} values={toSizes(60, 95)} />
      <Dropdown
        field={fields.get('dressSize')}
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
  <div className="w-full col-start-1">
    <Submit field={field} disabled={disabled}>
      Save Changes
    </Submit>
  </div>
)

const Fieldset = ({ name, children, onSubmit, fields }) => (
  <Form fields={fields} className="my-4" onSubmit={onSubmit} resubmit>
    <span className="text-gray font-bold">{name}</span>
    <Divider className="my-2" />
    <fieldset
      className="grid grid-cols-2 w-full gap-y-4 gap-x-4 max-w-screen-sm"
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
  className?: string
  field: UseField<any>
  [x: string]: any
}) => <Input {...props} field={field} className={className} />

export default Profile
