export interface Procedure {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  isForUs: string[];
  process: string[];
  timeline: string;
  whatToExpect: string;
  commonConcerns: { concern: string; answer: string }[];
  successRate: string;
  faqs: { question: string; answer: string }[];
}

export const procedures: Procedure[] = [
  {
    id: 'ivf',
    slug: 'ivf',
    name: 'In Vitro Fertilization (IVF)',
    description: 'The most comprehensive fertility treatment where eggs are retrieved, fertilized in the lab, and embryos are transferred to the uterus.',
    shortDescription: 'Egg retrieval, lab fertilization, and embryo transfer',
    isForUs: [
      'Blocked or damaged fallopian tubes',
      'Low sperm count or poor motility',
      'Endometriosis',
      'Unexplained infertility',
      'Previous failed fertility treatments',
      'Couples wanting genetic testing before pregnancy',
    ],
    process: [
      'Ovarian stimulation with hormones (10-14 days)',
      'Egg retrieval through minor surgery',
      'Sperm collection on retrieval day',
      'Fertilization in the laboratory',
      'Embryo development monitoring (3-6 days)',
      'Embryo transfer to the uterus',
      'Pregnancy test 12-14 days after transfer',
    ],
    timeline: '4-6 weeks from start to pregnancy test',
    whatToExpect: 'Multiple clinic visits for monitoring, mild hormone injection side effects, brief discomfort during egg retrieval, and the emotional journey of waiting. Most people continue normal activities throughout.',
    commonConcerns: [
      {
        concern: 'Will the injections hurt?',
        answer: 'Hormone injections are given with very fine needles and most people report minimal discomfort. Many describe it as less painful than expected.',
      },
      {
        concern: 'What if no eggs are retrieved?',
        answer: 'Poor egg retrieval is rare but if it occurs, your doctor will discuss options including repeating the cycle, donor eggs, or other approaches.',
      },
      {
        concern: 'Can I work during IVF?',
        answer: 'Most people continue working throughout IVF. You may want to take time off the day of retrieval and transfer.',
      },
    ],
    successRate: '40-50% per cycle for women under 35, declining with age',
    faqs: [
      {
        question: 'How many embryos will be transferred?',
        answer: 'Typically one healthy embryo is transferred to reduce risks of multiple pregnancy. Two may be transferred in specific circumstances.',
      },
      {
        question: 'What happens to extra embryos?',
        answer: 'Extra embryos can be frozen for future use, donated to research, or donated to other couples.',
      },
      {
        question: 'How many IVF cycles might we need?',
        answer: 'This varies greatly. Some couples succeed on the first cycle, others may need 2-3 cycles. Age, egg quality, and underlying conditions affect this.',
      },
    ],
  },
  {
    id: 'iui',
    slug: 'iui',
    name: 'Intrauterine Insemination (IUI)',
    description: 'A simpler procedure where specially prepared sperm is directly placed into the uterus during ovulation to increase chances of fertilization.',
    shortDescription: 'Sperm placement directly in the uterus',
    isForUs: [
      'Unexplained infertility',
      'Mild male factor infertility',
      'Cervical factor infertility',
      'Ovulation disorders with medication',
      'Single women using donor sperm',
      'Couples wanting less intensive treatment first',
    ],
    process: [
      'Optional mild hormonal stimulation (5-7 days)',
      'Ovulation monitoring through ultrasound',
      'Sperm collection and processing',
      'Catheter placement of processed sperm into uterus at ovulation',
      'Pregnancy test 12-14 days later',
    ],
    timeline: '2-3 weeks from start to pregnancy test',
    whatToExpect: 'Less intensive than IVF with fewer clinic visits. The IUI procedure itself takes minutes and is usually painless. Success rates lower than IVF but acceptable for many couples.',
    commonConcerns: [
      {
        concern: 'Is IUI painful?',
        answer: 'No, the procedure is quick and painless for most women. It&apos;s similar to a pap smear.',
      },
      {
        concern: 'How many IUI cycles should we try?',
        answer: 'Most doctors recommend 3-6 cycles before moving to IVF. This depends on your age and other factors.',
      },
    ],
    successRate: '10-20% per cycle depending on age and underlying cause',
    faqs: [
      {
        question: 'When should we move from IUI to IVF?',
        answer: 'This depends on your age, test results, and response to treatment. Your doctor will advise when IVF might be more appropriate.',
      },
      {
        question: 'Can we do IUI with my partner&apos;s sperm?',
        answer: 'Yes, IUI can be done with your partner&apos;s sperm, donor sperm, or frozen sperm.',
      },
    ],
  },
  {
    id: 'icsi',
    slug: 'icsi',
    name: 'Intracytoplasmic Sperm Injection (ICSI)',
    description: 'An advanced IVF technique where a single sperm is injected directly into an egg, ideal for male factor infertility.',
    shortDescription: 'Single sperm injection into eggs during IVF',
    isForUs: [
      'Low sperm count',
      'Poor sperm motility',
      'Abnormal sperm morphology',
      'No sperm ejaculation (extracted from testes)',
      'High-dose IVF failures without fertilization',
      'Previous fertilization failures',
    ],
    process: [
      'All standard IVF steps up to fertilization',
      'Individual sperm selection and injection into each egg',
      'Embryo development monitoring',
      'Embryo transfer and pregnancy test',
    ],
    timeline: 'Same as IVF (4-6 weeks total)',
    whatToExpect: 'Similar to standard IVF with the addition of specialized sperm injection in the lab. This dramatically improves fertilization rates in male factor cases.',
    commonConcerns: [
      {
        concern: 'Does ICSI damage the eggs?',
        answer: 'ICSI is a precise procedure with minimal risk of egg damage. Experienced embryologists perform this routinely.',
      },
      {
        concern: 'Will ICSI babies be normal?',
        answer: 'Yes, extensive research shows ICSI babies develop normally. ICSI is simply bypassing a fertilization barrier.',
      },
    ],
    successRate: '40-50% per cycle with proper sperm selection',
    faqs: [
      {
        question: 'Do we need ICSI if our male factor is mild?',
        answer: 'ICSI is recommended for moderate to severe male factor. Your doctor will advise based on semen analysis results.',
      },
      {
        question: 'Can ICSI be used with donor sperm?',
        answer: 'Yes, ICSI works well with donor sperm, especially if donor sample quality is variable.',
      },
    ],
  },
  {
    id: 'embryo-freezing',
    slug: 'embryo-freezing',
    name: 'Embryo Freezing (Cryopreservation)',
    description: 'Fertilised embryos are carefully frozen and stored so that the best ones can be used when the time is right for you.',
    shortDescription: 'Preserve your best embryos for the future',
    isForUs: [
      'Couples with remaining embryos after an IVF cycle',
      'Those who want to delay embryo transfer for health or timing reasons',
      'Women at risk of ovarian hyperstimulation syndrome (OHSS)',
      'Couples planning multiple future pregnancies from one retrieval cycle',
      'Medical situations requiring a break before transfer',
    ],
    process: [
      'Embryos are created through a standard IVF or ICSI cycle',
      'High-quality embryos are selected by the embryologist',
      'Embryos are vitrified (flash-frozen) and placed in secure storage',
      'When you are ready, an embryo is thawed and transferred in a gentle FET cycle',
      'Pregnancy test 12–14 days after transfer',
    ],
    timeline: 'Freezing happens during your IVF cycle; transfer can happen weeks or years later',
    whatToExpect: 'The freezing step adds very little to the IVF process — it happens in the lab after egg retrieval. A frozen embryo transfer cycle is simpler than a full IVF cycle: you take medication to prepare the uterus, the embryo is thawed on transfer day, and the procedure itself is brief.',
    commonConcerns: [
      {
        concern: 'Will freezing damage the embryo?',
        answer: 'Modern vitrification achieves survival rates above 95 %. The embryo is exactly the same biological age when it is thawed as when it was frozen.',
      },
      {
        concern: 'How long can embryos stay frozen?',
        answer: 'Research shows no time limit on storage. Many healthy babies have been born from embryos frozen for more than ten years.',
      },
    ],
    successRate: 'Comparable to fresh embryo transfer; outcomes depend on embryo quality and age at freezing',
    faqs: [
      {
        question: 'Is a frozen embryo transfer as successful as a fresh transfer?',
        answer: 'Yes — in many cases frozen transfers have equal or better outcomes because the uterus has had time to recover from stimulation.',
      },
      {
        question: 'What happens to embryos we do not use?',
        answer: 'Unused embryos can remain in storage, be donated to research, or be donated to other couples. Your team will discuss the options with you.',
      },
    ],
  },
  {
    id: 'egg-freezing',
    slug: 'egg-freezing',
    name: 'Egg Freezing (Oocyte Cryopreservation)',
    description: 'Advanced technique to freeze and preserve eggs for future use, ideal for career planning, medical treatment, or fertility preservation.',
    shortDescription: 'Preserve eggs for future pregnancy attempts',
    isForUs: [
      'Delaying family planning for career or personal reasons',
      'Medical treatments that affect fertility (cancer treatment)',
      'Genetic carrier status concerns',
      'Peace of mind preservation of fertility',
      'Age-related fertility concerns',
      'Partners with serious male factor issues',
    ],
    process: [
      'Ovarian stimulation (10-14 days)',
      'Egg retrieval procedure',
      'Egg maturation and freezing in laboratory',
      'Long-term storage in specialized facility',
      'When ready: thawing, fertilization, and transfer',
    ],
    timeline: '4-6 weeks for freezing; later use depends on your plan',
    whatToExpect: 'Same as IVF for the egg retrieval process. Success depends on age at freezing - younger eggs freeze and thaw better. No ongoing treatment needed while frozen.',
    commonConcerns: [
      {
        concern: 'What&apos;s the success rate of frozen eggs?',
        answer: 'Modern vitrification achieves 85-90% survival rates. Success when thawed depends on age at freezing.',
      },
      {
        concern: 'How long can eggs stay frozen?',
        answer: 'Research shows no time limit, though 10+ years is common storage. Eggs remain at the biological age they were frozen.',
      },
    ],
    successRate: 'Depends on age at freezing; younger eggs have better outcomes',
    faqs: [
      {
        question: 'How many eggs do we need to freeze?',
        answer: 'This depends on your age and goals. Most doctors recommend 15-20 eggs for reliable future pregnancy chances.',
      },
      {
        question: 'What&apos;s the cost difference between fresh and frozen eggs?',
        answer: 'Freezing adds cost during collection, but storage and later use are relatively affordable. It&apos;s a long-term investment in fertility.',
      },
    ],
  },
  {
    id: 'male-fertility',
    slug: 'male-fertility',
    name: 'Male Fertility Treatment',
    description: 'Comprehensive evaluation and treatment of male infertility including medical management, lifestyle optimization, and surgical sperm extraction.',
    shortDescription: 'Diagnosis and treatment of male factor infertility',
    isForUs: [
      'Low sperm count or concentration',
      'Poor sperm motility',
      'Abnormal sperm shape',
      'No ejaculation',
      'Hormonal imbalances affecting sperm',
      'Varicoceles affecting sperm production',
    ],
    process: [
      'Comprehensive semen analysis',
      'Hormonal evaluation if indicated',
      'Lifestyle assessment and counseling',
      'Medication or surgical intervention as needed',
      'Repeat semen analysis after treatment',
      'Coordination with partner&apos;s fertility planning',
    ],
    timeline: '2-3 months for lifestyle changes; 3-6 months for hormonal treatment',
    whatToExpect: 'Detailed evaluation and often surprising findings. Many male fertility issues are manageable with lifestyle changes, medications, or minimally invasive procedures.',
    commonConcerns: [
      {
        concern: 'Is low sperm count treatable?',
        answer: 'Many causes of low sperm count are treatable. Even if not, IVF with ICSI makes fatherhood possible.',
      },
      {
        concern: 'Will I need surgery?',
        answer: 'Surgery is rarely needed. Most cases respond to lifestyle changes or medication.',
      },
    ],
    successRate: 'Depends on underlying cause; 30-60% can improve sperm parameters',
    faqs: [
      {
        question: 'How long does treatment take to work?',
        answer: 'Sperm takes 74 days to mature, so improvement takes at least 2-3 months.',
      },
      {
        question: 'What lifestyle changes help most?',
        answer: 'Weight management, heat reduction, exercise, stress management, and avoiding smoking have the most evidence.',
      },
    ],
  },
  {
    id: 'fertility-preservation',
    slug: 'fertility-preservation',
    name: 'Fertility Preservation',
    description: 'Specialized services to preserve fertility before medical treatments or life-changing events that may affect reproductive capacity.',
    shortDescription: 'Protect your fertility before medical treatments',
    isForUs: [
      'Cancer diagnosis requiring chemotherapy or radiation',
      'Upcoming surgery affecting fertility',
      'Medical treatments affecting reproductive potential',
      'Genetic conditions requiring family planning considerations',
      'Gender transition',
      'Military deployment or other life events',
    ],
    process: [
      'Urgent fertility consultation and counseling',
      'Rapid ovarian stimulation or other collection method',
      'Egg, sperm, or embryo collection and freezing',
      'Long-term storage while medical treatment proceeds',
      'Use for family building after recovery',
    ],
    timeline: '1-2 weeks for urgent collection; variable for later use',
    whatToExpect: 'Expedited evaluation and rapid decision-making. Our team works closely with your oncologist or treating physician to minimize delays in necessary medical care.',
    commonConcerns: [
      {
        concern: 'Can we preserve fertility quickly enough?',
        answer: 'Yes, emergency egg or sperm freezing can often be arranged within days.',
      },
      {
        concern: 'Will fertility preservation delay medical treatment?',
        answer: 'No, we coordinate timing so preservation doesn\'t delay necessary medical care.',
      },
    ],
    successRate: 'Depends on method; generally comparable to standard IVF',
    faqs: [
      {
        question: 'Is fertility preservation covered by insurance?',
        answer: 'Some insurance plans cover fertility preservation for cancer patients. We help navigate insurance questions.',
      },
      {
        question: 'Can we preserve fertility if already undergoing treatment?',
        answer: 'This depends on the specific treatment, but sometimes yes. Emergency consultation can explore options.',
      },
    ],
  },
];
