import React from 'react'
import { LayoutRectangle } from 'react-native'

import { extras } from '@/shared/constants'
import Hoverable from '@/shared/Hoverable'
import { div, AspectView, Animated, Platform } from '@/shared/components'

import usePanImage from './usePanImage'

export const FeaturedImage = ({ image, ...props }) => {
  const [mainHover, setMainhover] = React.useState<{
    clientX: number
    clientY: number
  }>()
  const [layout, setLayout] = React.useState<LayoutRectangle>()
  const scale = 2
  const pan = usePanImage(scale, layout, mainHover)

  const scaleFactor = 1 - 1 / scale
  const pan = React.useRef(new Animated.ValueXY()).current

  React.useEffect(() => {
    if (!layout || !hover || Platform.OS !== 'web') return
    Animated.timing(pan, {
      useNativeDriver: true,
      easing: Easing.in as any,
      toValue: {
        x: scaleFactor * (layout.left + layout.width / 2 - hover.clientX),
        y: scaleFactor * (layout.top + layout.height / 2 - hover.clientY),
      },
      duration: 1.5,
    }).start()
  }, [layout, hover])

  return (
    <AspectView maxWidth={500} overflow="hidden" {...props}>
      <div
        onLayout={({ nativeEvent: { layout } }) => setLayout(layout)}
        width="100%"
        height="100%"
      >
        <Hoverable
          onHoverOut={() => setMainhover(undefined)}
          onMouseMove={({ clientX, clientY }) =>
            setMainhover({ clientX, clientY })
          }
          style={{ width: '100%', height: '100%' }}
        >
          <Animated.Image
            style={[
              Platform.OS === 'web' &&
                mainHover &&
                layout && {
                  transform: [
                    { scale },
                    { translateX: pan.x },
                    { translateY: pan.y },
                  ],
                },
              {
                width: '100%',
                height: '100%',
              },
            ]}
            source={{ uri: extras.api + image.url }}
          />
        </Hoverable>
      </div>
    </AspectView>
  )
}
export default FeaturedImage
