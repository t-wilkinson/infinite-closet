import Profile from '@/User/Profile'
import User from '@/User'
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
