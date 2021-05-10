import Profile from '@/Account/Profile'
import User from '@/Account/User'
import Layout from '@/Layout'

export const Page = () => {
  return (
    <Layout>
      <User>
        <Profile />
      </User>
    </Layout>
  )
}

export default Page
