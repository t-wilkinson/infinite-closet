import React from 'react'

import { Size } from '@/types'
import * as sizing from '@/utils/sizing'
import useAnalytics from '@/utils/useAnalytics'
import { useDispatch, useSelector } from '@/utils/store'

import { Form, Submit } from '@/Form'
import { Button } from '@/Components'
import { addToCart, addToFavorites } from '@/Order'
import { SelectRentalSize, SelectRentalDate, DatePicker} from '@/Order/Cart/AddToCart'
import { AddWardrobe } from '@/Wardrobe/AddWardrobe'

export const AddToCart = ({ fields, product }) => {
  const user = useSelector((state) => state.user.data)
  const Contents = productRentContents[fields.value('rentType')]
  const dispatch = useDispatch()

  return (
    <Contents
      fields={fields}
      user={user}
      product={product}
      dispatch={dispatch}
    />
  )
}

export const productRentContents = {
  OneTime: ({ user, dispatch, product, fields }) => {
    const analytics = useAnalytics()
    const [addedFavorite, setAddedFavorite] = React.useState(false)
    const [wardrobePopupVisible, setWardrobePopupVisible] = React.useState(true)

    React.useEffect(() => {
      const hasSize = (size: Size) => sizing.get(product.sizes, size)
      if (user?.dressSize && hasSize(user.dressSize)) {
        fields.get('size').setValue(user.dressSize)
      } else if (!hasSize(fields.get('size').value) && product.sizes[0]) {
        fields.get('size').setValue(product.sizes[0].size)
      }
    }, [user])

    // React.useEffect(() => {
    //   var settings = {
    //     integration_code: 'SC-A8B4CC5D',
    //     retailer_token: 'EfrpfcDJyCWwju2rrf6fqz2t',
    //   }
    //   var s = document.createElement('script')
    //   s.src = 'https://widget.mysz.io/v1/assets/js/mysize-connect.js'
    //   s.async = true
    //   // @ts-ignore
    //   window.MYSIZE = Object.assign(window.MYSIZE || {}, settings)
    //   document.body.appendChild(s)
    // }, [])

    const quantity = sizing.get(
      product.sizes,
      fields.get('size').value
    )?.quantity

    return (
      <>
      <Form
        fields={fields}
        onSubmit={() => addToCart({fields, dispatch, analytics, user, product})}
        redirect={user ? '/buy' : '/account/checkout/register'}
      >
        <DatePicker
          fields={fields}
          product={product}
        />

        <SelectRentalSize
          size={fields.get('size')}
          selectedDate={fields.get('selectedDate')}
          product={product}
        />
        <SelectRentalDate
          size={fields.get('size')}
          rentalLength={fields.get('rentalLength')}
          selectedDate={fields.get('selectedDate')}
          setVisible={(visible: boolean) => fields.setValue('visible', visible)}
        />

        <Submit
          form={fields.form}
          className="my-2 self-center rounded-sm w-full"
          disabled={fields.form.value === 'success'}
        >
          {quantity === 0 ? 'Pre-Order' : 'Add to Cart'}
        </Submit>
        <Button
          role="secondary"
          disabled={addedFavorite}
          onClick={() => {
            addToFavorites({fields, dispatch, analytics, user, product})
            .then(() => setAddedFavorite(true))
          }}
        >
          Add to Favorites
        </Button>
        {user && <>
          <Button
          role="secondary"
          onClick={() => {
            setWardrobePopupVisible(true)
          }}
        >
          Add to Wardrobe
        </Button>
        </>
        }
      </Form>
        <AddWardrobe product={product} visible={wardrobePopupVisible} setVisible={setWardrobePopupVisible} />
        </>
    )
  },

  Membership: () => (
    <div className="justify-center items-center flex-grow h-64">
      <span className="font-subheader text-center text-3xl">Coming Soon</span>
    </div>
  ),

  Purchase: () => (
    <div className="justify-center items-center flex-grow h-64">
      <span className="font-subheader text-center text-3xl">Coming Soon</span>
    </div>
  ),
}

export default AddToCart
