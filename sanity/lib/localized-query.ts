// Match String.trim(), including Marathi copy separated by non-breaking spaces.
const whitespace = JSON.stringify(Array.from(' \t\n\r\v\f\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff'))

/** GROQ coalesce only skips null; a cleared translation must use the other locale. */
export function localizedValue(field: string): string {
  // Ordinary copy takes the indexed-token fast path. Punctuation/emoji still
  // count as content; only that short fallback needs a character scan.
  const present = (locale: string) => `select(${field}.${locale} match "*" => ${field}.${locale}, count(string::split(${field}.${locale}, "")[!(@ in ${whitespace})]) > 0 => ${field}.${locale})`
  return `select($locale == "en" => coalesce(${present('en')}, ${present('mr')}), coalesce(${present('mr')}, ${present('en')}))`
}
