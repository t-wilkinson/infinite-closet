import { getURL } from '@/utils/axios'
import { StrapiProduct } from '@/types/models'

export const productImageProps = (product: StrapiProduct) => {
  const mainImage = product.images[0]
  return {
    src: getURL(mainImage.formats.thumbnail?.url || mainImage.url),
    alt:
      mainImage.alternativeText ||
      product.designer ? `${product.name} by ${product.designer.name}` : product.name,
  }
}

export const productRentalPrice = (product: StrapiProduct, rentalLength: 'short' | 'long') => {
  switch (rentalLength) {
    case 'short':
      return product.shortRentalPrice
    case 'long':
      return product.longRentalPrice
    default:
      return undefined
  }
}
