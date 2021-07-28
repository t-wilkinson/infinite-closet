// TODO: refactor
/* Components that are used everywhere */
import React from 'react'
import Link from 'next/link'

export const BlueLink = ({ href, label }) => (
  <Link href={href}>
    <a>
      <span className="cursor-pointer text-blue-500">{label}</span>
    </a>
  </Link>
)

export const CheckBox = ({
  state = false,
  setState,
  color = undefined,
  className = '',
  children,
  ...props
}) => (
  <button onClick={() => setState(!state)} aria-label="Toggle checkbox">
    <div className="flex-row flex-wrap items-center" {...props}>
      <div className="items-center justify-center w-5 h-5 bg-white border border-black rounded-sm">
        <Icon
          name={state ? 'check' : undefined}
          className={className + 'w-3 h-3'}
          style={{ color }}
        />
      </div>
      {children}
    </div>
  </button>
)

export const Divider = ({
  visible = true,
  className = '',
  border = 'border-gray-light',
}) => visible && <div className={`${border} border-b-2 w-full ${className}`} />

// export const Button = ({
//   onClick = () => {},
//   children,
//   className = '',
//   disabled = false,
//   label = '',
//   ...props
// }) => (
//   <button
//     className="items-center"
//     onClick={onClick}
//     disabled={disabled}
//     aria-label={label}
//     {...props}
//   >
//     {children}
//   </button>
// )

export const CallToAction = ({
  onClick = () => {},
  children,
  className = '',
  disabled = false,
  ...props
}) => (
  <button
    className="items-center"
    onClick={onClick}
    disabled={disabled}
    aria-label="Activate call to action"
  >
    <div
      className={`items-center content-center p-3 bg-pri transition duration-200
        ${className}
        ${disabled ? 'bg-pri-light' : 'hover:bg-sec bg-pri'}
      `}
      {...props}
    >
      <span className="text-white" children={children} />
    </div>
  </button>
)

interface Icon {
  name: keyof typeof icons
  className?: string
  size?: number
  style?: object
}

export const Icon = ({
  name,
  className = '',
  size = undefined,
  style = {},
  ...props
}: Icon) => {
  const sizes = size ? { width: size, height: size } : {}

  return (
    <div
      className={`fill-current ${className}`}
      style={{ ...style, ...sizes }}
      {...props}
    >
      {icons[name]}
    </div>
  )
}

// TODO: this is ~ 24K not compressed
const icons = {
  plus: (
    <svg viewBox="0 0 448 448">
      <path d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 512 512">
      <path
        d="M256,0C161.896,0,85.333,76.563,85.333,170.667c0,28.25,7.063,56.26,20.49,81.104L246.667,506.5
        c1.875,3.396,5.448,5.5,9.333,5.5s7.458-2.104,9.333-5.5l140.896-254.813c13.375-24.76,20.438-52.771,20.438-81.021
        C426.667,76.563,350.104,0,256,0z M256,256c-47.052,0-85.333-38.281-85.333-85.333c0-47.052,38.281-85.333,85.333-85.333
        s85.333,38.281,85.333,85.333C341.333,217.719,303.052,256,256,256z"
      />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 512 512">
      <path d="m256 512c-141.164062 0-256-114.835938-256-256s114.835938-256 256-256 256 114.835938 256 256-114.835938 256-256 256zm0-480c-123.519531 0-224 100.480469-224 224s100.480469 224 224 224 224-100.480469 224-224-100.480469-224-224-224zm0 0" />
      <path d="m368 394.667969c-4.097656 0-8.191406-1.558594-11.308594-4.695313l-112-112c-3.007812-3.007812-4.691406-7.082031-4.691406-11.304687v-149.335938c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v142.699219l107.308594 107.308594c6.25 6.25 6.25 16.382812 0 22.632812-3.117188 3.136719-7.210938 4.695313-11.308594 4.695313zm0 0" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 512 512">
      <path
        d="M256,288.389c-153.837,0-238.56,72.776-238.56,204.925c0,10.321,8.365,18.686,18.686,18.686h439.747
			c10.321,0,18.686-8.365,18.686-18.686C494.56,361.172,409.837,288.389,256,288.389z M55.492,474.628
			c7.35-98.806,74.713-148.866,200.508-148.866s193.159,50.06,200.515,148.866H55.492z"
      />
      <path
        d="M256,0c-70.665,0-123.951,54.358-123.951,126.437c0,74.19,55.604,134.54,123.951,134.54s123.951-60.35,123.951-134.534
			C379.951,54.358,326.665,0,256,0z M256,223.611c-47.743,0-86.579-43.589-86.579-97.168c0-51.611,36.413-89.071,86.579-89.071
			c49.363,0,86.579,38.288,86.579,89.071C342.579,180.022,303.743,223.611,256,223.611z"
      />
    </svg>
  ),
  'shopping-bag': (
    <svg viewBox="-35 0 512 512.00102">
      <path d="m443.054688 495.171875-38.914063-370.574219c-.816406-7.757812-7.355469-13.648437-15.15625-13.648437h-73.140625v-16.675781c0-51.980469-42.292969-94.273438-94.273438-94.273438-51.984374 0-94.277343 42.292969-94.277343 94.273438v16.675781h-73.140625c-7.800782 0-14.339844 5.890625-15.15625 13.648437l-38.9140628 370.574219c-.4492192 4.292969.9453128 8.578125 3.8320308 11.789063 2.890626 3.207031 7.007813 5.039062 11.324219 5.039062h412.65625c4.320313 0 8.4375-1.832031 11.324219-5.039062 2.894531-3.210938 4.285156-7.496094 3.835938-11.789063zm-285.285157-400.898437c0-35.175782 28.621094-63.796876 63.800781-63.796876 35.175782 0 63.796876 28.621094 63.796876 63.796876v16.675781h-127.597657zm-125.609375 387.25 35.714844-340.097657h59.417969v33.582031c0 8.414063 6.824219 15.238282 15.238281 15.238282s15.238281-6.824219 15.238281-15.238282v-33.582031h127.597657v33.582031c0 8.414063 6.824218 15.238282 15.238281 15.238282 8.414062 0 15.238281-6.824219 15.238281-15.238282v-33.582031h59.417969l35.714843 340.097657zm0 0" />
    </svg>
  ),
  logo: (
    <svg viewBox="0 0 213.36864 145.47653">
      <g id="layer1" transform="translate(431.30717,-87.070989)">
        <path d="m -324.73724,87.072273 c -2.94094,0.02997 -5.90126,0.613321 -8.72206,1.781733 -8.75302,3.625618 -14.47084,12.182324 -14.47084,21.656514 0,1.41269 1.14425,2.5583 2.55691,2.55852 1.41316,4.1e-4 2.5588,-1.14537 2.55812,-2.55852 0,-7.4202 4.45798,-14.093075 11.31337,-16.932663 6.85538,-2.839591 14.72738,-1.273438 19.97427,3.973439 5.24689,5.246874 6.81142,13.117304 3.97185,19.972684 -2.83926,6.85451 -9.51078,11.31342 -16.92988,11.31454 h -0.003 -0.20379 c -1.41199,4.1e-4 -2.55656,1.14493 -2.55693,2.55693 v 17.60315 c -33.99355,19.55561 -68.6659,39.73751 -102.74836,59.07815 -0.81751,0.45701 -1.31983,1.32431 -1.30943,2.26083 0.0581,6.31422 0.25659,13.57907 0.19619,19.44603 v 0.20539 c 0,1.41262 1.14429,2.55815 2.55692,2.55852 h 207.95577 c 0.71125,1e-4 1.39043,-0.29598 1.87444,-0.81715 0.50171,-0.48227 0.78524,-1.14815 0.78517,-1.84407 v -19.86159 c -6.1e-4,-0.46306 -0.12675,-0.91729 -0.36521,-1.31422 -0.006,-0.0111 -0.0122,-0.0222 -0.0184,-0.0332 -0.002,-0.003 -0.005,-0.007 -0.008,-0.0104 -0.22408,-0.39263 -0.54822,-0.71884 -0.93941,-0.94541 l -102.6608,-58.72292 v -15.18565 c 8.43128,-0.92503 15.80402,-6.37297 19.1,-14.33019 3.62562,-8.75301 1.61737,-18.84917 -5.08187,-25.548436 -4.39641,-4.396395 -10.25523,-6.771836 -16.2374,-6.860814 -0.19585,-0.0029 -0.39172,-0.0032 -0.58779,-0.0012 z m -0.14121,66.571327 101.62092,57.91667 v 15.66639 h -202.73963 c 6e-5,-0.01 6e-5,-0.0195 0,-0.0292 l -0.17821,-15.39987 101.29692,-58.15402 c 2.94827,-4.645 -2.37104,-4.645 0,0 z" />
      </g>
    </svg>
  ),
  email: (
    <svg viewBox="0 0 479.058 479.058">
      <path d="m434.146 59.882h-389.234c-24.766 0-44.912 20.146-44.912 44.912v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159l-200.355 173.649-200.356-173.649c1.769-.736 3.704-1.159 5.738-1.159zm0 299.411h-389.234c-8.26 0-14.971-6.71-14.971-14.971v-251.648l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 297 297">
      <path
        d="M294.908,142.226c-0.566-0.756-14.169-18.72-38.883-36.693c-32.842-23.886-70.023-36.511-107.524-36.511
        c-37.501,0-74.683,12.625-107.525,36.51C16.261,123.506,2.658,141.47,2.092,142.226c-2.789,3.718-2.789,8.831,0,12.549
        c0.566,0.756,14.169,18.72,38.884,36.694c32.843,23.885,70.024,36.51,107.525,36.51c37.502,0,74.683-12.625,107.524-36.511
        c24.714-17.974,38.316-35.938,38.883-36.693C297.697,151.057,297.697,145.943,294.908,142.226z M207.065,148.5
        c0,32.292-26.271,58.564-58.563,58.564S89.938,180.792,89.938,148.5s26.271-58.563,58.563-58.563S207.065,116.208,207.065,148.5z
        M24.152,148.499c8.936-9.863,28.83-29.278,57.591-43.046c-8.034,12.415-12.721,27.19-12.721,43.047
        c0,15.914,4.719,30.738,12.807,43.181c-9.538-4.566-18.878-10.143-27.995-16.724C39.936,164.925,29.835,154.779,24.152,148.499z
        M243.167,174.957c-9.117,6.581-18.457,12.156-27.993,16.724c8.087-12.442,12.806-27.268,12.806-43.181
        s-4.719-30.738-12.806-43.181c9.536,4.567,18.876,10.143,27.993,16.724c13.897,10.032,23.998,20.178,29.68,26.457
        C267.161,154.783,257.062,164.927,243.167,174.957z"
      />
      <circle cx="148.501" cy="148.5" r="17.255" />
    </svg>
  ),
  'eye-hidden': (
    <svg viewBox="0 0 297 297">
      <path d="M294.908,142.225c-0.566-0.756-14.168-18.72-38.881-36.693c-10.007-7.277-20.418-13.504-31.116-18.652l47.458-47.458 c4.084-4.084,4.084-10.706,0-14.79c-4.085-4.083-10.705-4.083-14.79,0L203.922,78.29c-18.06-6.122-36.7-9.269-55.42-9.269 c-37.501,0-74.683,12.625-107.526,36.51C16.262,123.506,2.658,141.47,2.092,142.225c-2.789,3.718-2.789,8.831,0,12.549 c0.566,0.756,14.17,18.72,38.884,36.694c10.006,7.277,20.418,13.503,31.115,18.651l-47.458,47.458 c-4.084,4.084-4.084,10.706,0,14.79c2.043,2.042,4.719,3.063,7.394,3.063c2.678,0,5.354-1.021,7.396-3.063l53.658-53.658 c18.062,6.122,36.701,9.268,55.421,9.268c37.502,0,74.684-12.625,107.525-36.511c24.713-17.974,38.315-35.938,38.881-36.693 C297.697,151.057,297.697,145.943,294.908,142.225z M207.065,148.5c0,32.292-26.271,58.564-58.563,58.564 c-12.376,0-23.859-3.87-33.328-10.446l23.981-23.98c2.899,1.123,6.05,1.746,9.347,1.746c14.296,0,25.883-11.587,25.883-25.883 c0-3.298-0.623-6.447-1.746-9.348l23.98-23.98C203.196,124.641,207.065,136.123,207.065,148.5z M89.939,148.5 c0-32.292,26.271-58.563,58.564-58.563c12.376,0,23.859,3.868,33.326,10.446l-23.98,23.98c-2.9-1.123-6.049-1.746-9.346-1.746 c-14.296,0-25.883,11.587-25.883,25.883c0,3.297,0.623,6.446,1.746,9.346l-23.98,23.98C93.808,172.358,89.939,160.876,89.939,148.5z M24.153,148.5c5.687-6.283,15.785-16.427,29.681-26.457c9.118-6.581,18.458-12.157,27.996-16.725 c-8.088,12.443-12.807,27.268-12.807,43.182s4.719,30.738,12.807,43.182c-9.538-4.567-18.878-10.144-27.996-16.725 C39.937,164.925,29.836,154.779,24.153,148.5z M243.167,174.957c-9.115,6.581-18.456,12.156-27.991,16.724 c8.086-12.442,12.805-27.268,12.805-43.181s-4.719-30.738-12.805-43.181c9.535,4.567,18.876,10.143,27.991,16.724 c13.897,10.032,23.998,20.178,29.681,26.457C267.162,154.783,257.063,164.927,243.167,174.957z" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 512 512">
      <path d="M230.792,354.313l-6.729,60.51c-0.333,3.01,0.635,6.031,2.656,8.292c2.021,2.26,4.917,3.552,7.948,3.552h42.667 c3.031,0,5.927-1.292,7.948-3.552c2.021-2.26,2.99-5.281,2.656-8.292l-6.729-60.51c10.927-7.948,17.458-20.521,17.458-34.313 c0-23.531-19.135-42.667-42.667-42.667S213.333,296.469,213.333,320C213.333,333.792,219.865,346.365,230.792,354.313z M256,298.667c11.76,0,21.333,9.573,21.333,21.333c0,8.177-4.646,15.5-12.125,19.125c-4.073,1.979-6.458,6.292-5.958,10.781 l6.167,55.427h-18.833l6.167-55.427c0.5-4.49-1.885-8.802-5.958-10.781c-7.479-3.625-12.125-10.948-12.125-19.125 C234.667,308.24,244.24,298.667,256,298.667z" />
      <path d="M437.333,192h-32v-42.667C405.333,66.99,338.344,0,256,0S106.667,66.99,106.667,149.333V192h-32 C68.771,192,64,196.771,64,202.667v266.667C64,492.865,83.135,512,106.667,512h298.667C428.865,512,448,492.865,448,469.333 V202.667C448,196.771,443.229,192,437.333,192z M128,149.333c0-70.583,57.417-128,128-128s128,57.417,128,128V192h-21.333 v-42.667c0-58.813-47.854-106.667-106.667-106.667S149.333,90.521,149.333,149.333V192H128V149.333z M341.333,149.333V192 H170.667v-42.667C170.667,102.281,208.948,64,256,64S341.333,102.281,341.333,149.333z M426.667,469.333 c0,11.76-9.573,21.333-21.333,21.333H106.667c-11.76,0-21.333-9.573-21.333-21.333v-256h341.333V469.333z" />
    </svg>
  ),
  'lock-open': (
    <svg viewBox="0 0 512 512">
      <path
        d="M256,0c-82.347,0-149.333,66.987-149.333,149.333v96c0,5.888,4.779,10.667,10.667,10.667S128,251.221,128,245.333v-96
			c0-70.592,57.408-128,128-128s128,57.408,128,128V192h-21.333v-42.667c0-58.816-47.851-106.667-106.667-106.667
			S149.333,90.517,149.333,149.333v96c0,5.888,4.779,10.667,10.667,10.667s10.667-4.779,10.667-10.667v-96
			C170.667,102.272,208.939,64,256,64s85.333,38.272,85.333,85.333v53.333c0,5.888,4.779,10.667,10.667,10.667h42.667
			c5.888,0,10.667-4.779,10.667-10.667v-53.333C405.333,66.987,338.347,0,256,0z"
      />
      <path
        d="M394.667,234.667H117.333c-17.643,0-32,14.357-32,32v192c0,29.397,23.936,53.333,53.333,53.333h234.667
			c29.397,0,53.333-23.936,53.333-53.333v-192C426.667,249.024,412.309,234.667,394.667,234.667z M405.333,458.667
			c0,17.643-14.357,32-32,32H138.667c-17.643,0-32-14.357-32-32v-192c0-5.888,4.779-10.667,10.667-10.667h277.333
			c5.888,0,10.667,4.779,10.667,10.667V458.667z"
      />
      <path
        d="M284.8,372.693c8.811-8,13.867-19.221,13.867-31.36c0-23.531-19.136-42.667-42.667-42.667s-42.667,19.136-42.667,42.667
			c0,12.139,5.056,23.36,13.867,31.339l-13.312,39.936c-1.109,3.264-0.555,6.848,1.451,9.621c2.005,2.795,5.227,4.437,8.661,4.437
			h64c3.435,0,6.656-1.643,8.661-4.416c1.984-2.795,2.539-6.379,1.451-9.621L284.8,372.693z M262.123,372.139l11.072,33.195h-34.389
			l11.072-33.195c1.579-4.757-0.363-9.984-4.672-12.544c-6.592-3.925-10.539-10.752-10.539-18.261
			c0-11.755,9.579-21.333,21.333-21.333s21.333,9.579,21.333,21.333c0,7.509-3.947,14.336-10.539,18.261
			C262.485,362.155,260.523,367.381,262.123,372.139z"
      />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 384.97 384.97">
      <path
        d="M12.03,120.303h360.909c6.641,0,12.03-5.39,12.03-12.03c0-6.641-5.39-12.03-12.03-12.03H12.03
			c-6.641,0-12.03,5.39-12.03,12.03C0,114.913,5.39,120.303,12.03,120.303z"
      />
      <path
        d="M372.939,180.455H12.03c-6.641,0-12.03,5.39-12.03,12.03s5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03
			S379.58,180.455,372.939,180.455z"
      />
      <path
        d="M372.939,264.667H132.333c-6.641,0-12.03,5.39-12.03,12.03c0,6.641,5.39,12.03,12.03,12.03h240.606
			c6.641,0,12.03-5.39,12.03-12.03C384.97,270.056,379.58,264.667,372.939,264.667z"
      />
    </svg>
  ),
  'menu-full': (
    <svg viewBox="0 -53 384 384">
      <path d="m368 154.667969h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
      <path d="m368 32h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
      <path d="m368 277.332031h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 512.005 512.005">
      <path
        d="M505.749,475.587l-145.6-145.6c28.203-34.837,45.184-79.104,45.184-127.317c0-111.744-90.923-202.667-202.667-202.667
			S0,90.925,0,202.669s90.923,202.667,202.667,202.667c48.213,0,92.48-16.981,127.317-45.184l145.6,145.6
			c4.16,4.16,9.621,6.251,15.083,6.251s10.923-2.091,15.083-6.251C514.091,497.411,514.091,483.928,505.749,475.587z
			 M202.667,362.669c-88.235,0-160-71.765-160-160s71.765-160,160-160s160,71.765,160,160S290.901,362.669,202.667,362.669z"
      />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 329.26933 379">
      <path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0" />
    </svg>
  ),
  date: (
    <svg viewBox="0 0 511.977 511.977">
      <path d="m14.977 390.988h392c3.516 0 6.914-1.23 9.609-3.472 3.765-3.153 89.652-77.038 94.889-236.528h-421c-5.217 144.774-84.315 212.822-85.137 213.501-4.819 4.072-6.592 10.723-4.424 16.641 2.153 5.903 7.764 9.858 14.063 9.858z" />
      <path d="m496.976 60.988h-75v-15c0-8.4-6.6-15-15-15s-15 6.6-15 15v15h-76v-15c0-8.4-6.6-15-15-15s-15 6.6-15 15v15h-75v-15c0-8.4-6.6-15-15-15s-15 6.6-15 15v15h-75c-8.4 0-15 6.6-15 15v45h421v-45c0-8.4-6.6-15-15-15z" />
      <path d="m435.849 410.515c-8.145 6.782-18.369 10.474-28.872 10.474h-316v45c0 8.291 6.709 15 15 15h391c8.291 0 15-6.709 15-15v-168.146c-28.92 70.951-69.276 106.937-76.128 112.672z" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 -28 512.001 512">
      <path d="m256 455.515625c-7.289062 0-14.316406-2.640625-19.792969-7.4375-20.683593-18.085937-40.625-35.082031-58.21875-50.074219l-.089843-.078125c-51.582032-43.957031-96.125-81.917969-127.117188-119.3125-34.644531-41.804687-50.78125-81.441406-50.78125-124.742187 0-42.070313 14.425781-80.882813 40.617188-109.292969 26.503906-28.746094 62.871093-44.578125 102.414062-44.578125 29.554688 0 56.621094 9.34375 80.445312 27.769531 12.023438 9.300781 22.921876 20.683594 32.523438 33.960938 9.605469-13.277344 20.5-24.660157 32.527344-33.960938 23.824218-18.425781 50.890625-27.769531 80.445312-27.769531 39.539063 0 75.910156 15.832031 102.414063 44.578125 26.191406 28.410156 40.613281 67.222656 40.613281 109.292969 0 43.300781-16.132812 82.9375-50.777344 124.738281-30.992187 37.398437-75.53125 75.355469-127.105468 119.308594-17.625 15.015625-37.597657 32.039062-58.328126 50.167969-5.472656 4.789062-12.503906 7.429687-19.789062 7.429687zm-112.96875-425.523437c-31.066406 0-59.605469 12.398437-80.367188 34.914062-21.070312 22.855469-32.675781 54.449219-32.675781 88.964844 0 36.417968 13.535157 68.988281 43.882813 105.605468 29.332031 35.394532 72.960937 72.574219 123.476562 115.625l.09375.078126c17.660156 15.050781 37.679688 32.113281 58.515625 50.332031 20.960938-18.253907 41.011719-35.34375 58.707031-50.417969 50.511719-43.050781 94.136719-80.222656 123.46875-115.617188 30.34375-36.617187 43.878907-69.1875 43.878907-105.605468 0-34.515625-11.605469-66.109375-32.675781-88.964844-20.757813-22.515625-49.300782-34.914062-80.363282-34.914062-22.757812 0-43.652344 7.234374-62.101562 21.5-16.441406 12.71875-27.894532 28.796874-34.609375 40.046874-3.453125 5.785157-9.53125 9.238282-16.261719 9.238282s-12.808594-3.453125-16.261719-9.238282c-6.710937-11.25-18.164062-27.328124-34.609375-40.046874-18.449218-14.265626-39.34375-21.5-62.097656-21.5zm0 0" />
    </svg>
  ),
  sort: (
    <svg viewBox="0 0 512 512">
      <path d="m496.1,138.3l-120.4-120.4c-7.9-7.9-20.6-7.9-28.5-7.10543e-15l-120.3,120.4c-7.9,7.9-7.9,20.6 0,28.5 7.9,7.9 20.6,7.9 28.5,0l85.7-85.7v352.8c0,11.3 9.1,20.4 20.4,20.4 11.3,0 20.4-9.1 20.4-20.4v-352.8l85.7,85.7c7.9,7.9 20.6,7.9 28.5,0 7.9-7.8 7.9-20.6 5.68434e-14-28.5z" />
      <path d="m287.1,347.2c-7.9-7.9-20.6-7.9-28.5,0l-85.7,85.7v-352.8c0-11.3-9.1-20.4-20.4-20.4-11.3,0-20.4,9.1-20.4,20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5,0-7.9,7.9-7.9,20.6 0,28.5l120.4,120.4c7.9,7.9 20.6,7.9 28.5,0l120.4-120.4c7.8-7.9 7.8-20.7-0.1-28.5l0,0z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 480.3 480.3">
      <path
        d="M254.15,234.1V13.5c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v220.6c-31.3,6.3-55,34-55,67.2s23.7,60.9,55,67.2v98.2
        c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5v-98.2c31.3-6.3,55-34,55-67.2C309.15,268.2,285.55,240.4,254.15,234.1z M240.65,342.8
        c-22.9,0-41.5-18.6-41.5-41.5s18.6-41.5,41.5-41.5s41.5,18.6,41.5,41.5S263.55,342.8,240.65,342.8z"
      />
      <path
        d="M88.85,120.9V13.5c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v107.4c-31.3,6.3-55,34-55,67.2s23.7,60.9,55,67.2v211.4
        c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V255.2c31.3-6.3,55-34,55-67.2S120.15,127.2,88.85,120.9z M75.35,229.6
        c-22.9,0-41.5-18.6-41.5-41.5s18.6-41.5,41.5-41.5s41.5,18.6,41.5,41.5S98.15,229.6,75.35,229.6z"
      />
      <path
        d="M418.45,120.9V13.5c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v107.4c-31.3,6.3-55,34-55,67.2s23.7,60.9,55,67.2v211.5
        c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V255.2c31.3-6.3,55-34,55-67.2S449.85,127.2,418.45,120.9z M404.95,229.6
        c-22.9,0-41.5-18.6-41.5-41.5s18.6-41.5,41.5-41.5s41.5,18.6,41.5,41.5S427.85,229.6,404.95,229.6z"
      />
    </svg>
  ),
  // TODO: use one icon
  left: (
    <svg viewBox="0 0 492.002 492.002" className="-rotate-90 transform">
      <path
        d="M484.136,328.473L264.988,109.329c-5.064-5.064-11.816-7.844-19.172-7.844c-7.208,0-13.964,2.78-19.02,7.844
        L7.852,328.265C2.788,333.333,0,340.089,0,347.297c0,7.208,2.784,13.968,7.852,19.032l16.124,16.124
        c5.064,5.064,11.824,7.86,19.032,7.86s13.964-2.796,19.032-7.86l183.852-183.852l184.056,184.064
        c5.064,5.06,11.82,7.852,19.032,7.852c7.208,0,13.96-2.792,19.028-7.852l16.128-16.132
        C494.624,356.041,494.624,338.965,484.136,328.473z"
      />
    </svg>
  ),
  right: (
    <svg viewBox="0 0 492.002 492.002" className="rotate-90 transform">
      <path
        d="M484.136,328.473L264.988,109.329c-5.064-5.064-11.816-7.844-19.172-7.844c-7.208,0-13.964,2.78-19.02,7.844
        L7.852,328.265C2.788,333.333,0,340.089,0,347.297c0,7.208,2.784,13.968,7.852,19.032l16.124,16.124
        c5.064,5.064,11.824,7.86,19.032,7.86s13.964-2.796,19.032-7.86l183.852-183.852l184.056,184.064
        c5.064,5.06,11.82,7.852,19.032,7.852c7.208,0,13.96-2.792,19.028-7.852l16.128-16.132
        C494.624,356.041,494.624,338.965,484.136,328.473z"
      />
    </svg>
  ),
  up: (
    <svg viewBox="0 0 492.002 492.002">
      <path
        d="M484.136,328.473L264.988,109.329c-5.064-5.064-11.816-7.844-19.172-7.844c-7.208,0-13.964,2.78-19.02,7.844
        L7.852,328.265C2.788,333.333,0,340.089,0,347.297c0,7.208,2.784,13.968,7.852,19.032l16.124,16.124
        c5.064,5.064,11.824,7.86,19.032,7.86s13.964-2.796,19.032-7.86l183.852-183.852l184.056,184.064
        c5.064,5.06,11.82,7.852,19.032,7.852c7.208,0,13.96-2.792,19.028-7.852l16.128-16.132
        C494.624,356.041,494.624,338.965,484.136,328.473z"
      />
    </svg>
  ),
  down: (
    <svg viewBox="0 0 451.847 451.847">
      <path
        d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751
        c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0
        c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z"
      />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 512 512">
      <path
        d="M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0
        c-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7
        C514.5,101.703,514.499,85.494,504.502,75.496z"
      />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 512 512">
      <path
        d="M452,0H60C26.916,0,0,26.916,0,60v392c0,33.084,26.916,60,60,60h392c33.084,0,60-26.916,60-60V60
        C512,26.916,485.084,0,452,0z M472,452c0,11.028-8.972,20-20,20H338V309h61.79L410,247h-72v-43c0-16.975,13.025-30,30-30h41v-62
        h-41c-50.923,0-91.978,41.25-91.978,92.174V247H216v62h60.022v163H60c-11.028,0-20-8.972-20-20V60c0-11.028,8.972-20,20-20h392
        c11.028,0,20,8.972,20,20V452z"
      />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 511 511.9">
      <path d="m510.949219 150.5c-1.199219-27.199219-5.597657-45.898438-11.898438-62.101562-6.5-17.199219-16.5-32.597657-29.601562-45.398438-12.800781-13-28.300781-23.101562-45.300781-29.5-16.296876-6.300781-34.898438-10.699219-62.097657-11.898438-27.402343-1.300781-36.101562-1.601562-105.601562-1.601562s-78.199219.300781-105.5 1.5c-27.199219 1.199219-45.898438 5.601562-62.097657 11.898438-17.203124 6.5-32.601562 16.5-45.402343 29.601562-13 12.800781-23.097657 28.300781-29.5 45.300781-6.300781 16.300781-10.699219 34.898438-11.898438 62.097657-1.300781 27.402343-1.601562 36.101562-1.601562 105.601562s.300781 78.199219 1.5 105.5c1.199219 27.199219 5.601562 45.898438 11.902343 62.101562 6.5 17.199219 16.597657 32.597657 29.597657 45.398438 12.800781 13 28.300781 23.101562 45.300781 29.5 16.300781 6.300781 34.898438 10.699219 62.101562 11.898438 27.296876 1.203124 36 1.5 105.5 1.5s78.199219-.296876 105.5-1.5c27.199219-1.199219 45.898438-5.597657 62.097657-11.898438 34.402343-13.300781 61.601562-40.5 74.902343-74.898438 6.296876-16.300781 10.699219-34.902343 11.898438-62.101562 1.199219-27.300781 1.5-36 1.5-105.5s-.101562-78.199219-1.300781-105.5zm-46.097657 209c-1.101562 25-5.300781 38.5-8.800781 47.5-8.601562 22.300781-26.300781 40-48.601562 48.601562-9 3.5-22.597657 7.699219-47.5 8.796876-27 1.203124-35.097657 1.5-103.398438 1.5s-76.5-.296876-103.402343-1.5c-25-1.097657-38.5-5.296876-47.5-8.796876-11.097657-4.101562-21.199219-10.601562-29.398438-19.101562-8.5-8.300781-15-18.300781-19.101562-29.398438-3.5-9-7.699219-22.601562-8.796876-47.5-1.203124-27-1.5-35.101562-1.5-103.402343s.296876-76.5 1.5-103.398438c1.097657-25 5.296876-38.5 8.796876-47.5 4.101562-11.101562 10.601562-21.199219 19.203124-29.402343 8.296876-8.5 18.296876-15 29.398438-19.097657 9-3.5 22.601562-7.699219 47.5-8.800781 27-1.199219 35.101562-1.5 103.398438-1.5 68.402343 0 76.5.300781 103.402343 1.5 25 1.101562 38.5 5.300781 47.5 8.800781 11.097657 4.097657 21.199219 10.597657 29.398438 19.097657 8.5 8.300781 15 18.300781 19.101562 29.402343 3.5 9 7.699219 22.597657 8.800781 47.5 1.199219 27 1.5 35.097657 1.5 103.398438s-.300781 76.300781-1.5 103.300781zm0 0" />
      <path d="m256.449219 124.5c-72.597657 0-131.5 58.898438-131.5 131.5s58.902343 131.5 131.5 131.5c72.601562 0 131.5-58.898438 131.5-131.5s-58.898438-131.5-131.5-131.5zm0 216.800781c-47.097657 0-85.300781-38.199219-85.300781-85.300781s38.203124-85.300781 85.300781-85.300781c47.101562 0 85.300781 38.199219 85.300781 85.300781s-38.199219 85.300781-85.300781 85.300781zm0 0" />
      <path d="m423.851562 119.300781c0 16.953125-13.746093 30.699219-30.703124 30.699219-16.953126 0-30.699219-13.746094-30.699219-30.699219 0-16.957031 13.746093-30.699219 30.699219-30.699219 16.957031 0 30.703124 13.742188 30.703124 30.699219zm0 0" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24">
      <path d="m.473 19.595c2.222 1.41 4.808 2.155 7.478 2.155 3.91 0 7.493-1.502 10.09-4.229 2.485-2.61 3.852-6.117 3.784-9.676.942-.806 2.05-2.345 2.05-3.845 0-.575-.624-.94-1.13-.647-.885.52-1.692.656-2.522.423-1.695-1.652-4.218-2-6.344-.854-1.858 1-2.891 2.83-2.798 4.83-3.139-.383-6.039-1.957-8.061-4.403-.332-.399-.962-.352-1.226.1-.974 1.668-.964 3.601-.117 5.162-.403.071-.652.41-.652.777 0 1.569.706 3.011 1.843 3.995-.212.204-.282.507-.192.777.5 1.502 1.632 2.676 3.047 3.264-1.539.735-3.241.98-4.756.794-.784-.106-1.171.948-.494 1.377zm7.683-1.914c.561-.431.263-1.329-.441-1.344-1.24-.026-2.369-.637-3.072-1.598.339-.022.69-.074 1.024-.164.761-.206.725-1.304-.048-1.459-1.403-.282-2.504-1.304-2.917-2.62.377.093.761.145 1.144.152.759.004 1.046-.969.427-1.376-1.395-.919-1.99-2.542-1.596-4.068 2.436 2.468 5.741 3.955 9.237 4.123.501.031.877-.44.767-.917-.475-2.059.675-3.502 1.91-4.167 1.222-.66 3.184-.866 4.688.712.447.471 1.955.489 2.722.31-.344.648-.873 1.263-1.368 1.609-.211.148-.332.394-.319.651.161 3.285-1.063 6.551-3.358 8.96-2.312 2.427-5.509 3.764-9.004 3.764-1.39 0-2.753-.226-4.041-.662 1.54-.298 3.003-.95 4.245-1.906z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 48 48">
      <path d="M38.4,21.68V16c-2.66,0-4.69-.71-6-2.09a8.9,8.9,0,0,1-2.13-5.64V7.86L24.9,7.73s0,.23,0,.54V30.8a5,5,0,1,1-3.24-5.61v-5.5a10.64,10.64,0,0,0-1.7-.14A10.36,10.36,0,1,0,30.32,29.91a10.56,10.56,0,0,0-.08-1.27V19.49A14.48,14.48,0,0,0,38.4,21.68Z" />
    </svg>
  ),
}

export const ScrollUp = () => (
  <button
    aria-label="Scroll up"
    className="flex fixed bottom-0 right-0 items-center justify-center w-12 h-12 bg-white border border-gray rounded-full mr-2 md:mr-4 mb-2"
    onClick={() => {
      document
        .getElementById('_app')
        .scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }}
  >
    <Icon name="up" size={18} />
  </button>
)

export const Tooltip = ({ children, info, position = 'left-0' }) => {
  const [hover, setHover] = React.useState(false)
  return (
    <div
      className={`relative items-center justify-center`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      <div
        className={`p-1 m-4 z-10 border-gray border rounded-sm bg-white absolute text-norm text-left
        ${position}
        ${hover ? '' : 'invisible'}
        `}
      >
        {info}
      </div>
    </div>
  )
}

export const Hover = ({ type = 'info', children, position = 'left-0' }) => {
  const [hover, setHover] = React.useState(false)
  return (
    <div
      className={`relative p-1 ml-1 w-5 h-5 rounded-full items-center justify-center text-sm
        ${type === 'caution' ? 'border border-gray' : 'bg-sec-light'}
      `}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span
        className={`text-xs
        ${type === 'caution' ? 'text-warning' : 'text-black'}
        `}
      >
        {type === 'caution' ? '!' : '?'}
      </span>
      <div
        className={`p-2 z-10 border-gray border rounded-md bg-white absolute m-4 w-64 text-norm text-left
        ${position}
        ${hover ? '' : 'invisible'}
        `}
      >
        {children}
      </div>
    </div>
  )
}
