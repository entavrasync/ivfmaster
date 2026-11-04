import assert from 'node:assert/strict'
import test from 'node:test'
import { getListVisibility } from '../components/publications/list-visibility.ts'

test('visibility remains bounded for empty, short and large lists with featured items', () => {
  for (let total = 0; total <= 100; total++) {
    for (let featured = 0; featured <= Math.min(3, total); featured++) {
      for (const requested of [0, 5, 10, 11, 25, 105]) {
        const state = getListVisibility(total, featured, requested)
        assert(state.shown >= Math.min(5, total) && state.shown <= total)
        assert.equal(state.visibleItems + featured, state.shown)
        assert.equal(state.canShowMore, state.moreTarget > state.shown)
        assert.equal(state.canShowLess, state.lessTarget < state.shown)
        assert(state.moreTarget - state.shown >= 0 && state.moreTarget - state.shown <= 5)
        assert(state.shown - state.lessTarget >= 0 && state.shown - state.lessTarget <= 5)
      }
    }
  }
})

test('any list length expands and collapses in steps of five, with bounded final steps', () => {
  let state = getListVisibility(27, 1)
  const counts = [state.shown]
  while (state.canShowMore) {
    state = getListVisibility(27, 1, state.moreTarget)
    counts.push(state.shown)
  }
  while (state.canShowLess) {
    state = getListVisibility(27, 1, state.lessTarget)
    counts.push(state.shown)
  }
  assert.deepEqual(counts, [5, 10, 15, 20, 25, 27, 22, 17, 12, 7, 5])
})

test('live shrinking and growing lists derive working actions from actual visible items', () => {
  const expanded = getListVisibility(11, 1, 11)
  const shortened = getListVisibility(3, 1, expanded.shown)
  assert.equal(shortened.shown, 3)
  assert.equal(shortened.canShowMore, false)
  assert.equal(shortened.canShowLess, false)
  const grown = getListVisibility(25, 1, expanded.shown)
  assert.equal(grown.shown, 11)
  assert.equal(grown.moreTarget, 16)
  assert.equal(grown.lessTarget, 6)
  assert.equal(getListVisibility(25, 1, grown.lessTarget).lessTarget, 5)
  assert.equal(getListVisibility(0, 0, expanded.shown).shown, 0)
})
