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
      restaurants: {
        Row: {
          id: string
          name: string
          location: string
          total_capacity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          total_capacity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          total_capacity?: number
          created_at?: string
          updated_at?: string
        }
      }
      tables: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          capacity: number
          location: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          capacity: number
          location: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          capacity?: number
          location?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reservation_settings: {
        Row: {
          id: string
          restaurant_id: string
          min_party_size: number
          max_party_size: number
          reservation_interval: string
          advance_booking_limit: string
          cancellation_deadline: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          min_party_size?: number
          max_party_size?: number
          reservation_interval?: string
          advance_booking_limit?: string
          cancellation_deadline?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          min_party_size?: number
          max_party_size?: number
          reservation_interval?: string
          advance_booking_limit?: string
          cancellation_deadline?: string
          created_at?: string
          updated_at?: string
        }
      }
      occasions: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reservation_statuses: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          created_at: string
          date: string
          time: string
          guests: number
          name: string
          email: string
          phone: string
          // Original text columns
          status: string
          occasion: string | null
          special_requests: string | null
          user_id: string | null
          marketing_consent: boolean
          // Extended columns from migration
          restaurant_id: string | null
          table_id: string | null
          occasion_id: string | null
          status_id: string | null
          notes: string | null
          arrival_time: string | null
          departure_time: string | null
          cancellation_reason: string | null
          updated_at: string | null
          // New columns
          source: string | null
          admin_notes: string | null
          reminder_sent_at: string | null
          cancellation_token: string
        }
        Insert: {
          id?: string
          created_at?: string
          date: string
          time: string
          guests: number
          name: string
          email: string
          phone: string
          status?: string
          occasion?: string | null
          special_requests?: string | null
          user_id?: string | null
          marketing_consent?: boolean
          restaurant_id?: string | null
          table_id?: string | null
          occasion_id?: string | null
          status_id?: string | null
          notes?: string | null
          arrival_time?: string | null
          departure_time?: string | null
          cancellation_reason?: string | null
          updated_at?: string
          source?: string | null
          admin_notes?: string | null
          reminder_sent_at?: string | null
          cancellation_token?: string
        }
        Update: {
          id?: string
          created_at?: string
          date?: string
          time?: string
          guests?: number
          name?: string
          email?: string
          phone?: string
          status?: string
          occasion?: string | null
          special_requests?: string | null
          user_id?: string | null
          marketing_consent?: boolean
          restaurant_id?: string | null
          table_id?: string | null
          occasion_id?: string | null
          status_id?: string | null
          notes?: string | null
          arrival_time?: string | null
          departure_time?: string | null
          cancellation_reason?: string | null
          updated_at?: string
          source?: string | null
          admin_notes?: string | null
          reminder_sent_at?: string | null
          cancellation_token?: string
        }
      }
      feature_flags: {
        Row: {
          id: string
          key: string
          label: string
          description: string | null
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          label: string
          description?: string | null
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          label?: string
          description?: string | null
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      waitlist: {
        Row: {
          id: string
          created_at: string
          date: string
          time: string
          guests: number
          name: string
          email: string
          phone: string
          occasion: string | null
          special_requests: string | null
          status: string
          notified_at: string | null
          position: number
        }
        Insert: {
          id?: string
          created_at?: string
          date: string
          time: string
          guests: number
          name: string
          email: string
          phone: string
          occasion?: string | null
          special_requests?: string | null
          status?: string
          notified_at?: string | null
          position?: number
        }
        Update: {
          id?: string
          created_at?: string
          date?: string
          time?: string
          guests?: number
          name?: string
          email?: string
          phone?: string
          occasion?: string | null
          special_requests?: string | null
          status?: string
          notified_at?: string | null
          position?: number
        }
      }
    }
  }
}
