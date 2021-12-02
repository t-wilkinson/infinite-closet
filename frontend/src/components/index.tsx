// TODO: refactor
/* Components that are used everywhere */
import React from 'react'
import Link from 'next/link'
import { iconUp } from '@/Icons'

export const FacebookMessenger = () => (
  <>
    <div id="fb-root" />
    <div id="fb-customer-chat" className="fb-customerchat" />
    <script
      dangerouslySetInnerHTML={{
        __html: `
          var chatbox = document.getElementById('fb-customer-chat');
          chatbox.setAttribute("page_id", "106359464321550");
          chatbox.setAttribute("attribution", "biz_inbox");

          window.fbAsyncInit = function() {
          FB.init({
          xfbml            : true,
          version          : 'v11.0'
          });
          };

          (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = 'https://connect.facebook.net/en_GB/sdk/xfbml.customerchat.js';
          fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));

          `,
      }}
    />
  </>
)

export const BlueLink = ({ href, label }) => (
  <Link href={href}>
    <a>
      <span className="cursor-pointer text-blue-500">{label}</span>
    </a>
  </Link>
)

export const Button = ({
  onClick = (..._: any[]): void => {},
  children,
  role = 'primary' as 'primary' | 'secondary' | 'cta',
  className = '',
  ...props
}) => (
  <button
    onClick={onClick}
    className={`
      p-3 transition duration-200
      ${className}
      ${
        role === 'primary'
          ? 'text-white bg-pri hover:bg-sec rounded-sm font-bold'
          : role === 'secondary'
          ? 'text-black bg-white border border-black'
          : role === 'cta'
          ? 'text-white bg-sec hover:bg-pri rounded-sm font-bold'
          : ''
      }
      `}
    {...props}
  >
    {children}
  </button>
)

export const Divider = ({
  visible = true,
  className = '',
  border = 'border-gray-light',
}) => visible && <div className={`${border} border-b-2 w-full ${className}`} />

type Icon = {
  name?: string
  icon: object
  className?: string
  size?: number
  style?: object
} & unknown

export const Icon = ({
  icon,
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
      {icon}
    </div>
  )
}

export const Icons = ({
  n,
  icon,
  className = '',
  onClick=() => {},
  onMouseEnter=() => {},
  onMouseLeave=() => {},
  size=18,
  ...props
}: {
  n: number
  icon: React.ReactElement
  className?: string
  onClick?: (_: number) => void
  onMouseEnter?: (_: number) => void
  onMouseLeave?: (_: number) => void
  size?: number
} & unknown) => (
  <>
    {n > 0
      ? Array(n)
          .fill(0)
          .map((_, i) => (
            <Icon
              key={Math.random()}
              onMouseEnter={() => onMouseEnter(i + 1)}
              onMouseLeave={() => onMouseLeave(i + 1)}
              onClick={() => onClick(i + 1)}
              icon={icon}
              size={size}
              className={className}
              {...props}
            />
          ))
      : null}
  </>
)

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
    <Icon icon={iconUp} size={18} />
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
