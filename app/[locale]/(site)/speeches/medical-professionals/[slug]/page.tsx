import { PublicationDetail, publicationMetadata, type PublicationParams } from '@/components/publications/publication-pages'

export const dynamic = 'force-dynamic'
export const generateMetadata = (props: PublicationParams) => publicationMetadata('news', props)
export default function NewsDetail(props: PublicationParams) { return <PublicationDetail kind="news" {...props} /> }
