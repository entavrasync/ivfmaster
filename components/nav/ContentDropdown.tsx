'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, BookOpen, CalendarDays, ChevronDown, Newspaper } from 'lucide-react'
import { Link, usePathname } from '@/i18n/navigation'
import type { SiteNavigationItem } from '@/sanity/lib/site-content-mapping'
import styles from './ContentDropdown.module.css'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function ContentDropdown({ item, mobile = false, onNavigate, isHovered = false, onHoverEnter }: { item: SiteNavigationItem; mobile?: boolean; onNavigate?: () => void; isHovered?: boolean; onHoverEnter?: () => void }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const keyboardOpen = useRef(false), openedByHover = useRef(false)
  const reduced = useReducedMotion()
  const id = useId(), pathname = usePathname()
  const matches = (href: string) => pathname === href || href !== '/' && pathname.startsWith(href + '/')
  const dropdownOnly = item.behavior === 'dropdown'
  const active = item.href !== undefined && matches(item.href) || item.children?.some(child => matches(child.href))
  const cancelClose = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null } }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => { if (event.target instanceof Node && !root.current?.contains(event.target)) { cancelClose(); setOpen(false) } }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])
  return <div ref={root} className={`${styles.root} ${mobile ? styles.mobile : ''}`}
    onMouseEnter={() => { cancelClose(); if (!mobile && window.matchMedia('(hover: hover)').matches) { keyboardOpen.current = false; if (!open) openedByHover.current = true; setOpen(true); onHoverEnter?.() } }}
    onMouseLeave={() => { if (!mobile) { cancelClose(); timer.current = setTimeout(() => { if (!keyboardOpen.current) { openedByHover.current = false; setOpen(false) } }, 150) } }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { cancelClose(); setOpen(false) } }}
    onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancelClose(); setOpen(false); trigger.current?.focus() }
    }}>
    <div className={styles.label} data-active={active}>
      {!mobile && (isHovered || open) && !reduced && <motion.div layoutId="nav-hover-pill" className={styles.hoverPill} transition={{ type: 'spring', stiffness: 500, damping: 45, mass: .5 }} />}
      {item.href !== undefined && <Link href={item.href} onClick={onNavigate} target={item.opensInNewTab ? '_blank' : undefined} rel={item.opensInNewTab ? 'noopener noreferrer' : undefined} aria-current={matches(item.href) ? 'page' : undefined} className="focus-visible:outline-2 focus-visible:outline-navy">{item.label}</Link>}
      <button ref={trigger} type="button" aria-label={item.label} aria-expanded={open} aria-controls={id}
        onClick={event => { cancelClose(); keyboardOpen.current = event.detail === 0; const fromHover = openedByHover.current; openedByHover.current = false; setOpen(value => fromHover || !value) }} onKeyDown={event => {
          if (event.key === 'ArrowDown') { event.preventDefault(); keyboardOpen.current = true; openedByHover.current = false; setOpen(true); requestAnimationFrame(() => root.current?.querySelector<HTMLAnchorElement>(`[id="${id}"] a`)?.focus()) }
        }} className={styles.trigger} data-only={dropdownOnly} style={!dropdownOnly ? { marginLeft: mobile ? 'auto' : 5 } : undefined}>
        {dropdownOnly && <span>{item.label}</span>}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {!mobile && active && <motion.span layoutId="nav-active-bar" className={styles.activeBar} transition={{ type: 'spring', stiffness: 400, damping: 40 }} />}
    </div>
    <ul id={id} hidden={!open} className={styles.panel}>
      {item.children?.map(child => { const Icon = child.href === '/events' ? CalendarDays : child.href === '/educate-ivf' ? BookOpen : Newspaper; return <li key={child.key}><Link href={child.href} aria-current={matches(child.href) ? 'page' : undefined}
        target={child.opensInNewTab ? '_blank' : undefined} rel={child.opensInNewTab ? 'noopener noreferrer' : undefined}
        onClick={() => { setOpen(false); onNavigate?.() }} className={styles.destination}><span className={styles.icon}><Icon size={17} aria-hidden="true" /></span><span>{child.label}</span><ArrowRight size={14} className={styles.arrow} aria-hidden="true" /></Link></li> })}
    </ul>
  </div>
}
