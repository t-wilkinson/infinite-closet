import axios from '@/utils/axios'
import { StrapiUser } from '@/types/models'
import { userActions } from '@/User/slice'
import { OrderUtils } from '@/Order'

export const signin = (dispatch: any) =>
  axios
    .post<{ user?: StrapiUser }>('/account/signin', {})
    .then((data) => {
      if (data.user) {
        // loggedIn tracks if the user has logged into the web site
        window.localStorage.setItem('logged-in', 'true')
        dispatch(userActions.signin(data.user))

        return data.user
      } else {
        throw new Error('User not found')
      }
    })
    .catch(() => {
      dispatch(userActions.signout())
      throw new Error('User not found')
    })

export const signout = (dispatch: any) =>
    axios
      .post<void>('/account/signout', {})
      .then(async () => {
        await dispatch(userActions.signout())
        dispatch(OrderUtils.count())
        dispatch(OrderUtils.view())
      })
      .catch((err) => console.error(err))

