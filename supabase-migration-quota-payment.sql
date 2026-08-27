-- Supabase SQL Migration: Quota & Payment System
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- ============================================
-- 1. User Quotas Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_quotas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  free_quota integer DEFAULT 1 NOT NULL,
  purchased_quota integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_quotas ENABLE ROW LEVEL SECURITY;

-- Users can read their own quota
CREATE POLICY "Users can view own quota"
  ON user_quotas FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own quota (first-time setup)
CREATE POLICY "Users can insert own quota"
  ON user_quotas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can update quotas (for webhook)
-- Note: The webhook uses the service role key via server-side Supabase client
CREATE POLICY "Service role can update quotas"
  ON user_quotas FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 2. Transactions Table
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id text UNIQUE NOT NULL,
  amount integer NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled', 'expired')),
  payment_method text,
  pakasir_payment_number text,
  expired_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own transactions
CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can update transactions (for webhook)
CREATE POLICY "Service role can update transactions"
  ON transactions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 3. Auto-create quota on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user_quota()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_quotas (user_id, free_quota, purchased_quota)
  VALUES (NEW.id, 1, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create quota when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_quota ON auth.users;
CREATE TRIGGER on_auth_user_created_quota
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_quota();

-- ============================================
-- 4. Backfill quota for existing users
-- ============================================
INSERT INTO user_quotas (user_id, free_quota, purchased_quota)
SELECT id, 1, 0
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_quotas)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- Done! Your quota and payment system is ready.
-- ============================================
