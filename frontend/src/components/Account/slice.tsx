import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/utils/store'

interface State {
  popup: 'hidden' | 'signin' | 'register' | 'email'
}

const initialState: State = {
  popup: 'hidden',
}

export const accountSlice = createSlice({
  name: 'ACCOUNT',
  initialState,
  reducers: {
    hidePopup(state) {
      state.popup = 'hidden'
    },
    togglePopup(state, { payload }: PayloadAction<State['popup']>) {
      state.popup = state.popup === 'hidden' ? payload : 'hidden'
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
