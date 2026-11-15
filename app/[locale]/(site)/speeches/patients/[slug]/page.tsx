import { PublicationDetail, publicationMetadata, type PublicationParams } from '@/components/publications/publication-pages'

export const dynamic = 'force-dynamic'
export const generateMetadata = (props: PublicationParams) => publicationMetadata('event', props)
export default function EventDetail(props: PublicationParams) { return <PublicationDetail kind="event" {...props} /> }
