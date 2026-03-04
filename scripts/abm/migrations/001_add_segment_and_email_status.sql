-- Migration 001: Add segment column to accounts + email_status to contacts
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Add segment column to accounts
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS segment text;

-- 2. Tag all existing accounts as 'series-a-saas'
UPDATE public.accounts SET segment = 'series-a-saas' WHERE segment IS NULL AND domain IS NOT NULL;

-- 3. Add email_status column to contacts (for Prospeo verification)
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS email_status text;

-- 4. Add source column to contacts if missing
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS source text;

-- 5. Add notes column to contacts if missing
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS notes text;

-- 6. Add mx_provider column to contacts if missing
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS mx_provider text;

-- Verify
SELECT 'accounts.segment' as col, count(*) as total, count(segment) as has_value FROM public.accounts
UNION ALL
SELECT 'contacts.email_status', count(*), count(email_status) FROM public.contacts;
