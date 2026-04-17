export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin';
          charity_id: string | null;
          charity_percentage: number;
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'trialing';
          subscription_plan: 'monthly' | 'yearly' | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          charity_id?: string | null;
          charity_percentage?: number;
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'trialing';
          subscription_plan?: 'monthly' | 'yearly' | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          charity_id?: string | null;
          charity_percentage?: number;
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'trialing';
          subscription_plan?: 'monthly' | 'yearly' | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_current_period_end?: string | null;
          updated_at?: string;
        };
      };
      charities: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string | null;
          website_url: string | null;
          category: string;
          total_raised: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url?: string | null;
          website_url?: string | null;
          category: string;
          total_raised?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          image_url?: string | null;
          website_url?: string | null;
          category?: string;
          total_raised?: number;
          is_active?: boolean;
        };
      };
      scores: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          date_played: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score: number;
          date_played: string;
          created_at?: string;
        };
        Update: {
          score?: number;
          date_played?: string;
        };
      };
      draws: {
        Row: {
          id: string;
          month: number;
          year: number;
          status: 'pending' | 'simulated' | 'completed';
          draw_logic: 'random' | 'most_frequent' | 'least_frequent';
          winning_numbers: number[] | null;
          pool_amount: number;
          jackpot_amount: number;
          tier_two_amount: number;
          tier_three_amount: number;
          jackpot_rolled_over: number;
          total_participants: number;
          created_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          month: number;
          year: number;
          status?: 'pending' | 'simulated' | 'completed';
          draw_logic?: 'random' | 'most_frequent' | 'least_frequent';
          winning_numbers?: number[] | null;
          pool_amount?: number;
          jackpot_amount?: number;
          tier_two_amount?: number;
          tier_three_amount?: number;
          jackpot_rolled_over?: number;
          total_participants?: number;
          created_at?: string;
          published_at?: string | null;
        };
        Update: {
          status?: 'pending' | 'simulated' | 'completed';
          draw_logic?: 'random' | 'most_frequent' | 'least_frequent';
          winning_numbers?: number[] | null;
          pool_amount?: number;
          jackpot_amount?: number;
          tier_two_amount?: number;
          tier_three_amount?: number;
          jackpot_rolled_over?: number;
          total_participants?: number;
          published_at?: string | null;
        };
      };
      winners: {
        Row: {
          id: string;
          draw_id: string;
          user_id: string;
          matched_numbers: number[];
          match_tier: 3 | 4 | 5;
          prize_amount: number;
          payout_status: 'pending' | 'approved' | 'paid' | 'rejected';
          proof_url: string | null;
          created_at: string;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          draw_id: string;
          user_id: string;
          matched_numbers: number[];
          match_tier: 3 | 4 | 5;
          prize_amount: number;
          payout_status?: 'pending' | 'approved' | 'paid' | 'rejected';
          proof_url?: string | null;
          created_at?: string;
          paid_at?: string | null;
        };
        Update: {
          payout_status?: 'pending' | 'approved' | 'paid' | 'rejected';
          proof_url?: string | null;
          paid_at?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'subscription' | 'prize' | 'charity';
          amount: number;
          currency: string;
          stripe_payment_intent_id: string | null;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'subscription' | 'prize' | 'charity';
          amount: number;
          currency?: string;
          stripe_payment_intent_id?: string | null;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          metadata?: Json;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Charity = Database['public']['Tables']['charities']['Row'];
export type Score = Database['public']['Tables']['scores']['Row'];
export type Draw = Database['public']['Tables']['draws']['Row'];
export type Winner = Database['public']['Tables']['winners']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
