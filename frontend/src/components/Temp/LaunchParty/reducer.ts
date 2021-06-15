type Status = null | 'checking-out' | 'error' | 'success'
type Hover = null | 'donation'
type Info = 'info' | 'payment'

export const initialState = {
  status: null as Status,
  error: undefined,
  paymentStatus: undefined,
  donation: 0,
  hover: null as Hover,
  edit: 'info' as Info,
  promoValid: undefined,
}

export const reducer = (state, action) => {
  // prettier-ignore
  switch (action.type) {
    case 'try-promo-again': return {...state, promoValid: undefined}
    case 'promo-valid': return {...state, promoValid: true}
    case 'promo-invalid': return {...state, promoValid: false}

    case 'edit-info': return {...state, edit: 'info'}
    case 'edit-payment': return {...state, edit: 'payment'}

    case 'hover-donation': return {...state, hover: 'donation'}
    case 'hover-leave': return {...state, hover: null}

    case 'donation-amount': return {...state, donation: action.payload}

    case 'status-checkout': return {...state, status: 'checking-out'}
    case 'status-error': return {...state, status: 'error'}
    case 'status-success': return {...state, status: 'success'}

    case 'payment-progress': return { ...state, paymentStatus:undefined, error: undefined }
    case 'payment-error': return { ...state, paymentStatus: 'disabled', error: action.payload }
    case 'payment-succeeded': return { ...state, paymentStatus: action.payload ?? 'succeeded', error: undefined, }
    case 'payment-processing': return { ...state, paymentStatus: 'processing' }
    case 'payment-failed': {
      let error: string
      if (action.payload.error?.message) {
        error = `Payment failed ${action.payload.error.message}`
      } else {
        error = `Payment failed`
      }
      return { ...state, paymentStatus: 'failed', error: error }
    }

    default: return state
  }
}

export default reducer
