import axios from '@/utils/axios'
import { StrapiProduct } from '@/types/models'

export async function getProduct(params) {
    return await axios
      .get<StrapiProduct >(`/products/shop/${params.item}`, {withCredentials: false})
}
