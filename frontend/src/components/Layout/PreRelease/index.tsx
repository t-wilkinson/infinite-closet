import { Divider } from '@/components'
import Header from './Header'
import Footer from './Footer'

const Page = ({ children }) => (
  <>
    <Header />
    {children}
    <Divider />
    <Footer />
  </>
)
export default Page
