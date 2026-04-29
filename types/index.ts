export type BookingStatus =
  | 'new'
  | 'confirmed'
  | 'pending_review'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'pending_cal'

export interface ServiceCategory {
  id: string
  name: string
  description: string
  cover_image_url: string | null
  sort_order: number
  visible: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar_url: string | null
}

export interface Booking {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  service_category_id: string
  project_description: string
  photo_urls: string[]
  cal_booking_uid: string | null
  scheduled_at: string | null
  status: BookingStatus
  assigned_team_member_id: string | null
  created_at: string
  service_category?: ServiceCategory
  assigned_team_member?: TeamMember | null
}

export interface PortfolioPhoto {
  id: string
  image_url: string
  category_id: string | null
  caption: string | null
  created_at: string
  service_category?: ServiceCategory
}

export interface Testimonial {
  id: string
  customer_name: string
  customer_city: string
  quote: string
  star_rating: number
  featured: boolean
  created_at: string
}

export interface CalWebhookPayload {
  triggerEvent: string
  payload: {
    uid: string
    title: string
    startTime: string
    attendees: Array<{ email: string; name: string }>
    metadata?: Record<string, string>
  }
}
