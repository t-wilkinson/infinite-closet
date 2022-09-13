import React from 'react'
import * as t from '@/utils/test'
import ProductItem from '@/Product/ProductItem'
import { product } from '../__mocks__/product.ts'
import renderer from 'react-test-renderer';

describe('ProductItem', () => {
  test('ProductItem', () => {
    const tree = renderer.create(<ProductItem product={product} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
