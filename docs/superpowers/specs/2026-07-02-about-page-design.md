# IVF Master About Page Design Specification

## Purpose

Redesign the About page as a calm, premium continuation of the IVF Master homepage. The page must build trust through humane, document-backed storytelling rather than hospital marketing, a corporate mission statement, or a doctor résumé.

The page should answer one question throughout: **Why should I trust these people with a deeply personal fertility journey?**

## Approved Direction

The experience combines an editorial trust narrative with a patient-care journey. It moves from the clinic's reason for existing, through the way care begins, into the doctors and wider team, then closes with evidence, ethics, and an invitation to talk.

The final page contains seven meaningful sections with generous whitespace and deliberately different desktop and mobile compositions.

## Authoritative Content Sources

All factual claims and medical-care themes must come from the supplied Word documents:

- `About IVF in details.docx`
- `About IVF in short.docx`
- `Age related changes and IVF Success.docx`
- `Dr. Gorakh Mandrupkar.docx`
- `Dr. MRS. Saie Mandrupkar.docx`
- `IVF Myths Vs Facts.docx`
- `Male Infertility.docx`
- `Mindmap for the website ivfmaster.docx`
- `PCOS.docx`
- `Recurrent Pregnancy Loss.docx`
- `Unexplained Infertility.docx`

The existing homepage design system is the visual authority. The current About page copy and layout are not retained.

### Content guardrails

- Do not invent achievements, outcomes, facilities, testimonials, or patient promises.
- Do not imply guaranteed pregnancy or guaranteed treatment success.
- Do not use inflated adjectives such as world-class, renowned, revolutionary, or best.
- Do not present Mission, Vision, or Core Values headings.
- Do not convert biographies into credential lists.
- Weave verified experience, research, teaching, and patient care into editorial prose.
- Keep medical language plain, calm, and accurate.
- Use honest hope: treatment can help, but outcomes vary with age, diagnosis, health, egg and sperm quality, and other individual factors.
- Preserve the existing locale-aware route and metadata behavior. English source copy is authoritative; untranslated factual claims must not be machine-invented.

## Narrative Voice

The writing is warm, precise, and unhurried. Paragraphs are short, with clear line lengths and occasional pull quotes. The clinic speaks as a care team, not a corporation.

Preferred language includes listening, understanding, explaining, individual care, evidence, honesty, and staying beside the couple. Avoid slogans that cannot be substantiated.

## Page Architecture

### 1. Hero — Care begins before treatment does

Open with an emotional promise of understanding before recommendations. Use a short headline, a two-line supporting statement, one primary consultation CTA, and one low-emphasis anchor link into the story.

The hero visual is an abstract editorial image about fertility, care, and possibility. It must not depict or imitate either doctor's likeness.

### 2. Why IVF Master exists

Describe couples arriving with questions, mixed emotions, and uncertainty. Explain that IVF Master exists to make reproductive medicine understandable and to help couples make informed decisions without pressure.

Use one central narrative, a short pull quote, and a quiet evidence note that the website itself was conceived as an educational platform for couples and misconceptions about IVF.

### 3. How care begins

Express the clinic philosophy as four connected moments rather than values cards:

1. Listen to the whole story.
2. Explain what the evaluation shows.
3. Shape treatment around the individual couple.
4. Stay present through decisions, treatment, waiting, and follow-up.

The sequence should reinforce that preparation and evaluation precede treatment recommendations. It can reference ovarian reserve testing, semen analysis, uterine assessment, and lifestyle guidance only as examples, not as an exhaustive protocol.

### 4. Two doctors, one continuity of care

Give each doctor a distinct editorial chapter.

Dr. Gorakh Mandrupkar's story should connect more than two decades of infertility practice with his habit of explaining treatment, training other gynecologists, and contributing to clinical research. Verified details that may be woven into the story include his Pune University Gold Medal in Gynecology in 2004, work as a reproductive medicine consultant since March 2006, care for more than 2,000 couples, leadership of a FOGSI-recognized IVF training centre for ten years, and development of the HDP Gestosis Score adopted by India's National Health Mission.

Dr. Saie Mandrupkar's story should connect more than two decades of clinical practice with continuity from fertility treatment into high-risk pregnancy and safe motherhood. Verified details include her postgraduate Obstetrics and Gynecology degree from Pune University in 2005, work across infertility, reproductive medicine, recurrent pregnancy loss, IVF pregnancy, diabetes, hypertension, and other complex maternal conditions, care for more than 2,000 couples, and participation in clinical research.

The copy must remain narrative. At most one restrained evidence note may sit beside each biography; there is no résumé bullet list.

### 5. The people beside every step

Present the wider care team as a coordinated relationship rather than a staff directory. The source documents support nursing staff, counsellors, clinical staff, and embryology involvement during the IVF journey.

Explain how different roles support medication questions, monitoring, procedures, embryo development, emotional strain, and the waiting period. Do not invent names, qualifications, team size, or facilities.

### 6. Trust built through practice

Show why the clinic's approach is credible through an editorial evidence ledger:

- individualized evaluation before a plan
- evidence-based reproductive medicine
- active clinical research in women's health
- professional teaching and training
- honest explanations of uncertainty and age-related outcomes
- support that continues from fertility assessment through pregnancy care where appropriate

These are short narrative statements, not promotional badges or metric cards.

### 7. Closing — You do not need every answer before the first conversation

Close with reassurance that the first step is a conversation and assessment, not a commitment to IVF. Use one primary CTA to contact or schedule a consultation and a secondary link to educational IVF content.

The tone must avoid urgency, countdown language, or guaranteed outcomes.

## Visual System

Reuse the existing homepage system:

- Fraunces for editorial display typography.
- Figtree for body copy, labels, and controls.
- Ivory `#FBF7F1` as the primary canvas.
- Navy `#2E4F8E` and ink `#1C2A48` for hierarchy and contrast.
- Periwinkle `#97A6D2`, lavender `#ECEFF9`, blush `#E2849C`, and taupe `#D8CCBE` as supporting fields.
- Existing `Container`, spacing rhythm, button treatments, and responsive gutters.

Do not introduce a separate hospital-style visual language. Avoid generic blue medical gradients, glassmorphism, dense card grids, excessive rounded boxes, and decorative statistics.

## Abstract Image Direction

Reuse the project's existing abstract `assets/cost` raster sequence because it already supplies coordinated desktop and mobile compositions in the approved palette. No doctor or team photography is available, and the artwork must never imply a likeness.

The images should be sophisticated editorial abstractions using soft biomorphic forms, gentle light, translucent layers, and tactile paper or frosted-material depth. They may suggest a protected cell, a growing form, care passing between hands, or coordinated clinical attention, but must avoid literal embryos, synthetic doctor portraits, hospital stock imagery, DNA helices, babies, and sentimental clichés.

Select matched compositions for their actual slots:

- hero: matched landscape desktop and portrait mobile assets
- doctor chapter support: two distinct matched desktop/mobile abstract pairs
- team section: one matched wide/portrait abstract pair

All meaningful visuals require useful alt text; decorative texture layers use empty alt text.

## Desktop Composition

- Hero uses a 12-column asymmetric split with approximately seven columns for copy and five for artwork.
- The origin story uses a wide text measure, pull quote, and offset evidence note.
- The care journey becomes four connected editorial scenes separated by a fine progress rule, not four cards.
- Doctor chapters alternate image and text alignment and occupy substantial vertical space without becoming full-viewport scroll traps.
- The team section uses a wide visual field with overlaid or adjacent narrative, depending on text contrast.
- The trust section reads like a magazine evidence ledger with strong rules and whitespace.
- The closing CTA uses a high-contrast navy or lavender field and the existing premium pill-button language.

## Mobile Composition

Mobile is independently composed rather than a stacked desktop page.

- The hero begins with the headline and CTA, followed by a portrait image with a controlled focal point.
- The origin story is split into short passages with the pull quote placed between them.
- The care journey becomes a vertical guided sequence with a visible rail, concise steps, and generous thumb-scrolling rhythm.
- Each doctor chapter has its own order: image, identifying line, narrative, evidence note, and CTA. The two chapters use distinct spacing and color fields so they do not feel like repeated cards.
- The team narrative is divided into short moments around a portrait mobile artwork rather than compressed beside an image.
- The trust ledger becomes a vertical reading sequence with strong section dividers.
- Touch targets are at least 44 by 44 CSS pixels, body text remains comfortably readable, and no interaction depends on hover.

No important content is hidden merely to shorten the page. Progressive pacing comes from composition and paragraph length rather than accordions.

## Motion Design

Use Framer Motion for restrained, component-scoped animation.

- Content reveals use opacity plus short transform distances.
- Desktop artwork may use subtle, bounded depth movement tied to viewport progress.
- Doctor chapters reveal image and text on separate but coordinated timings.
- Buttons use small hover and tap responses without large scale jumps.
- Mobile uses shorter distances, fewer simultaneous layers, and no continuous parallax.
- Animations run once where repetition would distract.
- Respect `prefers-reduced-motion` and render all content immediately when motion is reduced.
- Do not use scroll hijacking, smooth-scroll libraries, long pinned scenes, layout-affecting animation, or animation that creates blank scroll space.
- Animate transforms and opacity only wherever practical to protect mobile performance.

## Component Architecture

Keep the route server-rendered for metadata and content assembly. Place motion only in focused client components.

Suggested boundaries:

- `app/[locale]/(site)/about/page.tsx` — metadata and page composition
- `components/about/AboutHero.tsx`
- `components/about/AboutOrigin.tsx`
- `components/about/CareJourney.tsx`
- `components/about/DoctorStory.tsx` — reusable structure with explicit layout variant
- `components/about/CareTeam.tsx`
- `components/about/TrustInPractice.tsx`
- `components/about/AboutClosing.tsx`
- `components/about/Reveal.tsx` — small shared Framer Motion primitive with reduced-motion handling
- `lib/content/about.ts` or the existing locale message system — typed, centralized copy and verified facts

Avoid a single monolithic client page. Server-render all static copy and keep client JavaScript limited to animated wrappers and interactive links.

## Navigation and Actions

- Primary CTA routes to the existing contact or consultation path using locale-aware links.
- Secondary educational CTA routes to the relevant IVF education or procedures content already present in the site.
- In-page links use stable section IDs and native browser scrolling.
- Every control must have visible keyboard focus and meaningful accessible text.

## Error and Fallback Behavior

- The page must remain complete and readable if JavaScript is disabled or Framer Motion fails to initialize.
- Missing optional artwork must not collapse layout geometry; use a reserved aspect-ratio container with a brand-color surface only as a technical fallback, not as the intended delivered asset.
- Unsupported locales continue to follow the project's existing locale behavior.
- No runtime data request is required for the About content.

## Verification

Implementation is complete only when all of the following pass:

- TypeScript and production build succeed.
- Existing lint or project checks succeed, except for clearly documented unrelated pre-existing failures.
- All seven sections render in the intended order.
- Metadata remains locale-aware.
- CTAs resolve to valid locale-aware routes.
- Heading hierarchy contains one `h1` and logical `h2`/`h3` levels.
- Keyboard focus, reduced motion, alt text, and color contrast are checked.
- Mobile layouts are reviewed at narrow and common phone widths for overflow, cramped text, tap targets, and excessive motion.
- Desktop layouts are reviewed for line length, alignment, whitespace, and section continuity.
- There is no scroll hijacking, duplicated section, or unexplained blank space after the closing section.
- Content is audited against the supplied documents before handoff.

Browser preview remains off by default in accordance with the user's preference. It may be requested only if a visual defect cannot be responsibly evaluated through code and build checks alone.
