import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StrapiUser } from '@/types/models'

interface State {
  data?: undefined | null | StrapiUser
}

const initialState: State = {}

export const userSlice = createSlice({
  name: 'USER',
  initialState,
  reducers: {
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

export const userActions = userSlice.actions
export default userSlice.reducer
