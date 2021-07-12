import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/utils/store'
import { StrapiUser } from '@/utils/models'

interface State {
  data?: null | StrapiUser
  cartCount?: number
}

const initialState: State = {}

export const userSlice = createSlice({
  name: 'USER',
  initialState,
  reducers: {
    countCart(state, { payload }: PayloadAction<number>) {
      state.cartCount = payload
    },
    noUser(state) {
      state.data = null
    },
    signin(state, { payload }: PayloadAction<StrapiUser>) {
      state.data = payload
    },
    signout(state) {
      state.data = null
    },
  },
})

const userSelector = (state: RootState) => state.user

const userSelectors = {
  user: userSelector,
}

export { userSelectors }
export const userActions = userSlice.actions
export default userSlice.reducer
