import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import MediaQuery from 'react-responsive'

import FeaturedImage from './FeaturedImage'
import ProductImageSlider from './ProductImageSlider'

export const ListingImages = ({ images }) => {
  const [startIndex, setStartIndex] = React.useState<number>(0)
  const [selected, setSelected] = React.useState<number>(0)
  const [sideHover, setSideHover] = React.useState<number>()

  return (
    <>
      <MediaQuery maxWidth={600}>
        <ImagesSmall
          images={images}
          selected={selected}
          setSelected={setSelected}
        />
      </MediaQuery>
      <MediaQuery minWidth={601} maxWidth={breakpoints.laptop}>
        <ImagesMedium
          images={images}
          selected={selected}
          setSelected={setSelected}
          setStartIndex={setStartIndex}
          startIndex={startIndex}
          sideHover={sideHover}
          setSideHover={setSideHover}
        />
      </MediaQuery>
      <MediaQuery minWidth={breakpoints.laptop + 1}>
        <ImagesLarge
          images={images}
          selected={selected}
          setSelected={setSelected}
          setStartIndex={setStartIndex}
          startIndex={startIndex}
          sideHover={sideHover}
          setSideHover={setSideHover}
        />
      </MediaQuery>
    </>
  )
}
export default ListingImages

const ImagesSmall = ({ images, selected, setSelected }) => (
  <div alignItems="center" justifyContent="center">
    <FeaturedImage image={images[selected]} />
    <div mr="md" flexDirection="row" alignItems="center" mt="md">
      <button
        onPress={() =>
          setSelected((n: number) => (n <= 0 ? images.length - 1 : n - 1))
        }
      >
        <div p="sm" alignItems="center">
          <AntDesign size={16} name="left" />
        </div>
      </button>
      {images.map((_: unknown, i: number) => (
        <button key={i} onPress={() => setSelected(i)}>
          <div
            height={16}
            width={16}
            bg={selected === i ? 'pri-light' : 'pri'}
            mx="sm"
            borderRadius={999}
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 1,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
            }}
          />
        </button>
      ))}
      <button
        onPress={() =>
          setSelected((n: number) => (n + 1 >= images.length ? 0 : n + 1))
        }
      >
        <div p="sm" alignItems="center">
          <AntDesign size={16} name="right" />
        </div>
      </button>
    </div>
  </div>
)

const ImagesMedium = ({
  images,
  selected,
  setSelected,
  setStartIndex,
  startIndex,
  sideHover,
  setSideHover,
}) => (
  <div flex={1.5}>
    <FeaturedImage image={images[selected]} />
    <div
      alignItems="center"
      justifyContent="center"
      flexDirection="row"
      mr="md"
      mt="lg"
      width="100%"
    >
      <button
        onPress={() => setStartIndex((n: number) => n - 1)}
        style={startIndex < 1 ? { opacity: 0.2 } : {}}
        disabled={startIndex < 1}
      >
        <div
          borderColor="light-gray"
          borderWidth={1}
          p="sm"
          alignItems="center"
        >
          <AntDesign size={16} name="left" />
        </div>
      </button>
      <ProductImageSlider
        images={images}
        sideHover={sideHover}
        setSelected={setSelected}
        setSideHover={setSideHover}
        startIndex={startIndex}
        style={{
          width: 64,
          height: 64,
          marginHorizontal: 8,
        }}
      />
      <button
        onPress={() => setStartIndex((n: number) => n + 1)}
        style={startIndex + 1 > images.length - 3 ? { opacity: 0.2 } : {}}
        disabled={startIndex + 1 > images.length - 3}
      >
        <div
          borderColor="light-gray"
          borderWidth={1}
          p="sm"
          alignItems="center"
        >
          <AntDesign size={16} name="right" />
        </div>
      </button>
    </div>
  </div>
)

const ImagesLarge = ({
  images,
  selected,
  setSelected,
  setStartIndex,
  startIndex,
  sideHover,
  setSideHover,
}) => (
  <div flexDirection="row" justifyContent="center" flex={2}>
    <div mr="md">
      <button
        onPress={() => setStartIndex((n: number) => n - 1)}
        style={startIndex < 1 ? { opacity: 0.2 } : {}}
        disabled={startIndex < 1}
      >
        <div
          borderColor="light-gray"
          borderWidth={1}
          p="sm"
          alignItems="center"
        >
          <AntDesign size={16} name="up" />
        </div>
      </button>
      <ProductImageSlider
        images={images}
        sideHover={sideHover}
        setSelected={setSelected}
        setSideHover={setSideHover}
        startIndex={startIndex}
        style={{
          width: 100,
          height: 100,
          marginVertical: 8,
        }}
      />
      <button
        onPress={() => setStartIndex((n: number) => n + 1)}
        style={startIndex + 1 > images.length - 3 ? { opacity: 0.2 } : {}}
        disabled={startIndex + 1 > images.length - 3}
      >
        <div
          borderColor="light-gray"
          borderWidth={1}
          p="sm"
          alignItems="center"
        >
          <AntDesign size={16} name="down" />
        </div>
      </button>
    </div>
    <FeaturedImage image={images[selected]} />
  </div>
)
