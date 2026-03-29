// Auto-generated TypeScript types for Supabase database
// Run: npx supabase gen types typescript --project-id your-project-id > src/lib/supabase/database.types.ts

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
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string | null;
          role: UserRole;
          first_name: string | null;
          last_name: string | null;
          display_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          bio: string | null;
          artist_name: string | null;
          stage_name: string | null;
          genre: string | null;
          label: string | null;
          social_links: Json;
          is_verified: boolean;
          is_active: boolean;
          is_banned: boolean;
          ban_reason: string | null;
          wallet_balance: number;
          last_login_at: string | null;
          email_verified_at: string | null;
          created_at: string;
          updated_at: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash?: string | null;
          role?: UserRole;
          first_name?: string | null;
          last_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          bio?: string | null;
          artist_name?: string | null;
          stage_name?: string | null;
          genre?: string | null;
          label?: string | null;
          social_links?: Json;
          is_verified?: boolean;
          is_active?: boolean;
          is_banned?: boolean;
          ban_reason?: string | null;
          wallet_balance?: number;
          last_login_at?: string | null;
          email_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string | null;
          role?: UserRole;
          first_name?: string | null;
          last_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          bio?: string | null;
          artist_name?: string | null;
          stage_name?: string | null;
          genre?: string | null;
          label?: string | null;
          social_links?: Json;
          is_verified?: boolean;
          is_active?: boolean;
          is_banned?: boolean;
          ban_reason?: string | null;
          wallet_balance?: number;
          last_login_at?: string | null;
          email_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          currency: string;
          discount_percentage: number;
          plan_type: PlanType;
          playlist_count: number;
          platform_count: number;
          duration_days: number;
          max_songs: number;
          features: Json;
          platforms: PlatformType[];
          is_active: boolean;
          is_featured: boolean;
          is_popular: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          currency?: string;
          discount_percentage?: number;
          plan_type?: PlanType;
          playlist_count?: number;
          platform_count?: number;
          duration_days?: number;
          max_songs?: number;
          features?: Json;
          platforms?: PlatformType[];
          is_active?: boolean;
          is_featured?: boolean;
          is_popular?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          currency?: string;
          discount_percentage?: number;
          plan_type?: PlanType;
          playlist_count?: number;
          platform_count?: number;
          duration_days?: number;
          max_songs?: number;
          features?: Json;
          platforms?: PlatformType[];
          is_active?: boolean;
          is_featured?: boolean;
          is_popular?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string | null;
          track_title: string;
          artist_name: string;
          genre: string | null;
          release_date: string | null;
          duration_seconds: number | null;
          spotify_url: string | null;
          youtube_url: string | null;
          apple_music_url: string | null;
          soundcloud_url: string | null;
          audiomack_url: string | null;
          other_urls: Json;
          cover_art_url: string | null;
          preview_url: string | null;
          spotify_track_id: string | null;
          spotify_popularity: number | null;
          youtube_video_id: string | null;
          youtube_view_count: number | null;
          api_metadata: Json;
          status: SubmissionStatus;
          progress_percentage: number;
          admin_notes: string | null;
          rejection_reason: string | null;
          target_playlists: number;
          completed_playlists: number;
          target_plays: number;
          achieved_plays: number;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id?: string | null;
          track_title: string;
          artist_name: string;
          genre?: string | null;
          release_date?: string | null;
          duration_seconds?: number | null;
          spotify_url?: string | null;
          youtube_url?: string | null;
          apple_music_url?: string | null;
          soundcloud_url?: string | null;
          audiomack_url?: string | null;
          other_urls?: Json;
          cover_art_url?: string | null;
          preview_url?: string | null;
          spotify_track_id?: string | null;
          spotify_popularity?: number | null;
          youtube_video_id?: string | null;
          youtube_view_count?: number | null;
          api_metadata?: Json;
          status?: SubmissionStatus;
          progress_percentage?: number;
          admin_notes?: string | null;
          rejection_reason?: string | null;
          target_playlists?: number;
          completed_playlists?: number;
          target_plays?: number;
          achieved_plays?: number;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string | null;
          track_title?: string;
          artist_name?: string;
          genre?: string | null;
          release_date?: string | null;
          duration_seconds?: number | null;
          spotify_url?: string | null;
          youtube_url?: string | null;
          apple_music_url?: string | null;
          soundcloud_url?: string | null;
          audiomack_url?: string | null;
          other_urls?: Json;
          cover_art_url?: string | null;
          preview_url?: string | null;
          spotify_track_id?: string | null;
          spotify_popularity?: number | null;
          youtube_video_id?: string | null;
          youtube_view_count?: number | null;
          api_metadata?: Json;
          status?: SubmissionStatus;
          progress_percentage?: number;
          admin_notes?: string | null;
          rejection_reason?: string | null;
          target_playlists?: number;
          completed_playlists?: number;
          target_plays?: number;
          achieved_plays?: number;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Json;
        };
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          submission_id: string | null;
          name: string;
          description: string | null;
          status: CampaignStatus;
          start_date: string | null;
          end_date: string | null;
          budget: number;
          spent_amount: number;
          target_plays: number;
          target_saves: number;
          target_followers: number;
          achieved_plays: number;
          achieved_saves: number;
          achieved_followers: number;
          platforms: PlatformType[];
          target_countries: string[] | null;
          target_genres: string[] | null;
          target_age_range: string | null;
          targeting: Json;
          analytics: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          submission_id?: string | null;
          name: string;
          description?: string | null;
          status?: CampaignStatus;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number;
          spent_amount?: number;
          target_plays?: number;
          target_saves?: number;
          target_followers?: number;
          achieved_plays?: number;
          achieved_saves?: number;
          achieved_followers?: number;
          platforms?: PlatformType[];
          target_countries?: string[] | null;
          target_genres?: string[] | null;
          target_age_range?: string | null;
          targeting?: Json;
          analytics?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          submission_id?: string | null;
          name?: string;
          description?: string | null;
          status?: CampaignStatus;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number;
          spent_amount?: number;
          target_plays?: number;
          target_saves?: number;
          target_followers?: number;
          achieved_plays?: number;
          achieved_saves?: number;
          achieved_followers?: number;
          platforms?: PlatformType[];
          target_countries?: string[] | null;
          target_genres?: string[] | null;
          target_age_range?: string | null;
          targeting?: Json;
          analytics?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          submission_id: string | null;
          plan_id: string | null;
          amount: number;
          currency: string;
          status: PaymentStatus;
          payment_method: PaymentMethod;
          gateway_reference: string | null;
          gateway_response: Json;
          paystack_reference: string | null;
          flutterwave_reference: string | null;
          flutterwave_tx_id: string | null;
          is_verified: boolean;
          verified_at: string | null;
          refund_amount: number | null;
          refund_reason: string | null;
          refunded_at: string | null;
          metadata: Json;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          submission_id?: string | null;
          plan_id?: string | null;
          amount: number;
          currency?: string;
          status?: PaymentStatus;
          payment_method: PaymentMethod;
          gateway_reference?: string | null;
          gateway_response?: Json;
          paystack_reference?: string | null;
          flutterwave_reference?: string | null;
          flutterwave_tx_id?: string | null;
          is_verified?: boolean;
          verified_at?: string | null;
          refund_amount?: number | null;
          refund_reason?: string | null;
          refunded_at?: string | null;
          metadata?: Json;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          submission_id?: string | null;
          plan_id?: string | null;
          amount?: number;
          currency?: string;
          status?: PaymentStatus;
          payment_method?: PaymentMethod;
          gateway_reference?: string | null;
          gateway_response?: Json;
          paystack_reference?: string | null;
          flutterwave_reference?: string | null;
          flutterwave_tx_id?: string | null;
          is_verified?: boolean;
          verified_at?: string | null;
          refund_amount?: number | null;
          refund_reason?: string | null;
          refunded_at?: string | null;
          metadata?: Json;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          message: string;
          type: NotificationType;
          action_url: string | null;
          action_text: string | null;
          is_read: boolean;
          read_at: string | null;
          sent_via_email: boolean;
          sent_via_push: boolean;
          metadata: Json;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          message: string;
          type?: NotificationType;
          action_url?: string | null;
          action_text?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          sent_via_email?: boolean;
          sent_via_push?: boolean;
          metadata?: Json;
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          message?: string;
          type?: NotificationType;
          action_url?: string | null;
          action_text?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          sent_via_email?: boolean;
          sent_via_push?: boolean;
          metadata?: Json;
          created_at?: string;
          expires_at?: string;
        };
      };
      playlists: {
        Row: {
          id: string;
          platform: PlatformType;
          platform_playlist_id: string;
          name: string;
          description: string | null;
          cover_image_url: string | null;
          owner_name: string | null;
          follower_count: number;
          track_count: number;
          genres: string[] | null;
          mood: string | null;
          curator_id: string | null;
          is_verified: boolean;
          is_active: boolean;
          placement_price: number;
          last_synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform: PlatformType;
          platform_playlist_id: string;
          name: string;
          description?: string | null;
          cover_image_url?: string | null;
          owner_name?: string | null;
          follower_count?: number;
          track_count?: number;
          genres?: string[] | null;
          mood?: string | null;
          curator_id?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
          placement_price?: number;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform?: PlatformType;
          platform_playlist_id?: string;
          name?: string;
          description?: string | null;
          cover_image_url?: string | null;
          owner_name?: string | null;
          follower_count?: number;
          track_count?: number;
          genres?: string[] | null;
          mood?: string | null;
          curator_id?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
          placement_price?: number;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      playlist_placements: {
        Row: {
          id: string;
          submission_id: string;
          playlist_id: string;
          position: number | null;
          added_at: string;
          remove_at: string | null;
          removed_at: string | null;
          is_active: boolean;
          plays_received: number;
          notes: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          submission_id: string;
          playlist_id: string;
          position?: number | null;
          added_at?: string;
          remove_at?: string | null;
          removed_at?: string | null;
          is_active?: boolean;
          plays_received?: number;
          notes?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          submission_id?: string;
          playlist_id?: string;
          position?: number | null;
          added_at?: string;
          remove_at?: string | null;
          removed_at?: string | null;
          is_active?: boolean;
          plays_received?: number;
          notes?: string | null;
          metadata?: Json;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          currency: string;
          transaction_type: 'credit' | 'debit';
          category: string;
          reference: string | null;
          description: string | null;
          related_payment_id: string | null;
          related_submission_id: string | null;
          balance_after: number | null;
          status: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          currency?: string;
          transaction_type: 'credit' | 'debit';
          category: string;
          reference?: string | null;
          description?: string | null;
          related_payment_id?: string | null;
          related_submission_id?: string | null;
          balance_after?: number | null;
          status?: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          currency?: string;
          transaction_type?: 'credit' | 'debit';
          category?: string;
          reference?: string | null;
          description?: string | null;
          related_payment_id?: string | null;
          related_submission_id?: string | null;
          balance_after?: number | null;
          status?: string;
          metadata?: Json;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: string | null;
          value_type: string;
          category: string;
          description: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value?: string | null;
          value_type?: string;
          category?: string;
          description?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string | null;
          value_type?: string;
          category?: string;
          description?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_values: Json;
          new_values: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          old_values?: Json;
          new_values?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          old_values?: Json;
          new_values?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          is_read: boolean;
          is_resolved: boolean;
          admin_response: string | null;
          responded_at: string | null;
          responded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          is_read?: boolean;
          is_resolved?: boolean;
          admin_response?: string | null;
          responded_at?: string | null;
          responded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string | null;
          message?: string;
          is_read?: boolean;
          is_resolved?: boolean;
          admin_response?: string | null;
          responded_at?: string | null;
          responded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      promo_codes: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          max_uses: number | null;
          current_uses: number;
          max_uses_per_user: number;
          valid_from: string;
          valid_until: string | null;
          min_order_amount: number;
          applicable_plans: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description?: string | null;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          max_uses?: number | null;
          current_uses?: number;
          max_uses_per_user?: number;
          valid_from?: string;
          valid_until?: string | null;
          min_order_amount?: number;
          applicable_plans?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          description?: string | null;
          discount_type?: 'percentage' | 'fixed';
          discount_value?: number;
          max_uses?: number | null;
          current_uses?: number;
          max_uses_per_user?: number;
          valid_from?: string;
          valid_until?: string | null;
          min_order_amount?: number;
          applicable_plans?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          token_hash: string;
          refresh_token_hash: string | null;
          device_info: Json;
          ip_address: string | null;
          user_agent: string | null;
          is_valid: boolean;
          last_accessed_at: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          token_hash: string;
          refresh_token_hash?: string | null;
          device_info?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          is_valid?: boolean;
          last_accessed_at?: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          token_hash?: string;
          refresh_token_hash?: string | null;
          device_info?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          is_valid?: boolean;
          last_accessed_at?: string;
          expires_at?: string;
          created_at?: string;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string | null;
          event_name: string;
          event_category: string | null;
          properties: Json;
          page_url: string | null;
          referrer: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_name: string;
          event_category?: string | null;
          properties?: Json;
          page_url?: string | null;
          referrer?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          event_name?: string;
          event_category?: string | null;
          properties?: Json;
          page_url?: string | null;
          referrer?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      submission_stats: {
        Row: {
          date: string | null;
          total_submissions: number | null;
          completed: number | null;
          pending: number | null;
          rejected: number | null;
          revenue: number | null;
        };
      };
      user_stats: {
        Row: {
          date: string | null;
          new_users: number | null;
          verified_users: number | null;
          new_artists: number | null;
        };
      };
      payment_stats: {
        Row: {
          date: string | null;
          total_payments: number | null;
          successful: number | null;
          failed: number | null;
          total_revenue: number | null;
          average_payment: number | null;
        };
      };
    };
    Functions: {
      get_user_stats: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          total_submissions: number;
          active_campaigns: number;
          total_payments: number;
          total_spent: number;
          wallet_balance: number;
        }[];
      };
      check_promo_code: {
        Args: {
          p_code: string;
          p_user_id: string;
          p_plan_id: string;
          p_amount: number;
        };
        Returns: {
          is_valid: boolean;
          discount_amount: number;
          message: string;
        }[];
      };
      create_notification: {
        Args: {
          p_user_id: string;
          p_title: string;
          p_message: string;
          p_type?: NotificationType;
          p_action_url?: string;
          p_action_text?: string;
        };
        Returns: string;
      };
      record_analytics_event: {
        Args: {
          p_user_id: string;
          p_event_name: string;
          p_category?: string;
          p_properties?: Json;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      submission_status: SubmissionStatus;
      payment_status: PaymentStatus;
      payment_method: PaymentMethod;
      plan_type: PlanType;
      campaign_status: CampaignStatus;
      notification_type: NotificationType;
      platform_type: PlatformType;
    };
  };
}

// Enum types
export type UserRole = 'user' | 'artist' | 'admin' | 'super_admin';
export type SubmissionStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded';
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';
export type PaymentMethod = 'paystack' | 'flutterwave' | 'bank_transfer' | 'wallet';
export type PlanType = 'basic' | 'standard' | 'premium' | 'platinum' | 'custom';
export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';
export type NotificationType =
  | 'system'
  | 'payment'
  | 'submission'
  | 'campaign'
  | 'promotion'
  | 'alert'
  | 'marketing';
export type PlatformType =
  | 'spotify'
  | 'youtube'
  | 'apple_music'
  | 'soundcloud'
  | 'audiomack'
  | 'other';

// Table row types (convenience exports)
export type User = Database['public']['Tables']['users']['Row'];
export type Plan = Database['public']['Tables']['plans']['Row'];
export type Submission = Database['public']['Tables']['submissions']['Row'];
export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Playlist = Database['public']['Tables']['playlists']['Row'];
export type PlaylistPlacement = Database['public']['Tables']['playlist_placements']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Setting = Database['public']['Tables']['settings']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
export type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
export type PromoCode = Database['public']['Tables']['promo_codes']['Row'];
export type UserSession = Database['public']['Tables']['user_sessions']['Row'];
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row'];
