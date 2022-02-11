import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  email?: string
  name?: string
  popup: 'hidden' | 'signin' | 'register' | 'email'
}

const initialState: State = {
  popup: 'hidden',
}

export const rootSlice = createSlice({
  name: 'ROOT',
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
      state.name = ''
      state.popup = 'hidden'
    },
    showPopup(state, { payload }: PayloadAction<State['popup']>) {
      state.popup = payload
    },
  },
})

export const rootActions = rootSlice.actions
export default rootSlice.reducer
