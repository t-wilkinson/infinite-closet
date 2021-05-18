import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/utils/store'
import { StrapiUser } from '@/utils/models'

interface State {
  user?: StrapiUser
}

const initialState: State = {}

export const accountSlice = createSlice({
  name: 'ACCOUNT',
  initialState,
  reducers: {
    login(state, { payload }: PayloadAction<StrapiUser>) {
      state.user = payload
    },
    logout(state, { payload }: PayloadAction<StrapiUser>) {
      state.user = payload
    },
  },
})

const accountSelector = (state: RootState) => state.account

const accountSelectors = {
  account: accountSelector,
}

export { accountSelectors }
export const accountActions = accountSlice.actions
export default accountSlice.reducer
