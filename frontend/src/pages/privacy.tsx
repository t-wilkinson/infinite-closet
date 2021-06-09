import { MarkdownWrapper, fetchMarkdown } from '@/Markdown'
export const Page = ({ data }) => <MarkdownWrapper {...data} />
export const getServerSideProps = fetchMarkdown({})
export default Page
