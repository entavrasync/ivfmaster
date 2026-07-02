import type { StaticImageData } from 'next/image'

import heroDesktop from '@/assets/cost/cost-desktop-2.png'
import heroMobile from '@/assets/cost/cost-mobile-2.png'
import gorakhDesktop from '@/assets/cost/cost-desktop-3.png'
import gorakhMobile from '@/assets/cost/cost-mobile-3.png'
import saieDesktop from '@/assets/cost/cost-desktop-4.png'
import saieMobile from '@/assets/cost/cost-mobile-4.png'
import teamDesktop from '@/assets/cost/cost-desktop-5.png'
import teamMobile from '@/assets/cost/cost-mobile-5.png'

export interface CareStep {
  number: string
  title: string
  body: string
}

export interface EditorialImage {
  desktop: StaticImageData
  mobile: StaticImageData
  alt: string
}

export interface DoctorStory {
  id: 'gorakh' | 'saie'
  name: string
  role: string
  pullQuote: string
  paragraphs: readonly string[]
  evidence: string
  image: EditorialImage
  ctaLabel: string
  ctaHref: '/contact?doctor=gorakh' | '/contact?doctor=saie'
}

export interface TrustPoint {
  label: string
  title: string
  body: string
}

export const aboutContent = {
  hero: {
    eyebrow: 'The people behind your care',
    title: 'Care begins before treatment does.',
    body: 'Fertility care should begin with time to listen, space to understand, and honest guidance about what comes next.',
    primaryCta: 'Begin with a conversation',
    secondaryCta: 'Read our story',
    image: {
      desktop: heroDesktop,
      mobile: heroMobile,
      alt: 'A small luminous sprout emerging through a calm, dark landscape',
    } satisfies EditorialImage,
  },
  origin: {
    eyebrow: 'Why IVF Master exists',
    title: 'When the path feels uncertain, understanding is a form of care.',
    paragraphs: [
      'Many couples arrive with more questions than answers. They may have spent months reading, waiting, or hearing advice that does not fit their story. Before another recommendation is made, they deserve to understand what their evaluation means.',
      'IVF Master was conceived as a place for education as much as treatment: a place to explain fertility medicine in plain language, correct misconceptions, and help couples make informed decisions without pressure.',
      'That belief shapes the clinical relationship. The team listens first, explains what is known, speaks honestly about what remains uncertain, and only then discusses the care that may be appropriate.',
    ],
    quote: 'Hope is most useful when it comes with clarity.',
    note: 'The original purpose of IVF Master was to educate couples about IVF and remove misconceptions around treatment.',
  },
  care: {
    eyebrow: 'How care begins',
    title: 'A plan is built with you, not handed to you.',
    intro: 'The medical work matters. So does the order in which it happens.',
    steps: [
      {
        number: '01',
        title: 'Listen to the whole story',
        body: 'Your history, concerns, previous treatment, health, and hopes provide the context that tests alone cannot.',
      },
      {
        number: '02',
        title: 'Make the findings understandable',
        body: 'Evaluation may include ovarian reserve testing, semen analysis, uterine assessment, and lifestyle guidance. Each finding is explained before it becomes a decision.',
      },
      {
        number: '03',
        title: 'Shape care around the couple',
        body: 'Age, diagnosis, medical history, time trying to conceive, and individual priorities all influence which next step makes sense.',
      },
      {
        number: '04',
        title: 'Stay present through what follows',
        body: 'Questions do not stop when treatment starts. Support continues through monitoring, procedures, the waiting period, and pregnancy care where appropriate.',
      },
    ] satisfies readonly CareStep[],
  },
  doctors: [
    {
      id: 'gorakh',
      name: 'Dr. Gorakh Mandrupkar',
      role: 'Reproductive medicine and infertility specialist',
      pullQuote: 'Experience matters most when it helps someone feel less lost.',
      paragraphs: [
        'For Dr. Gorakh Mandrupkar, reproductive medicine has always involved two responsibilities: practising it carefully and making it understandable. He has worked as a consultant in reproductive medicine since March 2006, building more than two decades of experience around the questions couples bring into the consultation room.',
        'His academic path includes a Pune University Gold Medal in Gynecology in 2004. Over time, that foundation expanded into clinical care for more than 2,000 couples, research in women\'s health, and ten years directing a FOGSI-recognized IVF training centre where gynecologists received training in IUI and IVF techniques.',
        'The same practical curiosity led him to develop the HDP Gestosis Score, a screening tool for women at risk of preeclampsia that was adopted for clinical use by India\'s National Health Mission. At the clinic, research and teaching are not separate from patient care; they shape how evidence is questioned, explained, and applied to each couple.',
      ],
      evidence: 'Clinical practice, research, and teaching are treated as one responsibility: improving the quality of the next decision.',
      image: {
        desktop: gorakhDesktop,
        mobile: gorakhMobile,
        alt: 'A luminous sprout growing through a layered midnight landscape',
      },
      ctaLabel: 'Talk with Dr. Gorakh',
      ctaHref: '/contact?doctor=gorakh',
    },
    {
      id: 'saie',
      name: 'Dr. Saie Mandrupkar',
      role: 'High-risk obstetrics, gynecology and reproductive medicine',
      pullQuote: 'Care should remain steady when the journey becomes complex.',
      paragraphs: [
        'Dr. Saie Mandrupkar completed her postgraduate degree in Obstetrics and Gynecology from Pune University in 2005. Across more than two decades of clinical work, she has cared for women through infertility evaluation, fertility treatment, high-risk pregnancy, and the transition toward safe motherhood.',
        'Her experience includes IVF pregnancies, recurrent pregnancy loss, pregnancies complicated by diabetes or hypertension, and other complex maternal and fetal conditions. She has helped more than 2,000 couples through infertility care, while remaining attentive to the emotional weight carried alongside the medical details.',
        'Her participation in clinical research helps keep that care connected to current evidence. Just as importantly, her work creates continuity: the person who understands the uncertainty before treatment can remain present through the vulnerable stages that may follow.',
      ],
      evidence: 'Continuity matters: fertility treatment and high-risk pregnancy care are understood as connected parts of one reproductive journey.',
      image: {
        desktop: saieDesktop,
        mobile: saieMobile,
        alt: 'A warm luminous sprout rising through an expansive abstract landscape',
      },
      ctaLabel: 'Talk with Dr. Saie',
      ctaHref: '/contact?doctor=saie',
    },
  ] satisfies readonly DoctorStory[],
  team: {
    eyebrow: 'The people beside every step',
    title: 'Good care is never the work of one person.',
    intro: 'An IVF journey moves between conversations, monitoring, medication, procedures, laboratory work, and waiting. The experience feels more manageable when those moments belong to one coordinated team.',
    moments: [
      {
        title: 'Clinical and nursing care',
        body: 'Questions about preparation, medication, monitoring, and recovery need clear answers at the moment they arise.',
      },
      {
        title: 'Embryology',
        body: 'After egg retrieval, the embryology team manages fertilisation and embryo development with careful observation over the days that follow.',
      },
      {
        title: 'Counselling and emotional support',
        body: 'The waiting period can be difficult. Support includes making space for anxiety, questions, and the need to move through treatment one step at a time.',
      },
    ],
    image: {
      desktop: teamDesktop,
      mobile: teamMobile,
      alt: 'Several illuminated paths converging around a growing form in an abstract landscape',
    } satisfies EditorialImage,
  },
  trust: {
    eyebrow: 'Trust built through practice',
    title: 'What you can expect from the relationship.',
    intro: 'Trust is not a claim made once. It is built through the way each conversation, recommendation, and uncertainty is handled.',
    points: [
      {
        label: 'Before treatment',
        title: 'Evaluation before recommendation',
        body: 'A treatment plan follows an understanding of reproductive health, medical history, age, and the couple\'s circumstances.',
      },
      {
        label: 'During decisions',
        title: 'Education without pressure',
        body: 'Options are explained in plain language so consent is informed and couples can ask questions without feeling rushed.',
      },
      {
        label: 'In the clinic',
        title: 'Evidence with individual judgment',
        body: 'Research and established reproductive medicine guide care, while the plan remains specific to the person rather than a standard protocol.',
      },
      {
        label: 'Through uncertainty',
        title: 'Honesty without withdrawing hope',
        body: 'IVF can help, but it cannot promise pregnancy. Outcomes vary, and difficult facts are discussed with the same care as encouraging ones.',
      },
      {
        label: 'Over time',
        title: 'Support beyond one appointment',
        body: 'Care continues through treatment questions, the waiting period, follow-up, and pregnancy management when it is needed.',
      },
    ] satisfies readonly TrustPoint[],
  },
  closing: {
    eyebrow: 'A gentler first step',
    title: 'You do not need every answer before the first conversation.',
    body: 'Bring your questions, your history, and whatever uncertainty you are carrying. The first step is to understand—not to commit to a treatment.',
    primaryCta: 'Schedule a consultation',
    secondaryCta: 'Learn how IVF works',
  },
} as const

if (process.env.NODE_ENV !== 'production') {
  if (aboutContent.care.steps.length !== 4) {
    throw new Error('About care journey must contain exactly four steps')
  }
  if (aboutContent.doctors.length !== 2) {
    throw new Error('About doctor stories must contain exactly two doctors')
  }
}
