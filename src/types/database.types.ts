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
          role: 'creator' | 'brand' | 'admin';
          full_name: string;
          email: string;
          avatar_url: string | null;
          phone: string | null;
          bio: string | null;
          location: string | null;
          country: string;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      creator_profiles: {
        Row: {
          id: string;
          handle: string;
          headline: string;
          niches: string[];
          languages: string[];
          sponsored_reel_rate_paise: number;
          dedicated_video_rate_paise: number;
          story_set_rate_paise: number;
          custom_package_min_paise: number;
          rating: number;
          review_count: number;
          total_collaborations: number;
          completion_rate: number;
          is_public_profile: boolean;
          portfolio: Json;
          bank_account_verified: boolean;
          razorpay_contact_id: string | null;
          razorpay_fund_account_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['creator_profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['creator_profiles']['Insert']>;
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          industry: string;
          website: string | null;
          description: string | null;
          business_location: string;
          gstin: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      campaigns: {
        Row: {
          id: string;
          organization_id: string;
          created_by: string;
          title: string;
          description: string;
          niche: string;
          primary_platform: string;
          target_audience: Json;
          budget_min_paise: number;
          budget_max_paise: number;
          currency: string;
          creators_needed: number;
          creators_accepted_count: number;
          application_deadline: string;
          content_deadline: string;
          publication_date: string | null;
          usage_rights: string;
          exclusivity_requirements: string | null;
          revisions_limit: number;
          status: 'draft' | 'published' | 'in_progress' | 'paused' | 'completed' | 'closed';
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>;
      };
      proposals: {
        Row: {
          id: string;
          campaign_id: string;
          creator_id: string;
          cover_letter: string;
          proposed_rate_paise: number;
          currency: string;
          estimated_delivery_days: number;
          proposed_deliverables: Json;
          portfolio_links: string[];
          status: 'submitted' | 'shortlisted' | 'negotiating' | 'accepted' | 'rejected' | 'withdrawn';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['proposals']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['proposals']['Insert']>;
      };
      collaborations: {
        Row: {
          id: string;
          contract_id: string;
          campaign_id: string;
          organization_id: string;
          creator_id: string;
          status: string;
          total_amount_paise: number;
          payment_status: string;
          deadline: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['collaborations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['collaborations']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          collaboration_id: string;
          payer_user_id: string;
          organization_id: string;
          amount_paise: number;
          currency: string;
          provider: 'razorpay' | 'upi' | 'direct_bank';
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          status: 'created' | 'authorized' | 'captured' | 'settled' | 'failed' | 'refunded';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
    };
  };
}
