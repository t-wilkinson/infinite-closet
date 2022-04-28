export * from "./iconCheck"
export * from "./iconClock"
export * from "./iconClose"
export * from "./iconDate"
export * from "./iconDown"
export * from "./iconEmail"
export * from "./iconEyeHidden"
export * from "./iconEye"
export * from "./iconFacebook"
export * from "./iconHeart"
export * from "./iconInstagram"
export * from "./iconLeft"
export * from "./iconLoading"
export * from "./iconLockOpen"
export * from "./iconLock"
export * from "./iconLogo"
export * from "./iconMenuFull"
export * from "./iconMenu"
export * from "./iconPin"
export * from "./iconPlus"
export * from "./iconRight"
export * from "./iconSearch"
export * from "./iconSettings"
export * from "./iconShoppingBag"
export * from "./iconSort"
export * from "./iconStarFill"
export * from "./iconStarHalf"
export * from "./iconTiktok"
export * from "./iconTwitter"
export * from "./iconUp"
export * from "./iconUser"
export * from "./iconHeartFill"
export * from "./iconWardrobe"

type Icon = {
  name?: string
  icon: object
  className?: string
  size?: number
  style?: object
  [x: string]: any
}

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
  onClick = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  size = 18,
  ...props
}: {
  n: number
  icon: React.ReactElement
  className?: string
  onClick?: (_: number) => void
  onMouseEnter?: (i: number) => void
  onMouseLeave?: (i: number) => void
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

/* macro I used to move all icons to their own file, keep for now just incase
0/icon"ayiwbct(default $dVa(:let @a=@a . '.tsx':vs %:h/aP:wq
*/
