-- Supabase SQL Migration: Enforce Quota at Database Level
-- This trigger ensures users cannot create invitations beyond their quota.

CREATE OR REPLACE FUNCTION check_user_quota_before_insert()
RETURNS trigger AS $$
DECLARE
  v_used_quota int;
  v_total_quota int;
BEGIN
  -- 1. Count existing invitations for this user
  SELECT count(*) INTO v_used_quota
  FROM public.invitations
  WHERE user_id = NEW.user_id;

  -- 2. Get the user's total quota
  SELECT (free_quota + purchased_quota) INTO v_total_quota
  FROM public.user_quotas
  WHERE user_id = NEW.user_id;

  -- If no quota record found, assume 0 limit (or handle gracefully)
  IF v_total_quota IS NULL THEN
    v_total_quota := 0;
  END IF;

  -- 3. Check if they have reached the limit
  IF v_used_quota >= v_total_quota THEN
    RAISE EXCEPTION 'QUOTA_EXCEEDED: You have reached your invitation quota limit.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_quota_on_invitation_insert ON public.invitations;

CREATE TRIGGER enforce_quota_on_invitation_insert
  BEFORE INSERT ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION check_user_quota_before_insert();
