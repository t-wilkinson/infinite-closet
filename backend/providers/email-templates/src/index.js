import React from 'react'
import ReactDOM from 'react-dom'

import './styles.css'
import { defaultData } from './utils/data'

// Misc
import Components from './email-templates/components'
import ForgotPassword from './email-templates/forgot-password'

// Order lifecycle
import OrderConfirmation from './email-templates/order-confirmation'
import OrderShipped from './email-templates/order-shipped'
import OrderStarting from './email-templates/order-starting'
import OrderEnding from './email-templates/order-ending'
import OrderReceived from './email-templates/order-received'
import OrderReview from './email-templates/order-review'

// Money
import GiftCard from './email-templates/gift-card'
import StoreCredit from './email-templates/store-credit'

// Non user-facing
import TrustPilot from './email-templates/trust-pilot'
import OrderShippingFailure from './email-templates/order-shipping-failure'
import ContactUs from './email-templates/contact-us'

// Old
import JoinLaunchParty from './email-templates/join-launch-party'

const templates = {
  misc: {
    label: 'Misc',
    components: Components,
    // 'newsletter-subscription': {},
    // 'waitlist-subscription': {},
    // 'mailinglist-subscription': {},
    'forgot-password': ForgotPassword,
  },

  order: {
    label: 'Order lifecycle',
    'order-confirmation': OrderConfirmation,
    'order-shipped': OrderShipped,
    'order-starting': OrderStarting,
    'order-ending': OrderEnding,
    'order-received': OrderReceived,
    'order-review': OrderReview,
  },

  money: {
    label: 'Money',
    'gift-card': GiftCard,
    'store-credit': StoreCredit,
  },

  'non-user-facing': {
    label: 'Non user-facing',
    'trust-pilot': TrustPilot,
    'order-shipping-failure': OrderShippingFailure,
    'contact-us': ContactUs,
  },

  old: {
    label: 'Old',
    'join-launch-party': JoinLaunchParty,
  },
}

const NavLink = ({ group, template, active}) => {
  return (
    <a
      key={template}
      href={`/${group}/${template}`}
      style={{
        fontWeight: active ? 'bold' : 'normal',
        color: 'black',
        textDecoration: 'none',
        padding: '4px 8px',
        borderRadius: 4,
        fontSize: 14,
      }}
    >
      {template}
    </a>
  )
}

const Emails = () => {
  // const [Email, setEmail] = React.useState()
  let [group, template] = window.location.pathname.split('/').slice(1, 3)
  if (!templates[group] || !templates[group][template]) {
    [group, template] = ['misc', 'components']
  }
  const Email = templates[group][template]

//   React.useEffect(() => {
//     const Email = React.lazy(() =>
//       import(`./email-templates/${path[1] || defaultEmail[1]}`)
//     )
//     setEmail(Email)
//   }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <nav
        style={{
          backgroundColor: '#eee',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
        }}
      >
        {Object.keys(templates).map((grp) => (
          <React.Fragment key={grp}>
            <strong style={{ marginTop: 8 }}>{templates[grp].label}</strong>
            {Object.keys(templates[grp]).map(
              (temp) => temp !== 'label' && <NavLink key={temp} template={temp} group={grp} active={grp === group && temp === template} />
            )}
          </React.Fragment>
        ))}
      </nav>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div width="100%" style={{ maxWidth: 1000, width: '100%' }}>
          <Email data={defaultData[template]} />
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<Emails />, document.getElementById('root'))
