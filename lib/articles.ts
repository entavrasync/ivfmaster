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
  readonly coverImage?:   string
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
    relatedSlugs: ['ivf-myths-vs-facts', 'age-and-ivf-success', 'understanding-pcos'],
  },

  /* ─── 2. Understanding PCOS ───────────────────────────────────────────── */
  {
    slug:     'understanding-pcos',
    title:    'Understanding PCOS',
    category: 'Conditions',
    excerpt:  'PCOS is one of the most common hormonal conditions in women of reproductive age — and one of the most misunderstood.',
    date:     '2025-11-20',
    readTime: 8,
    intro:
      'Polycystic ovary syndrome (PCOS) affects roughly one in ten women of reproductive age, making it one of the most common hormonal conditions we see. It is also one of the most misunderstood — not least because it looks different in different women, and because advice like "just lose a little weight and exercise more" often leaves women feeling blamed rather than helped. Here is what PCOS actually is, how it is diagnosed, and what treatment really looks like.',
    sections: [
      {
        heading: 'What PCOS actually is',
        body:
          'Despite the name, PCOS is not primarily a condition of cysts on the ovaries. It is a hormonal condition in which the ovaries produce slightly too much androgen (a group of hormones often called "male hormones," though all women have them). This hormonal imbalance disrupts ovulation — the monthly release of an egg — and it is this disruption that causes most of the symptoms and fertility challenges associated with PCOS.\n\nThe "polycystic" appearance on ultrasound — many small follicles clustered at the edge of the ovary — is a common finding, but it is not present in all women with PCOS, and it can be present in women who do not have the condition.',
      },
      {
        heading: 'Signs that might point to PCOS',
        body:
          'PCOS is a spectrum, and women experience it very differently. The most common signs include:\n\nIrregular or absent periods — if your cycle is consistently shorter than 21 days or longer than 35, or if periods are unpredictable or have stopped altogether, this is worth investigating.\n\nExcess hair growth (hirsutism) — on the face, chest, or abdomen, driven by elevated androgens.\n\nAcne or oily skin — particularly if it persists beyond the teenage years or is unresponsive to usual treatments.\n\nDifficulty losing weight, or unexplained weight gain, particularly around the abdomen.\n\nDifficulty getting pregnant — irregular ovulation means the timing for conception is harder to predict.\n\nNot all women with PCOS have all of these signs. Some have very subtle symptoms and only discover the diagnosis when they are investigated for fertility challenges.',
      },
      {
        heading: 'Why PCOS happens',
        body:
          'The exact cause of PCOS is not fully understood, but two factors are central to most cases: insulin resistance and excess androgen production.\n\nInsulin resistance means the body\'s cells do not respond normally to insulin. The body compensates by producing more insulin, and this excess insulin in turn stimulates the ovaries to produce more androgens. This creates a cycle that disrupts ovulation and contributes to many of the physical signs of PCOS.\n\nThere is also a genetic component — PCOS tends to run in families. If your mother, sister, or aunt has PCOS or type 2 diabetes (a condition closely linked to insulin resistance), your own risk is higher.',
      },
      {
        heading: 'How we diagnose it',
        body:
          'PCOS is diagnosed using what is called the Rotterdam criteria — a diagnosis requires at least two of the following three features:\n\n1. Irregular or absent ovulation (irregular or infrequent periods).\n2. Signs of elevated androgens — either on a blood test, or physically (excess hair, acne).\n3. Polycystic-appearing ovaries on ultrasound.\n\nWe also rule out other conditions that can look similar — thyroid problems, high prolactin levels, and other hormonal disorders. A straightforward blood panel and a pelvic ultrasound are usually enough to give us a clear picture.',
      },
      {
        heading: 'Treatment — lifestyle first, always',
        body:
          'For women with PCOS who are overweight, even a modest weight loss — around 5 to 10% of body weight — can restore regular ovulation and significantly improve fertility. This is genuinely the most powerful intervention available for many women, and it is important to say this clearly: not as a criticism, but because it is true and because understanding why it works can be motivating.\n\nThat said, "just eat less and walk more" is inadequate advice. PCOS makes weight management harder — insulin resistance increases hunger and promotes fat storage. Women with PCOS often need a genuinely different dietary approach (lower in refined carbohydrates, higher in protein and fibre) and a realistic, sustainable plan for exercise. We do not blame women for finding this difficult. We help them find what works.',
      },
      {
        heading: 'When lifestyle is not enough',
        body:
          'When lifestyle changes alone do not restore ovulation, the next step is usually medication. Letrozole (an aromatase inhibitor) is now the first-choice medication to induce ovulation in women with PCOS, and it is effective for many women. Metformin, originally developed for type 2 diabetes, helps with insulin resistance and can improve ovulation and hormone levels.\n\nIf medication does not establish regular ovulation, or if there are other fertility factors involved, IVF is an excellent option for women with PCOS. Because PCOS ovaries contain many follicles, stimulation often produces a good number of eggs — though we monitor carefully to prevent ovarian hyperstimulation syndrome (OHSS), a complication of stimulation that is more common in PCOS.',
      },
      {
        heading: 'When to come and see us',
        body:
          'If you have any of the signs above, or if you have been trying to conceive for more than six months with irregular periods, a conversation with a specialist is worthwhile. PCOS is extremely manageable — most women with PCOS who want to conceive go on to do so, with the right support. The earlier we understand what your particular version of PCOS looks like, the better we can tailor the approach.',
      },
    ],
    keyTakeaways: [
      'PCOS is a hormonal condition that disrupts ovulation — it is not primarily about cysts.',
      'It looks different in different women; not everyone has all the classic signs.',
      'Lifestyle changes are the most powerful first treatment for many women, especially those with insulin resistance.',
      'Most women with PCOS who want to conceive go on to do so, with appropriate support.',
      'IVF is highly effective in PCOS, and specialist monitoring reduces the risk of complications.',
    ],
    relatedSlugs: ['male-fertility-explained', 'age-and-ivf-success', 'what-ivf-really-is'],
  },

  /* ─── 3. Male fertility, explained ───────────────────────────────────────*/
  {
    slug:     'male-fertility-explained',
    title:    'Male fertility, explained',
    category: 'Conditions',
    excerpt:  'About half of all fertility challenges involve the man. Yet male fertility is still the less-talked-about half of the conversation.',
    date:     '2025-12-05',
    readTime: 7,
    intro:
      'When a couple comes to us having struggled to conceive, our first job is to understand both partners. Male factor infertility accounts for roughly half of all cases — sometimes as the primary cause, sometimes as one part of a combined picture. Yet in most couples, the investigation of the male side takes five minutes and a small plastic container. A semen analysis is quick and simple, and the information it gives us is invaluable. Here is what male fertility involves, what can go wrong, and what can be done.',
    sections: [
      {
        heading: 'What a semen analysis tells us',
        body:
          'A semen analysis measures several things at once. The most important are:\n\nSperm count — how many sperm are present per millilitre of semen. A count below 16 million per millilitre is considered low.\n\nMotility — the percentage of sperm that are swimming, and how well. Sperm need to be able to swim vigorously in the right direction to reach and fertilise an egg.\n\nMorphology — the shape of the sperm. Even in fertile men, many sperm have unusual shapes; what matters is the proportion that are normal.\n\nThe result is rarely black and white. A man with a low count may have excellent motility; a man with normal count may have poor morphology. We look at the whole picture, not any single number.',
      },
      {
        heading: 'What can affect sperm quality',
        body:
          'Sperm quality is sensitive to a wide range of factors, many of which are modifiable:\n\nHeat is one of the most significant — the testicles sit outside the body for a reason, and prolonged heat exposure (hot baths, saunas, heated car seats, laptops on the lap) can suppress sperm production for several months.\n\nLifestyle factors — smoking, heavy alcohol consumption, anabolic steroids, obesity, and chronic stress all have measurable negative effects on sperm parameters.\n\nVaricocele — enlarged veins in the scrotum — is one of the most common and treatable causes of male infertility. It raises testicular temperature and is present in about 40% of men investigated for infertility.\n\nHormonal imbalances, genetic conditions, previous infections (particularly mumps orchitis in adulthood), and prior surgery can all affect sperm production.',
      },
      {
        heading: 'When there is no sperm at all',
        body:
          'Azoospermia — the complete absence of sperm in the ejaculate — sounds final but often is not. It can be "obstructive" (the sperm are being produced but cannot reach the ejaculate, due to a blockage) or "non-obstructive" (the testicles are producing very little or no sperm).\n\nIn obstructive azoospermia, surgical sperm retrieval — a minor procedure to collect sperm directly from the testicle or epididymis — is often successful, and the retrieved sperm can be used with ICSI to fertilise eggs. Even in non-obstructive azoospermia, sperm are sometimes found with more advanced retrieval techniques. These cases require careful discussion with a specialist, but they are not all hopeless.',
      },
      {
        heading: 'What men can do to improve sperm health',
        body:
          'Because sperm take around 74 days to develop, changes made today will begin to show in the semen analysis about three months from now. The most evidence-based steps are:\n\nStopping smoking and limiting alcohol. Reaching and maintaining a healthy weight. Avoiding prolonged heat exposure. Managing stress where possible. Taking a good antioxidant supplement (look for one containing zinc, selenium, CoQ10, and vitamin C). Not using anabolic steroids or recreational drugs.\n\nThese changes will not fix everything, but for many men they make a meaningful difference — and they improve general health regardless.',
      },
      {
        heading: 'Treatment options',
        body:
          'The treatment depends entirely on what the semen analysis shows and what is causing the problem.\n\nFor mild male factor — slightly reduced count or motility — IUI (intrauterine insemination) can improve the odds of natural fertilisation by concentrating the best-quality sperm and placing them close to the egg.\n\nFor moderate to severe male factor, ICSI (intracytoplasmic sperm injection) is the most powerful tool we have. A single healthy sperm is injected directly into each egg, bypassing the usual fertilisation barriers entirely. ICSI makes pregnancy possible even with very low sperm counts.\n\nFor azoospermia, surgical retrieval followed by ICSI is the pathway. Outcomes depend on sperm quality and egg quality, but many couples do go on to have children via this route.',
      },
      {
        heading: 'A note to the man reading this',
        body:
          'Fertility challenges can feel like they are primarily a women\'s issue. They are not. If your partner is navigating this, so are you — and the investigation and treatment is genuinely a team process, not something one partner does while the other waits. A semen analysis is one of the simplest, least invasive tests in medicine, and it gives us half the picture. We encourage men to be part of the conversation from the very first appointment.',
      },
    ],
    keyTakeaways: [
      'Male factor accounts for roughly half of all fertility challenges — it deserves the same attention as female factor.',
      'A semen analysis is quick, simple, and gives us essential information. It is the right first step for any man whose partner is being investigated.',
      'Many factors affecting sperm quality are modifiable, though changes take around three months to show.',
      'Even with very low or zero sperm count, ICSI and surgical retrieval give many couples a genuine pathway to parenthood.',
    ],
    relatedSlugs: ['understanding-pcos', 'what-ivf-really-is', 'ivf-myths-vs-facts'],
  },

  /* ─── 4. Recurrent pregnancy loss ─────────────────────────────────────── */
  {
    slug:     'recurrent-pregnancy-loss',
    title:    'Recurrent pregnancy loss',
    category: 'Conditions',
    excerpt:  'Losing a pregnancy is one of the most painful things a couple can experience. Losing more than one deserves a careful, compassionate investigation.',
    date:     '2026-01-18',
    readTime: 8,
    intro:
      'Recurrent pregnancy loss is defined as two or more pregnancy losses — though many specialists begin a full investigation after two losses, rather than waiting for a third. It affects about one to two in every hundred couples who are trying to conceive, and it is a cause of profound grief. Most importantly, it is not inevitable. Most couples who experience recurrent loss go on to have a healthy baby. Understanding why it is happening is the most important first step.',
    sections: [
      {
        heading: 'Why pregnancy loss happens',
        body:
          'The most common cause of any individual pregnancy loss — and of recurrent loss — is a chromosomal abnormality in the embryo. When a sperm and egg come together, the resulting embryo should contain 46 chromosomes in the correct configuration. Sometimes an error occurs, producing an embryo that cannot develop to a healthy birth. This is not caused by anything either parent did or did not do; it is a biological error that becomes more common as women age, but can happen at any age.\n\nBeyond chromosomal factors, other causes include: anatomical issues with the uterus (such as a septum, fibroids, or polyps that affect implantation); problems with blood clotting that impair the development of the placenta; immune system factors; and hormonal imbalances. In a significant number of couples — perhaps 40 to 50% — investigations do not find a clear cause.',
      },
      {
        heading: 'The investigation',
        body:
          'A thorough investigation for recurrent pregnancy loss typically includes:\n\nA blood test to assess clotting function — looking particularly for antiphospholipid syndrome, a treatable immune condition associated with pregnancy loss.\n\nA blood test for both partners to check chromosome structure (a karyotype test).\n\nAn ultrasound and possibly a hysteroscopy to look at the inside of the uterus.\n\nHormone tests — thyroid function, prolactin, and others.\n\nThis investigation is not about finding fault or blame. It is about finding information that helps us give the next pregnancy the best possible chance.',
      },
      {
        heading: 'Treatment',
        body:
          'Treatment depends entirely on what the investigation finds.\n\nIf antiphospholipid syndrome is identified, low-dose aspirin and low molecular weight heparin (a blood-thinning injection) during pregnancy significantly reduces the risk of further loss.\n\nIf a uterine abnormality is found — a septum, polyp, or fibroid inside the cavity — surgical treatment can improve outcomes substantially.\n\nIf chromosomal abnormalities in the embryo are suspected, preimplantation genetic testing (PGT) during an IVF cycle allows us to test embryos before transfer and select those with the correct number of chromosomes. This is one of the most powerful tools available for couples with recurrent chromosomal losses.\n\nWhen investigations do not find a specific cause, a supervised pregnancy with close monitoring and sometimes aspirin or progesterone support can still improve outcomes.',
      },
      {
        heading: 'The emotional side',
        body:
          'Loss is loss, and multiple losses carry a compounding weight that is hard to describe. The grief of each individual loss, the anxiety of each new pregnancy, the exhaustion of hoping and being disappointed — these are not small things. We do not expect couples to approach investigation and treatment clinically and without emotion.\n\nWhat we do expect is to be alongside you through this — to answer your questions honestly, to explain what we know and acknowledge what we do not, and to make sure you never feel like just a case number.',
      },
      {
        heading: 'Reason for hope',
        body:
          'The most important thing we want couples going through recurrent loss to know is this: most of them go on to have a healthy baby. Even without a clear cause being found, the majority of couples who experience recurrent loss have a successful pregnancy — often with careful monitoring and support during the next attempt.\n\nThe investigation and treatment journey is hard. But for most couples who walk through it with us, the destination is the one they hoped for.',
      },
    ],
    keyTakeaways: [
      'Most individual pregnancy losses — and many recurrent losses — are caused by chromosomal errors in the embryo. This is not caused by anything either partner did.',
      'A thorough investigation can identify treatable causes in many couples — antiphospholipid syndrome, uterine abnormalities, and chromosome issues are all findable.',
      'Preimplantation genetic testing (PGT) during IVF is one of the most powerful options for couples whose losses are due to chromosomal abnormalities.',
      'Most couples who experience recurrent pregnancy loss go on to have a healthy baby.',
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
    relatedSlugs: ['what-ivf-really-is', 'understanding-pcos', 'ivf-myths-vs-facts'],
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
    relatedSlugs: ['what-ivf-really-is', 'age-and-ivf-success', 'understanding-pcos'],
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
