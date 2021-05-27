import Markdown from '@/Layout/Markdown'

export const Page = () => <Markdown src="terms-and-conditions" />

export default Page

/*
import Legal from '@/Legal'
import Layout from '@/Layout'
import { terms } from '@/Legal/constants'

const Page = () => {
  return (
    <Layout title="Privacy Policy">
      <Legal {...terms}>
        <span className="font-bold">Cancellation Form</span>
        <span className="whitespace-pre-wrap">
          {`
If you want to cancel your contract of sale with us you may use this form and email or post it back to us at the address below.

To: https://infinitecloset.co.uk
Address: 71-75 Shelton Street, London, WC2H 9JQ
Email: info@infinitecloset.co.uk

I hereby give notice that I cancel my contract of sale of the following goods or services:
`}
          <Lines n={3} />
          {`
Ordered on:
Received on:
Customer name:
Customer address:
`}
          <Lines n={1} />
          {`
Signature (only required if you are returning a hardcopy of this form):`}
          <div className="max-w-sm">
            <Lines n={1} />
          </div>
          {`
Date:

©2002 - 2021 LawDepot.co.uk®
            `}
        </span>
      </Legal>
    </Layout>
  )
}

const Lines = ({ n }) => (
  <div className="w-full space-y-8 mt-8">
    {Array(n)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="w-full border-b border-black" />
      ))}
  </div>
)

export default Page
*/
