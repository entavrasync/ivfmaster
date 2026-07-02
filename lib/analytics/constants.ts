export const ANALYTICS_EVENTS = {
  bookAppointment: 'book_appointment',
  whatsappClick: 'whatsapp_click',
  phoneClick: 'phone_click',
  emailClick: 'email_click',
  googleMapsClick: 'google_maps_click',
  doctorProfileView: 'doctor_profile_view',
  procedureView: 'procedure_view',
  blogRead: 'blog_read',
  faqExpand: 'faq_expand',
  formSubmit: 'form_submit',
  videoPlay: 'video_play',
  ctaClick: 'cta_click',
} as const

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]
