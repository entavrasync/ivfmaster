import type { StaticImageData } from 'next/image'
import gorakhPhoto from '@/assets/doctor/gorakh-mandrupkar.jpeg'
import saiePhoto from '@/assets/doctor/saie.jpeg'
import pankajPhoto from '@/assets/doctor/Embryologist-doc-pankaj.png'
import receptionPhoto from '@/assets/Clinic-photos/recetion.jpg'
import consultingRoomPhoto from '@/assets/Clinic-photos/consulting-room.jpg'
import laboratory1 from '@/assets/Clinic-photos/laboratory-1.jpg'
import laboratory2 from '@/assets/Clinic-photos/laboratory-2.jpg'
import laboratory3 from '@/assets/Clinic-photos/laboratory-3.jpg'
import waitingAreaPhoto from '@/assets/Clinic-photos/waiting-area.jpg'

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
  readonly messageKey: 'nurse' | 'embryologist'
  readonly name: string
  readonly role: string
  readonly blurb: string
  /** Optional credential bullets — present for confirmed team members like the embryologist. */
  readonly credentials?: readonly string[]
  readonly image: TeamImageSlot
}

export interface FacilityPhoto {
  readonly id: string
  readonly messageKey: 'reception' | 'consultation' | 'laboratory' | 'waiting'
  readonly caption: string
  /**
   * One image renders as a normal image tile; two or more turn that same tile
   * into an in-place carousel (auto-play + arrows + dots). To add more photos
   * to an area later, just import the file and append it to this array.
   */
  readonly images: readonly StaticImageData[]
}

export const doctors: readonly Doctor[] = [
  {
    slug: 'gorakh-mandrupkar',
    messageKey: 'gorakh',
    name: 'Dr. Gorakh Mandrupkar',
    title: 'Reproductive medicine and infertility specialist',
    essence: 'The doctor who explains until it finally makes sense.',
    intro:
      'Dr. Gorakh believes that understanding your treatment is part of feeling safe in it. He takes time to explain the science plainly, answer every question, and build a plan around the couple in front of him.',
    credentials: [
      'Gold Medallist in Gynecology, Pune University (2004)',
      'Consultant in reproductive medicine since March 2006 — 20+ years',
      '2,000+ couples cared for',
      "Developed the HDP Gestosis Score, adopted by India's National Health Mission",
      'Director of a FOGSI-recognized IVF training centre (10+ years)',
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
    title: 'High-risk obstetrics, gynecology and reproductive medicine',
    essence: 'Gentle with people, fierce about their care.',
    intro:
      'Dr. Saie brings steadiness to the moments that feel most uncertain. Her work in high-risk obstetrics and reproductive medicine is grounded in careful attention, calm communication, and the conviction that every patient deserves to feel heard.',
    credentials: [
      'Postgraduate in Obstetrics & Gynecology, Pune University (2005)',
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

// Care-team roster. The embryologist is confirmed; the fertility-nurse slot is a
// placeholder until the clinic provides a name and photo.
export const careTeam: readonly CareTeamMember[] = [
  {
    id: 'embryologist',
    messageKey: 'embryologist',
    name: 'Dr. Pankaj Kaingade',
    role: 'Embryologist & reproductive biologist',
    blurb:
      'The careful hands behind our laboratory — pairing scientific precision with genuine care for what each embryo represents.',
    credentials: [
      'PhD, Charotar University of Science and Technology (CHARUSAT), Gujarat',
      '1000+ IVF-ICSI cycles handled',
      'Invited across centres for his ICSI expertise',
      'Published peer-reviewed research in reproductive biology & stem cells',
    ],
    image: { src: pankajPhoto.src, altKey: 'careTeam.embryologist.imageAlt', position: 'center 20%' },
  },
  // Temporarily hidden — fertility-nurse slot is a placeholder awaiting the clinic's
  // name and photo. Uncomment to restore the card once those details are confirmed.
  // {
  //   id: 'fertility-nurse',
  //   messageKey: 'nurse',
  //   name: 'Name to be confirmed',
  //   role: 'Fertility nurse',
  //   blurb: 'The steady hand beside you through medicines, questions, and next steps.',
  //   image: { src: '/team/care-placeholder.svg', altKey: 'careTeam.nurse.imageAlt' },
  // },
] as const

// Real clinic-interior photos — warm environment shots, NOT clinical procedure imagery.
export const facilityPhotos: readonly FacilityPhoto[] = [
  {
    id: 'reception',
    messageKey: 'reception',
    caption: 'Reception — a calm first hello.',
    images: [receptionPhoto],
  },
  {
    id: 'consultation-room',
    messageKey: 'consultation',
    caption: 'Consultation room — private space for unhurried conversations.',
    images: [consultingRoomPhoto],
  },
  {
    id: 'embryology-lab',
    messageKey: 'laboratory',
    caption: 'Embryology laboratory — precise, protected, and closely monitored.',
    // Multiple images → this tile becomes the in-place lab carousel.
    // Append more '@/assets/Clinic-photos/laboratory-*.jpg' imports here to grow it.
    images: [laboratory1, laboratory2, laboratory3],
  },
  {
    id: 'waiting-area',
    messageKey: 'waiting',
    caption: 'Waiting area — designed for quiet and comfort.',
    images: [waitingAreaPhoto],
  },
] as const

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return doctors.find((doctor) => doctor.slug === slug)
}
