'use client'

import React from 'react'
import { motion } from 'motion/react'
import type { Testimonial } from '@/lib/content/testimonials'

export type { Testimonial } from '@/lib/content/testimonials'

export function TestimonialsColumn({
  testimonials,
  duration = 15,
  className,
  reduced,
}: Readonly<{
  testimonials: Testimonial[]
  duration?:    number
  className?:   string
  reduced?:     boolean
}>) {
  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <motion.div
        animate={reduced ? {} : { translateY: '-50%' }}
        transition={
          reduced
            ? {}
            : { duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }
        }
        style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem', paddingBottom: '1.125rem' }}
      >
        {[0, 1].map((pass) => (
          <React.Fragment key={pass}>
            {testimonials.map(({ text, name, situation, initials, avatarColor }) => (
              <div
                key={`${pass}-${name}`}
                style={{
                  padding:      '1.375rem 1.5rem',
                  borderRadius: '1.25rem',
                  border:       '1px solid rgba(195,148,80,0.16)',
                  background:   'rgba(255,252,248,0.88)',
                  boxShadow:    '0 4px 24px -8px rgba(55,28,8,0.10), 0 1px 4px rgba(55,28,8,0.06)',
                  maxWidth:     '300px',
                  width:        '100%',
                }}
              >
                {/* Quote mark */}
                <p
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize:   '2rem',
                    lineHeight: 0.8,
                    color:      '#D4A870',
                    marginBottom: '0.5rem',
                    fontStyle: 'normal',
                  }}
                >
                  &ldquo;
                </p>

                {/* Text */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize:   '0.9375rem',
                    lineHeight: 1.7,
                    color:      '#3D4255',
                  }}
                >
                  {text}
                </p>

                {/* Author */}
                <div
                  style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        '0.75rem',
                    marginTop:  '1rem',
                    paddingTop: '0.875rem',
                    borderTop:  '1px solid rgba(195,148,80,0.12)',
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width:           '36px',
                      height:          '36px',
                      borderRadius:    '50%',
                      background:      avatarColor,
                      display:         'flex',
                      alignItems:      'center',
                      justifyContent:  'center',
                      flexShrink:      0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize:   '0.6875rem',
                        fontWeight: 700,
                        color:      '#fff',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {initials}
                    </span>
                  </div>

                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize:   '0.875rem',
                        fontWeight: 600,
                        color:      '#1C2A48',
                        lineHeight: 1.25,
                      }}
                    >
                      {name}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize:   '0.8125rem',
                        color:      '#8A7060',
                        lineHeight: 1.25,
                      }}
                    >
                      {situation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}
