import { StrapiUser } from '@/types/models'

export const displayUsername = (username: string) => {
  return username ? username.split('-').slice(0, -1).join('-') : ''
}
