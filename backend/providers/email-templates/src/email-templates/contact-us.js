import React from 'react'

export default ({ data }) => {
  return (
    <dl>
      {Object.entries(data).map(([k,v]) =>
        <React.Fragment>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </React.Fragment>
      )}
    </dl>
  )
}
