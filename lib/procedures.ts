// Medical content for IUI, ICSI, and embryo freezing is drafted and pending Dr. Mandrupkar's review before publishing.

export type QuickFact   = { readonly label: string; readonly value: string }
export type ProcessStep = { readonly title: string; readonly detail: string; readonly image?: string }
export type FAQ         = { readonly q: string; readonly a: string }

export type Procedure = {
  readonly slug:            string
  readonly name:            string
  readonly fullName:        string
  readonly oneLiner:        string
  readonly heroDescription: string
  readonly heroImage?:      string
  readonly accentEdge:      string
  readonly accentBg:        string
  readonly quickFacts:      readonly QuickFact[]
  readonly whoItsFor:       readonly string[]
  readonly process:         readonly ProcessStep[]
  readonly whatToExpect:    string
  readonly faqs:            readonly FAQ[]
}

export const PROCEDURES: ReadonlyArray<Procedure> = [
  {
    slug:     'ivf',
    name:     'IVF',
    fullName: 'In vitro fertilisation',
    oneLiner: 'The complete journey — eggs and sperm meet in the lab, and the healthiest embryo comes home to you.',
    heroDescription:
      'IVF is the most comprehensive fertility treatment we offer — a careful, step-by-step process that gives many couples their best chance at pregnancy. Every decision is personal, every plan is tailored, and we will walk with you through each stage.',
    accentEdge: 'rgba(226,132,156,0.55)',
    accentBg:   'rgba(226,132,156,0.08)',
    quickFacts: [
      { label: 'Timeline',      value: '4–6 weeks'                     },
      { label: 'Anaesthesia',   value: 'Light, for egg retrieval only' },
      { label: 'Clinic visits', value: 'Minimal'                       },
    ],
    whoItsFor: [
      'Blocked or damaged fallopian tubes',
      'Low sperm count or poor motility',
      'Endometriosis affecting fertility',
      'Unexplained infertility after simpler treatments',
      'When previous fertility treatments have not worked',
      'Couples who want embryos screened for genetic conditions before transfer',
    ],
    process: [
      {
        title:  'Preparing your body',
        detail: 'A brief round of blood tests, an ultrasound, and sometimes a semen assessment — nothing invasive. Just enough for us to understand your situation and build a plan that is personal to you.',
      },
      {
        title:  'Growing the eggs',
        detail: 'Daily hormone injections for around 10–14 days encourage your ovaries to mature several eggs at once. You will come in for gentle monitoring scans every few days so we can see how things are developing and adjust if needed.',
      },
      {
        title:  'Collecting the eggs',
        detail: 'A short procedure under light sedation, guided by ultrasound. Most patients are home within a couple of hours and comfortable enough to rest at home the same day. The discomfort is brief and well managed.',
      },
      {
        title:  'Fertilisation in the lab',
        detail: 'Your eggs and your partner\'s (or a donor\'s) prepared sperm are brought together in the laboratory. Where it helps, we use ICSI — a single sperm is injected carefully into each egg. The embryos are then watched closely as they develop over 3–6 days.',
      },
      {
        title:  'The embryo transfer',
        detail: 'The healthiest embryo is gently placed into your uterus through a thin, soft catheter. No anaesthesia needed, very little discomfort, and no bed rest required afterwards. You can go home the same hour.',
      },
      {
        title:  'The wait, together',
        detail: 'Supportive progesterone helps prepare the lining of your uterus. Around 13–15 days after the transfer, a blood test tells you the result. We remain available to you through every day of the wait.',
      },
    ],
    whatToExpect:
      'You will have a handful of monitoring visits during stimulation — typically every two to three days. Most people experience mild bloating or tenderness from the hormones, and brief discomfort at egg retrieval. The two-week wait is emotionally the hardest part for many couples, but most continue normal daily life throughout the rest of the process.',
    faqs: [
      {
        q: 'How many embryos will be transferred?',
        a: 'In most cases, one healthy embryo is transferred at a time. This reduces the chance of a multiple pregnancy while still giving a strong chance of success. Two may be considered in specific circumstances, and we will always discuss this with you first.',
      },
      {
        q: 'What happens to embryos we do not use?',
        a: 'Extra embryos of good quality can be frozen using vitrification and stored safely for a future cycle — so you may not need to go through stimulation again. They can also be donated to other couples or to research, or allowed to reach their natural end. Your team will talk through all the options with you.',
      },
      {
        q: 'How many cycles might we need?',
        a: 'This is genuinely variable and depends on your age, embryo quality, and the underlying reason for infertility. Some couples succeed on the first cycle; others need two or three. We give you an honest, personal picture at the very start so you can plan.',
      },
    ],
  },

  {
    slug:     'iui',
    name:     'IUI',
    fullName: 'Intrauterine insemination',
    oneLiner: 'A simpler, gentler first step — well-timed sperm meets egg with a little help from us.',
    heroDescription:
      'IUI is often where fertility treatment begins. It is a gentler, less intensive option that gives your body a well-timed helping hand. For the right couples, it can be an effective first step before considering anything more involved.',
    accentEdge: 'rgba(100,120,200,0.46)',
    accentBg:   'rgba(100,120,200,0.08)',
    quickFacts: [
      { label: 'Timeline',      value: '2–3 weeks' },
      { label: 'Anaesthesia',   value: 'None'       },
      { label: 'Clinic visits', value: 'Minimal'    },
    ],
    whoItsFor: [
      'Unexplained infertility at an earlier stage',
      'Mild male factor — slightly reduced count or motility',
      'Cervical mucus that may be preventing sperm from reaching the egg',
      'Couples who want to try a gentler option before IVF',
      'Single women or same-sex couples using donor sperm',
      'Ovulation disorders supported with light medication',
    ],
    process: [
      {
        title:  'Monitoring your cycle',
        detail: 'A scan or two to track your natural ovulation, or light hormone tablets to support it. For most IUI patients there are no injections — just careful monitoring to find the right moment.',
      },
      {
        title:  'Preparing the sperm',
        detail: 'On the day of the procedure, your partner provides a sample. Our laboratory washes and concentrates the most active, motile sperm over about two hours — a simple, standard process that makes a real difference.',
      },
      {
        title:  'The insemination',
        detail: 'A thin, flexible catheter places the prepared sperm gently into your uterus just as you are ovulating. The procedure takes a few minutes and is usually painless — most patients describe it as a mild internal sensation.',
      },
      {
        title:  'The wait',
        detail: 'Normal activities can resume immediately. There is nothing you need to change. A blood test or home test about two weeks later gives you the result, and we are here if you want to talk through how you are feeling.',
      },
    ],
    whatToExpect:
      'IUI is much less intensive than IVF — fewer clinic visits, no injections for most patients, and a very brief procedure on the day. You may feel mild cramp-like discomfort for a short time after the insemination. Success rates per cycle are lower than IVF, which is why couples often try a few cycles before deciding on next steps.',
    faqs: [
      {
        q: 'Is IUI painful?',
        a: 'For most people, no. The insemination itself is similar to a smear test — brief and usually painless. Some patients feel mild cramping for a short time afterwards, but this passes quickly and you can carry on with your day straight away.',
      },
      {
        q: 'How many cycles of IUI should we try before moving on?',
        a: 'Most clinics recommend three to six cycles before discussing other options — but this depends on your age and individual picture. We will talk with you honestly after each cycle and will never push you to continue if the evidence suggests a different path might serve you better.',
      },
    ],
  },

  {
    slug:     'icsi',
    name:     'ICSI',
    fullName: 'Intracytoplasmic sperm injection',
    oneLiner: 'A single, carefully selected sperm injected directly into each egg — precision where it matters most.',
    heroDescription:
      'ICSI is a precise technique used alongside IVF when sperm needs extra support to fertilise an egg. It works within the same cycle as standard IVF — the difference happens in the laboratory, in the skilled hands of our embryology team.',
    accentEdge: 'rgba(148,100,200,0.42)',
    accentBg:   'rgba(148,100,200,0.08)',
    quickFacts: [
      { label: 'Timeline',      value: '4–6 weeks (same as IVF)' },
      { label: 'Anaesthesia',   value: 'Light, for egg retrieval' },
      { label: 'Clinic visits', value: 'Minimal'                  },
    ],
    whoItsFor: [
      'Low sperm count (oligospermia)',
      'Poor sperm motility — sperm that struggle to swim',
      'Abnormal sperm shape affecting fertilisation',
      'Sperm retrieved surgically where there is no sperm in the ejaculate',
      'Previous IVF cycles where fertilisation did not occur',
      'Couples wanting the highest chance of fertilisation per egg collected',
    ],
    process: [
      {
        title:  'Egg collection',
        detail: 'Exactly the same as a standard IVF cycle — light hormone stimulation to grow several eggs, gentle monitoring visits, then a short egg-collection procedure under light sedation. The ICSI difference begins in the laboratory.',
      },
      {
        title:  'Single-sperm injection',
        detail: 'In the laboratory, an embryologist uses a high-powered microscope and a fine glass needle to select one healthy sperm and inject it directly into each mature egg. This step bypasses the natural fertilisation barrier entirely.',
      },
      {
        title:  'Embryo development',
        detail: 'The fertilised eggs are watched closely in the incubator over 3–5 days as they develop into embryos. Our team grades them carefully and keeps you updated on progress each day.',
      },
      {
        title:  'Embryo transfer',
        detail: 'The strongest embryo is transferred to your uterus in exactly the same gentle way as in a standard IVF cycle — a thin soft catheter, no anaesthesia, and no bed rest needed afterwards.',
      },
    ],
    whatToExpect:
      'From your perspective as a patient, ICSI feels identical to a standard IVF cycle. The additional precision happens in the lab, not to you. Fertilisation rates with ICSI are significantly higher when sperm quality is the primary challenge, and long-term outcomes for children are comparable to those from standard IVF.',
    faqs: [
      {
        q: 'Does ICSI guarantee fertilisation?',
        a: 'ICSI dramatically improves the chance of fertilisation when sperm quality is the challenge, but no technique can guarantee it. Your embryology team will keep you updated on how your embryos are developing each day.',
      },
      {
        q: 'Is ICSI riskier than standard IVF?',
        a: 'ICSI has been used successfully for over 30 years. Extensive research shows that outcomes for children are comparable to standard IVF. We recommend ICSI only when it is genuinely in your interest — not routinely.',
      },
    ],
  },

  {
    slug:     'embryo-freezing',
    name:     'Embryo freezing',
    fullName: 'Cryopreservation',
    oneLiner: 'Preserving your best embryos safely, so the future stays open.',
    heroDescription:
      'Embryo freezing means you can preserve the strongest embryos from your IVF cycle for later use — a future pregnancy, a second child, or simply the peace of mind of knowing they are there. Modern freezing technology is highly effective, and frozen embryos carry the same potential as fresh ones.',
    accentEdge: 'rgba(72,140,172,0.44)',
    accentBg:   'rgba(72,140,172,0.08)',
    quickFacts: [
      { label: 'Freezing timeline', value: 'During your IVF cycle'       },
      { label: 'Transfer timeline', value: 'Weeks to years later'         },
      { label: 'Survival rate',     value: 'Above 95% (vitrification)'   },
    ],
    whoItsFor: [
      'Couples with remaining good-quality embryos after an IVF cycle',
      'Those who want to delay transfer for health or personal timing reasons',
      'Women at risk of ovarian hyperstimulation syndrome (OHSS)',
      'Anyone planning a second pregnancy from one retrieval cycle',
      'Medical situations — such as illness or treatment — requiring a pause before transfer',
    ],
    process: [
      {
        title:  'Embryo assessment',
        detail: 'After your egg collection and fertilisation (from an IVF or ICSI cycle), our embryologist grades each embryo carefully. Those of good quality and development are selected for freezing.',
      },
      {
        title:  'Vitrification',
        detail: 'Selected embryos are flash-frozen using vitrification — an ultra-rapid process that protects them from ice-crystal damage. Survival rates are above 95%, and the embryo is preserved at exactly the developmental stage it was at when frozen.',
      },
      {
        title:  'Safe storage and future transfer',
        detail: 'Frozen embryos are stored in secure, continuously monitored tanks. When you are ready, an embryo is gently thawed and transferred in a frozen embryo transfer (FET) cycle — simpler, gentler, and far less intensive than the original IVF retrieval.',
      },
    ],
    whatToExpect:
      'The freezing step adds very little to the IVF process — it happens in the lab after your egg retrieval. A frozen embryo transfer cycle is much simpler than a full IVF cycle: you take medication to prepare the uterus lining, the embryo is thawed on the day of transfer, and the procedure itself is brief and gentle.',
    faqs: [
      {
        q: 'Does freezing affect an embryo\'s quality or potential?',
        a: 'With modern vitrification, no. Survival rates are above 95% and the embryo is preserved at exactly the same biological developmental stage. In many studies, frozen transfers produce outcomes equal to or better than fresh transfers, because the uterus has had time to fully recover from stimulation.',
      },
      {
        q: 'How long can embryos stay frozen?',
        a: 'There is no medical expiry date. Healthy babies have been born from embryos frozen for more than ten years. You can keep them in storage for as long as you need, and the decision about what to do with them ultimately remains yours.',
      },
    ],
  },
]
