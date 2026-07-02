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
