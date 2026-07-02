export interface ContactFormData {
  name:             string
  reachingAs:       string
  duration:         string
  reason:           string
  preferredContact: string
  bestTime:         string
  openMessage:      string
}

/**
 * Builds the pre-formatted WhatsApp message from contact form data.
 * Optional fields are cleanly omitted when blank.
 * Uses WhatsApp *bold* markers and newlines for structure.
 */
export function buildWhatsappMessage(data: ContactFormData): string {
  const lines: string[] = [
    '*New enquiry — IVF Master*',
    '',
    `*Name:* ${data.name}`,
  ]

  if (data.reachingAs)
    lines.push(`*Reaching out as:* ${data.reachingAs}`)

  if (data.duration)
    lines.push(`*Trying for:* ${data.duration}`)

  if (data.reason)
    lines.push(`*What brings them here:* ${data.reason}`)

  const contactParts = [data.preferredContact, data.bestTime].filter(Boolean)
  if (contactParts.length)
    lines.push(`*Preferred contact:* ${contactParts.join(' · ')}`)

  if (data.openMessage)
    lines.push('', '*In their words:*', data.openMessage)

  return lines.join('\n')
}
