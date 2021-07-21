import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/utils/store'

interface State {
  email?: string
  popup: 'hidden' | 'signin' | 'register' | 'email'
}

const initialState: State = {
  popup: 'hidden',
}

export const accountSlice = createSlice({
  name: 'ACCOUNT',
  initialState,
  reducers: {
    resetEmail(state) {
      state.email = ''
    },
    setEmail(state, { payload }: PayloadAction<string>) {
      state.email = payload
    },
    hidePopup(state) {
      state.email = ''
      state.popup = 'hidden'
    },
    // togglePopup(state, { payload }: PayloadAction<State['popup']>) {
    //   state.popup = state.popup === 'hidden' ? payload : 'hidden'
    // },
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
