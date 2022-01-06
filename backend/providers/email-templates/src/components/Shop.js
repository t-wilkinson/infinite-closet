import React from 'react'

import { G } from '../layout'
import { Link, ButtonLink, Img } from '../components'
import { fmtPrice, normalizeSize } from '../utils'

const ShopItem = (product) => {
  return (
    <G style={{ fontSize: 14 }}>
      <Link
        provider="frontend"
        href={`/shop/${product.designer.slug}/${product.slug}`}
      >
        <Img
          provider="backend"
          src={product.images[0].url}
          style={{ width: 100, height: 200 }}
        />
      </Link>
      <br />
      <G.Cell style={{ lineHeight: 1.1 }}>
        <div>
          <strong style={{ textTransform: 'uppercase' }}>
            {product.designer.name}
          </strong>
        </div>
        <div>{product.name}</div>
        <div>
          {product.sizes.map((size, i) => (
            <span key={i}>
              {i > 0 ? ', ' : ''}
              {normalizeSize(size)}
            </span>
          ))}
        </div>
        <div>
          <strong>
            {fmtPrice(product.shortRentalPrice, true)}-
            {fmtPrice(product.longRentalPrice, true)}
          </strong>
          {' | '}
          <span className="text-gray">
            {fmtPrice(product.retailPrice, true)} retail
          </span>
        </div>
      </G.Cell>
    </G>
  )
}

export const YouMayAlsoLike = ({ recommendations }) => {
  return (
    <React.Fragment>
      <G>
        <G.Row>
          {recommendations.map((product, i) => (
            <ShopItem key={i} {...product} />
          ))}
        </G.Row>
        <G.Cell colSpan={recommendations.length}>
          <G cellPadding={32}>
            <center>
              <ButtonLink href="/products/clothing">Find Your Look</ButtonLink>
            </center>
          </G>
        </G.Cell>
      </G>
      <br />
      <br />
    </React.Fragment>
  )
}
