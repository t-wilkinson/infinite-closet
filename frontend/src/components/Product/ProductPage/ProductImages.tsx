import React from 'react'
import Image from 'next/image'

import { getURL } from '@/utils/axios'
import { StrapiFile } from '@/types/models'
import { Icon, iconLeft, iconDown, iconUp, iconRight } from '@/Components/Icons'

type Action =
  | { type: 'focus-image'; index: number }
  | { type: 'decrease-focus'; length: number }
  | { type: 'increase-focus'; length: number }
  | { type: 'shift-decrease' }
  | { type: 'shift-increase'; length: number }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'focus-image':
      return { ...state, focusedImage: action.index }
    case 'decrease-focus':
      return {
        ...state,
        focusedImage:
          state.focusedImage <= 0 ? action.length - 1 : state.focusedImage - 1,
      }
    case 'increase-focus':
      let i = state.focusedImage
      return { ...state, focusedImage: i >= action.length - 1 ? 0 : i + 1 }
    case 'shift-decrease': {
      const i = state.startIndex
      return { ...state, startIndex: i > 0 ? i - 1 : i }
    }
    case 'shift-increase': {
      const i = state.startIndex
      return { ...state, startIndex: i < action.length - 1 ? i + 1 : i }
    }
    default:
      return state
  }
}

interface State {
  startIndex: number
  focusedImage: number
}

const initialState: State = {
  startIndex: 0,
  focusedImage: 0,
}

export const ProductImages = ({ images }) => {
  const [state, dispatch] = React.useReducer<typeof reducer>(
    reducer,
    initialState
  )

  return (
    <>
      <ImagesSmall images={images} state={state} dispatch={dispatch} />
      <ImagesLarge images={images} state={state} dispatch={dispatch} />
    </>
  )
}
export default ProductImages

const ImagesSmall = ({ images, state, dispatch }) => (
  <div className="items-center justify-center sm:hidden h-80">
    <FocusedImage
      alt={toAlt(images, state.focusedImage)}
      image={images[state.focusedImage]}
    />
    <div className="mr-4 flex-row items-center mt-4 space-x-2">
      <button
        onClick={() =>
          dispatch({
            type: 'decrease-focus',
            length: images.length,
          })
        }
      >
        <div className="p-2 items-center">
          <Icon icon={iconLeft} size={16} />
        </div>
      </button>
      {images.map((_: unknown, i: number) => (
        <button
          key={i}
          onClick={() => dispatch({ type: 'focus-image', index: i })}
          className="flex w-4 h-4 rounded-full border border-gray items-center justify-center"
        >
          <div
            className={`w-3 h-3 rounded-full
              ${state.focusedImage === i ? 'bg-sec' : ''}
              `}
          />
        </button>
      ))}
      <button
        onClick={() =>
          dispatch({
            type: 'increase-focus',
            length: images.length,
          })
        }
      >
        <div className="p-2 items-center">
          <Icon size={16} icon={iconRight} />
        </div>
      </button>
    </div>
  </div>
)

const ImagesLarge = ({ images, state, dispatch }) => (
  <div className="hidden sm:flex flex-col-reverse md:flex-row justify-center w-1/2 lg:w-full h-128">
    <div className="flex-row md:flex-col items-center space-x-2">
      <button
        onClick={() => dispatch({ type: 'shift-decrease' })}
        style={state.startIndex < 1 ? { opacity: 0.2 } : {}}
        disabled={state.startIndex < 1}
      >
        <div className="border-gray-light border p-2 items-center">
          <Icon size={16} icon={iconUp} className="hidden md:block" />
          <Icon size={16} icon={iconLeft} className="md:hidden" />
        </div>
      </button>
      {images
        .slice(state.startIndex, state.startIndex + 3)
        .map((image: StrapiFile, index: number) => (
          <button
            key={image.url}
            className="w-24 lg:w-32 h-24 lg:h-32 my-2 cursor-pointer relative hover:opacity-75"
            onClick={() => {
              dispatch({ type: 'focus-image', index: state.startIndex + index })
            }}
          >
            <Image
              alt={toAlt(images, index)}
              className="Product image"
              layout="fill"
              objectFit="contain"
              src={getURL(image.formats.thumbnail.url)}
            />
          </button>
        ))}
      <button
        onClick={() =>
          dispatch({ type: 'shift-increase', length: images.length })
        }
        style={state.startIndex + 1 > images.length - 3 ? { opacity: 0.2 } : {}}
        disabled={state.startIndex + 1 > images.length - 3}
      >
        <div className="border-gray-light border p-2 items-center">
          <Icon size={16} icon={iconDown} className="hidden md:block" />
          <Icon size={16} icon={iconRight} className="md:hidden" />
        </div>
      </button>
    </div>
    <FocusedImage
      alt={toAlt(images, state.focusedImage)}
      image={images[state.focusedImage]}
    />
  </div>
)

const toAlt = (images, index) =>
  images[index]?.alternativeText || images[0]?.alternativeText || ''

export const FocusedImage = ({ alt, image }) => {
  const [hover, setHover] = React.useState()
  const [layout, setLayout] = React.useState()
  const ref = React.useRef()

  const scale = 2
  const scaleFactor = 1 - 1 / scale

  if (!image) {
    return <div
      className="overflow-hidden max-w-md w-full h-full relative border border-gray-light rounded-sm ml-2"
        />
  }

  return (
    <div
      className="overflow-hidden max-w-md w-full h-full relative border border-gray-light rounded-sm ml-2"
      onMouseLeave={() => setHover(undefined)}
      onMouseMove={({ clientX, clientY }) => setHover({ clientX, clientY })}
    >
      <div
        ref={ref}
        className="relative w-full h-full overflow-hidden"
        style={{
          transition:
            '0.25s transform ease-in-out, 0.25s left ease-out, 0.25s top ease-out',
          transform: `scale(${hover ? scale : 1})`,
          left:
            layout && hover
              ? scaleFactor * (layout.left + layout.width / 2 - hover.clientX)
              : 0,
          top:
            layout && hover
              ? scaleFactor * (layout.top + layout.height / 2 - hover.clientY)
              : 0,
        }}
        onMouseMove={(e) => {
          setLayout(e.target.getBoundingClientRect())
        }}
      >
        <Image
          alt={alt}
          layout="fill"
          objectFit="contain"
          src={getURL(image.formats.large?.url || image.url)}
        />
      </div>
    </div>
  )
}
