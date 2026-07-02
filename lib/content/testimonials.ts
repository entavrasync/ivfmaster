export type Testimonial = {
  text:        string
  name:        string
  situation:   string
  initials:    string
  avatarColor: string
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    text:        "We'd been trying for four years and had almost given up. Dr. Gorakh sat with us for nearly an hour on our first visit — no rush, no rehearsed answers. He explained everything until it made sense. Six months later, we brought our daughter home.",
    name:        'Priya & Rahul Joshi',
    situation:   'Unexplained infertility, 4 years',
    initials:    'PR',
    avatarColor: '#C07888',
  },
  {
    text:        "Male factor infertility felt like something no one wanted to talk about. Dr. Gorakh treated it as just another problem to solve — calmly, clinically, without any awkwardness. That made all the difference for my husband.",
    name:        'Anita & Suresh Kulkarni',
    situation:   'Male factor infertility',
    initials:    'AK',
    avatarColor: '#7888B8',
  },
  {
    text:        "Two failed IVF cycles at another clinic had made us very wary. What was different here was Dr. Saie's gentleness. She called us herself after every scan. We never felt like a file number.",
    name:        'Meena & Anand Desai',
    situation:   'After 2 failed IVF cycles',
    initials:    'MD',
    avatarColor: '#78A890',
  },
  {
    text:        "PCOS had made me feel like my own body was working against me. Dr. Saie helped me understand what was actually happening — no jargon, no alarm. Her calm gave me my calm back.",
    name:        'Kavitha & Rajesh Nair',
    situation:   'PCOS, 3 years of treatment',
    initials:    'KN',
    avatarColor: '#B87848',
  },
  {
    text:        "We already had one child and assumed a second would come easily. When it didn't, I was devastated. Dr. Gorakh reminded us that secondary infertility is real — and treatable. We welcomed twins last March.",
    name:        'Deepa & Nitin Sharma',
    situation:   'Secondary infertility',
    initials:    'DN',
    avatarColor: '#9878C0',
  },
  {
    text:        "At 41, another specialist told me IVF was unlikely to work. I came to Dr. Gorakh for a second opinion. He was honest — he said it would be challenging — but he didn't say no. I'm so glad I didn't stop there.",
    name:        'Seema & Ramesh Patil',
    situation:   'Age 41, low ovarian reserve',
    initials:    'SP',
    avatarColor: '#C08878',
  },
  {
    text:        "Three miscarriages in two years. Every time I lost hope, Dr. Saie was there — not with platitudes, but with a plan. She investigated when others had simply said 'try again'. That investigation saved us.",
    name:        'Pooja & Arun Iyer',
    situation:   'Recurrent pregnancy loss',
    initials:    'PA',
    avatarColor: '#88A0C0',
  },
  {
    text:        "Endometriosis had been stealing years from me without a proper diagnosis. Dr. Saie connected the dots immediately. I finally felt heard — and finally got the right care.",
    name:        'Sunita & Vikram Jain',
    situation:   'Endometriosis, 6-year journey',
    initials:    'SJ',
    avatarColor: '#A8B870',
  },
  {
    text:        "The whole team here operates with such warmth. From the front desk to the procedure room, everyone made sure I wasn't scared. That matters more than people realise when you're already exhausted.",
    name:        'Nisha & Kiran Gupta',
    situation:   'IVF with donor eggs',
    initials:    'NG',
    avatarColor: '#C098A8',
  },
]

export function distributeTestimonials(
  testimonials: readonly Testimonial[],
): [Testimonial[], Testimonial[], Testimonial[]] {
  const columns: [Testimonial[], Testimonial[], Testimonial[]] = [[], [], []]

  testimonials.forEach((testimonial, index) => {
    columns[index % columns.length].push(testimonial)
  })

  return columns
}

export const TESTIMONIAL_COLUMNS = distributeTestimonials(TESTIMONIALS)
