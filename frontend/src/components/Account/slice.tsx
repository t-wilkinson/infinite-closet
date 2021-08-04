import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/utils/store'

interface State {
  email?: string
  name?: string
  popup: 'hidden' | 'signin' | 'register' | 'email'
}

const initialState: State = {
  popup: 'email',
}

export const accountSlice = createSlice({
  name: 'ACCOUNT',
  initialState,
  reducers: {
    resetEmail(state) {
      state.email = ''
    },
    setName(state, { payload }: PayloadAction<string>) {
      state.name = payload
    },
    setEmail(state, { payload }: PayloadAction<string>) {
      state.email = payload
    },
    hidePopup(state) {
      state.email = ''
      state.popup = 'hidden'
    },
    showPopup(state, { payload }: PayloadAction<State['popup']>) {
      state.popup = payload
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
