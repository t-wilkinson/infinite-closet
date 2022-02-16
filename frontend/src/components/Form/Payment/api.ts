import axios from '@/utils/axios'

export const deletePaymentMethod = ({ userId, paymentId }) =>
    axios
      .delete<void>(`/account/${userId}/payment-methods/${paymentId}`)

