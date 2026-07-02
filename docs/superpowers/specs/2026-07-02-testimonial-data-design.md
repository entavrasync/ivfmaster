# Testimonial Data Extraction Design

## Goal

Move testimonial content into a dedicated data module and allow any number of testimonials to populate the existing three continuously rotating columns without changing the rendered structure, styling, responsive behavior, or animation.

## Scope

- Create `lib/content/testimonials.ts` as the single source of testimonial content.
- Define and export the `Testimonial` type from that module.
- Export the testimonial collection as immutable data.
- Export a function that distributes testimonials across exactly three columns in round-robin order.
- Update `SuccessStories.tsx` to consume the dedicated data module instead of its inline array and fixed slices.
- Update `TestimonialsColumn.tsx` to import the shared type only if required.

## Preserved Behavior

- Keep the `SuccessStories` and `TestimonialsColumn` component structure unchanged.
- Keep all inline styles and CSS classes unchanged.
- Keep the duplicated `[0, 1]` rendering pass used by the seamless loop.
- Keep animation durations of 16, 20, and 18 seconds.
- Keep the responsive visibility behavior: one column on mobile, two from `md`, and three from `lg`.
- Keep the existing testimonial order deterministic.

## Data Flow

`lib/content/testimonials.ts` owns the testimonial records. A pure distribution function creates three arrays by assigning record `n` to column `n % 3`. `SuccessStories.tsx` passes those arrays to the same three `TestimonialsColumn` instances already rendered today. Each column continues to duplicate its received records internally for the infinite vertical loop.

Round-robin distribution is preferred over fixed slicing because adding a tenth or later testimonial requires no component edits and remains balanced across the three columns.

## Edge Cases

- Any positive number of testimonials is accepted.
- Empty columns remain valid when fewer than three testimonials exist, although production content should retain enough entries for each visible desktop column.
- Duplicate patient names remain unsupported because the current card key uses the name; this behavior will not be changed in this task.

## Verification

- Add a focused test for round-robin distribution with more than nine records.
- Confirm every source testimonial appears exactly once across the distributed columns.
- Confirm column counts differ by no more than one.
- Run the production build.
- Verify that no JSX structure, CSS value, responsive class, or animation setting changed in `TestimonialsColumn.tsx`.
