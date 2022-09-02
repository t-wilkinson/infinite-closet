import React from 'react'
import { toast } from 'react-toastify'

import { useFields, UseFields, Input, Form, Checkbox, Submit, Textarea, Tags } from '@/Form'
import { Hover } from '@/Components/Hover'

import { updateWardrobe } from './api'

interface EditWardrobeFields {
  name: string;
  visible: boolean;
  description: string;
  tags: string[]
}

export const EditWardrobe = ({wardrobe, setWardrobes}) => {
  const fields = useFields<EditWardrobeFields>({
    name: {},
    visible: {},
    description: {},
    tags: {},
  })

  const updateFields = (wardrobe) => {
    fields.setValue('visible', wardrobe.visible)
    fields.setValue('tags', wardrobe.tags.map(tag => tag.name))
  }

  const onSubmit = () => {
    const props = fields.clean()
    updateWardrobe(wardrobe.id, props)
    .then(wardrobe => {
      setWardrobes(wardrobes => wardrobes.map(w => {
        if (w.wardrobe.id === wardrobe.id) {
          return {...w, wardrobe}
        } else {
          return w
        }
      }))
      updateFields(wardrobe)
    })
    .then(() => {
      fields.reset()
      toast.success(`Successfully updated wardrobe.`, {
        autoClose: 1500,
        hideProgressBar: true,
      })
    })
  }

  React.useEffect(() => {
    updateFields(wardrobe)
  }, [wardrobe])

  return <Form fields={fields} onSubmit={onSubmit} resubmit={true}>
    <Input field={fields.get('name')} />
    <Textarea field={fields.get('description')} />
    <div className="flex-row items-center">
      <Checkbox field={fields.get('visible')} />
      <Hover>
        Allow others to view this wardrobe.
      </Hover>
    </div>
    <Tags field={fields.get('tags')} />
    <Submit form={fields.form}>
      Update
    </Submit>
  </Form>
}

export default EditWardrobe
