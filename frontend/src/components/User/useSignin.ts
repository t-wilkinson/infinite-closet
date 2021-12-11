import axios from '@/utils/axios'
import { StrapiUser } from '@/types/models'
import { userActions } from '@/User/slice'
import { useDispatch } from '@/utils/store'

const signin = (dispatch: any) =>
  axios
    .post<{ user?: StrapiUser }>('/account/signin', {})
    .then((data) => {
      if (data.user) {
        // loggedIn tracks if the user has logged into the web site
        window.localStorage.setItem('logged-in', 'true')
        dispatch(userActions.signin(data.user))

        return data.user
      } else {
        dispatch(userActions.signout())
        throw new Error('User not found')
      }
    })
    .catch(() => {
      dispatch(userActions.signout())
      throw new Error('User not found')
    })

export const useSignin = () => {
  const dispatch = useDispatch()
  return () => signin(dispatch)
}


export default useSignin
