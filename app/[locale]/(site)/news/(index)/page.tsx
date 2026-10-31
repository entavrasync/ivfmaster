import { PublicationListing, publicationMetadata, type PublicationParams, type PublicationSearch } from '@/components/publications/publication-pages'

export const dynamic = 'force-dynamic'
type Props = PublicationParams & { searchParams: PublicationSearch }
export const generateMetadata = (props: Props) => publicationMetadata('news', props, props.searchParams)
export default function NewsPage(props: Props) { return <PublicationListing kind="news" {...props} /> }
