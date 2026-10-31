import { Fragment, type ReactNode } from 'react'
import type { PublicationBlock } from '@/sanity/lib/publication-model'

function text(block: PublicationBlock) {
  return block.children.map(span => {
    let content: ReactNode = span.text
    for (const mark of span.marks) {
      if (mark === 'strong') content = <strong>{content}</strong>
      else if (mark === 'em') content = <em>{content}</em>
      else {
        const link = block.markDefs.find(def => def._key === mark)
        if (link) content = <a className="underline decoration-navy/40 underline-offset-4 hover:decoration-navy" href={link.href}>{content}</a>
      }
    }
    return <Fragment key={span._key}>{content}</Fragment>
  })
}
export function PublicationRichText({ blocks }: { blocks: PublicationBlock[] }) {
  const nodes: ReactNode[] = []
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block.listItem) {
      const list = [block]
      while (blocks[i + 1]?.listItem === block.listItem) list.push(blocks[++i])
      const Tag = block.listItem === 'number' ? 'ol' : 'ul'
      nodes.push(<Tag key={block._key} className={`my-6 space-y-3 pl-6 ${Tag === 'ol' ? 'list-decimal' : 'list-disc'}`}>{list.map(item => <li key={item._key}>{text(item)}</li>)}</Tag>)
    } else {
      const Tag = block.style === 'normal' ? 'p' : block.style
      nodes.push(<Tag key={block._key} className={Tag === 'p' ? 'my-6 whitespace-pre-line' : Tag === 'blockquote' ? 'my-10 border-l-2 border-blush pl-6 font-display text-2xl text-navy' : 'mb-5 mt-12 font-display text-3xl leading-tight text-ink'}>{text(block)}</Tag>)
    }
  }
  return <div className="text-lg leading-relaxed text-ink/80">{nodes}</div>
}
