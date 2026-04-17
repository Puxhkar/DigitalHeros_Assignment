-- =============================================
-- DigitalHeros Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Charities ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS charities (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  description   TEXT NOT NULL,
  image_url     TEXT,
  website_url   TEXT,
  category      TEXT NOT NULL DEFAULT 'General',
  total_raised  NUMERIC(12, 2) NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Profiles (extends auth.users) ───────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                           TEXT NOT NULL,
  full_name                       TEXT,
  avatar_url                      TEXT,
  role                            TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  charity_id                      UUID REFERENCES charities(id) ON DELETE SET NULL,
  charity_percentage              INTEGER NOT NULL DEFAULT 10 CHECK (charity_percentage >= 10 AND charity_percentage <= 100),
  subscription_status             TEXT NOT NULL DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'trialing')),
  subscription_plan               TEXT CHECK (subscription_plan IN ('monthly', 'yearly')),
  stripe_customer_id              TEXT UNIQUE,
  stripe_subscription_id          TEXT UNIQUE,
  subscription_current_period_end TIMESTAMPTZ,
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Scores ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scores (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score       INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  date_played DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date_played)
);

-- Index for fetching user's latest scores
CREATE INDEX IF NOT EXISTS idx_scores_user_date ON scores(user_id, date_played DESC);

-- ─── Draws ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS draws (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month               INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year                INTEGER NOT NULL CHECK (year >= 2024),
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'simulated', 'completed')),
  draw_logic          TEXT NOT NULL DEFAULT 'random' CHECK (draw_logic IN ('random', 'most_frequent', 'least_frequent')),
  winning_numbers     INTEGER[],
  pool_amount         NUMERIC(12, 2) NOT NULL DEFAULT 0,
  jackpot_amount      NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tier_two_amount     NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tier_three_amount   NUMERIC(12, 2) NOT NULL DEFAULT 0,
  jackpot_rolled_over NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_participants  INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at        TIMESTAMPTZ,
  UNIQUE (month, year)
);

-- ─── Winners ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS winners (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id         UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  matched_numbers INTEGER[] NOT NULL,
  match_tier      INTEGER NOT NULL CHECK (match_tier IN (3, 4, 5)),
  prize_amount    NUMERIC(12, 2) NOT NULL,
  payout_status   TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'approved', 'paid', 'rejected')),
  proof_url       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at         TIMESTAMPTZ
);

-- ─── Transactions ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type                      TEXT NOT NULL CHECK (type IN ('subscription', 'prize', 'charity')),
  amount                    NUMERIC(12, 2) NOT NULL,
  currency                  TEXT NOT NULL DEFAULT 'usd',
  stripe_payment_intent_id  TEXT,
  status                    TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata                  JSONB DEFAULT '{}',
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Triggers ─────────────────────────────────────────────────────
-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enforce rolling 5 score limit per user
CREATE OR REPLACE FUNCTION enforce_score_limit()
RETURNS TRIGGER AS $$
DECLARE
  score_count INTEGER;
  oldest_id UUID;
BEGIN
  SELECT COUNT(*) INTO score_count FROM scores WHERE user_id = NEW.user_id;
  IF score_count >= 5 THEN
    SELECT id INTO oldest_id
    FROM scores
    WHERE user_id = NEW.user_id
    ORDER BY date_played ASC, created_at ASC
    LIMIT 1;
    DELETE FROM scores WHERE id = oldest_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER scores_rolling_limit
  BEFORE INSERT ON scores
  FOR EACH ROW EXECUTE FUNCTION enforce_score_limit();

-- ─── Row Level Security (RLS) ─────────────────────────────────────
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores      ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws       ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners     ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"    ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role full access"      ON profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admins can view all profiles"  ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Charities policies
CREATE POLICY "Anyone can view active charities" ON charities FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage charities"      ON charities FOR ALL USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Scores policies
CREATE POLICY "Users can view own scores"   ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON scores FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all scores"  ON scores FOR SELECT USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Draws policies
CREATE POLICY "Anyone can view completed draws" ON draws FOR SELECT USING (status = 'completed');
CREATE POLICY "Admins can manage draws"         ON draws FOR ALL USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Winners policies
CREATE POLICY "Users can view own wins"     ON winners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage winners"   ON winners FOR ALL USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role full access on tx"  ON transactions FOR ALL USING (auth.role() = 'service_role');

-- ─── Seed data: Charities ─────────────────────────────────────────
INSERT INTO charities (name, description, image_url, category, website_url) VALUES
  ('Save the Children', 'Empowering children worldwide with access to education, health, and protection.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', 'Children', 'https://savethechildren.org'),
  ('Ocean Conservancy', 'Protecting the ocean from its greatest global challenges to ensure clean, healthy seas.', 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800', 'Environment', 'https://oceanconservancy.org'),
  ('Doctors Without Borders', 'Providing emergency medical aid where it is needed most.', 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800', 'Healthcare', 'https://msf.org'),
  ('World Wildlife Fund', 'Leading organization in wildlife conservation and endangered species recovery.', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800', 'Wildlife', 'https://wwf.org'),
  ('Feeding America', 'A nationwide network of food banks feeding America''s hungry through programs.', 'https://images.unsplash.com/photo-1593113630400-ea4288922559?w=800', 'Hunger', 'https://feedingamerica.org'),
  ('Habitat for Humanity', 'Building homes, communities and hope around the world.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Housing', 'https://habitat.org')
ON CONFLICT DO NOTHING;
