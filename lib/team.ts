import gorakhPhoto from '@/assets/doctor/gorakh-mandrupkar.jpeg'
import saiePhoto from '@/assets/doctor/saie.jpeg'

export interface TeamImageSlot {
  readonly src: string
  readonly altKey: string
  readonly position?: string
}

export interface Doctor {
  readonly slug: string
  readonly messageKey: 'gorakh' | 'saie'
  readonly name: string
  readonly title: string
  readonly essence: string
  readonly intro: string
  readonly credentials: readonly string[]
  readonly image: TeamImageSlot
}

export interface CareTeamMember {
  readonly id: string
  readonly messageKey: 'coordinator' | 'nurse' | 'embryologist' | 'counsellor'
  readonly name: string
  readonly role: string
  readonly blurb: string
  readonly image: TeamImageSlot
}

export interface FacilityPhoto {
  readonly id: string
  readonly messageKey: 'reception' | 'consultation' | 'laboratory' | 'waiting'
  readonly caption: string
  readonly image: TeamImageSlot
}

export const doctors: readonly Doctor[] = [
  {
    slug: 'gorakh-mandrupkar',
    messageKey: 'gorakh',
    name: 'Dr. Gorakh Mandrupkar',
    title: 'Fertility specialist and obstetrician',
    essence: 'The doctor who explains until it finally makes sense.',
    intro:
      'Dr. Gorakh believes that understanding your treatment is part of feeling safe in it. He takes time to explain the science plainly, answer every question, and build a plan around the couple in front of him.',
    credentials: [
      'Gold Medallist, Pune University (2004)',
      '20+ years in reproductive medicine',
      '2,000+ couples cared for',
      "Developed the HDP Gestosis Score, adopted by India's National Health Mission",
      'Former director of a FOGSI IVF training centre',
    ],
    image: {
      src: gorakhPhoto.src,
      altKey: 'doctors.gorakh.imageAlt',
      position: 'center 20%',
    },
  },
  {
    slug: 'saie-mandrupkar',
    messageKey: 'saie',
    name: 'Dr. Saie Mandrupkar',
    title: 'High-risk obstetrician and reproductive medicine specialist',
    essence: 'Gentle with people, fierce about their care.',
    intro:
      'Dr. Saie brings steadiness to the moments that feel most uncertain. Her work in high-risk obstetrics and reproductive medicine is grounded in careful attention, calm communication, and the conviction that every patient deserves to feel heard.',
    credentials: [
      'Pune University',
      '20+ years in high-risk obstetrics and reproductive medicine',
      '2,000+ couples cared for',
    ],
    image: {
      src: saiePhoto.src,
      altKey: 'doctors.saie.imageAlt',
      position: 'center 20%',
    },
  },
] as const

// Care-team names, roles, and photos to be provided by the clinic.
export const careTeam: readonly CareTeamMember[] = [
  {
    id: 'patient-coordinator',
    messageKey: 'coordinator',
    name: 'Name to be confirmed',
    role: 'Patient coordinator',
    blurb: 'The familiar face who helps every visit feel less unfamiliar.',
    image: { src: '/team/care-placeholder.svg', altKey: 'careTeam.coordinator.imageAlt' },
  },
  {
    id: 'fertility-nurse',
    messageKey: 'nurse',
    name: 'Name to be confirmed',
    role: 'Fertility nurse',
    blurb: 'The steady hand beside you through medicines, questions, and next steps.',
    image: { src: '/team/care-placeholder.svg', altKey: 'careTeam.nurse.imageAlt' },
  },
  {
    id: 'embryologist',
    messageKey: 'embryologist',
    name: 'Name to be confirmed',
    role: 'Embryologist',
    blurb: 'The careful specialist protecting the quiet work inside our laboratory.',
    image: { src: '/team/care-placeholder.svg', altKey: 'careTeam.embryologist.imageAlt' },
  },
  {
    id: 'counsellor',
    messageKey: 'counsellor',
    name: 'Name to be confirmed',
    role: 'Fertility counsellor',
    blurb: 'The person who makes room for every feeling this journey can bring.',
    image: { src: '/team/care-placeholder.svg', altKey: 'careTeam.counsellor.imageAlt' },
  },
] as const

// Real clinic-interior photos to be provided — warm environment shots, NOT clinical procedure imagery.
export const facilityPhotos: readonly FacilityPhoto[] = [
  {
    id: 'reception',
    messageKey: 'reception',
    caption: 'Reception — a calm first hello.',
    image: { src: '/team/facility-placeholder.svg', altKey: 'facilityPhotos.reception.imageAlt' },
  },
  {
    id: 'consultation-room',
    messageKey: 'consultation',
    caption: 'Consultation room — private space for unhurried conversations.',
    image: { src: '/team/facility-placeholder.svg', altKey: 'facilityPhotos.consultation.imageAlt' },
  },
  {
    id: 'embryology-lab',
    messageKey: 'laboratory',
    caption: 'Embryology laboratory — precise, protected, and closely monitored.',
    image: { src: '/team/facility-placeholder.svg', altKey: 'facilityPhotos.laboratory.imageAlt' },
  },
  {
    id: 'waiting-area',
    messageKey: 'waiting',
    caption: 'Waiting area — designed for quiet and comfort.',
    image: { src: '/team/facility-placeholder.svg', altKey: 'facilityPhotos.waiting.imageAlt' },
  },
] as const

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return doctors.find((doctor) => doctor.slug === slug)
}
