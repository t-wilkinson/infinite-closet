import Header from './Header'
import Footer from './Footer'
export const Layout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
)
export default Layout
