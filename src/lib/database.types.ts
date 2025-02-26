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
          restaurant_id: string
          table_id: string | null
          occasion_id: string | null
          status_id: string
          date: string
          time: string
          guests: number
          name: string
          email: string
          phone: string
          notes: string | null
          special_requests: string | null
          marketing_consent: boolean
          arrival_time: string | null
          departure_time: string | null
          cancellation_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          table_id?: string | null
          occasion_id?: string | null
          status_id: string
          date: string
          time: string
          guests: number
          name: string
          email: string
          phone: string
          notes?: string | null
          special_requests?: string | null
          marketing_consent?: boolean
          arrival_time?: string | null
          departure_time?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          table_id?: string | null
          occasion_id?: string | null
          status_id?: string
          date?: string
          time?: string
          guests?: number
          name?: string
          email?: string
          phone?: string
          notes?: string | null
          special_requests?: string | null
          marketing_consent?: boolean
          arrival_time?: string | null
          departure_time?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}