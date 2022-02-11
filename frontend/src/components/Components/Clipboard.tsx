import { toast } from 'react-toastify'

export function copyToClipboard(value: string, message: string) {
  if (!navigator.clipboard) {
    console.error("Don't have access to clipboard")
  }
  navigator.clipboard?.writeText(value).then(
    () => toast.success(`Successfully copied ${message} to clipboard.`),
    () => toast.error(`Could not copy ${message} to clipboard.`)
  )
}

export const CopyToClipboard = ({ value, message }) => (
  <button
    type="button"
    className="bg-gray-light p-2 rounded-m m-2 select-all"
    onClick={() => copyToClipboard(value, message)}
  >
    {value}
  </button>
)

export default CopyToClipboard
