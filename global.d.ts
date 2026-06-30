// Type-safe translation keys.
// After this, calling t('Hero.missingKey') becomes a TypeScript error.
// The shape is derived from en.json — the source of truth for all keys.
import type en from './messages/en.json';

type Messages = typeof en;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
declare interface IntlMessages extends Messages {}
