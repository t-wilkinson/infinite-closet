import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/utils/store'
import { StrapiUser } from '@/utils/models'

interface State {
  user?: StrapiUser
  popup: 'hidden' | 'sign-in' | 'register' | 'email'
}

const initialState: State = {
  popup: 'email',
}

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
