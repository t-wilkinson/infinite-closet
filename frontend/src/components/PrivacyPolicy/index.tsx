import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ScrollView, div, Divider, span } from '@/shared/components'
import { LandingPageHeader as Header } from '@/shared/Header'
import { LandingPageFooter as Footer } from '@/shared/Footer'

import { terms } from './constants'

export default ({ navigation }) => {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView>
      <div bg="white" flex={1} style={{ paddingTop: insets.top }}>
        <Header navigation={navigation} />
        <Wrapper inner={{ px: { base: 'sm', desktop: 0 } }}>
          <PolicyTerms />
        </Wrapper>
        <Default>
          <Divider />
        </Default>
        <Footer />
      </div>
    </ScrollView>
  )
}

const PolicyTerms = () => (
  <>
    <div alignItems="center" mb="md">
      <span variant="subheader" textAlign="center">
        Privacy & Cookie Policy
      </span>
      <span color="dark-gray" fontSize={14}>
        Last Updated: 5/2/21
      </span>
    </div>
    {terms.map((term) => (
      <React.Fragment key={term.header}>
        <TermHeader header={term.header} text={term.text} />
        {term.data.map((content: { header: string; text: string }) => (
          <TermContent
            key={content.header}
            subheader={content.header}
            text={content.text}
          />
        ))}
      </React.Fragment>
    ))}
  </>
)

const TermHeader = ({ header = '', text = '' }) => (
  <>
    <span textAlign="center" variant="subheader" fontSize={32}>
      {header}
    </span>
    <Divider my="md" />
    <span variant="body">{`${text}

`}</span>
  </>
)

const TermContent = ({ subheader = '', text = '' }) => (
  <>
    <span variant="body-bold">{subheader}</span>
    <span variant="body">{`${text}

`}</span>
  </>
)
