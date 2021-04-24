import React from 'react'
import { AntDesign } from '@expo/vector-icons'

import { Divider, div, span, button } from '@/shared/components'
import Share from '@/shared/share'
import { extras } from '@/shared/constants'

import { State } from './types'

export const ProductDeatils = ({ selected, setState, item, shopItem }) => (
  <>
    <button
      onPress={() =>
        setState((s: State) => ({
          ...s,
          moreInfo: item.key === s.moreInfo ? undefined : item.key,
        }))
      }
    >
      <div px="sm" py="md" flexDirection="row" justifyContent="space-between">
        <span variant={selected ? 'body-bold' : 'body'}>{item.label}</span>
        <AntDesign size={12} name={selected ? 'down' : 'up'} />
      </div>
    </button>
    {item.key === 'share' ? (
      <div flexDirection="row" visible={selected} px="sm" pb="md">
        <div mr="sm">
          <Share.Facebook
            url={createProductURL(shopItem)}
            description={shopItem.description}
          />
        </div>
        <Share.Pinterest
          url={createProductURL(shopItem)}
          description={shopItem.description}
          imageURL={shopItem.images[0]}
        />
      </div>
    ) : (
      <div bg="light-gray" px="sm" py="md" visible={selected}>
        <span>{shopItem[item.key]}</span>
      </div>
    )}
    <Divider />
  </>
)
export default ProductDeatils

const createProductURL = ({ name_uid, designer: { name: designer_uid } }) =>
  `${extras.domain}/@/Shop/listings/${designer_uid}/${name_uid}`
