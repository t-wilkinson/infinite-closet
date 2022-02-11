import { getURL } from '@/utils/axios'
import { StrapiProduct } from '@/types/models'

export const productImageProps = (product: StrapiProduct) => {
  const mainImage = product.images[0]
  return {
    src: getURL(mainImage.formats.thumbnail?.url || mainImage.url),
    alt:
      mainImage.alternativeText ||
      `${product.name} by ${product.designer.name}`,
  }
}
