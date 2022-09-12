import React from 'react'
import * as t from '@/utils/test'
import ProductItem from '@/Product/ProductItem'
import { product } from '../__mocks__/product.ts'
import renderer from 'react-test-renderer';

describe('ProductItem', () => {
  test('.', () => {
    const tree = renderer.create(t.render(<ProductItem product={product} />))
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
