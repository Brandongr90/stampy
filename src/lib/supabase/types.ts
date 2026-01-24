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
      businesses: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          business_type: string | null
          logo_url: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          subscription_tier: string
          subscription_status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          business_type?: string | null
          logo_url?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          subscription_tier?: string
          subscription_status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          business_type?: string | null
          logo_url?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          subscription_tier?: string
          subscription_status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loyalty_programs: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          type: string
          reward_threshold: number
          reward_description: string | null
          design_config: Json | null
          apple_pass_type_id: string | null
          google_class_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          type: string
          reward_threshold: number
          reward_description?: string | null
          design_config?: Json | null
          apple_pass_type_id?: string | null
          google_class_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          type?: string
          reward_threshold?: number
          reward_description?: string | null
          design_config?: Json | null
          apple_pass_type_id?: string | null
          google_class_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          business_id: string
          name: string | null
          email: string | null
          phone: string | null
          created_at: string
          last_visit: string | null
          total_visits: number
        }
        Insert: {
          id?: string
          business_id: string
          name?: string | null
          email?: string | null
          phone?: string | null
          created_at?: string
          last_visit?: string | null
          total_visits?: number
        }
        Update: {
          id?: string
          business_id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          created_at?: string
          last_visit?: string | null
          total_visits?: number
        }
      }
      loyalty_cards: {
        Row: {
          id: string
          program_id: string
          customer_id: string
          serial_number: string
          current_points: number
          current_stamps: number
          total_rewards_redeemed: number
          qr_code: string | null
          apple_pass_url: string | null
          google_pass_url: string | null
          status: string
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          program_id: string
          customer_id: string
          serial_number: string
          current_points?: number
          current_stamps?: number
          total_rewards_redeemed?: number
          qr_code?: string | null
          apple_pass_url?: string | null
          google_pass_url?: string | null
          status?: string
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          customer_id?: string
          serial_number?: string
          current_points?: number
          current_stamps?: number
          total_rewards_redeemed?: number
          qr_code?: string | null
          apple_pass_url?: string | null
          google_pass_url?: string | null
          status?: string
          last_updated?: string
          created_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          business_id: string
          title: string
          description: string | null
          discount_type: string | null
          discount_value: number | null
          terms_conditions: string | null
          design_config: Json | null
          valid_from: string
          valid_until: string | null
          max_redemptions: number | null
          current_redemptions: number
          apple_pass_type_id: string | null
          google_class_id: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          title: string
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          terms_conditions?: string | null
          design_config?: Json | null
          valid_from?: string
          valid_until?: string | null
          max_redemptions?: number | null
          current_redemptions?: number
          apple_pass_type_id?: string | null
          google_class_id?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          title?: string
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          terms_conditions?: string | null
          design_config?: Json | null
          valid_from?: string
          valid_until?: string | null
          max_redemptions?: number | null
          current_redemptions?: number
          apple_pass_type_id?: string | null
          google_class_id?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      coupon_instances: {
        Row: {
          id: string
          coupon_id: string
          customer_id: string | null
          serial_number: string
          qr_code: string | null
          apple_pass_url: string | null
          google_pass_url: string | null
          status: string
          redeemed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          coupon_id: string
          customer_id?: string | null
          serial_number: string
          qr_code?: string | null
          apple_pass_url?: string | null
          google_pass_url?: string | null
          status?: string
          redeemed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          coupon_id?: string
          customer_id?: string | null
          serial_number?: string
          qr_code?: string | null
          apple_pass_url?: string | null
          google_pass_url?: string | null
          status?: string
          redeemed_at?: string | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          business_id: string
          customer_id: string
          loyalty_card_id: string | null
          coupon_instance_id: string | null
          type: string
          points_change: number
          stamps_change: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          customer_id: string
          loyalty_card_id?: string | null
          coupon_instance_id?: string | null
          type: string
          points_change?: number
          stamps_change?: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          customer_id?: string
          loyalty_card_id?: string | null
          coupon_instance_id?: string | null
          type?: string
          points_change?: number
          stamps_change?: number
          description?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          business_id: string
          title: string
          message: string
          type: string
          target_audience: string | null
          geofence_radius: number | null
          scheduled_for: string | null
          sent_at: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          title: string
          message: string
          type: string
          target_audience?: string | null
          geofence_radius?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          title?: string
          message?: string
          type?: string
          target_audience?: string | null
          geofence_radius?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          business_id: string
          event_type: string
          customer_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          event_type: string
          customer_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          event_type?: string
          customer_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}
