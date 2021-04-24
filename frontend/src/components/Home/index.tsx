import React from 'react'
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons'
import {
  Image,
  ImageBackground,
  span,
  Divider,
  div,
  AspectView,
  CallToAction,
} from '@/shared/components'
import { MainHeader as Header } from '@/shared/Header'
import { MainFooter as Footer } from '@/shared/Footer'

export default ({ navigation }) => {
  return (
    <div bg="white">
      <Header navigation={navigation} />
      <Membership />
      <FilterCards />
      <FeaturedCards />
      <Shop />
      <Break1 />
      <Footer />
    </div>
  )
}

const Break1 = () => (
  <div
    justifyContent="center"
    alignItems="center"
    bg="sec"
    height={400}
    my="sm"
  >
    <span variant="subheader" my="md">
      Amet Quis Unde
    </span>
    <span mb="md">Sapiente voluptatem</span>
    <div my="md">
      <CallToAction>
        <span>Doloribus Aliquid </span>
      </CallToAction>
    </div>
  </div>
)

const Membership = () => (
  <div mb="lg">
    <ImageBackground
      source={{
        uri:
          'https://static01.nyt.com/images/2020/10/01/fashion/30PFW-DIOR-dior-5/20PFW-DIOR-dior-5-mobileMasterAt3x.jpg',
      }}
    >
      <Wrapper
        outer={{ style: { backgroundColor: 'rgba(0,0,0,.5)' } }}
        inner={{ py: '2xl', height: 400 }}
      >
        <div
          justifyContent="space-around"
          alignItems="flex-start"
          flex={1}
          maxWidth={500}
          px={{ base: 'lg', laptop: 'none' }}
        >
          <span color="white" variant="subheader">
            Lorem ipsum dolor
          </span>
          <span color="white">
            Ipsum necessitatibus minima similique atque eaque, debitis.
            Explicabo facilis eligendi velit fugit nam Alias illum architecto
            voluptatem quis repellat.{' '}
          </span>
          <span color="white">
            Repellendus obcaecati fugiat dicta reprehenderit
          </span>
          <CallToAction>Lorem Ipsum</CallToAction>
        </div>
      </Wrapper>
    </ImageBackground>
  </div>
)

const FilterCards = () => {
  const size = 8
  const selected = 1
  const data = [
    {
      filter: 'Clothing',
      item: 'Lorem ipsum dolor sit amet',
      uri:
        'https://cdn.cliqueinc.com/posts/276577/black-and-white-clothes-trend-276577-1548699908418-promo.700x0c.jpg',
    },
    {
      filter: 'Occasions',
      item: 'Lorem ipsum dolor sit amet',
      uri:
        'https://cdn.cliqueinc.com/posts/276577/black-and-white-clothes-trend-276577-1548699908418-promo.700x0c.jpg',
    },
    {
      filter: 'Accessories',
      item: 'Lorem ipsum dolor sit amet',
      uri:
        'https://cdn.cliqueinc.com/posts/276577/black-and-white-clothes-trend-276577-1548699908418-promo.700x0c.jpg',
    },
    {
      filter: 'Trending',
      item: 'Lorem ipsum dolor sit amet',
      uri:
        'https://cdn.cliqueinc.com/posts/276577/black-and-white-clothes-trend-276577-1548699908418-promo.700x0c.jpg',
    },
    {
      filter: 'Sale',
      item: 'Lorem ipsum dolor sit amet',
      uri:
        'https://cdn.cliqueinc.com/posts/276577/black-and-white-clothes-trend-276577-1548699908418-promo.700x0c.jpg',
    },
  ]

  return (
    <Wrapper outer={{ pb: 'lg' }}>
      <div
        flexDirection="row"
        pb="md"
        overflow="scroll"
        justifyContent="center"
      >
        {data.map((item) => (
          <FilterCard key={item.filter} {...item} />
        ))}
      </div>
      <Mobile>
        <div alignItems="center" my="md">
          <div
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            width={(size + 4) * data.length}
          >
            {Array(data.length)
              .fill(0)
              .map((_, i) => (
                <FilterCircle
                  key={i}
                  size={i === selected ? size + 2 : size}
                  filled={i === selected}
                />
              ))}
          </div>
        </div>
      </Mobile>
      <Default>
        <div
          alignItems="center"
          my="md"
          position="absolute"
          bottom={0}
          right={0}
          style={{ transform: [{ translateY: -140 }] }}
        >
          <div
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            width={(size + 4) * data.length}
          >
            {Array(data.length)
              .fill(0)
              .map((_, i) => (
                <FilterCircle
                  key={i}
                  size={i === selected ? size + 2 : size}
                  filled={i === selected}
                />
              ))}
          </div>
        </div>
      </Default>
    </Wrapper>
  )
}

const FilterCircle = ({ size = 16, filled = false }) => (
  <div
    borderRadius={999}
    bg={filled ? 'black' : 'gray5'}
    height={size}
    width={size}
  />
)

const FilterCard = ({ uri, filter, item }) => (
  <>
    <Mobile>
      <div
        shadowColor="black"
        shadowOffset={{ width: 0, height: 7 }}
        shadowOpacity={0.43}
        shadowRadius={9.51}
        elevation={15}
        mx="sm"
        width={300}
        height={500}
      >
        <Image source={uri} style={{ flex: 60 }} />
        <div flex={40} alignItems="center" px="md" py="md">
          <span color="gray5">{filter}</span>
          <span
            mt="md"
            textTransform="uppercase"
            fontSize={20}
            textAlign="center"
          >
            {item}
          </span>
          <div height={8} />
          <Order my="lg" />
        </div>
      </div>
    </Mobile>
    <Default>
      <div width="100%">
        <Image source={uri} style={{ height: 400 }} />
        <div alignItems="flex-start" py="md" flex={1}>
          <span color="gray5">{filter}</span>
          <span
            mt="sm"
            textTransform="uppercase"
            fontSize={20}
            textAlign="center"
          >
            {item}
          </span>
          <Order my="lg" />
        </div>
      </div>
    </Default>
  </>
)

const FeaturedCards = ({ ...props }) => {
  const size = 8
  const selected = 1
  const data = [
    {
      uri:
        'https://media.gq.com/photos/5ab151dcd668df704470b18f/master/w_2000,h_2285,c_limit/Not-Normal-High-Fashion-Gets-Serious-About-Regular-Clothes-20-Edit.jpg',
    },
    {
      uri:
        'https://media.gq.com/photos/5ab151dcd668df704470b18f/master/w_2000,h_2285,c_limit/Not-Normal-High-Fashion-Gets-Serious-About-Regular-Clothes-20-Edit.jpg',
    },
    {
      uri:
        'https://media.gq.com/photos/5ab151dcd668df704470b18f/master/w_2000,h_2285,c_limit/Not-Normal-High-Fashion-Gets-Serious-About-Regular-Clothes-20-Edit.jpg',
    },
  ]

  return (
    <Wrapper
      inner={{
        bg: 'light-gray',
        px: { tablet: '3xl' },
        height: { base: '100vh', tablet: 800 },
        maxHeight: 900,
      }}
    >
      <div alignItems="center" mx="lg" my="xl">
        <span variant="subheader" fontSize={48}>
          Featured
        </span>
      </div>
      <div
        {...props}
        overflow="scroll"
        flexDirection="row"
        justifyContent="center"
      >
        {data.map((item, i) => (
          <FeaturedCard key={i} {...item} />
        ))}
      </div>
      <div flex={1} />
      <div alignItems="center" my="md">
        <div
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
          width={(size + 4) * data.length}
        >
          {Array(data.length)
            .fill(0)
            .map((_, i) => (
              <FilterCircle
                key={i}
                size={i === selected ? size + 2 : size}
                filled={i === selected}
              />
            ))}
        </div>
      </div>
    </Wrapper>
  )
}

const FeaturedCard = ({ uri, ...props }) => (
  <div
    {...props}
    width={256}
    maxWidth="100%"
    maxHeight="100%"
    mx="md"
    position="relative"
  >
    <div height={256}>
      <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
      <div position="absolute" top={0} right={0} mt="sm" mr="sm">
        <Ionicons name="heart-outline" size={24} />
      </div>
    </div>
    <div alignItems="center" my="lg">
      <span my="sm" fontSize={20} variant="body-bold">
        Adipisicing sit{' '}
      </span>
      <span my="sm" fontSize={20} variant="body" textAlign="center">
        Amet cum aspernatur quisquam atque
      </span>
      <span my="sm" fontSize={20} variant="price">
        £16.00
      </span>
      <Order />
    </div>
  </div>
)

const Shop = () => (
  <Wrapper inner={{ alignItems: 'center' }} outer={{ mx: 'md' }}>
    <ItemHeader
      title="Lorem Ipsum"
      description="Consectetur dolorem quos doloribus exercitationem ipsa"
    />
    <LargeItem
      label="Adipisicing blanditiis"
      uri="https://coveteur.com/wp-content/uploads/2019/12/PCL_MFWAW18_Day1_Image-18-2010s-fashion-trends-decade-homepage-1280x720.jpg"
      label2="Adipisicing blanditiis"
      uri2="https://miro.medium.com/max/10370/1*FbAVZD_gQJtd2FX21S7c5w.jpeg"
    />
    <div
      flexDirection={{ base: 'column', tablet: 'row' }}
      width="100%"
      flex={1}
    >
      <SmallItem
        flex={1}
        mr="md"
        left={{
          label: 'Error mollitia',
          uri:
            'https://coveteur.com/wp-content/uploads/2019/12/PCL_MFWAW18_Day1_Image-18-2010s-fashion-trends-decade-homepage-1280x720.jpg',
        }}
        right={{
          label: 'sint dignissimos',
          uri:
            'https://coveteur.com/wp-content/uploads/2019/12/PCL_MFWAW18_Day1_Image-18-2010s-fashion-trends-decade-homepage-1280x720.jpg',
        }}
      />
      <SmallItem
        flex={1}
        left={{
          label: 'Error mollitia',
          uri:
            'https://coveteur.com/wp-content/uploads/2019/12/PCL_MFWAW18_Day1_Image-18-2010s-fashion-trends-decade-homepage-1280x720.jpg',
        }}
        right={{
          label: 'sint dignissimos',
          uri:
            'https://coveteur.com/wp-content/uploads/2019/12/PCL_MFWAW18_Day1_Image-18-2010s-fashion-trends-decade-homepage-1280x720.jpg',
        }}
      />
    </div>

    <Divider />

    <ItemHeader
      title="Lorem Ipsum"
      description="modi! Odio provident sapiente quae"
    />
    <LargeItem
      label="Adipisicing blanditiis"
      uri="https://coveteur.com/wp-content/uploads/2019/12/PCL_MFWAW18_Day1_Image-18-2010s-fashion-trends-decade-homepage-1280x720.jpg"
      label2="Adipisicing blanditiis"
      uri2="https://miro.medium.com/max/10370/1*FbAVZD_gQJtd2FX21S7c5w.jpeg"
    />
    <div
      flexDirection={{ base: 'column', tablet: 'row' }}
      width="100%"
      flex={1}
    >
      <SmallItem
        flex={1}
        mr="md"
        left={{
          label: 'Error mollitia',
          uri:
            'https://coveteur.com/wp-content/uploads/2019/12/PCL_MFWAW18_Day1_Image-18-2010s-fashion-trends-decade-homepage-1280x720.jpg',
        }}
        right={{
          label: 'sint dignissimos',
          uri:
            'https://coveteur.com/wp-content/uploads/2019/12/PCL_MFWAW18_Day1_Image-18-2010s-fashion-trends-decade-homepage-1280x720.jpg',
        }}
      />
      <SmallItem
        flex={1}
        left={{
          label: 'Error mollitia',
          uri:
            'https://coveteur.com/wp-content/uploads/2019/12/PCL_MFWAW18_Day1_Image-18-2010s-fashion-trends-decade-homepage-1280x720.jpg',
        }}
        right={{
          label: 'sint dignissimos',
          uri:
            'https://coveteur.com/wp-content/uploads/2019/12/PCL_MFWAW18_Day1_Image-18-2010s-fashion-trends-decade-homepage-1280x720.jpg',
        }}
      />
    </div>
  </Wrapper>
)

const ItemHeader = ({ title, description }) => (
  <div alignItems="center" mb="lg">
    <span variant="subheader" fontSize={48} my="sm">
      {title}
    </span>
    <span textAlign="center" fontSize={20}>
      {description}
    </span>
  </div>
)

const LargeItem = ({ label, uri, label2, uri2 }) => (
  <div flexDirection="row" width="100%">
    <ItemImage
      flex={1}
      uri={uri}
      label={label}
      text={{ variant: 'subheader', fontSize: 32 }}
    />
    <ItemImage
      visible={{ base: false, tablet: true }}
      ml={{ tablet: 'md' }}
      flex={1}
      uri={uri2}
      label={label2}
      text={{ variant: 'subheader', fontSize: 32 }}
    />
  </div>
)

const SmallItem = ({ left, right, ...props }) => (
  <div flexDirection="row" {...props}>
    <ItemImage uri={left.uri} label={left.label} mr="md" />
    <ItemImage uri={right.uri} label={right.label} />
  </div>
)

const ItemImage = ({ uri, label, text = {}, ...props }) => (
  <div flex={1} width="100%" mb="md" {...props}>
    <AspectView aspectRatio={1} dimension="width" size={100}>
      <Image style={{ flex: 1 }} source={{ uri }} />
    </AspectView>
    <span my="sm" fontSize={20} textTransform="uppercase" {...text}>
      {label}
    </span>
  </div>
)

export const Order = ({ ...props }) => (
  <div mt="md" {...props}>
    <CallToAction onPress={() => console.log('TODO')}>
      <SimpleLineIcons name="bag" size={16} />
      <span>&nbsp;Order</span>
    </CallToAction>
  </div>
)
