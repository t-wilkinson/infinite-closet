import React from 'react'

import { Icon, iconClose } from '@/Components/Icons'
import { Button } from '@/Components'

import { Input } from './Input'
import { UseField } from './types'
import { useField } from './fields'
import { Submit } from './Submit'

export const Tags = ({ field }: { field: UseField<string[]> }) => {
  const tag = useField('tag', { label: 'Add tag' })

  const removeTag = (name: string) => {
    if (Array.isArray(field.value)) {
      field.setValue(field.value.filter((tag) => tag !== name))
    }
  }

  const addTag = (tag: UseField) => {
    field.setValue(tags => tags.includes(tag.value) ? tags : [...tags, tag.value])
  }

  return (
    <div>
      <Input field={tag}
        after={<Button role="cta" className=""
          onClick={() => addTag(tag)}
        >Join</Button>}
      />
      <div className="flex-row">
        {field.value
          ? field.value.map((tag: string) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="relative rounded-lg bg-pri-white px-2 pr-3 py-1 mt-2 mr-2 cursor-pointer"
              >
                {tag}
                <Icon
                  className="absolute top-0 right-0 m-1"
                  icon={iconClose}
                  size={8}
                />
              </button>
            ))
          : null}
      </div>
    </div>
  )
}

export default Tags
