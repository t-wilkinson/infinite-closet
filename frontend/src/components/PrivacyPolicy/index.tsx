import React from 'react'

import { Divider } from '@/components'

import { terms } from './constants'

export const PolicyTerms = () => (
  <div className="mx-4">
    <div className="items-center mb-4">
      <span className="font-subheader text-center">
        Privacy & Cookie Policy
      </span>
      <span className="text-gray-dark text-sm">Last Updated: 5/2/21</span>
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
  </div>
)
export default PolicyTerms

const TermHeader = ({ header = '', text = '' }) => (
  <>
    <span className="text-center sm:text-left font-subheader text-xl">
      {header}
    </span>
    <Divider className="my-4" />
    <span className="whitespace-pre-wrap">{`${text}

`}</span>
  </>
)

const TermContent = ({ subheader = '', text = '' }) => (
  <>
    <span className="font-bold">{subheader}</span>
    <span className="whitespace-pre-wrap">{`${text}

`}</span>
  </>
)
