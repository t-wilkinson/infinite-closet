import React from 'react'

import { Divider } from '@/components'

export const Legal = ({ label, updated, data, children }) => (
  <div className="items-center mx-4">
    <div className="w-full max-w-screen-lg">
      <div className="items-center mb-4">
        <span className="font-subheader text-center text-3xl">{label}</span>
        <span className="text-gray-dark text-sm">Last Updated: {updated}</span>
      </div>
      {data.map((term) => (
        <React.Fragment key={term.header}>
          <LegalHeader header={term.header} text={term.text} />
          {term.data.map((content: { header: string; text: string }) => (
            <LegalContent key={content.header} {...content} />
          ))}
        </React.Fragment>
      ))}
      {children}
    </div>
  </div>
)

export const LegalHeader = ({ header = '', text = '' }) => (
  <>
    <span className="text-center sm:text-left font-subheader text-2xl">
      {header}
    </span>
    <Divider className="my-4" />
    {text && (
      <span className="whitespace-pre-wrap">{`${text}

`}</span>
    )}
  </>
)

export const LegalContent = ({ header = '', text = '' }) => (
  <>
    <span className="font-bold">{header}</span>
    <span className="whitespace-pre-wrap">{`${text}

`}</span>
  </>
)

export default Legal
