import Register from './Register'

const popups = {
  hidden: () => null,
  register: Register,
  email: () => null,
  'sign-in': () => null,
}

export const Popup = ({ popup }) => {
  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-70">
      {popups[popup]()}
    </div>
  )
}

export default Popup
