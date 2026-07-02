# IVF Master About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing About page with a seven-section, document-backed editorial experience that uses abstract imagery, Framer Motion, and intentionally different desktop and mobile compositions.

**Architecture:** Keep `app/[locale]/(site)/about/page.tsx` as the server-rendered route for metadata and composition. Store verified English copy in a typed content module, split visual sections into focused server components, and reuse the existing client-side `Reveal`, `Parallax`, and `Pressable` motion primitives so static content remains server rendered. Generate real raster artwork for the image slots rather than fabricating visible assets in CSS or SVG.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, next-intl, Next Image, Motion 12 (`motion/react`, the current Framer Motion package), existing IVF Master design tokens.

---

## File Map

- Create `lib/content/about.ts` — typed, document-backed About-page content.
- Create `components/about/AboutHero.tsx` — opening promise, CTA, hero artwork.
- Create `components/about/AboutOrigin.tsx` — why the clinic exists.
- Create `components/about/CareJourney.tsx` — four connected care moments.
- Create `components/about/DoctorStories.tsx` — two distinct editorial biographies.
- Create `components/about/CareTeam.tsx` — coordinated team narrative.
- Create `components/about/TrustInPractice.tsx` — evidence and ethics ledger.
- Create `components/about/AboutClosing.tsx` — final consultation CTA.
- Modify `app/[locale]/(site)/about/page.tsx` — route assembly and metadata.
- Modify `messages/en.json`, `messages/hi.json`, `messages/mr.json` — remove Mission wording from metadata while preserving locale support.
- Reuse `assets/cost/cost-desktop-2.png` and `assets/cost/cost-mobile-2.png` — abstract hero artwork.
- Reuse desktop/mobile pairs 3 and 4 from `assets/cost` — distinct doctor-story artwork.
- Reuse desktop/mobile pair 5 from `assets/cost` — abstract coordinated-care artwork.

### Task 1: Validate production artwork

**Files:**
- Verify: `assets/cost/cost-desktop-2.png` through `assets/cost/cost-desktop-5.png`
- Verify: `assets/cost/cost-mobile-2.png` through `assets/cost/cost-mobile-5.png`

- [ ] **Step 1: Verify asset geometry**

Run:

```powershell
Add-Type -AssemblyName System.Drawing
Get-ChildItem assets/cost/cost-desktop-[2-5].png, assets/cost/cost-mobile-[2-5].png | ForEach-Object {
  $image = [System.Drawing.Image]::FromFile($_.FullName)
  try { "{0}: {1}x{2}" -f $_.Name, $image.Width, $image.Height }
  finally { $image.Dispose() }
}
```

Expected: all eight files load successfully; desktop assets are landscape and mobile assets are portrait.

### Task 2: Add the verified content model

**Files:**
- Create: `lib/content/about.ts`

- [ ] **Step 1: Define the typed content interfaces**

Create explicit interfaces for `CareStep`, `DoctorStory`, and `TrustPoint`, then export one `aboutContent` object. The structure must include:

```ts
export interface CareStep {
  number: string
  title: string
  body: string
}

export interface DoctorStory {
  id: 'gorakh' | 'saie'
  name: string
  role: string
  pullQuote: string
  paragraphs: readonly string[]
  evidence: string
  image: string
  imageAlt: string
  ctaLabel: string
  ctaHref: string
}

export interface TrustPoint {
  label: string
  title: string
  body: string
}
```

- [ ] **Step 2: Add document-backed copy**

Populate all seven sections with the approved narrative. Include only these verified doctor facts: Pune University Gold Medal in Gynecology in 2004; reproductive-medicine consultant since March 2006; more than 20 years of practice; more than 2,000 couples helped; ten years directing a FOGSI-recognized IVF training centre; HDP Gestosis Score adoption by India's National Health Mission; Dr. Saie's Pune University postgraduate Obstetrics and Gynecology degree in 2005; her high-risk obstetrics, infertility, recurrent pregnancy loss, IVF pregnancy, diabetes, hypertension, research, and continuity-of-care experience.

Do not include a success-rate claim, guaranteed result, invented quote, staff name, or facility claim.

- [ ] **Step 3: Add development-time content assertions**

At the bottom of the module, add a non-production assertion that prevents missing section content:

```ts
if (process.env.NODE_ENV !== 'production') {
  if (aboutContent.care.steps.length !== 4) {
    throw new Error('About care journey must contain exactly four steps')
  }
  if (aboutContent.doctors.length !== 2) {
    throw new Error('About doctor stories must contain exactly two doctors')
  }
}
```

- [ ] **Step 4: Run the TypeScript compiler**

Run `pnpm exec tsc --noEmit`.

Expected: PASS with no errors from `lib/content/about.ts`.

### Task 3: Build the opening narrative and care journey

**Files:**
- Create: `components/about/AboutHero.tsx`
- Create: `components/about/AboutOrigin.tsx`
- Create: `components/about/CareJourney.tsx`

- [ ] **Step 1: Build the hero**

Use `Container`, `Image`, locale-aware `Link`, `Reveal`, `Parallax`, and `Pressable`. Render a single `h1`, a primary `/contact` CTA, and an anchor link to `#our-story`. Use `<picture>` so mobile receives `about-hero-mobile.png` and desktop receives `about-hero-desktop.png` without relying on a destructive crop.

The desktop grid is `lg:grid-cols-12`; copy spans seven columns and art spans five. Mobile order is copy, actions, then portrait art. Reserve image dimensions with aspect-ratio classes to prevent layout shift.

- [ ] **Step 2: Build the origin story**

Create `section#our-story` with a two-column desktop editorial layout and a single mobile reading column. Place the pull quote between short mobile paragraphs and beside the narrative on desktop.

- [ ] **Step 3: Build the care journey**

Render four semantic ordered-list items. Desktop uses a shared horizontal rule and four editorial scenes; mobile uses a vertical left rail. Each item uses `Reveal` with a maximum 24px desktop distance and 14px mobile-safe default. Do not use cards or pinned scrolling.

- [ ] **Step 4: Compile the new sections**

Run `pnpm exec tsc --noEmit`.

Expected: PASS and no client/server boundary error.

### Task 4: Build doctor and care-team chapters

**Files:**
- Create: `components/about/DoctorStories.tsx`
- Create: `components/about/CareTeam.tsx`

- [ ] **Step 1: Create a reusable doctor chapter**

Inside `DoctorStories.tsx`, create a local `DoctorChapter` component accepting `DoctorStory` plus `index`. Use `index` to alternate desktop image/text alignment and background field. Mobile always renders image, identifying line, story, evidence note, then CTA.

Use `Image` with the generated 4:5 artwork, `Parallax` with a desktop-safe range no greater than 24px, and `Reveal` for text. The biography is paragraphs, never credential bullets.

- [ ] **Step 2: Render both doctors from content**

Map `aboutContent.doctors` with stable `doctor.id` keys. Use locale-aware contact links, preserving doctor query parameters.

- [ ] **Step 3: Build the care-team narrative**

Use the wide generated image and short narrative moments for nursing, counselling, clinical, and embryology support. Desktop may overlay a contained ivory text panel only when contrast remains sufficient; mobile must place the text before and after the portrait-safe crop rather than shrinking the desktop composition.

- [ ] **Step 4: Compile the chapters**

Run `pnpm exec tsc --noEmit`.

Expected: PASS with no invalid image or link props.

### Task 5: Build evidence and closing sections

**Files:**
- Create: `components/about/TrustInPractice.tsx`
- Create: `components/about/AboutClosing.tsx`

- [ ] **Step 1: Build the trust ledger**

Render `aboutContent.trust.points` as a semantic list separated by rules. Use a two-column desktop ledger and one-column mobile sequence. Avoid icon badges, metric cards, and unsupported numeric claims.

- [ ] **Step 2: Build the closing CTA**

Create a high-contrast closing section with one primary `/contact` CTA and one secondary `/educate-ivf` link. Use `Pressable` for tap/hover feedback, visible focus styles, and a minimum 44px target height.

- [ ] **Step 3: Confirm reduced-motion behavior**

Verify that all animation comes through existing motion primitives backed by `useReducedMotion`. No essential content may start hidden outside those primitives, and there must be no scroll-trigger pinning or smooth-scroll dependency.

- [ ] **Step 4: Compile the final sections**

Run `pnpm exec tsc --noEmit`.

Expected: PASS.

### Task 6: Assemble the route and metadata

**Files:**
- Modify: `app/[locale]/(site)/about/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/hi.json`
- Modify: `messages/mr.json`

- [ ] **Step 1: Replace the old page body**

Remove the old gradient hero, generic story, and “Join our community” sections. Compose the seven new sections in this exact order:

```tsx
<AboutHero />
<AboutOrigin />
<CareJourney />
<DoctorStories />
<CareTeam />
<TrustInPractice />
<AboutClosing />
```

Keep the existing `Footer` after `main` and preserve `generateMetadata`.

- [ ] **Step 2: Update locale metadata**

Replace Mission-oriented metadata wording with calm About-page wording in all three locale files. Do not add unreviewed translations for the body copy; body copy remains the authoritative supplied English until human translations are provided.

- [ ] **Step 3: Run lint and TypeScript**

Run:

```powershell
pnpm exec tsc --noEmit
pnpm lint
```

Expected: both commands pass, or any unrelated pre-existing lint failures are recorded with exact file and rule.

### Task 7: Production verification

**Files:**
- Verify: all files listed above

- [ ] **Step 1: Run the production build**

Run `pnpm build`.

Expected: Next.js build succeeds and `/[locale]/about` is generated without metadata, image, or client-boundary errors.

- [ ] **Step 2: Run structural source checks**

Run:

```powershell
rg -n "<h1" components/about app/[locale]/(site)/about/page.tsx
rg -n "Mission|Vision|Core Values|world-class|guarantee" components/about lib/content/about.ts
rg -n "SmoothScroll|Lenis|ScrollTrigger" components/about app/[locale]/(site)/about/page.tsx
```

Expected: exactly one `h1`; no prohibited corporate or guarantee language; no smooth-scroll or pinned-scroll implementation.

- [ ] **Step 3: Check links, images, and layout safeguards**

Confirm every `Image` has width/height or `fill` with a reserved aspect-ratio parent, every image has appropriate alt text, all CTAs use locale-aware `Link`, and all sections have stable IDs where linked.

- [ ] **Step 4: Check working-tree scope**

Run `git status --short` and `git diff --check`.

Expected: no whitespace errors. Preserve unrelated existing user changes and report only the About-page files created or modified by this plan.

Browser preview remains off by default. Request permission only if a visual problem cannot be responsibly resolved through source and build verification.
