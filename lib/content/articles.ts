export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  image: string;
  content: string;
  faqs: { question: string; answer: string }[];
}

export const articles: Article[] = [
  {
    id: 'ivf-basics-101',
    slug: 'ivf-basics-101',
    title: 'IVF Basics 101: Everything You Need To Know',
    description: 'A comprehensive guide to understanding In Vitro Fertilization without the medical jargon.',
    category: 'IVF Basics',
    readTime: 12,
    image: '/images/ivf-basics.jpg',
    content: `# Understanding IVF: A Complete Guide

## What Is IVF?

IVF stands for In Vitro Fertilization. In Latin, "in vitro" means "in glass" - referring to the laboratory dishes where fertilization occurs. IVF is a process where eggs and sperm are combined in a controlled lab environment to create embryos, which are then transferred to the uterus.

## Why Do People Choose IVF?

People pursue IVF for various reasons:
- Blocked or damaged fallopian tubes
- Low sperm count or poor sperm mobility
- Endometriosis
- Unexplained infertility
- Age-related fertility concerns
- PCOS (Polycystic Ovary Syndrome)
- To preserve fertility before medical treatment

## The IVF Process: Step by Step

### 1. Ovarian Stimulation
Hormonal medications stimulate the ovaries to produce multiple eggs instead of one. This process takes about 10-14 days.

### 2. Egg Retrieval
A minor surgical procedure removes eggs from the ovaries using ultrasound guidance. This takes about 20 minutes.

### 3. Sperm Collection
On the day of egg retrieval, sperm is collected through ejaculation or surgical extraction.

### 4. Fertilization
Eggs and sperm are combined in the lab, or sperm is directly injected into eggs (ICSI). Fertilization is checked the next day.

### 5. Embryo Development
Fertilized eggs (now called embryos) are cultured in the lab for 3-6 days. They're monitored for development and quality.

### 6. Embryo Transfer
The best quality embryo is selected and transferred into the uterus through the cervix. This is a simple procedure, similar to a pap smear.

### 7. Implantation & Pregnancy Test
The embryo must implant into the uterine lining. A pregnancy test is done 12-14 days after transfer.

## Success Rates

IVF success rates depend on many factors including age, egg quality, sperm health, and uterine health. At IVF Master, we achieve success rates above the national average through personalized treatment protocols.

## Common Concerns Addressed

**Is IVF painful?** Most procedures cause minimal discomfort. Egg retrieval may cause mild cramping.

**How long does IVF take?** From start to pregnancy test is typically 4-6 weeks.

**What are the risks?** IVF is generally safe. Ovarian Hyperstimulation Syndrome is rare but manageable.

**Can I work during IVF?** Most people continue working, though some take time off during retrieval and transfer.`,
    faqs: [
      {
        question: 'How many IVF cycles might we need?',
        answer: 'This varies. Some couples succeed on the first cycle, others may need 2-3 cycles. Your doctor will discuss realistic expectations based on your specific situation.',
      },
      {
        question: 'What is the difference between IVF and IUI?',
        answer: 'IUI (Intrauterine Insemination) is simpler - sperm is placed directly in the uterus during ovulation. IVF involves retrieving eggs and fertilizing them in the lab. IVF is more intensive but often necessary for certain conditions.',
      },
      {
        question: 'Can we choose the baby&apos;s gender with IVF?',
        answer: 'Gender selection (PGD) is available in some cases but is regulated and only recommended for medical reasons in India.',
      },
    ],
  },
  {
    id: 'pcos-fertility',
    slug: 'pcos-fertility',
    title: 'PCOS & Fertility: Your Guide to Treatment Options',
    description: 'Understanding PCOS and how it affects fertility, plus treatment strategies.',
    category: 'Female Fertility',
    readTime: 10,
    image: '/images/pcos-guide.jpg',
    content: `# PCOS & Fertility: Complete Guide

## What Is PCOS?

Polycystic Ovary Syndrome (PCOS) is an endocrine disorder affecting 1 in 10 women of reproductive age. It's characterized by irregular periods, elevated androgens (male hormones), and multiple small cysts on the ovaries.

## How PCOS Affects Fertility

PCOS can prevent regular ovulation, leading to irregular or absent periods. Irregular ovulation makes it harder to predict fertile days or become pregnant naturally.

## Treatment Options for PCOS & Fertility

### 1. Lifestyle Modifications
Weight loss of just 5-10% can regulate periods in many women with PCOS. Diet, exercise, and stress management are first-line treatments.

### 2. Medications
- **Metformin**: Improves insulin sensitivity
- **Letrozole**: Stimulates ovulation without overstimulation risk
- **Clomiphene**: Another ovulation-stimulating medication

### 3. Assisted Reproduction
- **IUI**: With ovulation-stimulating medications
- **IVF**: Often successful in PCOS due to many available eggs

## Success Rates With PCOS

Women with PCOS often have excellent IVF success rates because of the abundance of eggs available. Many cycles can be done with less medication.

## Lifestyle Tips for PCOS

1. Maintain a balanced diet low in refined carbohydrates
2. Exercise 3-4 times per week
3. Manage stress through yoga, meditation, or counseling
4. Sleep 7-8 hours nightly
5. Regular monitoring of hormone levels`,
    faqs: [
      {
        question: 'Is PCOS curable?',
        answer: 'PCOS is manageable but not curable. Most women find that with proper treatment and lifestyle changes, their symptoms improve significantly and fertility is achievable.',
      },
      {
        question: 'Can I get pregnant naturally with PCOS?',
        answer: 'Yes! Many women with PCOS conceive naturally, especially with lifestyle modifications and sometimes basic medications. Your doctor will help determine your best approach.',
      },
    ],
  },
  {
    id: 'male-fertility-guide',
    slug: 'male-fertility-guide',
    title: 'Male Fertility 101: What Every Couple Should Know',
    description: 'Understanding male factor infertility and treatment options.',
    category: 'Male Fertility',
    readTime: 8,
    image: '/images/male-fertility.jpg',
    content: `# Male Fertility: Complete Guide for Couples

## Male Factor Infertility

Male factor accounts for about 40-50% of infertility cases. It can involve sperm count, motility (movement), morphology (shape), or production issues.

## Common Male Fertility Concerns

### Low Sperm Count
Normal count is 15 million sperm per milliliter. Lower counts may require IUI or IVF with ICSI.

### Poor Sperm Motility
Sperm that don't move well may need ICSI (Intracytoplasmic Sperm Injection).

### Abnormal Morphology
Sperm with unusual shapes may affect fertilization rates.

### Zero Sperm Count (Azoospermia)
Either due to obstruction (treatable) or production issues (may need sperm extraction for IVF/ICSI).

## Diagnosis: Semen Analysis

A semen analysis measures:
- Volume
- pH
- Sperm concentration
- Total sperm count
- Motility (movement percentage and quality)
- Morphology (shape and structure)

## Treatment Options

### Lifestyle Modifications
- Avoid excessive heat (boxers over briefs)
- Healthy diet and exercise
- Reduce stress
- Quit smoking
- Limit alcohol
- Maintain healthy weight

### Medical Treatments
- Hormone treatments for specific deficiencies
- Antibiotics for infections
- Surgical correction of varicoceles

### Assisted Reproduction
- **IUI**: For mild male factor issues
- **ICSI**: Direct sperm injection into eggs
- **Surgical Sperm Extraction**: For obstructive azoospermia`,
    faqs: [
      {
        question: 'How long does it take to improve sperm quality?',
        answer: 'Sperm takes about 74 days to mature. Lifestyle changes may show improvement in 2-3 months.',
      },
      {
        question: 'Is male infertility treatable?',
        answer: 'Many cases are treatable. Even if not, modern fertility treatments like ICSI make pregnancy possible.',
      },
    ],
  },
  {
    id: 'age-fertility-timeline',
    slug: 'age-fertility-timeline',
    title: 'Age & Fertility: What The Science Really Says',
    description: 'Understanding how age affects fertility and your options at every stage.',
    category: 'Fertility Awareness',
    readTime: 11,
    image: '/images/age-fertility.jpg',
    content: `# Age & Fertility: Science-Based Guide

## How Age Affects Fertility

Female fertility peaks in the late 20s and early 30s. After age 35, the decline accelerates. Age affects:
- Egg quality
- Egg quantity
- Miscarriage risk
- Genetic abnormalities

## Fertility Timeline By Age

### Age 20-30
- Peak fertility years
- Highest egg quality
- Lowest miscarriage risk
- About 20-25% chance per cycle

### Age 30-35
- Still excellent fertility
- Slight decline in egg quality
- About 15-20% chance per cycle
- Great time to explore if trying

### Age 35-40
- "Advanced Maternal Age" starts at 35
- Noticeable decline in egg quality
- About 10-15% chance per cycle
- More miscarriage risk

### Age 40+
- Significant age-related decline
- About 5-10% chance per cycle
- Higher miscarriage and chromosomal risk
- IVF with preimplantation genetic testing (PGT) often recommended

## Egg Freezing: Preserving Your Options

Egg freezing allows women to preserve eggs at their current age for use later. Success rates depend on age at freezing, not age at use.

## Success Rates By Age

The chance of having a baby through IVF varies significantly by age. At IVF Master, we personalize approaches based on individual ovarian reserve and egg quality.

## Your Options At Every Age

1. **Start Trying**: Natural conception is always worth attempting if desired
2. **Get Tested**: Ovarian reserve testing can guide decisions
3. **Consider Egg Freezing**: Before major medical treatments or if delaying family planning
4. **Discuss Assisted Reproduction**: If trying for a set time without success`,
    faqs: [
      {
        question: 'At what age should I start worrying about fertility?',
        answer: 'If you&apos;re under 35 and trying for 1 year, or over 35 and trying for 6 months without success, it&apos;s worth getting an evaluation.',
      },
      {
        question: 'Is it too late to conceive at 45?',
        answer: 'Natural conception at 45 is unlikely but possible. IVF with donor eggs has much higher success rates at any age.',
      },
    ],
  },
  {
    id: 'ivf-myths-debunked',
    slug: 'ivf-myths-debunked',
    title: '7 Myths About IVF That Are Absolutely Wrong',
    description: 'Separating IVF facts from fiction - clearing up common misconceptions.',
    category: 'IVF Myths',
    readTime: 9,
    image: '/images/ivf-myths.jpg',
    content: `# IVF Myths Debunked: Facts vs Fiction

## Myth 1: IVF Babies Are Not Biologically Connected
**FACT**: IVF babies are 100% biologically the baby of the parents (unless using donor gametes, which is a choice). The only difference is conception location - the lab instead of the fallopian tube.

## Myth 2: IVF Always Produces Multiple Babies
**FACT**: Most IVF transfers result in single pregnancies. Multiple pregnancies depend on how many embryos are transferred, not on IVF itself. Modern practice emphasizes single embryo transfer to reduce risks.

## Myth 3: IVF Is Extremely Painful
**FACT**: While some procedures cause mild discomfort, most IVF steps are painless or minimally uncomfortable. Sedation is used during egg retrieval.

## Myth 4: IVF Always Works After One Cycle
**FACT**: Success depends on many factors including age, egg quality, and underlying causes. Many people need 2-3 cycles, and that's completely normal.

## Myth 5: You Can't Exercise During IVF
**FACT**: Gentle exercise like walking and yoga are encouraged. Avoid high-impact exercise during stimulation, but normal daily activity is fine.

## Myth 6: IVF Increases Cancer Risk
**FACT**: Multiple large studies show no increased cancer risk from IVF or fertility medications. IVF is a safe procedure when performed at quality clinics.

## Myth 7: You're Too Old at 40 for IVF
**FACT**: While egg quality declines with age, IVF at 40+ is very possible, especially with newer techniques like PGT and egg freezing. Age is a factor, not a barrier.

## Additional Facts About IVF

- IVF does not increase birth defects beyond baseline population risk
- IVF can be done with your own eggs or donor eggs
- IVF success rates are highest with reputable clinics and experienced doctors
- Time between cycles is usually 1-2 months`,
    faqs: [
      {
        question: 'What\'s the most common IVF misconception you hear?',
        answer: 'That IVF is a guaranteed solution. IVF significantly improves chances but isn\'t 100% guaranteed. Success depends on individual factors, and sometimes multiple cycles are needed.',
      },
    ],
  },
];
