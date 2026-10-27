// These contracts describe the existing renderers, not a replacement page builder.
export type ArticleField = 'text' | 'list' | 'phases' | 'myths' | 'sections' | 'tableSections' | { readonly [key: string]: ArticleField }
export type ArticleContract = Readonly<Record<string, ArticleField>>

const narrative = { title: 'text', intro: 'text', sections: 'sections', closing: 'text' } as const
export const articleModels = {
  'what-ivf-really-is': { field: 'ivfGuide', namespace: 'ArticleWhatIvf', contract: {
    title: 'text', intro1: 'text', phases: 'phases', closingHeading: 'text', closingPara1: 'text', closingPara2: 'text',
  } },
  pcos: { field: 'pcos', namespace: 'ArticlePcos', contract: {
    intro: 'text', signsHeading: 'text', signs: 'list', signsNote: 'text', whyHeading: 'text', whyBody: 'text',
    diagnosisHeading: 'text', diagnosisIntro: 'text', diagnosisList: 'list', treatmentHeading: 'text',
    lifestyleSubheading: 'text', lifestyleIntro: 'text', lifestyleList: 'list', mantra: 'text',
    medicinesSubheading: 'text', medicinesIntro: 'text', medicinesList: 'list', medicinesNote: 'text',
    regularHeading: 'text', regularIntro: 'text', regularList: 'list', regularClosing: 'text',
    visitHeading: 'text', visitIntro: 'text', visitList: 'list', rememberHeading: 'text', rememberList: 'list',
  } },
  // The canonical male route uses RichBody and its EducateIVF namespace today.
  'male-fertility': { field: 'maleFertility', namespace: 'EducateIVF', contract: {
    intro: 'text', about: { heading: 'text', body: 'text' }, causes: { heading: 'text', items: 'list' },
    signs: { heading: 'text', body: 'text' }, checked: { heading: 'text', intro: 'text', items: 'list' },
    treated: { heading: 'text', intro: 'text', items: 'list' }, doYou: { heading: 'text', items: 'list' },
    doctor: { heading: 'text', items: 'list' }, remember: { heading: 'text', line: 'text' },
  } },
  'recurrent-pregnancy-loss': { field: 'recurrentLoss', namespace: 'ArticleRecurrentLoss', contract: narrative },
  'unexplained-infertility': { field: 'unexplained', namespace: 'ArticleUnexplained', contract: narrative },
  'age-and-ivf-success': { field: 'age', namespace: 'ArticleAge', contract: { ...narrative, sections: 'tableSections' } },
  'ivf-myths-vs-facts': { field: 'myths', namespace: 'ArticleMyths', contract: {
    title: 'text', intro: 'text', items: 'myths', closing: 'text',
  } },
} as const satisfies Record<string, { field: string; namespace: string; contract: ArticleContract }>

export type ArticleSlug = keyof typeof articleModels
export const articleSlugs = Object.keys(articleModels) as ArticleSlug[]
export const isArticleSlug = (value: string): value is ArticleSlug => Object.hasOwn(articleModels, value)
// Historical addresses must keep redirecting to their original article.
export const reservedArticleSlugs = ['understanding-pcos', 'male-fertility-explained'] as const
export const articleSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const maxArticles = 1000
