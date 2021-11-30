import React from 'react'

import Form, { Input, Dropdown, FormHeader} from '@/Form'
import useFields from '@/Form/useFields'
import Popup from '@/Layout/Popup'
import { Icons } from '@/components'
import { iconStarFill } from '@/Icons'

const fitValues = [
  { key: 'short', label: 'short' },
  { key: 'true', label: 'true' },
  { key: 'long', label: 'long' },
]

const AddReview = () => {
  const [state, setState] = React.useState<boolean>(false)
  const fields = useFields({
    heading: {},
    message: {},
    fit: { constraints: 'enum:short,true,long', default: 'true' },
    rating: { constraints: 'between:0:5', default: 0 },
  })

  return (
    <div>
      <button onClick={() => setState(!state)}>toggle</button>
      <Popup state={state} setState={setState}>
        <Form>
          <FormHeader label="How was your experience?" />
          <Input {...fields.heading} />
          <Input {...fields.message} />
          <Dropdown {...fields.fit} values={fitValues} />
          <Rating {...fields.rating} />
        </Form>
      </Popup>
    </div>
  )
}

const Rating = ({ value, onChange }) => {
  const [hover, setHover] = React.useState<number | null>(null)
  console.log(hover)

  if (isNaN(value)) {
    onChange(0)
  } else if (value > 5) {
    onChange(5)
  } else if (value < 0) {
    onChange(0)
  }

  return (
    <div className="flex-row space-x-1">
      <Icons
        onMouseEnter={(i) => setHover(i)}
        onMouseLeave={() => setHover(null)}
        onClick={(i) => onChange(i)}
        n={hover || value}
        icon={iconStarFill}
        className="text-sec cursor-pointer"
      />
      <Icons
        onMouseEnter={(i) => setHover(value + i)}
        onMouseLeave={() => setHover(null)}
        onClick={(i) => onChange(value + i)}
        n={5 - (hover || value)}
        icon={iconStarFill}
        className="text-gray-light hover:text-sec cursor-pointer"
      />
    </div>
  )
}

export default AddReview
