export interface Doctor {
  id: string;
  slug: string;
  name: string;
  title: string;
  specialization: string;
  shortBio: string;
  philosophy: string;
  qualifications: string[];
  experience: string;
  image: string;
  articlesWritten?: string[];
}

export const doctors: Doctor[] = [
  {
    id: 'dr-sharma',
    slug: 'dr-sharma',
    name: 'Dr. Priya Sharma',
    title: 'Director & Lead Fertility Specialist',
    specialization: 'Reproductive Endocrinology & IVF',
    shortBio: 'With over 15 years of expertise in fertility treatment, Dr. Sharma is known for her compassionate approach and innovative diagnostic techniques.',
    philosophy: `Dr. Sharma believes that every couple&apos;s fertility journey is unique. She emphasizes thorough evaluation, clear communication, and personalized treatment plans over one-size-fits-all protocols. Her approach combines cutting-edge reproductive science with deep empathy for the emotional complexity of fertility challenges.

"I see each couple as individuals with their own story, fears, and hopes. My job isn't just to achieve pregnancy—it's to guide you with clarity, respect your autonomy, and make sure you feel supported every step of the way."`,
    qualifications: [
      'MD, Obstetrics & Gynecology - AIIMS Delhi',
      'DM, Reproductive Endocrinology - ICMR Institute',
      'Fellow, American College of Obstetricians and Gynecologists',
      'Certified in IVF, ICSI, and PGT procedures',
      'Advanced training in egg freezing and fertility preservation',
    ],
    experience: '15+ years in reproductive medicine, 5000+ IVF cycles managed',
    image: '/images/doctor-sharma.jpg',
    articlesWritten: ['ivf-basics-101', 'age-fertility-timeline'],
  },
  {
    id: 'dr-kapoor',
    slug: 'dr-kapoor',
    name: 'Dr. Arun Kapoor',
    title: 'Male Fertility Specialist & Andrologist',
    specialization: 'Male Factor Infertility & Reproductive Urology',
    shortBio: 'Dr. Kapoor specializes in male fertility assessment and treatment, bringing expertise in sperm analysis, hormone evaluation, and surgical procedures.',
    philosophy: `Dr. Kapoor recognizes that male infertility often carries emotional weight that's not openly discussed. He's dedicated to comprehensive male evaluation and evidence-based treatment.

"Male fertility often gets overlooked in fertility conversations, but 40% of infertility involves male factors. My role is to thoroughly evaluate, offer realistic options, and help men understand they're not alone in this journey."`,
    qualifications: [
      'MBBS - Delhi University',
      'MS, General Surgery - PGIMER',
      'MCh, Urology - CMC Vellore',
      'Fellowship in Andrology - International Society of Andrology',
      'Expert in sperm extraction and ICSI',
    ],
    experience: '12+ years in male reproductive health, 8000+ semen analyses performed',
    image: '/images/doctor-kapoor.jpg',
    articlesWritten: ['male-fertility-guide'],
  },
  {
    id: 'dr-menon',
    slug: 'dr-menon',
    name: 'Dr. Sneha Menon',
    title: 'Reproductive Geneticist & Embryologist Lead',
    specialization: 'Embryology, Genetic Testing & PGT',
    shortBio: 'Dr. Menon leads our laboratory operations with expertise in embryo development, genetic testing, and embryo selection strategies.',
    philosophy: `Dr. Menon believes that science and compassion go hand-in-hand in the laboratory. She's committed to transparency about embryo development and realistic expectations about genetic testing.

"What happens in our laboratory matters greatly. I focus on creating the best environment for embryo development while giving you clear information about your options, including genetic testing decisions."`,
    qualifications: [
      'PhD, Reproductive Genetics - University of Cambridge',
      'HFEA Diploma in Embryology',
      'Fellowship in Laboratory Techniques - International Embryo Transfer Society',
      'Expertise in PGT-A, PGT-SR, and PGT-M',
      'Advanced embryo selection strategies',
    ],
    experience: '10+ years in reproductive genetics, 15000+ embryos managed',
    image: '/images/doctor-menon.jpg',
    articlesWritten: ['ivf-myths-debunked'],
  },
  {
    id: 'dr-patel',
    slug: 'dr-patel',
    name: 'Dr. Rajesh Patel',
    title: 'Fertility Counselor & Patient Advocate',
    specialization: 'Reproductive Psychology & Patient Support',
    shortBio: 'Dr. Patel provides essential emotional and psychological support, helping couples navigate the fertility journey with resilience and hope.',
    philosophy: `Dr. Patel recognizes that fertility treatment affects the whole person—emotionally, mentally, and spiritually. He provides non-judgmental support for the psychological aspects of family building.

"The emotional journey of fertility treatment is as important as the medical one. I'm here to help you process, adjust, and maintain hope through every stage."`,
    qualifications: [
      'MSc, Clinical Psychology - Delhi University',
      'Postdoctoral Fellowship in Reproductive Psychology',
      'Certified Fertility Counselor - International Society of Fertility Counselors',
      'Training in mindfulness and evidence-based therapy',
    ],
    experience: '8+ years supporting fertility patients, 2000+ counseling sessions',
    image: '/images/doctor-patel.jpg',
  },
];
