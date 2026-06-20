export interface Story {
  id: string;
  title: string;
  description: string;
  quote: string;
  icon: string;
}

export const recognitionStories: Story[] = [
  {
    id: 'trying-year',
    title: "We've been trying for over a year",
    description: 'The emotional weight of wanting to start a family without clear answers',
    quote: 'Every month feels like a reset button. We needed someone to help us understand why.',
    icon: '💭',
  },
  {
    id: 'conflicting-advice',
    title: 'Everyone has advice but nobody has answers',
    description: 'Navigating conflicting opinions from family, friends, and the internet',
    quote: 'My mother says one thing, my friend says another. Who do we actually trust?',
    icon: '🗣️',
  },
  {
    id: 'scared-treatment',
    title: 'We\'re scared of treatment options',
    description: 'Fear of the unknown when it comes to fertility procedures',
    quote: 'Is IVF really our only option? What will it actually involve? Nobody explains it clearly.',
    icon: '😰',
  },
  {
    id: 'time-running-out',
    title: 'We feel like time is running out',
    description: 'Age-related concerns adding pressure to family planning',
    quote: 'At 35, I keep hearing how time matters. We need real guidance, not judgment.',
    icon: '⏳',
  },
  {
    id: 'expensive-unclear',
    title: 'It\'s expensive and unclear what we\'re paying for',
    description: 'Financial anxiety around fertility treatment costs',
    quote: 'The cost is significant. We need transparency about what we\'re investing in.',
    icon: '💰',
  },
  {
    id: 'hopeful-but-confused',
    title: 'We\'re hopeful but confused about our options',
    description: 'Wanting to explore fertility solutions without clear guidance',
    quote: 'We want to take action, but we need someone to explain our path forward.',
    icon: '🤔',
  },
];

export interface SuccessStory {
  id: string;
  couple: string;
  initialConcern: string;
  journey: string;
  outcome: string;
  duration: string;
}

export const successStories: SuccessStory[] = [
  {
    id: 'story-1',
    couple: 'Priya & Amit',
    initialConcern: 'Unexplained infertility after 3 years of trying',
    journey: 'Dr. Sharma\'s comprehensive diagnostic approach identified a subtle hormonal imbalance. Personalized treatment plan created with clear milestones.',
    outcome: 'Successful natural conception 6 months into treatment',
    duration: '8 months from consultation to positive pregnancy test',
  },
  {
    id: 'story-2',
    couple: 'Anjali & Rajesh',
    initialConcern: 'PCOS diagnosis with irregular cycles',
    journey: 'Education-first approach helped them understand their condition. Lifestyle modifications combined with targeted medication.',
    outcome: 'Successful IUI resulting in twin pregnancy',
    duration: '5 months of treatment',
  },
  {
    id: 'story-3',
    couple: 'Neha & Vikram',
    initialConcern: 'Male factor infertility (low sperm count)',
    journey: 'Specialized male fertility evaluation revealed treatable condition. Andrologist consultation + lifestyle changes + ICSI',
    outcome: 'Successful IVF with ICSI, baby boy born',
    duration: '1 year from diagnosis to delivery',
  },
  {
    id: 'story-4',
    couple: 'Deepa & Suresh',
    initialConcern: 'Recurrent pregnancy loss (3 miscarriages)',
    journey: 'Comprehensive recurrent loss evaluation identified immune factors. Specialized protocol implemented.',
    outcome: 'Successful pregnancy, healthy baby girl delivered',
    duration: '18 months to successful delivery',
  },
  {
    id: 'story-5',
    couple: 'Ritika & Aditya',
    initialConcern: 'Age-related concerns (39 years old)',
    journey: 'Egg freezing discussion led to egg freezing procedure. Options preserved for future planning.',
    outcome: 'Successful pregnancy using frozen eggs 2 years later',
    duration: '2.5 years from freezing to successful pregnancy',
  },
  {
    id: 'story-6',
    couple: 'Meera & Sanjay',
    initialConcern: 'Post-cancer fertility preservation',
    journey: 'Emergency egg freezing before cancer treatment. Genetic counseling and testing completed.',
    outcome: 'Healthy pregnancy 3 years post-cancer remission',
    duration: '3 years to successful pregnancy',
  },
];
