import type { StaticImageData } from 'next/image'

/* Procedure photos live under assets/procedure/<procedure>/. Statically imported
 * so next/image gets intrinsic dimensions; an article with no photo yet simply
 * omits coverImage and falls back to the lettered placeholder. */
import ivfCover from '@/assets/procedure/IVF/IVF-main.jpeg'
import maleFertilityCover from '@/assets/procedure/male-fertility/male-fertility.webp'
import pcosCover from '@/assets/procedure/pcos/PCOS.webp'
import recurrentPregnancyLossCover from '@/assets/pregnancy/recurrent-preganancy-loss.jpg'

export type ArticleCategory = 'Conditions' | 'Understanding IVF' | 'Myths'

export type ArticleSection = {
  readonly heading: string
  readonly body:    string   // paragraphs separated by \n\n
}

export type Article = {
  readonly slug:          string
  readonly title:         string
  readonly category:      ArticleCategory
  readonly excerpt:       string
  readonly date:          string     // ISO "YYYY-MM-DD"
  readonly readTime:      number     // minutes
  readonly coverImage?:   StaticImageData
  readonly intro:         string
  readonly sections:      readonly ArticleSection[]
  readonly keyTakeaways?: readonly string[]
  readonly relatedSlugs?: readonly string[]
}

export const ARTICLES: ReadonlyArray<Article> = [

  /* ─── 1. What IVF really is ───────────────────────────────────────────── */
  {
    slug:     'what-ivf-really-is',
    title:    'What IVF really is',
    category: 'Understanding IVF',
    excerpt:  'Most people have heard of IVF. Far fewer know what it actually involves — and how much gentler it is than its reputation suggests.',
    date:     '2025-10-15',
    readTime: 9,
    coverImage: ivfCover,
    intro:
      'IVF has a way of sounding more complicated — and more frightening — than it really is. The acronym alone can feel clinical and cold. But when you understand what is actually happening at each stage, it becomes something quite different: a careful, step-by-step process, with a real human team alongside you at every point. Here is what IVF really involves.',
    sections: [
      {
        heading: 'Why IVF exists',
        body:
          'Fertilisation — the moment an egg and sperm come together — normally happens inside the fallopian tube. IVF (in vitro fertilisation) simply moves that moment into a laboratory, where it can be supported, watched, and given the best possible conditions. The result — the embryo — is then placed back in the uterus.\n\nIVF is used when that natural journey is interrupted: blocked or damaged tubes, low sperm count, endometriosis, or infertility that simply cannot be explained. It is the most comprehensive fertility treatment available, but it is not as dramatic as it sounds.',
      },
      {
        heading: 'Phase 1 — Preparing your body',
        body:
          'The cycle begins with a short course of hormone injections — usually 10 to 14 days — that gently encourage your ovaries to mature several eggs at once, rather than the single egg a natural cycle produces. These are self-administered at home; most people find them much less daunting than expected.\n\nDuring this phase you will have a few monitoring scans — typically every two or three days — so the team can see exactly how the follicles (the fluid-filled sacs that each hold an egg) are developing. The timing is carefully managed so that the eggs are collected at exactly the right moment.',
      },
      {
        heading: 'Phase 2 — Collecting the eggs',
        body:
          'Egg collection is a short procedure done under light sedation, guided by ultrasound. A fine needle passes through the vaginal wall to gently draw fluid (and eggs) from each follicle. The whole thing takes around 20 to 30 minutes, and most people are home the same day.\n\nDiscomfort is usually mild — a little cramping and tiredness is typical. You will not feel pain during the procedure itself, and by the next day, most people feel well enough to go about their normal day.',
      },
      {
        heading: 'Phase 3 — The lab',
        body:
          'While the eggs are being collected, a sperm sample is prepared in the laboratory. In standard IVF, the eggs and sperm are placed together and nature is allowed to work. In ICSI (intracytoplasmic sperm injection) — used when sperm quality is a concern — a single carefully selected sperm is injected directly into each egg.\n\nThe following morning, the laboratory team checks which eggs have fertilised. This is the part that many couples find the most anxious wait of the whole cycle, and the team will update you as soon as they know.',
      },
      {
        heading: 'Phase 4 — The embryo grows',
        body:
          'Fertilised eggs are kept in the incubator for three to six days, where the embryology team watches them closely. Embryos develop through recognisable stages, and by day five or six, the best-quality ones reach what is called the blastocyst stage — the ideal point for transfer or freezing.\n\nSome embryos will not develop to this point, and that is a normal part of the process. The team grades each one honestly and explains what this means for the cycle.',
      },
      {
        heading: 'Phase 5 — The transfer',
        body:
          'The embryo transfer is simpler than most people expect. A thin, flexible catheter is used to place the embryo gently into the uterus — no anaesthetic is needed, and most people describe it as feeling similar to a smear test. You are awake throughout, and the whole procedure takes only a few minutes.\n\nAfter the transfer, no bed rest is required. You can resume normal daily activities straight away. Heavy exercise and heavy lifting are usually avoided for a short while, but ordinary life continues.',
      },
      {
        heading: 'Phase 6 — The wait, together',
        body:
          'The two weeks between the transfer and the pregnancy blood test is, for most couples, the most emotionally demanding part of IVF. You will be taking progesterone support (either as pessaries or injections) to help prepare the uterus lining. Otherwise, there is nothing to do but wait.\n\nThis is the phase where the team is still with you — even if there is nothing practical to manage. A call, a question, a moment of worry: that is what we are here for.',
      },
      {
        heading: 'What IVF is not',
        body:
          'IVF is not a guaranteed solution — but it is the most powerful tool we have for many types of infertility. It does not always work first time, and the honest conversation about realistic expectations is one of the most important ones you will have with your doctor.\n\nIt is also not the cold, clinical process its name suggests. The people in that laboratory are watching your embryos grow with real care. The team in the clinic knows your name, your story, and how much this matters to you. That part never changes.',
      },
    ],
    keyTakeaways: [
      'IVF is a 6-phase process that typically takes 4 to 6 weeks from the start of stimulation to the pregnancy test.',
      'Most of it is gentler than its reputation suggests — the only uncomfortable part is usually the egg collection, which is done under sedation.',
      'The two-week wait after transfer is the hardest part for most couples, emotionally rather than physically.',
      'IVF does not guarantee pregnancy, but it gives many couples their best chance when other options have not worked.',
    ],
    relatedSlugs: ['ivf-myths-vs-facts', 'age-and-ivf-success', 'pcos'],
  },

  /* ─── 2. Understanding PCOS ───────────────────────────────────────────── */
  {
    slug:     'pcos',
    title:    'PCOS',
    category: 'Conditions',
    excerpt:  'PCOS is a common, treatable hormonal condition that can affect your periods and fertility. Here’s what it is, the signs to watch for, and how we treat it.',
    date:     '2025-11-20',
    readTime: 5,
    coverImage: pcosCover,
    intro:
      'Polycystic ovary syndrome — PCOS, now also known as PMOS (polyendocrine metabolic ovarian syndrome) — is one of the most common hormonal conditions in women. It can make periods irregular and make conceiving harder, and it often comes alongside weight gain, acne, or extra hair growth. Here is the part worth holding on to from the start: PCOS is treatable, and most women who have it go on to live healthy, full lives.',
    sections: [
      {
        heading: 'What PCOS is',
        body:
          'PCOS stands for polycystic ovary syndrome. You may also hear it called PMOS — polyendocrine metabolic ovarian syndrome — a newer name for the same condition. At its heart, PCOS is a hormonal imbalance, and it is those shifting hormones that ripple out into the signs many women notice.\n\nIt is common, and it is manageable. With the right care, most women with PCOS keep their symptoms in check and stay well.',
      },
      {
        heading: 'Signs and symptoms',
        body:
          'PCOS looks different from one woman to the next, and not everyone has every sign. The ones we see most often include irregular or missed periods, difficulty getting pregnant, weight gain or trouble losing weight, acne, extra hair on the face, chest or tummy, thinning hair on the scalp, and darker patches of skin around the neck or underarms.\n\nSome women notice only one or two of these; others notice several. If any of them feel familiar, they are worth a conversation.',
      },
      {
        heading: 'Why PCOS happens',
        body:
          'The honest answer is that we do not fully know what causes PCOS. It does seem to run in families, so genetics likely play a part.\n\nMany women with PCOS also have something called insulin resistance, where the body does not use insulin the way it should. That can lead to weight gain, and it can make the other symptoms more pronounced — which is one reason a healthy lifestyle makes such a difference.',
      },
      {
        heading: 'How we diagnose PCOS',
        body:
          'There is no single test that diagnoses PCOS on its own. Instead, we build up a picture together. We will ask about your periods and any symptoms you have noticed, examine you, and usually arrange some blood tests. If it helps make things clearer, we may also do an ultrasound.\n\nTaken together, these give us enough to understand your particular version of PCOS and to plan care around it.',
      },
      {
        heading: 'Treatment starts with a healthy lifestyle',
        body:
          'For most women, the single most important treatment for PCOS is not a medicine — it is a healthy lifestyle. It genuinely works, and even a small amount of weight loss can make periods more regular and improve the chances of pregnancy.\n\nWith food, the aim is simple and home-grown: healthy home-cooked meals, with more vegetables, fruits, whole grains, pulses, and lean protein, and less in the way of sweets, sugary drinks, and junk food. With movement, aim for at least 30 minutes of activity a day, around five days a week.\n\nIt is the idea behind the mantra we come back to again and again: “Eat less, walk more.”',
      },
      {
        heading: 'Where medicines help',
        body:
          'Alongside a healthy lifestyle, we sometimes prescribe medicines, and they do different jobs for different women. Depending on what you need, medicines can help regulate your periods, ease acne and unwanted hair, improve insulin resistance, and support your chances of pregnancy.\n\nThese are always tailored to you and taken as prescribed. Lifestyle and medicine work best hand in hand — not one instead of the other.',
      },
      {
        heading: 'Why regular treatment matters',
        body:
          'PCOS is easy to put off, especially when symptoms come and go. But left unmanaged over the long term, it can raise the risk of other health problems — including diabetes, high blood pressure, and high cholesterol. It can make pregnancy more complicated. And if periods are absent for a long time, that in itself can increase the risk of uterine cancer.\n\nNone of this is meant to worry you. It is simply why we treat PCOS as an ongoing partnership, with regular follow-up, rather than a one-time fix.',
      },
      {
        heading: 'When to come and see us',
        body:
          'It is worth booking a visit with our team at IVF Master in Sangli if you have not had a period for more than three months and you are not pregnant, if you have very heavy or prolonged bleeding, or if you have been trying to conceive without success. Rapid weight gain, severe acne, or a noticeable increase in facial hair are also good reasons to check in.\n\nThe earlier we understand your PCOS, the more we can do to keep you well — now and in the years ahead.',
      },
    ],
    keyTakeaways: [
      'PCOS is a common hormonal condition — and it is treatable.',
      'A healthy lifestyle is the most important treatment: good food, regular exercise, and even a little weight loss can improve periods and fertility.',
      'The mantra to remember is “Eat less, walk more.” — with prescribed medicines added when they are needed.',
      'Untreated PCOS can raise the long-term risk of diabetes, high blood pressure, high cholesterol, and pregnancy problems.',
      'Regular follow-up matters, and most women with PCOS go on to live healthy, full lives.',
    ],
    relatedSlugs: ['male-fertility-explained', 'age-and-ivf-success', 'what-ivf-really-is'],
  },

  /* ─── 3. Male fertility, explained ───────────────────────────────────────*/
  {
    slug:     'male-fertility-explained',
    title:    'Male fertility, explained',
    category: 'Conditions',
    excerpt:  'Male-factor infertility is common and often very treatable. The causes, the simple checks, and what men can do to help — explained clearly and kindly.',
    date:     '2025-12-05',
    readTime: 5,
    coverImage: maleFertilityCover,
    intro:
      'When a couple is finding it hard to conceive, it is not only a question for the woman. Male-factor infertility — when a man has difficulty helping his partner conceive after about a year of trying, with regular unprotected sex — is common, and it deserves the same care and attention. The encouraging news is that it is often very treatable. Here is what can affect male fertility, how we check it, and what you can do to help.',
    sections: [],
    keyTakeaways: [],
    relatedSlugs: ['pcos', 'what-ivf-really-is', 'ivf-myths-vs-facts'],
  },

  /* ─── 4. Recurrent pregnancy loss ─────────────────────────────────────── */
  {
    slug:     'recurrent-pregnancy-loss',
    title:    'Recurrent pregnancy loss',
    category: 'Conditions',
    excerpt:  'Recurrent miscarriage — two or more losses — is more common than many realise, and a healthy pregnancy is often still possible. The causes, tests, and treatment.',
    date:     '2026-01-18',
    readTime: 5,
    coverImage: recurrentPregnancyLossCover,
    intro:
      'Losing a pregnancy is painful in a way that is hard to put into words, and losing more than one can feel frightening and lonely. Recurrent pregnancy loss — having two or more miscarriages — is more common than many people realise. If it is happening to you, please hold on to this first: in many cases, a healthy pregnancy is still very possible. Understanding why it is happening is the most helpful place to begin.',
    sections: [],
    keyTakeaways: [],
    relatedSlugs: ['unexplained-infertility', 'age-and-ivf-success', 'what-ivf-really-is'],
  },

  /* ─── 5. Unexplained infertility ──────────────────────────────────────── */
  {
    slug:     'unexplained-infertility',
    title:    'Unexplained infertility',
    category: 'Conditions',
    excerpt:  'All the tests come back normal, yet pregnancy is not happening. "Unexplained infertility" is not a diagnosis of nothing.',
    date:     '2026-02-14',
    readTime: 7,
    intro:
      'You have had the tests. Ovulation is confirmed, the tubes are clear, the semen analysis is normal. And yet, month after month, pregnancy does not happen. "Unexplained infertility" is a phrase that frustrates nearly everyone who hears it — because it sounds like the doctor has given up, when the truth is that modern fertility investigation has real limits. Here is what unexplained infertility actually means, and what we do next.',
    sections: [],
    keyTakeaways: [],
    relatedSlugs: ['recurrent-pregnancy-loss', 'what-ivf-really-is', 'age-and-ivf-success'],
  },

  /* ─── 6. Age and IVF success ──────────────────────────────────────────── */
  {
    slug:     'age-and-ivf-success',
    title:    'Age and IVF success',
    category: 'Understanding IVF',
    excerpt:  'Age is one of the most important factors in fertility — but it is not the only one, and 40 is not a closed door.',
    date:     '2026-03-22',
    readTime: 8,
    intro:
      'Age and fertility is a conversation that makes many women uncomfortable — understandably, because it is often delivered as a warning or a deadline. But understanding how age affects fertility, and what this means in practical terms for treatment, allows for much better decisions. Age matters. It is not the only thing that matters, and it does not make the conversation simple.',
    sections: [],
    keyTakeaways: [],
    relatedSlugs: ['what-ivf-really-is', 'pcos', 'ivf-myths-vs-facts'],
  },

  /* ─── 7. IVF myths vs facts ───────────────────────────────────────────── */
  {
    slug:     'ivf-myths-vs-facts',
    title:    'IVF myths vs facts',
    category: 'Myths',
    excerpt:  'Myths about IVF spread faster than facts. Here is what is actually true — in plain language, without the dramatics.',
    date:     '2025-09-10',
    readTime: 10,
    intro:
      'Almost everyone who comes to us carrying a fertility question has also carried a collection of myths about IVF — things overheard, things read online, things a well-meaning relative said. Most myths start with a grain of something real and then grow in a direction that makes people more anxious than they need to be. Here is what is actually true.',
    sections: [],
    keyTakeaways: [],
    relatedSlugs: ['what-ivf-really-is', 'age-and-ivf-success', 'pcos'],
  },
]

export const CATEGORIES: ReadonlyArray<ArticleCategory | 'All'> = [
  'All',
  'Understanding IVF',
  'Conditions',
  'Myths',
]

export const CATEGORY_STYLES: Readonly<Record<ArticleCategory, { bg: string; color: string; accentBg: string; accentEdge: string }>> = {
  'Understanding IVF': {
    bg:         'rgba(100,120,200,0.10)',
    color:      'rgba(72,96,160,0.90)',
    accentBg:   'rgba(100,120,200,0.08)',
    accentEdge: 'rgba(100,120,200,0.40)',
  },
  'Conditions': {
    bg:         'rgba(226,132,156,0.12)',
    color:      'rgba(194,78,106,0.90)',
    accentBg:   'rgba(226,132,156,0.08)',
    accentEdge: 'rgba(226,132,156,0.50)',
  },
  'Myths': {
    bg:         'rgba(148,100,200,0.10)',
    color:      'rgba(120,72,168,0.90)',
    accentBg:   'rgba(148,100,200,0.07)',
    accentEdge: 'rgba(148,100,200,0.40)',
  },
}
