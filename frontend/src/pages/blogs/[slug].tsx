import { MarkdownWrapper, fetchMarkdown } from '@/Markdown'
export const Page = ({ data }) => (
  <MarkdownWrapper {...data} name={data.title} />
)
export const getServerSideProps = fetchMarkdown({ path: '/blogs' })
export default Page
