/* ─────────────────────────────────────────────────────────────────────────
 * Rich article content model.
 *
 * A fully-translated (EN + MR) article stores all of its copy in next-intl
 * messages under EducateIVF.articles.<i18nKey>. This file describes the
 * *structure* of each such article — which sections appear, in what order, and
 * which block type renders each piece of text — while the text itself lives in
 * the message catalogues. The renderer (ArticleDetail → RichBody) resolves
 * every `field` against `articles.<i18nKey>.<field>` using `t()` for strings
 * and `t.raw()` for list arrays.
 *
 * Adding a new translated article = add its copy to en.json / mr.json and a
 * RichConfig entry here. No new component code required.
 * ───────────────────────────────────────────────────────────────────────── */

export type RichBlock =
  | { kind: 'para';      field: string }   // body paragraph
  | { kind: 'paraMuted'; field: string }   // quieter closing / aside paragraph
  | { kind: 'intro';     field: string }   // lead line that precedes a list
  | { kind: 'list';      field: string }   // simple bulleted list (field → string[])
  | { kind: 'defList';   field: string }   // "Term: description" list, term emphasised
  | { kind: 'note';      field: string }   // small italic note line
  | { kind: 'sub';       field: string }   // Fraunces sub-heading within a section
  | { kind: 'quote';     field: string }   // signature pull-quote (premium panel)
  | { kind: 'highlight'; field: string }   // soft, warm highlighted paragraph

export type RichSection = {
  readonly headingField?: string           // e.g. 'signs.heading'; omit for lead-in blocks
  readonly blocks:        readonly RichBlock[]
}

export type RichRemember = {
  readonly headingField: string            // panel title, e.g. 'remember.heading'
  readonly itemsField?:  string            // multi-point takeaways (field → string[])
  readonly lineField?:   string            // single reassuring line
}

export type RichConfig = {
  /* Whether the hero shows the warm intro paragraph(s). When false, the intro
   * is instead placed as the first titled section in `sections`. */
  readonly heroIntro:   boolean
  readonly sections:    readonly RichSection[]
  readonly remember?:   RichRemember
  /* Optional per-article closing CTA overrides (fall back to shared strings). */
  readonly ctaButtonField?:  string        // e.g. 'cta.button'
}

/* Convenience builders keep the config definitions compact and readable. */
const H  = (headingField: string, ...blocks: RichBlock[]): RichSection => ({ headingField, blocks })
const para      = (field: string): RichBlock => ({ kind: 'para', field })
const paraMuted = (field: string): RichBlock => ({ kind: 'paraMuted', field })
const intro     = (field: string): RichBlock => ({ kind: 'intro', field })
const list      = (field: string): RichBlock => ({ kind: 'list', field })
const defList   = (field: string): RichBlock => ({ kind: 'defList', field })
const note      = (field: string): RichBlock => ({ kind: 'note', field })
const sub       = (field: string): RichBlock => ({ kind: 'sub', field })
const quote     = (field: string): RichBlock => ({ kind: 'quote', field })
const highlight = (field: string): RichBlock => ({ kind: 'highlight', field })

export const RICH_ARTICLES: Readonly<Record<string, RichConfig>> = {

  /* ─── PCOS ─────────────────────────────────────────────────────────────── */
  'pcos': {
    heroIntro: true,
    sections: [
      { headingField: 'signs.heading', blocks: [list('signs.items'), note('signs.note')] },
      H('why.heading', para('why.body')),
      H('diagnosis.heading', intro('diagnosis.intro'), list('diagnosis.items')),
      H('treatment.heading',
        sub('treatment.lifestyle.heading'),
        intro('treatment.lifestyle.intro'),
        list('treatment.lifestyle.items'),
        quote('treatment.mantra'),
        sub('treatment.medicines.heading'),
        intro('treatment.medicines.intro'),
        list('treatment.medicines.items'),
        note('treatment.medicines.note'),
      ),
      H('regular.heading', intro('regular.intro'), list('regular.items'), paraMuted('regular.closing')),
      H('visit.heading', intro('visit.intro'), list('visit.items')),
    ],
    remember: { headingField: 'remember.heading', itemsField: 'remember.items' },
  },

  /* ─── Male infertility ─────────────────────────────────────────────────── */
  'male-fertility': {
    heroIntro: false,
    sections: [
      H('about.heading', para('about.body')),
      H('causes.heading', list('causes.items')),
      H('signs.heading', para('signs.body')),
      H('checked.heading', intro('checked.intro'), list('checked.items')),
      H('treated.heading', intro('treated.intro'), list('treated.items')),
      H('doYou.heading', list('doYou.items')),
      H('doctor.heading', list('doctor.items')),
    ],
    remember: { headingField: 'remember.heading', lineField: 'remember.line' },
  },

  /* ─── Recurrent pregnancy loss ─────────────────────────────────────────── */
  'recurrent-pregnancy-loss': {
    heroIntro: true,
    sections: [
      H('why.heading', intro('why.intro'), list('why.items')),
      H('tests.heading', intro('tests.intro'), list('tests.items')),
      H('treated.heading', intro('treated.intro'), list('treated.items')),
      H('chances.heading', highlight('chances.body')),
      H('doctor.heading', para('doctor.body')),
    ],
    remember: { headingField: 'remember.heading', lineField: 'remember.line' },
  },

  /* ─── What IVF really is (6-phase guide) ───────────────────────────────── */
  'what-ivf-really-is': {
    heroIntro: true,
    sections: [
      H('phase1.heading', para('phase1.body'), quote('phase1.quote'), defList('phase1.items')),
      H('phase2.heading', para('phase2.body'), defList('phase2.items'), note('phase2.note')),
      H('phase3.heading', para('phase3.body'), defList('phase3.items')),
      H('phase4.heading', para('phase4.body'), defList('phase4.items')),
      H('phase5.heading', para('phase5.body'), defList('phase5.items')),
      H('phase6.heading', para('phase6.body'), defList('phase6.items')),
      H('support.heading', para('support.body')),
    ],
    ctaButtonField: 'cta.button',
  },
}
