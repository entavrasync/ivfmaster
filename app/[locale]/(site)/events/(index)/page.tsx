import { PublicationListing, publicationMetadata, type PublicationParams, type PublicationSearch } from '@/components/publications/publication-pages'

export const dynamic = 'force-dynamic'
type Props = PublicationParams & { searchParams: PublicationSearch }
export const generateMetadata = (props: Props) => publicationMetadata('event', props, props.searchParams)
export default function EventsPage(props: Props) { return <PublicationListing kind="event" {...props} /> }
