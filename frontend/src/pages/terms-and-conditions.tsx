import { MarkdownWrapper, fetchMarkdown } from '@/Components/Markdown'
export const Page = ({ data }) => <MarkdownWrapper {...data} />
export const getServerSideProps = fetchMarkdown({})
export default Page
