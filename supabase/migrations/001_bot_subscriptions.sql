-- ============================================================
-- ThriveOS Lifebud AI Bot Subscriptions
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Bot subscriptions ──────────────────────────────────────
-- Tracks each user's plan and their assigned bot

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id            uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid    REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Plan tier
  plan          text    NOT NULL DEFAULT 'free'
                        CHECK (plan IN ('free', 'starter', 'growth', 'unlimited', 'byot')),
  status        text    NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),

  -- Credit tracking (NULL = unlimited)
  credits_used  integer NOT NULL DEFAULT 0,
  credits_limit integer,              -- 500 / 2000 / NULL

  -- Assigned bot from our pool (set automatically on payment)
  bot_token_assigned  text,           -- kept server-side only, never exposed to client
  bot_username        text,           -- e.g. @LifebudStarterBot
  bot_display_name    text,           -- "Lifebud Starter"
  telegram_start_link text,           -- https://t.me/LifebudStarterBot?start=userId

  -- Billing
  stripe_customer_id      text UNIQUE,
  stripe_subscription_id  text UNIQUE,
  current_period_start    timestamptz DEFAULT now(),
  current_period_end      timestamptz,

  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),

  UNIQUE (user_id)
);

-- ── BYOT — bring your own token ────────────────────────────
-- When a user connects their own bot/OpenClaw credentials

CREATE TABLE IF NOT EXISTS public.bot_credentials (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Telegram
  telegram_bot_token  text,   -- store encrypted in production (use Supabase Vault)
  telegram_chat_id    text,   -- user's chat_id with the bot (linked after they /start it)
  telegram_linked     boolean DEFAULT false,

  -- OpenClaw
  openclaw_webhook_url  text,
  openclaw_api_key      text,  -- store encrypted in production

  linked_at   timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),

  UNIQUE (user_id)
);

-- ── Bot pool ───────────────────────────────────────────────
-- Your pre-made OpenClaw bots. Admin populates this table.
-- Each Telegram account can have up to 20 bots.

CREATE TABLE IF NOT EXISTS public.bot_pool (
  id              uuid  DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_token       text  UNIQUE NOT NULL,          -- Telegram bot token from BotFather
  bot_username    text,                            -- @LifebudGrowthBot etc.
  bot_display_name text,
  telegram_account text,                           -- which of your TG accounts owns this

  -- Which plan tier this bot serves
  plan_tier       text  NOT NULL CHECK (plan_tier IN ('starter', 'growth', 'unlimited')),

  -- Assignment
  is_available    boolean DEFAULT true,
  assigned_to     uuid  REFERENCES auth.users(id),
  assigned_at     timestamptz,

  created_at      timestamptz DEFAULT now()
);

-- ── Message log ────────────────────────────────────────────
-- Tracks AI message usage for credit billing

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role        text NOT NULL CHECK (role IN ('user', 'assistant')),
  content     text NOT NULL,
  source      text DEFAULT 'web',      -- 'web' | 'desktop' | 'telegram'
  tokens_used integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- ── RLS policies ───────────────────────────────────────────

ALTER TABLE public.subscriptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_credentials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages    ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own rows
CREATE POLICY "own subscription"  ON public.subscriptions   FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own credentials"   ON public.bot_credentials FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own messages"      ON public.chat_messages   FOR ALL USING (auth.uid() = user_id);

-- Bot pool is admin-only (managed via service role / Supabase dashboard)
ALTER TABLE public.bot_pool ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no public access"  ON public.bot_pool        FOR ALL USING (false);

-- ── Helper: auto-create free subscription on sign-up ──────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status, credits_limit)
  VALUES (NEW.id, 'free', 'active', 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Helper: increment credit usage ────────────────────────

CREATE OR REPLACE FUNCTION public.use_credit(p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  sub public.subscriptions%ROWTYPE;
BEGIN
  SELECT * INTO sub FROM public.subscriptions WHERE user_id = p_user_id;

  -- Unlimited plan or BYOT
  IF sub.plan IN ('unlimited', 'byot') OR sub.credits_limit IS NULL THEN
    UPDATE public.subscriptions SET credits_used = credits_used + 1, updated_at = now()
    WHERE user_id = p_user_id;
    RETURN true;
  END IF;

  -- Check credits remaining
  IF sub.credits_used >= sub.credits_limit THEN
    RETURN false;  -- no credits left
  END IF;

  UPDATE public.subscriptions SET credits_used = credits_used + 1, updated_at = now()
  WHERE user_id = p_user_id;
  RETURN true;
END;
$$;
