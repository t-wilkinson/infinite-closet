import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/utils/store'
import { StrapiUser } from '@/utils/models'

interface State {
  user?: StrapiUser
}

const initialState: State = {}

export const userSlice = createSlice({
  name: 'USER',
  initialState,
  reducers: {
    signin(state, { payload }: PayloadAction<StrapiUser>) {
      state.user = payload
    },
    logout(state, { payload }: PayloadAction<StrapiUser>) {
      state.user = payload
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
