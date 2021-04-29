import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/utils/store'

interface State {
  user?: string
  jwt?: string
}

const initialState: State = {}

export const accountsSlice = createSlice({
  name: 'ACCOUNTS',
  initialState,
  reducers: {
    addJWT(state, { payload }: PayloadAction<string>) {
      state.jwt = payload
    },
    login(state, { payload }: PayloadAction<string>) {
      state.user = payload
    },
    logout(state, { payload }: PayloadAction<string>) {
      state.user = payload
    },
  },
})

const accountsSelector = (state: RootState) => state.accounts

const accountsSelectors = {
  accounts: accountsSelector,
}

export { accountsSelectors }
export const accountsActions = accountsSlice.actions
export default accountsSlice.reducer
