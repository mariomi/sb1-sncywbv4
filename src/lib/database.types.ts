export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      closed_dates: {
        Row: {
          created_at: string | null
          date: string
          id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          enabled: boolean
          id: string
          key: string
          label: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          key: string
          label: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          key?: string
          label?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          active: boolean | null
          category: string
          created_at: string | null
          description: string
          id: string
          is_special: boolean | null
          min_persons: number | null
          name: string
          price: string
          subcategory: string
          translation: string | null
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          is_special?: boolean | null
          min_persons?: number | null
          name: string
          price: string
          subcategory: string
          translation?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          is_special?: boolean | null
          min_persons?: number | null
          name?: string
          price?: string
          subcategory?: string
          translation?: string | null
        }
        Relationships: []
      }
      occasions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      recurring_closures: {
        Row: {
          active: boolean | null
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: []
      }
      reservation_settings: {
        Row: {
          advance_booking_limit: string
          cancellation_deadline: string
          created_at: string | null
          id: string
          max_party_size: number
          min_party_size: number
          reservation_interval: string
          restaurant_id: string | null
          updated_at: string | null
        }
        Insert: {
          advance_booking_limit?: string
          cancellation_deadline?: string
          created_at?: string | null
          id?: string
          max_party_size?: number
          min_party_size?: number
          reservation_interval?: string
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          advance_booking_limit?: string
          cancellation_deadline?: string
          created_at?: string | null
          id?: string
          max_party_size?: number
          min_party_size?: number
          reservation_interval?: string
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_settings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_statuses: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          admin_notes: string | null
          arrival_time: string | null
          attribution: Json
          cancellation_reason: string | null
          cancellation_token: string
          confirmation_sent_at: string | null
          created_at: string | null
          date: string
          departure_time: string | null
          email: string
          guests: number
          id: string
          locale: string
          marketing_consent: boolean
          name: string
          notes: string | null
          occasion: string | null
          occasion_id: string | null
          phone: string
          reminder_2h_sent_at: string | null
          reminder_sent_at: string | null
          restaurant_id: string | null
          source: string | null
          special_requests: string | null
          status: string
          status_id: string | null
          table_id: string | null
          time: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          arrival_time?: string | null
          attribution?: Json
          cancellation_reason?: string | null
          cancellation_token?: string
          confirmation_sent_at?: string | null
          created_at?: string | null
          date: string
          departure_time?: string | null
          email: string
          guests: number
          id?: string
          locale?: string
          marketing_consent?: boolean
          name: string
          notes?: string | null
          occasion?: string | null
          occasion_id?: string | null
          phone: string
          reminder_2h_sent_at?: string | null
          reminder_sent_at?: string | null
          restaurant_id?: string | null
          source?: string | null
          special_requests?: string | null
          status?: string
          status_id?: string | null
          table_id?: string | null
          time: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          arrival_time?: string | null
          attribution?: Json
          cancellation_reason?: string | null
          cancellation_token?: string
          confirmation_sent_at?: string | null
          created_at?: string | null
          date?: string
          departure_time?: string | null
          email?: string
          guests?: number
          id?: string
          locale?: string
          marketing_consent?: boolean
          name?: string
          notes?: string | null
          occasion?: string | null
          occasion_id?: string | null
          phone?: string
          reminder_2h_sent_at?: string | null
          reminder_sent_at?: string | null
          restaurant_id?: string | null
          source?: string | null
          special_requests?: string | null
          status?: string
          status_id?: string | null
          table_id?: string | null
          time?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_occasion_id_fkey"
            columns: ["occasion_id"]
            isOneToOne: false
            referencedRelation: "occasions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "reservation_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          created_at: string | null
          id: string
          location: string
          name: string
          total_capacity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location: string
          name: string
          total_capacity: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string
          name?: string
          total_capacity?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tables: {
        Row: {
          capacity: number
          created_at: string | null
          id: string
          is_active: boolean | null
          location: string
          name: string
          restaurant_id: string | null
          updated_at: string | null
        }
        Insert: {
          capacity: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location: string
          name: string
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string
          name?: string
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tables_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      time_slots: {
        Row: {
          booked_capacity: number
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          is_active: boolean | null
          is_lunch: boolean
          location: string | null
          max_capacity: number
          status: string
          time: string
        }
        Insert: {
          booked_capacity?: number
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          is_active?: boolean | null
          is_lunch: boolean
          location?: string | null
          max_capacity?: number
          status?: string
          time: string
        }
        Update: {
          booked_capacity?: number
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          is_active?: boolean | null
          is_lunch?: boolean
          location?: string | null
          max_capacity?: number
          status?: string
          time?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string | null
          date: string
          email: string
          guests: number
          id: string
          name: string
          notified_at: string | null
          occasion: string | null
          phone: string
          position: number
          special_requests: string | null
          status: string
          time: string
        }
        Insert: {
          created_at?: string | null
          date: string
          email: string
          guests: number
          id?: string
          name: string
          notified_at?: string | null
          occasion?: string | null
          phone: string
          position?: number
          special_requests?: string | null
          status?: string
          time: string
        }
        Update: {
          created_at?: string | null
          date?: string
          email?: string
          guests?: number
          id?: string
          name?: string
          notified_at?: string | null
          occasion?: string | null
          phone?: string
          position?: number
          special_requests?: string | null
          status?: string
          time?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_reservation_by_token: {
        Args: { p_token: string }
        Returns: string
      }
      create_contact_message: {
        Args: {
          p_email: string
          p_first_name: string
          p_last_name: string
          p_message: string
          p_subject: string
        }
        Returns: string
      }
      create_public_reservation: {
        Args: {
          p_attribution?: Json
          p_date: string
          p_email: string
          p_guests: number
          p_locale?: string
          p_marketing_consent?: boolean
          p_name: string
          p_occasion?: string
          p_phone: string
          p_special_requests?: string
          p_time: string
        }
        Returns: {
          cancellation_token: string
          reservation_id: string
        }[]
      }
      get_public_availability: {
        Args: { p_date: string }
        Returns: {
          available: boolean
          is_lunch: boolean
          is_recurring_closed: boolean
          max_capacity: number
          remaining_capacity: number
          slot_id: string
          slot_time: string
        }[]
      }
      get_reservation_summary_by_token: {
        Args: { p_token: string }
        Returns: {
          date: string
          guests: number
          id: string
          name: string
          status: string
          time: string
        }[]
      }
      join_public_waitlist: {
        Args: {
          p_date: string
          p_email: string
          p_guests: number
          p_name: string
          p_occasion?: string
          p_phone: string
          p_special_requests?: string
          p_time: string
        }
        Returns: {
          position: number
          waitlist_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
