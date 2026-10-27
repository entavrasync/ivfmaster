
export function NotFoundPage({ locale = 'mr' }: { locale?: string }) {
  const english = locale === 'en'
  const prefix = english ? '/en' : ''
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-ivory px-6 py-28 font-body text-ink">
      <section aria-labelledby="not-found-title" className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-taupe/60 bg-white px-6 py-14 text-center shadow-sm sm:px-14">
        <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-lavender" />
        <div className="relative">
          <a href={prefix || '/'} className="text-lg font-semibold tracking-wide text-navy">IVF Master</a>
          <p className="my-6 font-display text-8xl leading-none text-navy sm:text-9xl">404</p>
          <h1 id="not-found-title" className="font-display text-3xl text-ink sm:text-4xl">Page Not Found</h1>
          {!english && <p lang="mr" className="mt-3 text-xl text-navy">हे पान सापडले नाही</p>}
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-slate">
            {english ? 'This page may have moved, or the address may be incorrect. Let us help you find your way.' : 'हे पान हलवले गेले असावे किंवा पत्ता चुकीचा असू शकतो. खालील दुव्यांमधून पुढे जा.'}
          </p>
          <nav aria-label={english ? 'Find another page' : 'दुसरे पान निवडा'} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={prefix || '/'} className="rounded-full bg-navy px-7 py-3 font-semibold text-white transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">{english ? 'Back to Home' : 'मुख्यपृष्ठावर जा'}</a>
            <a href={`${prefix}/procedures`} className="rounded-full border border-navy/30 px-7 py-3 font-semibold text-navy transition-colors hover:bg-lavender focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">{english ? 'Explore Treatments' : 'उपचार पहा'}</a>
          </nav>
          <p className="mt-8 text-sm text-slate">{english ? 'Need help? ' : 'मदत हवी आहे? '}<a href={`${prefix}/contact`} className="font-semibold text-navy underline underline-offset-4">{english ? 'Contact our team' : 'आमच्याशी संपर्क करा'}</a></p>
        </div>
      </section>
    </main>
  )
}
