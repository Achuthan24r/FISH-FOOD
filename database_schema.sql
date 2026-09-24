-- =============================================================================
-- AquaVigor Database Schema (PostgreSQL / Supabase / Firebase Compatible)
-- Developed by Team Connected Minds for Euphoria Hackathon: Agri Venture
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. USERS TABLE (Farmers & Company Admin Team)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'admin')),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(120),
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    preferred_lang VARCHAR(10) DEFAULT 'en' CHECK (preferred_lang IN ('en', 'ta')),
    pond_count INT DEFAULT 1,
    primary_species VARCHAR(50) DEFAULT 'Vannamei Shrimp',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security (RLS) for Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers can view and edit their own profile"
    ON users FOR ALL
    USING (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- -----------------------------------------------------------------------------
-- 2. PONDS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ponds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pond_number VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    area_acres NUMERIC(6,2) DEFAULT 1.0,
    depth_meters NUMERIC(4,2) DEFAULT 1.5,
    water_type VARCHAR(30) DEFAULT 'brackish' CHECK (water_type IN ('freshwater', 'brackish', 'saline')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ponds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers see own ponds, admin sees all"
    ON ponds FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- -----------------------------------------------------------------------------
-- 3. BATCHES TABLE (Target 45 Days vs 60 Days Baseline)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pond_id UUID NOT NULL REFERENCES ponds(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    batch_name VARCHAR(120) NOT NULL,
    species VARCHAR(60) NOT NULL,
    stocking_date DATE NOT NULL,
    target_harvest_date DATE NOT NULL,
    actual_harvest_date DATE,
    stocking_count INT NOT NULL CHECK (stocking_count > 0),
    feed_type VARCHAR(30) DEFAULT 'aquavigor' CHECK (feed_type IN ('aquavigor', 'other')),
    initial_weight_g NUMERIC(6,2) DEFAULT 0.5,
    target_weight_g NUMERIC(6,2) DEFAULT 30.0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'harvested', 'failed')),
    current_weight_g NUMERIC(6,2) DEFAULT 0.5,
    current_survival_rate NUMERIC(5,2) DEFAULT 100.0,
    current_fcr NUMERIC(4,2) DEFAULT 1.15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers access own batches"
    ON batches FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- -----------------------------------------------------------------------------
-- 4. GROWTH & WATER QUALITY LOGS (Weekly Tracking)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS growth_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    day_number INT NOT NULL,
    average_weight_g NUMERIC(6,2) NOT NULL,
    mortality_count INT DEFAULT 0,
    feed_fed_kg NUMERIC(8,2) NOT NULL,
    colour_score INT CHECK (colour_score BETWEEN 1 AND 5),
    water_temp_c NUMERIC(4,1) DEFAULT 28.5,
    dissolved_oxygen_ppm NUMERIC(4,2) DEFAULT 6.2,
    notes TEXT,
    photo_url TEXT,
    is_offline_synced BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE growth_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access logs of owned batches"
    ON growth_logs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM batches 
            WHERE batches.id = growth_logs.batch_id 
              AND (batches.user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin')
        )
    );

-- -----------------------------------------------------------------------------
-- 5. FEEDBACK & MULTI-DIMENSIONAL RATING SYSTEM (Core Feature)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    growth_rating INT NOT NULL CHECK (growth_rating BETWEEN 1 AND 5),
    colour_rating INT NOT NULL CHECK (colour_rating BETWEEN 1 AND 5),
    survival_rating INT NOT NULL CHECK (survival_rating BETWEEN 1 AND 5),
    immunity_rating INT NOT NULL CHECK (immunity_rating BETWEEN 1 AND 5),
    value_rating INT NOT NULL CHECK (value_rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    voice_transcript TEXT,
    photo_url TEXT,
    reduced_culture_period BOOLEAN DEFAULT TRUE,
    would_recommend BOOLEAN DEFAULT TRUE,
    sentiment VARCHAR(20) DEFAULT 'positive' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers read own feedback, admins read all"
    ON feedback FOR SELECT
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Farmers can insert feedback"
    ON feedback FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update feedback status"
    ON feedback FOR UPDATE
    USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- -----------------------------------------------------------------------------
-- 6. FEEDBACK REPLIES (Company Response Thread)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feedback_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
    admin_user_id UUID NOT NULL REFERENCES users(id),
    admin_name VARCHAR(100) NOT NULL,
    reply_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE feedback_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone involved can view replies"
    ON feedback_replies FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM feedback 
            WHERE feedback.id = feedback_replies.feedback_id 
              AND (feedback.user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin')
        )
    );

CREATE POLICY "Admins can post replies"
    ON feedback_replies FOR INSERT
    WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- -----------------------------------------------------------------------------
-- 7. FEED PRODUCTS CATALOG
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    tagline TEXT,
    target_species TEXT[] NOT NULL,
    bag_weight_kg INT DEFAULT 25,
    price_inr NUMERIC(10,2) NOT NULL,
    crude_protein_percent NUMERIC(4,1) NOT NULL,
    crude_fat_percent NUMERIC(4,1) NOT NULL,
    crude_fiber_percent NUMERIC(4,1) NOT NULL,
    moisture_percent NUMERIC(4,1) NOT NULL,
    ingredients JSONB NOT NULL,
    benefits JSONB NOT NULL,
    feeding_stages JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products are publicly viewable
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- 8. ORDERS & DIRECT QUOTES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farmer_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    district VARCHAR(100) NOT NULL,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(120) NOT NULL,
    quantity_bags INT NOT NULL CHECK (quantity_bags > 0),
    bag_size_kg INT DEFAULT 25,
    total_price_inr NUMERIC(12,2) NOT NULL,
    delivery_address TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'dispatched', 'delivered')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers see own orders, admins see all"
    ON orders FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- -----------------------------------------------------------------------------
-- INDEXES FOR HIGH-EFFICIENCY QUERIES & ANALYTICS
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_batches_user ON batches(user_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_growth_logs_batch ON growth_logs(batch_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_sentiment ON feedback(sentiment);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
