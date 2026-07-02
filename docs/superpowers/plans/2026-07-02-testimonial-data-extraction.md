# Testimonial Data Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract testimonial records into a dedicated content module and balance any number of records across the existing three infinite-scrolling responsive columns.

**Architecture:** `lib/content/testimonials.ts` will own the shared type, immutable content array, and a pure three-column round-robin distributor. `SuccessStories.tsx` will import the prepared columns while `TestimonialsColumn.tsx` will retain its JSX, styles, responsive behavior, and looping animation unchanged.

**Tech Stack:** TypeScript, React 19, Next.js 16, Node.js built-in test runner, Motion.

---

## File Structure

- Create `lib/content/testimonials.ts`: testimonial schema, content, and pure column distribution.
- Create `tests/testimonials.test.ts`: regression coverage for arbitrary collection sizes and balanced distribution.
- Modify `components/sections/SuccessStories.tsx`: replace inline records and fixed slices with imported prepared columns.
- Modify `components/ui/TestimonialsColumn.tsx`: import and re-export the shared type without changing rendered markup or styling.

### Task 1: Specify arbitrary-size column distribution

**Files:**
- Create: `tests/testimonials.test.ts`
- Create: `lib/content/testimonials.ts`

- [ ] **Step 1: Write the failing distribution test**

Create `tests/testimonials.test.ts` with a fixture containing eleven records. Import `distributeTestimonials` from `../lib/content/testimonials.ts`, assert that it returns three columns sized `[4, 4, 3]`, preserves every record exactly once, and assigns records in round-robin order.

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import {
  distributeTestimonials,
  type Testimonial,
} from '../lib/content/testimonials.ts'

const testimonials: Testimonial[] = Array.from({ length: 11 }, (_, index) => ({
  text: `Testimonial ${index}`,
  name: `Patient ${index}`,
  situation: `Situation ${index}`,
  initials: `P${index}`,
  avatarColor: '#000000',
}))

test('distributes any number of testimonials evenly across three columns', () => {
  const columns = distributeTestimonials(testimonials)

  assert.deepEqual(columns.map((column) => column.length), [4, 4, 3])
  assert.deepEqual(columns[0].map(({ name }) => name), ['Patient 0', 'Patient 3', 'Patient 6', 'Patient 9'])
  assert.deepEqual(columns[1].map(({ name }) => name), ['Patient 1', 'Patient 4', 'Patient 7', 'Patient 10'])
  assert.deepEqual(columns[2].map(({ name }) => name), ['Patient 2', 'Patient 5', 'Patient 8'])
  assert.deepEqual(
    columns.flat().map(({ name }) => name).toSorted(),
    testimonials.map(({ name }) => name).toSorted(),
  )
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/testimonials.test.ts`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` because `lib/content/testimonials.ts` does not exist.

- [ ] **Step 3: Implement the dedicated data module**

Create `lib/content/testimonials.ts`. Define and export the five-field `Testimonial` type, move the nine existing records into `TESTIMONIALS` without changing their content, and implement the distributor:

```ts
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
```

- [ ] **Step 4: Run the test and verify GREEN**

Run: `node --test tests/testimonials.test.ts`

Expected: one passing test and zero failures.

### Task 2: Connect the existing components to the data module

**Files:**
- Modify: `components/sections/SuccessStories.tsx:3-81`
- Modify: `components/ui/TestimonialsColumn.tsx:3-12`

- [ ] **Step 1: Share the content type without changing UI markup**

In `TestimonialsColumn.tsx`, replace the local type declaration with:

```ts
import type { Testimonial } from '@/lib/content/testimonials'

export type { Testimonial } from '@/lib/content/testimonials'
```

Leave the function signature, JSX, classes, style objects, `[0, 1].map`, and Motion configuration byte-for-byte unchanged.

- [ ] **Step 2: Replace inline content and fixed slices**

In `SuccessStories.tsx`, remove the `Testimonial` type import, inline `TESTIMONIALS` array, and three fixed `.slice()` calls. Add:

```ts
import { TESTIMONIAL_COLUMNS } from '@/lib/content/testimonials'

const [firstColumn, secondColumn, thirdColumn] = TESTIMONIAL_COLUMNS
```

Leave the three `TestimonialsColumn` elements, durations, responsive classes, section markup, and all style values unchanged.

- [ ] **Step 3: Verify the data regression test**

Run: `node --test tests/testimonials.test.ts`

Expected: one passing test and zero failures.

- [ ] **Step 4: Verify protected UI contracts in the diff**

Run: `git diff -- components/ui/TestimonialsColumn.tsx components/sections/SuccessStories.tsx`

Expected: `TestimonialsColumn.tsx` changes only its type source; `SuccessStories.tsx` changes only imports/data declarations. The values `duration={16}`, `duration={20}`, `duration={18}`, `hidden md:block`, and `hidden lg:block` remain present.

### Task 3: Project verification

**Files:**
- Verify: all files above

- [ ] **Step 1: Run whitespace validation**

Run: `git diff --check`

Expected: exit code 0.

- [ ] **Step 2: Run TypeScript validation**

Run: `pnpm exec tsc --noEmit`

Expected: no new errors in testimonial files. The repository may continue to report the two pre-existing `StaggerProps` errors in `app/motion-test/page.tsx`.

- [ ] **Step 3: Run the production build**

Run: `pnpm build`

Expected: Next.js production build exits successfully.

- [ ] **Step 4: Review final scope**

Run: `git status --short` and `git diff --stat`.

Expected: testimonial implementation changes are limited to the new content module, new test, and the two existing testimonial component files; unrelated user changes remain untouched.
