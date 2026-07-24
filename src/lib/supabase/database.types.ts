export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
          id: string
          slug: string
          name: string
          flag_emoji: string | null
          flag_type: 'preset' | 'image' | null
          flag_preset_key: string | null
          flag_image_url: string | null
          visa_type: string | null
          summary: string | null
          mosaic_visible: boolean
          mosaic_order: number | null
          mosaic_span: string | null
          has_tourism: boolean
          danisma_visible: boolean
          tourism_intro: string[] | null
          tourism_highlights: string[] | null
          tourism_tips: string[] | null
          tourism_best_time: string | null
          tourism_hero_image_url: string | null
          appointment_days: string | null
          general_info: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          flag_emoji?: string | null
          flag_type?: 'preset' | 'image' | null
          flag_preset_key?: string | null
          flag_image_url?: string | null
          visa_type?: string | null
          summary?: string | null
          mosaic_visible?: boolean
          mosaic_order?: number | null
          mosaic_span?: string | null
          has_tourism?: boolean
          danisma_visible?: boolean
          tourism_intro?: string[] | null
          tourism_highlights?: string[] | null
          tourism_tips?: string[] | null
          tourism_best_time?: string | null
          tourism_hero_image_url?: string | null
          appointment_days?: string | null
          general_info?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          flag_emoji?: string | null
          flag_type?: 'preset' | 'image' | null
          flag_preset_key?: string | null
          flag_image_url?: string | null
          visa_type?: string | null
          summary?: string | null
          mosaic_visible?: boolean
          mosaic_order?: number | null
          mosaic_span?: string | null
          has_tourism?: boolean
          danisma_visible?: boolean
          tourism_intro?: string[] | null
          tourism_highlights?: string[] | null
          tourism_tips?: string[] | null
          tourism_best_time?: string | null
          tourism_hero_image_url?: string | null
          appointment_days?: string | null
          general_info?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      country_requirements: {
        Row: {
          id: string
          country_id: string
          text: string
          sort_order: number
        }
        Insert: {
          id?: string
          country_id: string
          text: string
          sort_order?: number
        }
        Update: {
          id?: string
          country_id?: string
          text?: string
          sort_order?: number
        }
      }
      country_handles: {
        Row: {
          id: string
          country_id: string
          text: string
          sort_order: number
        }
        Insert: {
          id?: string
          country_id: string
          text: string
          sort_order?: number
        }
        Update: {
          id?: string
          country_id?: string
          text?: string
          sort_order?: number
        }
      }
      country_faqs: {
        Row: {
          id: string
          country_id: string
          question: string
          answer: string
          sort_order: number
        }
        Insert: {
          id?: string
          country_id: string
          question: string
          answer: string
          sort_order?: number
        }
        Update: {
          id?: string
          country_id?: string
          question?: string
          answer?: string
          sort_order?: number
        }
      }
      country_documents: {
        Row: {
          id: string
          country_id: string
          label: string
          pdf_url: string
          sort_order: number
        }
        Insert: {
          id?: string
          country_id: string
          label: string
          pdf_url: string
          sort_order?: number
        }
        Update: {
          id?: string
          country_id?: string
          label?: string
          pdf_url?: string
          sort_order?: number
        }
      }
      mega_menu_categories: {
        Row: {
          id: string
          name: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          id?: string
          name: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          id?: string
          name?: string
          sort_order?: number
          visible?: boolean
        }
      }
      mega_menu_items: {
        Row: {
          id: string
          category_id: string
          country_id: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          id?: string
          category_id: string
          country_id: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          id?: string
          category_id?: string
          country_id?: string
          sort_order?: number
          visible?: boolean
        }
      }
      marquee_items: {
        Row: {
          id: string
          location: 'home' | 'nav_ticker'
          text: string
          url: string | null
          visible: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          location: 'home' | 'nav_ticker'
          text: string
          url?: string | null
          visible?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          location?: 'home' | 'nav_ticker'
          text?: string
          url?: string | null
          visible?: boolean
          sort_order?: number
        }
      }
      marquee_settings: {
        Row: {
          id: string
          location: 'home' | 'nav_ticker'
          enabled: boolean
        }
        Insert: {
          id?: string
          location: 'home' | 'nav_ticker'
          enabled?: boolean
        }
        Update: {
          id?: string
          location?: 'home' | 'nav_ticker'
          enabled?: boolean
        }
      }
      partnerships: {
        Row: {
          id: string
          name: string
          eyebrow: string | null
          description: string | null
          logo_url: string | null
          external_url: string | null
          visible: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          eyebrow?: string | null
          description?: string | null
          logo_url?: string | null
          external_url?: string | null
          visible?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          eyebrow?: string | null
          description?: string | null
          logo_url?: string | null
          external_url?: string | null
          visible?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          initials: string
          role: string
          photo_url: string | null
          visible: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          initials: string
          role: string
          photo_url?: string | null
          visible?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          initials?: string
          role?: string
          photo_url?: string | null
          visible?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      page_sections: {
        Row: {
          key: string
          title: string
          paragraphs: string[]
          updated_at: string
        }
        Insert: {
          key: string
          title?: string
          paragraphs?: string[]
          updated_at?: string
        }
        Update: {
          key?: string
          title?: string
          paragraphs?: string[]
          updated_at?: string
        }
      }
      admin_profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
        }
      }
      consultation_requests: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          country: string | null
          country_emoji: string | null
          travel_date: string | null
          return_date: string | null
          contact_pref: string
          note: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          country?: string | null
          country_emoji?: string | null
          travel_date?: string | null
          return_date?: string | null
          contact_pref: string
          note?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          country?: string | null
          country_emoji?: string | null
          travel_date?: string | null
          return_date?: string | null
          contact_pref?: string
          note?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      home_region_entries: {
        Row: {
          id: string
          region: 'avrupa' | 'populer' | 'asya' | 'amerika' | 'diger'
          name: string
          href: string
          preset_key: string
          subtitle: string
          pinned: boolean
          visible: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          region: 'avrupa' | 'populer' | 'asya' | 'amerika' | 'diger'
          name: string
          href: string
          preset_key: string
          subtitle?: string
          pinned?: boolean
          visible?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          region?: 'avrupa' | 'populer' | 'asya' | 'amerika' | 'diger'
          name?: string
          href?: string
          preset_key?: string
          subtitle?: string
          pinned?: boolean
          visible?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      home_region_settings: {
        Row: {
          id: string
          region: 'avrupa' | 'populer' | 'asya' | 'amerika' | 'diger'
          visible: boolean
        }
        Insert: {
          id?: string
          region: 'avrupa' | 'populer' | 'asya' | 'amerika' | 'diger'
          visible?: boolean
        }
        Update: {
          id?: string
          region?: 'avrupa' | 'populer' | 'asya' | 'amerika' | 'diger'
          visible?: boolean
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
