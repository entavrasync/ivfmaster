export const LIST_STEP = 5

/** Derive every action from the live total, including when a CMS refresh removes items. */
export function getListVisibility(total: number, featuredCount: number, requestedShown = LIST_STEP) {
  const minimumShown = Math.min(total, Math.max(LIST_STEP, featuredCount))
  const shown = Math.min(total, Math.max(minimumShown, requestedShown))
  return {
    minimumShown,
    shown,
    visibleItems: Math.max(0, shown - featuredCount),
    canShowMore: shown < total,
    canShowLess: shown > minimumShown,
    moreTarget: Math.min(total, shown + LIST_STEP),
    lessTarget: Math.max(minimumShown, shown - LIST_STEP),
  }
}
