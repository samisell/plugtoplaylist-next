-- ===========================================
-- PlugToPlaylist - Supabase Database Schema
-- ===========================================
-- Version: 1.0.0
-- Last Updated: 2024
-- ===========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ===========================================
-- ENUM TYPES
-- ===========================================

-- User roles
CREATE TYPE user_role AS ENUM ('user', 'artist', 'admin', 'super_admin');

-- Submission status
CREATE TYPE submission_status AS ENUM (
    'pending',
    'under_review',
    'approved',
    'rejected',
    'in_progress',
    'completed',
    'cancelled',
    'refunded'
);

-- Payment status
CREATE TYPE payment_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded',
    'cancelled'
);

-- Payment methods
CREATE TYPE payment_method AS ENUM (
    'paystack',
    'flutterwave',
    'bank_transfer',
    'wallet'
);

-- Plan types
CREATE TYPE plan_type AS ENUM (
    'basic',
    'standard',
    'premium',
    'platinum',
    'custom'
);

-- Campaign status
CREATE TYPE campaign_status AS ENUM (
    'draft',
    'scheduled',
    'active',
    'paused',
    'completed',
    'cancelled'
);

-- Notification types
CREATE TYPE notification_type AS ENUM (
    'system',
    'payment',
    'submission',
    'campaign',
    'promotion',
    'alert',
    'marketing'
);

-- Platform types
CREATE TYPE platform_type AS ENUM (
    'spotify',
    'youtube',
    'apple_music',
    'soundcloud',
    'audiomack',
    'other'
);

-- ===========================================
-- TABLES
-- ===========================================

-- -------------------------------------------
-- Users Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role user_role NOT NULL DEFAULT 'user',
    
    -- Profile Information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(100),
    avatar_url TEXT,
    phone VARCHAR(20),
    bio TEXT,
    
    -- Artist-specific fields
    artist_name VARCHAR(150),
    stage_name VARCHAR(150),
    genre VARCHAR(100),
    label VARCHAR(150),
    social_links JSONB DEFAULT '{}',
    
    -- Account Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT,
    
    -- Wallet
    wallet_balance DECIMAL(15, 2) DEFAULT 0.00,
    
    -- Timestamps
    last_login_at TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Indexes
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_artist_name ON users(artist_name);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = TRUE;

-- -------------------------------------------
-- Plans Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    
    -- Plan Features
    plan_type plan_type NOT NULL DEFAULT 'basic',
    playlist_count INTEGER DEFAULT 1,
    platform_count INTEGER DEFAULT 1,
    duration_days INTEGER DEFAULT 30,
    max_songs INTEGER DEFAULT 1,
    
    -- Features (JSON for flexibility)
    features JSONB DEFAULT '{}',
    -- Example: {"spotify_playlists": 5, "youtube_playlists": 3, "priority_support": true}
    
    -- Platforms
    platforms platform_type[] DEFAULT ARRAY['spotify', 'youtube']::platform_type[],
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    
    -- Ordering
    sort_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for plans
CREATE INDEX idx_plans_slug ON plans(slug);
CREATE INDEX idx_plans_is_active ON plans(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_plans_plan_type ON plans(plan_type);
CREATE INDEX idx_plans_price ON plans(price);

-- -------------------------------------------
-- Submissions Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    
    -- Track Information
    track_title VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    release_date DATE,
    duration_seconds INTEGER,
    
    -- URLs
    spotify_url TEXT,
    youtube_url TEXT,
    apple_music_url TEXT,
    soundcloud_url TEXT,
    audiomack_url TEXT,
    other_urls JSONB DEFAULT '{}',
    
    -- Media
    cover_art_url TEXT,
    preview_url TEXT,
    
    -- Metadata from APIs
    spotify_track_id VARCHAR(100),
    spotify_popularity INTEGER,
    youtube_video_id VARCHAR(100),
    youtube_view_count BIGINT,
    api_metadata JSONB DEFAULT '{}',
    
    -- Status & Progress
    status submission_status NOT NULL DEFAULT 'pending',
    progress_percentage INTEGER DEFAULT 0,
    
    -- Admin Notes
    admin_notes TEXT,
    rejection_reason TEXT,
    
    -- Promotion Details
    target_playlists INTEGER DEFAULT 0,
    completed_playlists INTEGER DEFAULT 0,
    target_plays INTEGER DEFAULT 0,
    achieved_plays INTEGER DEFAULT 0,
    
    -- Timestamps
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for submissions
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_plan_id ON submissions(plan_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_spotify_id ON submissions(spotify_track_id);
CREATE INDEX idx_submissions_youtube_id ON submissions(youtube_video_id);

-- -------------------------------------------
-- Campaigns Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
    
    -- Campaign Details
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Status
    status campaign_status NOT NULL DEFAULT 'draft',
    
    -- Schedule
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    
    -- Budget
    budget DECIMAL(15, 2) DEFAULT 0,
    spent_amount DECIMAL(15, 2) DEFAULT 0,
    
    -- Goals
    target_plays INTEGER DEFAULT 0,
    target_saves INTEGER DEFAULT 0,
    target_followers INTEGER DEFAULT 0,
    
    -- Achieved
    achieved_plays INTEGER DEFAULT 0,
    achieved_saves INTEGER DEFAULT 0,
    achieved_followers INTEGER DEFAULT 0,
    
    -- Platforms
    platforms platform_type[] DEFAULT ARRAY[]::platform_type[],
    
    -- Targeting
    target_countries VARCHAR(50)[],
    target_genres VARCHAR(100)[],
    target_age_range VARCHAR(50),
    targeting JSONB DEFAULT '{}',
    
    -- Analytics
    analytics JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for campaigns
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_submission_id ON campaigns(submission_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_start_date ON campaigns(start_date);

-- -------------------------------------------
-- Payments Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    
    -- Payment Details
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    
    -- Status
    status payment_status NOT NULL DEFAULT 'pending',
    
    -- Payment Method
    payment_method payment_method NOT NULL,
    
    -- Gateway Information
    gateway_reference VARCHAR(255),
    gateway_response JSONB DEFAULT '{}',
    
    -- Transaction IDs from payment gateways
    paystack_reference VARCHAR(255),
    flutterwave_reference VARCHAR(255),
    flutterwave_tx_id VARCHAR(255),
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    
    -- Refund Information
    refund_amount DECIMAL(15, 2),
    refund_reason TEXT,
    refunded_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for payments
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_submission_id ON payments(submission_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway_ref ON payments(gateway_reference);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_paystack_ref ON payments(paystack_reference);
CREATE INDEX idx_payments_flutterwave_ref ON payments(flutterwave_reference);

-- -------------------------------------------
-- Notifications Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL DEFAULT 'system',
    
    -- Links
    action_url TEXT,
    action_text VARCHAR(100),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Delivery
    sent_via_email BOOLEAN DEFAULT FALSE,
    sent_via_push BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Auto-expire old notifications
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- Create indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- -------------------------------------------
-- Playlists Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Platform Info
    platform platform_type NOT NULL,
    platform_playlist_id VARCHAR(255) NOT NULL,
    
    -- Playlist Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    owner_name VARCHAR(255),
    
    -- Stats
    follower_count INTEGER DEFAULT 0,
    track_count INTEGER DEFAULT 0,
    
    -- Genre & Targeting
    genres VARCHAR(100)[],
    mood VARCHAR(100),
    
    -- Curator Info
    curator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Pricing (for placements)
    placement_price DECIMAL(10, 2) DEFAULT 0,
    
    -- Timestamps
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(platform, platform_playlist_id)
);

-- Create indexes for playlists
CREATE INDEX idx_playlists_platform ON playlists(platform);
CREATE INDEX idx_playlists_platform_id ON playlists(platform_playlist_id);
CREATE INDEX idx_playlists_curator_id ON playlists(curator_id);
CREATE INDEX idx_playlists_followers ON playlists(follower_count DESC);

-- -------------------------------------------
-- Playlist Placements Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS playlist_placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    
    -- Placement Details
    position INTEGER,
    
    -- Duration
    added_at TIMESTAMPTZ DEFAULT NOW(),
    remove_at TIMESTAMPTZ,
    removed_at TIMESTAMPTZ,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Performance
    plays_received INTEGER DEFAULT 0,
    
    -- Notes
    notes TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Unique constraint
    UNIQUE(submission_id, playlist_id)
);

-- Create indexes for playlist_placements
CREATE INDEX idx_placements_submission_id ON playlist_placements(submission_id);
CREATE INDEX idx_placements_playlist_id ON playlist_placements(playlist_id);
CREATE INDEX idx_placements_is_active ON playlist_placements(is_active) WHERE is_active = TRUE;

-- -------------------------------------------
-- Transactions Table (Wallet & Ledger)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Transaction Details
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    
    -- Type: credit (add) or debit (subtract)
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
    
    -- Category
    category VARCHAR(50) NOT NULL,
    -- Examples: 'deposit', 'withdrawal', 'payment', 'refund', 'bonus', 'penalty'
    
    -- Reference
    reference VARCHAR(255) UNIQUE,
    description TEXT,
    
    -- Related entities
    related_payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    related_submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
    
    -- Balance after transaction
    balance_after DECIMAL(15, 2),
    
    -- Status
    status VARCHAR(20) DEFAULT 'completed',
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_reference ON transactions(reference);

-- -------------------------------------------
-- Settings Table (Application Settings)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    value_type VARCHAR(20) DEFAULT 'string',
    -- Types: string, number, boolean, json
    
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for settings
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);

-- -------------------------------------------
-- Audit Logs Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Action Details
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    
    -- Request Info
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- -------------------------------------------
-- Contact Messages Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contact Info
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Message
    subject VARCHAR(255),
    message TEXT NOT NULL,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    
    -- Admin Response
    admin_response TEXT,
    responded_at TIMESTAMPTZ,
    responded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for contact_messages
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- -------------------------------------------
-- Promo Codes Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Code Details
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    
    -- Discount
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    
    -- Limits
    max_uses INTEGER DEFAULT NULL, -- NULL = unlimited
    current_uses INTEGER DEFAULT 0,
    max_uses_per_user INTEGER DEFAULT 1,
    
    -- Validity
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    
    -- Restrictions
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    applicable_plans UUID[], -- NULL = all plans
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for promo_codes
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_is_active ON promo_codes(is_active) WHERE is_active = TRUE;

-- -------------------------------------------
-- User Sessions Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Session Data
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    refresh_token_hash VARCHAR(255),
    
    -- Device Info
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    
    -- Status
    is_valid BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for user_sessions
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- -------------------------------------------
-- Analytics Events Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Event Details
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(50),
    
    -- Properties
    properties JSONB DEFAULT '{}',
    
    -- Context
    page_url TEXT,
    referrer TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for analytics_events (partitioned by date in production)
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- ===========================================
-- FUNCTIONS & TRIGGERS
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- RLS POLICIES - Users
-- ===========================================

-- Users can view their own profile
CREATE POLICY users_view_own ON users FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY users_update_own ON users FOR UPDATE
    USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY admins_view_all_users ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Admins can update all users
CREATE POLICY admins_update_all_users ON users FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Anyone can insert (registration)
CREATE POLICY users_insert ON users FOR INSERT
    WITH CHECK (true);

-- ===========================================
-- RLS POLICIES - Plans
-- ===========================================

-- Everyone can view active plans
CREATE POLICY plans_view_active ON plans FOR SELECT
    USING (is_active = true);

-- Admins can manage plans
CREATE POLICY admins_manage_plans ON plans FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- ===========================================
-- RLS POLICIES - Submissions
-- ===========================================

-- Users can view their own submissions
CREATE POLICY submissions_view_own ON submissions FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all submissions
CREATE POLICY admins_view_submissions ON submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Users can insert their own submissions
CREATE POLICY submissions_insert_own ON submissions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins can update all submissions
CREATE POLICY admins_update_submissions ON submissions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- ===========================================
-- RLS POLICIES - Payments
-- ===========================================

-- Users can view their own payments
CREATE POLICY payments_view_own ON payments FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all payments
CREATE POLICY admins_view_payments ON payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Users can insert their own payments
CREATE POLICY payments_insert_own ON payments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- System can update payments (via service role)
-- Admins can update all payments
CREATE POLICY admins_update_payments ON payments FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- ===========================================
-- RLS POLICIES - Notifications
-- ===========================================

-- Users can view their own notifications
CREATE POLICY notifications_view_own ON notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY notifications_update_own ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- System can insert notifications (via service role)
CREATE POLICY system_insert_notifications ON notifications FOR INSERT
    WITH CHECK (true);

-- ===========================================
-- RLS POLICIES - Transactions
-- ===========================================

-- Users can view their own transactions
CREATE POLICY transactions_view_own ON transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY admins_view_transactions ON transactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- System handles insert (via service role)

-- ===========================================
-- RLS POLICIES - Playlists
-- ===========================================

-- Everyone can view active playlists
CREATE POLICY playlists_view_active ON playlists FOR SELECT
    USING (is_active = true);

-- Admins can manage playlists
CREATE POLICY admins_manage_playlists ON playlists FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- ===========================================
-- RLS POLICIES - Campaigns
-- ===========================================

-- Users can view their own campaigns
CREATE POLICY campaigns_view_own ON campaigns FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all campaigns
CREATE POLICY admins_view_campaigns ON campaigns FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Users can insert their own campaigns
CREATE POLICY campaigns_insert_own ON campaigns FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own campaigns
CREATE POLICY campaigns_update_own ON campaigns FOR UPDATE
    USING (auth.uid() = user_id);

-- ===========================================
-- RLS POLICIES - Settings
-- ===========================================

-- Public settings are viewable by all
CREATE POLICY settings_view_public ON settings FOR SELECT
    USING (is_public = true);

-- Admins can manage settings
CREATE POLICY admins_manage_settings ON settings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- ===========================================
-- RLS POLICIES - Contact Messages
-- ===========================================

-- Anyone can insert contact messages
CREATE POLICY contact_insert ON contact_messages FOR INSERT
    WITH CHECK (true);

-- Admins can view and manage contact messages
CREATE POLICY admins_manage_contact ON contact_messages FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- ===========================================
-- RLS POLICIES - Promo Codes
-- ===========================================

-- Everyone can view active promo codes
CREATE POLICY promo_view_active ON promo_codes FOR SELECT
    USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

-- Admins can manage promo codes
CREATE POLICY admins_manage_promo ON promo_codes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- ===========================================
-- RLS POLICIES - User Sessions
-- ===========================================

-- Users can view their own sessions
CREATE POLICY sessions_view_own ON user_sessions FOR SELECT
    USING (auth.uid() = user_id);

-- Users can delete their own sessions
CREATE POLICY sessions_delete_own ON user_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- ===========================================
-- RLS POLICIES - Audit Logs
-- ===========================================

-- Only admins can view audit logs
CREATE POLICY admins_view_audit ON audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- System inserts audit logs (via service role)

-- ===========================================
-- RLS POLICIES - Analytics Events
-- ===========================================

-- System handles analytics (via service role)
-- Admins can view analytics
CREATE POLICY admins_view_analytics ON analytics_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- ===========================================
-- INITIAL DATA SEED
-- ===========================================

-- Insert default plans (prices in GBP)
INSERT INTO plans (name, slug, description, price, currency, plan_type, playlist_count, platform_count, duration_days, max_songs, features, is_active, is_featured, sort_order) VALUES

('Starter', 'starter', '1–2 Playlist Pitches with 1-Month Guarantee. Estimated streams: Afrobeats & Afro Pop: 6,000+ | Amapiano: 8,000+ | Hip-Hop, R&B, House, Tech: 5,000+', 50.00, 'GBP', 'basic', 2, 1, 30, 1, 
 '{"playlist_pitches": "1-2", "guarantee": "1-month", "estimated_streams": {"afrobeats_afro_pop": "6,000+", "amapiano": "8,000+", "hip_hop_rb_house_tech": "5,000+"}}', 
 true, false, 1),

('Standard', 'standard', '1–3 Playlist Pitches with 1-Month Guarantee. Estimated streams: Afrobeats & Afro Pop: 10,000+ | Amapiano: 16,000+ | Hip-Hop, R&B, House, Tech: 10,000+', 100.00, 'GBP', 'standard', 3, 2, 30, 2, 
 '{"playlist_pitches": "1-3", "guarantee": "1-month", "estimated_streams": {"afrobeats_afro_pop": "10,000+", "amapiano": "16,000+", "hip_hop_rb_house_tech": "10,000+"}}', 
 true, true, 2),

('Premium', 'premium', '1–4 Playlist Pitches with 1-Month Guarantee. Estimated streams: Afrobeats & Afro Pop: 20,000+ | Amapiano: 35,000+ | Hip-Hop, R&B, House, Tech: 20,000+', 200.00, 'GBP', 'premium', 4, 3, 30, 3, 
 '{"playlist_pitches": "1-4", "guarantee": "1-month", "estimated_streams": {"afrobeats_afro_pop": "20,000+", "amapiano": "35,000+", "hip_hop_rb_house_tech": "20,000+"}}', 
 true, false, 3),

('Custom', 'custom', 'Tailored to your needs. Choose your budget, request specific playlist placements, get extended reach & more placements.', 0.00, 'GBP', 'custom', 0, 0, 0, 0, 
 '{"custom": true, "features": ["choose_budget", "specific_placements", "extended_reach"]}', 
 true, false, 4);

-- Insert default settings
INSERT INTO settings (key, value, value_type, category, description, is_public) VALUES
('site_name', 'PlugToPlaylist', 'string', 'general', 'Site name displayed in header', true),
('site_description', 'Premium Music Promotion Platform', 'string', 'general', 'Site description for SEO', true),
('contact_email', 'support@plugtoplaylist.com', 'string', 'contact', 'Primary contact email', true),
('currency', 'GBP', 'string', 'payment', 'Default currency', true),
('min_payout', '5000', 'number', 'payment', 'Minimum payout amount', false),
('max_file_size_mb', '50', 'number', 'upload', 'Maximum file upload size in MB', true),
('maintenance_mode', 'false', 'boolean', 'system', 'Enable maintenance mode', false),
('registration_enabled', 'true', 'boolean', 'auth', 'Allow new user registration', true),
('email_verification_required', 'true', 'boolean', 'auth', 'Require email verification', false);

-- ===========================================
-- DATABASE VIEWS
-- ===========================================

-- View for submission statistics
CREATE OR REPLACE VIEW submission_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_submissions,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
    SUM(
        CASE WHEN plan_id IS NOT NULL THEN 
            (SELECT price FROM plans WHERE id = submissions.plan_id)
        ELSE 0 END
    ) as revenue
FROM submissions
GROUP BY DATE(created_at);

-- View for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as new_users,
    COUNT(*) FILTER (WHERE is_verified = true) as verified_users,
    COUNT(*) FILTER (WHERE role = 'artist') as new_artists
FROM users
GROUP BY DATE(created_at);

-- View for payment statistics
CREATE OR REPLACE VIEW payment_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_payments,
    COUNT(*) FILTER (WHERE status = 'completed') as successful,
    COUNT(*) FILTER (WHERE status = 'failed') as failed,
    SUM(amount) FILTER (WHERE status = 'completed') as total_revenue,
    AVG(amount) FILTER (WHERE status = 'completed') as average_payment
FROM payments
GROUP BY DATE(created_at);

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE(
    total_submissions BIGINT,
    active_campaigns BIGINT,
    total_payments BIGINT,
    total_spent DECIMAL,
    wallet_balance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM submissions WHERE user_id = p_user_id),
        (SELECT COUNT(*) FROM campaigns WHERE user_id = p_user_id AND status = 'active'),
        (SELECT COUNT(*) FROM payments WHERE user_id = p_user_id AND status = 'completed'),
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE user_id = p_user_id AND status = 'completed'),
        (SELECT wallet_balance FROM users WHERE id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check promo code validity
CREATE OR REPLACE FUNCTION check_promo_code(
    p_code VARCHAR(50),
    p_user_id UUID,
    p_plan_id UUID,
    p_amount DECIMAL
)
RETURNS TABLE(
    is_valid BOOLEAN,
    discount_amount DECIMAL,
    message TEXT
) AS $$
DECLARE
    v_promo RECORD;
    v_user_uses INTEGER;
BEGIN
    -- Get promo code details
    SELECT * INTO v_promo FROM promo_codes WHERE code = p_code AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Invalid promo code'::TEXT;
        RETURN;
    END IF;
    
    -- Check validity dates
    IF v_promo.valid_from > NOW() THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Promo code not yet active'::TEXT;
        RETURN;
    END IF;
    
    IF v_promo.valid_until IS NOT NULL AND v_promo.valid_until < NOW() THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Promo code has expired'::TEXT;
        RETURN;
    END IF;
    
    -- Check usage limits
    IF v_promo.max_uses IS NOT NULL AND v_promo.current_uses >= v_promo.max_uses THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Promo code usage limit reached'::TEXT;
        RETURN;
    END IF;
    
    -- Check user usage
    SELECT COUNT(*) INTO v_user_uses 
    FROM payments p
    JOIN submissions s ON p.submission_id = s.id
    WHERE s.user_id = p_user_id 
    AND p.metadata->>'promo_code' = p_code;
    
    IF v_user_uses >= v_promo.max_uses_per_user THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'You have already used this promo code'::TEXT;
        RETURN;
    END IF;
    
    -- Check minimum order amount
    IF p_amount < v_promo.min_order_amount THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Order amount below minimum required'::TEXT;
        RETURN;
    END IF;
    
    -- Check plan restrictions
    IF v_promo.applicable_plans IS NOT NULL AND NOT p_plan_id = ANY(v_promo.applicable_plans) THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Promo code not valid for this plan'::TEXT;
        RETURN;
    END IF;
    
    -- Calculate discount
    DECLARE
        v_discount DECIMAL;
    BEGIN
        IF v_promo.discount_type = 'percentage' THEN
            v_discount := (p_amount * v_promo.discount_value / 100);
        ELSE
            v_discount := v_promo.discount_value;
        END IF;
        
        -- Ensure discount doesn't exceed amount
        v_discount := LEAST(v_discount, p_amount);
        
        RETURN QUERY SELECT true, v_discount, 'Promo code applied successfully'::TEXT;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title VARCHAR(255),
    p_message TEXT,
    p_type notification_type DEFAULT 'system',
    p_action_url TEXT DEFAULT NULL,
    p_action_text VARCHAR(100) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, title, message, type, action_url, action_text)
    VALUES (p_user_id, p_title, p_message, p_type, p_action_url, p_action_text)
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record analytics event
CREATE OR REPLACE FUNCTION record_analytics_event(
    p_user_id UUID,
    p_event_name VARCHAR(100),
    p_category VARCHAR(50) DEFAULT NULL,
    p_properties JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO analytics_events (user_id, event_name, event_category, properties)
    VALUES (p_user_id, p_event_name, p_category, p_properties)
    RETURNING id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- GRANT PERMISSIONS
-- ===========================================

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant permissions to authenticated users
GRANT SELECT ON submission_stats TO authenticated;
GRANT SELECT ON user_stats TO authenticated;
GRANT SELECT ON payment_stats TO authenticated;

-- Grant permissions to service role (for backend operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ===========================================
-- INDEXES FOR PERFORMANCE (Additional)
-- ===========================================

-- Composite indexes for common queries
CREATE INDEX idx_submissions_user_status ON submissions(user_id, status);
CREATE INDEX idx_payments_user_status ON payments(user_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Partial indexes
CREATE INDEX idx_active_plans ON plans(price) WHERE is_active = true;
CREATE INDEX idx_pending_submissions ON submissions(created_at) WHERE status = 'pending';

-- ===========================================
-- SCHEMA VERSION TRACKING
-- ===========================================

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO schema_migrations (version) VALUES ('1.0.0');

-- ===========================================
-- END OF SCHEMA
-- ===========================================
