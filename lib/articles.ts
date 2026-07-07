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
  /* When set, the article's text (title, excerpt, intro, headings, lists,
   * takeaways, meta) is read from next-intl under EducateIVF.articles.<i18nKey>
   * rather than the literal English strings above. This is how a fully
   * translated article (EN + MR) is wired without duplicating copy in code. */
  readonly i18nKey?:      string
}

export const ARTICLES: ReadonlyArray<Article> = [

  /* ─── 1. What IVF really is ───────────────────────────────────────────── */
  {
    slug:     'what-ivf-really-is',
    title:    'Understanding IVF: a guide for your journey',
    category: 'Understanding IVF',
    excerpt:  'Most people have heard of IVF. Far fewer know what it actually involves — and how much gentler it is than its reputation suggests.',
    date:     '2025-10-15',
    readTime: 9,
    coverImage: ivfCover,
    i18nKey:  'what-ivf-really-is',
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

  /* ─── 2. PCOS ──────────────────────────────────────────────────────────
   * Fully translated (EN + MR): all copy lives in messages under
   * EducateIVF.articles.pcos and is rendered by the bespoke 'pcos' body
   * variant. The strings below are English fallbacks only. */
  {
    slug:       'pcos',
    title:      'PCOS',
    category:   'Conditions',
    excerpt:    'A common, treatable hormonal condition that can affect your periods and fertility. The signs to watch for, why it happens, and how we treat it.',
    date:       '2025-11-20',
    readTime:   4,
    coverImage: pcosCover,
    i18nKey:    'pcos',
    intro:
      'PCOS (Polycystic Ovary Syndrome) — now also called PMOS (Polyendocrine Metabolic Ovarian Syndrome). PCOS is a common condition that affects a woman\'s hormones. It can make periods irregular and may make it harder to become pregnant. It can also cause weight gain, acne, and extra hair growth on the face or body. PCOS can be treated, and most women with PCOS can live a healthy life.',
    sections: [],
    relatedSlugs: ['male-fertility', 'age-and-ivf-success', 'what-ivf-really-is'],
  },

  /* ─── 3. Male fertility, explained ───────────────────────────────────────*/
  {
    slug:     'male-fertility',
    title:    'Male infertility',
    category: 'Conditions',
    excerpt:  'Male-factor infertility is common and often very treatable. The causes, the simple checks, and what men can do to help — explained clearly and kindly.',
    date:     '2025-12-05',
    readTime: 4,
    coverImage: maleFertilityCover,
    i18nKey:  'male-fertility',
    intro:
      'When a couple is finding it hard to conceive, it is not only a question for the woman. Male-factor infertility — when a man has difficulty helping his partner conceive after about a year of trying, with regular unprotected sex — is common, and it deserves the same care and attention. The encouraging news is that it is often very treatable. Here is what can affect male fertility, how we check it, and what you can do to help.',
    sections: [
      {
        heading: 'What male-factor infertility means',
        body:
          'Doctors talk about male-factor infertility when a man has trouble helping his partner become pregnant after about a year of trying, with regular unprotected sex. It is one of the common reasons a couple does not conceive as quickly as they hoped — and, importantly, it is a shared part of the journey, not a fault for anyone to carry alone.',
      },
      {
        heading: 'What can cause it',
        body:
          'Male fertility can be affected by a number of things. Some of the more common are a low sperm count, or sperm that are weak or slow-moving. There can be a blockage in the tubes that carry sperm, an infection, or a problem with hormones.\n\nEveryday factors matter too. Smoking, alcohol, recreational drugs, and some medicines can all play a part, as can being overweight. Another common — and very treatable — cause is a varicocele, which is a group of swollen veins around the testicles.',
      },
      {
        heading: 'Why it often goes unnoticed',
        body:
          'One of the trickiest things about male-factor infertility is that most men have no symptoms at all. Everything can feel completely normal. Often the only sign is the very thing that brings a couple to us in the first place: difficulty having a baby.\n\nThat is exactly why a simple test matters so much — it can reveal something that nothing else would.',
      },
      {
        heading: 'How we check male fertility',
        body:
          'Checking male fertility is straightforward and gentle. It usually begins with a physical examination and a semen test, which looks at the sperm. We may also do blood tests to check hormones and general health, and an ultrasound if it is needed.\n\nNone of this is complicated or uncomfortable, and together it gives us a clear picture of what, if anything, is getting in the way.',
      },
      {
        heading: 'Can it be treated?',
        body:
          'Yes — and this is the part worth holding on to. Male-factor infertility can very often be treated, and what we suggest depends on the cause. Sometimes it is medicines. Sometimes it is a minor surgery, if that is what is needed. Often, healthy lifestyle changes make a real difference. And when it helps, fertility treatments can bridge the gap.\n\nMany men who come to us with a fertility concern go on to become fathers.',
      },
      {
        heading: 'What men can do to help',
        body:
          'Alongside any treatment, there is a lot within your own control that supports healthier sperm. Stopping smoking and tobacco is one of the most valuable steps. Limiting or avoiding alcohol helps, as does eating well, exercising regularly, and keeping to a healthy weight. Getting enough sleep matters more than most people expect. And it is worth avoiding too much heat around the testicles.\n\nNone of these are dramatic changes, but together they can genuinely tip things in your favour — and they are good for you in every other way too.',
      },
      {
        heading: 'When to see a doctor',
        body:
          'It is a good idea to speak with a doctor if you have been trying for a baby for a year without success, if you have any problems with erection or ejaculation, or if you notice pain or swelling in the testicles.\n\nAsking early does not commit you to anything. It simply means you understand what is going on, and what your options are.',
      },
    ],
    keyTakeaways: [
      'Male-factor infertility is common — it is part of the picture for many couples who struggle to conceive.',
      'Most men have no symptoms; often the only sign is difficulty having a baby.',
      'A simple physical check and semen test usually reveal the cause.',
      'It is very often treatable, and many men go on to become fathers.',
    ],
    relatedSlugs: ['pcos', 'what-ivf-really-is', 'ivf-myths-vs-facts'],
  },

  /* ─── 4. Recurrent pregnancy loss ─────────────────────────────────────── */
  {
    slug:     'recurrent-pregnancy-loss',
    title:    'Recurrent pregnancy loss',
    category: 'Conditions',
    excerpt:  'Recurrent miscarriage — two or more losses — is more common than many realise, and a healthy pregnancy is often still possible. The causes, tests, and treatment.',
    date:     '2026-01-18',
    readTime: 3,
    coverImage: recurrentPregnancyLossCover,
    i18nKey:  'recurrent-pregnancy-loss',
    intro:
      'Losing a pregnancy is painful in a way that is hard to put into words, and losing more than one can feel frightening and lonely. Recurrent pregnancy loss — having two or more miscarriages — is more common than many people realise. If it is happening to you, please hold on to this first: in many cases, a healthy pregnancy is still very possible. Understanding why it is happening is the most helpful place to begin.',
    sections: [
      {
        heading: 'What recurrent pregnancy loss means',
        body:
          'Recurrent pregnancy loss simply means having two or more miscarriages. It is more common than most people expect — many couples who go through it have never heard anyone else speak about it, which can make it feel lonelier than it should.\n\nIt is also not the end of the road. For many couples, a healthy pregnancy is still very much within reach, especially with the right care and follow-up.',
      },
      {
        heading: 'Why it can happen',
        body:
          'There is rarely a single reason, and often it is a mix of things. The most common cause is a problem with the baby’s chromosomes — something that happens by chance as an embryo forms, and not because of anything either partner did.\n\nOther causes include the shape of the uterus, hormone problems such as thyroid disease or diabetes, and certain blood-clotting or immune conditions. And sometimes, even after careful testing, no clear cause is found — which can be frustrating, but does not mean nothing can be done.',
      },
      {
        heading: 'The tests we may suggest',
        body:
          'To understand what is going on, we usually start with blood tests that look for conditions linked to pregnancy loss, and an ultrasound to check the uterus. Depending on your history, we may test for particular medical conditions and arrange specialised blood tests — including checks for APLAS, ANA, ENA, or thrombophilia markers, which relate to clotting and immune causes.\n\nIn some situations, genetic tests are helpful, either for both partners or on the pregnancy tissue itself. The aim of all of it is simple: to find anything treatable, so that the next pregnancy has the best possible support.',
      },
      {
        heading: 'How it is treated',
        body:
          'The reassuring news is that recurrent pregnancy loss can often be treated, and the approach depends on what we find.\n\nIf a hormone problem such as thyroid disease or diabetes is involved, or a blood-clotting disorder, medicines can help manage it. If there is a problem with the shape of the uterus, surgery can sometimes correct it. And in every case, close monitoring through the next pregnancy — staying near you and watching carefully — is part of giving it the best chance.',
      },
      {
        heading: 'The chances of a healthy pregnancy',
        body:
          'This is the part we most want couples to hear. Most women who experience recurrent pregnancy loss go on to have a healthy baby — especially with proper medical care and regular follow-up.\n\nA run of losses does not mean you cannot have a successful pregnancy. For many couples, it is the beginning of finding the right support, not the end of the hope of a family.',
      },
      {
        heading: 'When to see a doctor',
        body:
          'If you have had two or more miscarriages, it is worth seeing an obstetrician or fertility specialist. You do not need to keep wondering on your own.\n\nEarly care and steady support genuinely improve the chances of a healthy pregnancy — and just as importantly, they mean you do not have to carry this alone.',
      },
    ],
    keyTakeaways: [
      'Recurrent pregnancy loss means two or more miscarriages — and it is more common than many realise.',
      'Causes range from the baby’s chromosomes to the shape of the uterus, hormone problems, and clotting or immune conditions; sometimes no cause is found.',
      'Many of the causes are treatable, and close monitoring supports the next pregnancy.',
      'Most women with recurrent pregnancy loss go on to have a healthy baby with the right care.',
    ],
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
    sections: [
      {
        heading: 'What "unexplained" really means',
        body:
          'Unexplained infertility is a clinical label applied when standard investigations find no identifiable cause. It accounts for roughly 25 to 30% of infertility cases — a significant number.\n\nThe important word here is "standard." A normal semen analysis, confirmed ovulation, open tubes, and a normal uterine cavity are the things that routine testing checks. But these tests do not measure everything. They do not assess the quality of the egg at a molecular level, the precise environment of the fallopian tube, the subtle interaction between sperm and egg, or the quality of early embryo development. Any of these, or a combination, might be the missing piece.',
      },
      {
        heading: 'Why tests do not catch everything',
        body:
          'Consider what a semen analysis measures: count, motility, and morphology. It does not measure sperm DNA fragmentation — damage at the genetic level inside individual sperm — which can be present in semen that looks normal in every standard parameter and yet impairs fertilisation or early embryo development.\n\nSimilarly, a normal ovulation test confirms that an egg is being released each month. It does not confirm that the egg is of sufficient quality to develop into a healthy embryo. Egg quality is one of the most significant factors in fertility, and it is also one of the least visible from the outside.',
      },
      {
        heading: 'What we look at more closely',
        body:
          'When standard investigations are normal, we consider whether further investigation is warranted. This might include a sperm DNA fragmentation test, a more detailed assessment of the uterine lining, or tracking several cycles more carefully to understand ovulation timing with greater precision.\n\nWe also look at the picture as a whole: how long has conception been attempted, how old are both partners, are cycles regular, has there been any previous pregnancy? The answers shape the next steps.',
      },
      {
        heading: 'Treatment options',
        body:
          'For couples with unexplained infertility, the treatment approach is usually stepwise.\n\nIf the duration of trying has been relatively short and age is on your side, a period of supported expectant management — trying naturally with optimised timing — is sometimes appropriate.\n\nIUI (intrauterine insemination) is a gentle first treatment that increases the concentration of sperm in the right place at the right time. It adds a small but meaningful benefit over natural conception and is low in burden.\n\nIVF is the most effective intervention for unexplained infertility and often works when nothing else visible explains why conception has not occurred. Crucially, IVF also gives us information — we can see how the eggs fertilise, how the embryos develop, and how many reach a viable stage. This information sometimes reveals what the standard tests could not.',
      },
      {
        heading: 'The emotional weight of "unexplained"',
        body:
          'For many couples, not having an explanation is almost harder than having a diagnosis. A named condition feels fixable; uncertainty feels endless. If this is where you are, that feeling is completely understandable and very common.\n\nWe take unexplained infertility seriously. It is not "nothing is wrong." It is "we have not yet found the specific reason" — and there are real, evidence-based steps we can take regardless.',
      },
    ],
    keyTakeaways: [
      '"Unexplained" means no cause was found in standard investigations — not that nothing is wrong or that pregnancy is impossible.',
      'Standard tests do not measure everything, including sperm DNA fragmentation and detailed egg quality.',
      'IVF is often very effective for unexplained infertility and also gives valuable diagnostic information.',
      'Most couples with unexplained infertility do go on to achieve pregnancy with appropriate treatment.',
    ],
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
    sections: [
      {
        heading: 'How eggs age',
        body:
          'Women are born with all the eggs they will ever have. Over time, both the number and quality of eggs decline. What we mean by "egg quality" is the integrity of the chromosomes inside each egg — the genetic blueprint that, once fertilised, guides the development of the embryo.\n\nAs eggs age, they become more susceptible to chromosomal errors. An embryo with the wrong number of chromosomes will either not implant, miscarry early, or (in some cases) develop with a chromosomal condition. This is why the risk of miscarriage increases with age, and why the proportion of IVF cycles that result in a healthy birth also changes.',
      },
      {
        heading: 'The numbers, honestly',
        body:
          'The likelihood of a live birth per IVF cycle using a woman\'s own eggs is significantly higher in the early 30s than in the early 40s. This is a real difference, and any clinic that does not acknowledge it is not being honest with you.\n\nAt the same time, IVF success rates represent averages across large populations. Individual results depend on egg reserve, embryo quality, uterine health, and a range of other factors that vary between women of the same age. A 38-year-old with a good ovarian reserve and healthy embryos may have much better prospects than average; a 34-year-old with diminished reserve may face greater challenges. Age is a guide, not a verdict.',
      },
      {
        heading: 'What we look at beyond age',
        body:
          'Two key tests give us a more personalised picture:\n\nAMH (anti-Mullerian hormone) is a blood test that reflects the current size of your egg reserve — how many eggs are likely to respond to stimulation. It does not directly measure quality, but it does help us predict how an IVF cycle is likely to go and calibrate the stimulation protocol.\n\nAFC (antral follicle count) is an ultrasound measurement of the number of resting follicles visible at the start of a cycle. Together with AMH, it gives a much more individualised view than age alone.',
      },
      {
        heading: 'Options in your 30s',
        body:
          'For women in their 30s who are thinking ahead, ovarian reserve testing gives useful information. If AMH is declining earlier than expected, this knowledge can be important for decision-making — whether about when to start trying, whether to consider egg freezing, or whether earlier investigation is warranted.\n\nFor those already trying to conceive in their 30s, the threshold for seeking help is lower than it used to be — we recommend a referral after six months of trying at age 35 or older, rather than the standard twelve months for younger women.',
      },
      {
        heading: 'Options in your 40s',
        body:
          'IVF with a woman\'s own eggs is possible in the early 40s, though success rates are lower and multiple cycles are sometimes needed. Preimplantation genetic testing (PGT) — testing embryos before transfer — can identify chromosomally normal embryos and significantly improve the chance of a successful pregnancy when good-quality embryos are available.\n\nFor women in their mid to late 40s, or those for whom own-egg IVF has not been successful, donor egg IVF is an option with high success rates regardless of the recipient\'s age. Using eggs from a younger donor restores much of the age-related decline in egg quality. This is a deeply personal decision, and we support couples through it with care and without judgement.',
      },
      {
        heading: '40 is not a closed door',
        body:
          'Successful pregnancies through IVF — and natural conception — happen in women in their 40s every day. The conversation is not about whether it is possible; it is about what approach is most likely to succeed for this particular person, at this particular time.\n\nIf you are in your 40s and wondering whether it is too late to ask: it is not. The answer to your specific question requires your specific information, and that conversation is worth having.',
      },
    ],
    keyTakeaways: [
      'Egg quality declines with age, which is why older women have lower IVF success rates with their own eggs on average.',
      'AMH and antral follicle count give a much more personalised picture than age alone.',
      'Preimplantation genetic testing (PGT) can improve the success rate of each transfer by identifying chromosomally normal embryos.',
      'Donor egg IVF offers high success rates for women whose own eggs are no longer giving good results.',
      'Many women over 40 do go on to have healthy babies, through both natural conception and IVF.',
    ],
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
    sections: [
      {
        heading: 'IVF always results in twins or triplets',
        body:
          'This was true — and a real concern — when IVF was newer and two or three embryos were routinely transferred at once to improve the odds of at least one implanting. Modern practice is different.\n\nToday, a single embryo transfer is standard in most cases. The embryo is carefully selected for quality, and transferring one at a time reduces the risks that come with multiple pregnancies — to mother and babies — without significantly reducing the chance of success. Most IVF pregnancies result in a single baby.',
      },
      {
        heading: 'IVF is extremely painful',
        body:
          'The reputation for pain comes largely from the hormone injections of stimulation and the egg collection procedure. Both deserve honest comment.\n\nThe injections are self-administered at home with fine needles. Most people find them much less daunting once they have done the first one — mild stinging and bruising at the injection site is the most common experience.\n\nEgg collection is done under light sedation — you are not conscious during the procedure. Some cramping and tiredness in the hours afterwards is normal. By the next day, most people feel well enough to resume normal activity.\n\nThe embryo transfer is usually painless — it is similar to a smear test.',
      },
      {
        heading: 'IVF babies are not as healthy as other babies',
        body:
          'This is not supported by the evidence. Millions of IVF children have now been followed through childhood and into adulthood, and the large-scale studies consistently show that health and development outcomes are comparable to those of naturally conceived children.\n\nThere is a slightly elevated risk of low birth weight in IVF pregnancies, which is largely attributable to the higher proportion of multiple pregnancies in older data (since twins are smaller on average). As single embryo transfer has become standard, this difference has become less significant.',
      },
      {
        heading: 'You must rest completely after the embryo transfer',
        body:
          'This was once a standard instruction and is still sometimes given. The evidence does not support it.\n\nMultiple good-quality studies have compared bed rest after embryo transfer with normal activity, and they consistently show no benefit to bed rest — and some suggestion of harm, possibly because prolonged immobility affects blood flow. Normal daily activity is not only permitted after transfer; it is actively encouraged. We ask patients to avoid heavy lifting and intense exercise for a short period, but ordinary life continues.',
      },
      {
        heading: 'IVF is only about the woman',
        body:
          'This is perhaps the most persistent and most harmful of the myths, because it means that many men never have a proper fertility investigation.\n\nMale factor infertility accounts for roughly half of all fertility challenges, either as the sole cause or as a contributing factor. A semen analysis should be one of the first tests done when any couple is investigated — it is simple, quick, and gives essential information. The fertility journey is a joint one, and the investigation and treatment should reflect that.',
      },
      {
        heading: 'If IVF fails once, it will probably always fail',
        body:
          'Not at all. A failed cycle gives us information: about how the ovaries responded to stimulation, how embryos developed, and whether there are factors to address before the next attempt. Protocols are adjusted between cycles, and for many couples the second or third cycle is the successful one.\n\nThat said, we give honest expectations from the start. Some people do need multiple cycles; this is part of a realistic conversation, not a failure of optimism.',
      },
      {
        heading: 'IVF increases the risk of cancer',
        body:
          'This concern — particularly about ovarian and breast cancer — has been studied extensively. Large-scale studies following women who have had IVF treatment over many years do not show an increased risk of cancer attributable to IVF or fertility medications.\n\nIt is worth noting that infertility itself is associated with some conditions that carry a slightly elevated cancer risk. When researchers control for this, the IVF signal largely or completely disappears. The medications used in IVF are safe at the doses and durations used.',
      },
      {
        heading: 'Age does not matter if you use IVF',
        body:
          'IVF cannot reverse the effect of age on egg quality. It can optimise everything else, but if the eggs themselves are of reduced quality due to age, IVF success rates will reflect that.\n\nThis does not mean older women should not pursue IVF — it means that age is an honest part of the conversation, alongside individual reserve, embryo quality, and other factors. Donor egg IVF is one of the options available when a woman\'s own eggs are no longer giving good results, and it has high success rates regardless of the recipient\'s age.',
      },
      {
        heading: 'You have to try for years before getting help',
        body:
          'This is a common misconception rooted in the general guidance that healthy couples under 35 may take up to twelve months to conceive naturally. But this is not a waiting room everyone has to sit in.\n\nIf you have irregular periods, a known condition like PCOS or endometriosis, a history of pelvic infection, or a partner with known sperm issues, earlier investigation is appropriate. If you are 35 or older, six months is the threshold for seeking an assessment. And if you simply feel that something is not right, a conversation with a specialist is never premature.',
      },
      {
        heading: 'IVF is always a last resort',
        body:
          'IVF is the most effective treatment available for many types of infertility, and waiting until every other option has been exhausted before considering it is not always in a couple\'s best interest — particularly as age is a factor.\n\nIVF is not a failure. It is a tool, and like any tool, it is most useful when used at the right time. The decision about when IVF is appropriate is an individual one, based on the full picture of each couple\'s situation.',
      },
    ],
    keyTakeaways: [
      'Single embryo transfer is now standard — most IVF pregnancies result in a single baby.',
      'IVF babies have comparable health and development outcomes to naturally conceived children.',
      'Bed rest after embryo transfer is not recommended; normal activity is fine.',
      'Male factor infertility is just as common as female factor and deserves equal investigation.',
      'Large studies show no increased cancer risk from IVF or fertility medications.',
    ],
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
