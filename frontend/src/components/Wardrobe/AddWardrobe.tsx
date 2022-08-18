import React from 'react'

import { StrapiWardrobe } from '@/types/models'
import { Icon, iconCheck, iconPlus } from '@/Components/Icons'
import { Button } from '@/Components'
import { OR, Input, useFields } from '@/Form'
import { Popup } from '@/Layout'

import {
  createWardrobeItem,
  removeWardrobeItem,
  getProductWardrobes,
  removeWardrobe,
  addWardrobe,
} from './api'

export const AddWardrobe = ({ product, visible, setVisible }) => {
  const [wardrobes, setWardrobes] = React.useState<StrapiWardrobe[]>([])
  const [wardrobeItems, setWardrobeItems] = React.useState([])
  const fields = useFields<{ name: string }>({
    name: {},
  })

  const updateProductWardrobes = () =>
    getProductWardrobes(product.id).then(({ wardrobes, wardrobeItems }) => {
      setWardrobes(wardrobes)
      setWardrobeItems(wardrobeItems)
    })

  React.useEffect(() => {
    if (visible) {
      updateProductWardrobes()
    }
  }, [visible])

  const createWardrobe = async (slug: string) =>
    addWardrobe(slug).then(() => updateProductWardrobes())

  const removeFromWardrobe = async (slug: string) =>
    removeWardrobe(slug).then(() => updateProductWardrobes())

  const toggleWardrobeItem = (wardrobe) => {
    const wardrobeItem = wardrobeItems.find(
      (wardrobeItem) =>
        wardrobeItem.wardrobe?.id === wardrobe.id ||
        (wardrobeItem.wardrobe === null && wardrobe.slug === 'my-wardrobe')
    )
    if (wardrobeItem) {
      removeWardrobeItem(wardrobeItem.id).then(() => updateProductWardrobes())
    } else {
      createWardrobeItem(wardrobe.id, product.id).then(() =>
        updateProductWardrobes()
      )
    }
  }

  return (
    <Popup
      isOpen={visible}
      close={() => setVisible(false)}
      header="Wardrobes"
      className="items-stretch"
    >
      <div className="w-full">
        {wardrobes.map((wardrobe) => (
          <WardrobeToggle
            key={wardrobe.id}
            toggle={toggleWardrobeItem}
            wardrobe={wardrobe}
            selected={wardrobeItems.find(
              (item) =>
                item.wardrobe?.id === wardrobe.id ||
                (item.wardrobe === null && wardrobe.slug === 'my-wardrobe')
            )}
            remove={removeFromWardrobe}
          />
        ))}
      </div>
      <OR />
      <div className="flex flex-row items-center">
        <Input field={fields.get('name')} />
        <Button
          className="ml-2 flex flex-row items-center"
          onClick={() =>
            createWardrobe(fields.value('name')).then(() =>
              fields.setValue('name', '')
            )
          }
        >
          Create wardrobe
        </Button>
      </div>
    </Popup>
  )
}

const WardrobeToggle = ({ remove, selected, wardrobe, toggle }) => {
  const size = 20
  return (
    <div className="flex-row justify-between my-1">
      <button
        className="flex flex-row items-center"
        onClick={() => toggle(wardrobe)}
        type="button"
        aria-label={`Add/remove from wardrobe ${wardrobe.name}`}
      >
        <input
          className="hidden"
          type="checkbox"
          checked={selected}
          readOnly={true}
        />
        <div
          className="items-center flex-shrink-0 justify-center bg-white border border-black"
          style={{ width: size, height: size, borderRadius: size / 8 }}
        >
          {selected && <Icon icon={iconCheck} size={(size * 2) / 3} />}
        </div>
        &nbsp;&nbsp;
        <span className="inline ${labelClassName}">{wardrobe.name}</span>
      </button>
      {wardrobe.slug !== 'my-wardrobe' && (
        <Button
          role="action"
          className="py-0"
          onClick={() => remove(wardrobe.slug)}
        >
          Remove
        </Button>
      )}
    </div>
  )
}

export const CreateWardrobe = () => {
  const fields = useFields<{ name: string }>({
    name: {},
  })

  return (
    <button className="flex flex-row items-center">
      <Input field={fields.get('name')} /> Add wardrobe
    </button>
  )
}

export const RemoveWardrobe = () => {
  return (
    <button>
      <Icon icon={iconPlus} size={20} /> Add wardrobe
    </button>
  )
}
