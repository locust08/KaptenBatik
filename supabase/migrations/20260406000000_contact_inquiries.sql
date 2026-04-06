create extension if not exists pgcrypto;

create table if not exists public.contact_inquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending',
  sync_status text not null default 'pending',
  sync_warning text not null default '',
  submitted_at timestamptz not null,
  tracking_captured_at timestamptz not null,
  click_id text not null default '',
  full_name text not null,
  email text not null,
  phone text not null default '',
  inquiry_type text not null,
  message text not null,
  landing_page text not null,
  landing_page_path text not null default '',
  referrer text not null default '',
  session_id text not null,
  page_history text not null default '[]',
  page_path text not null default '',
  page_url text not null default '',
  tracking_session_id text not null default '',
  msclkid text not null default '',
  ttclid text not null default '',
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  utm_content text not null default '',
  utm_term text not null default '',
  gclid text not null default '',
  fbclid text not null default '',
  user_agent text not null default '',
  ip_address text not null default '',
  whatsapp_href text not null,
  whatsapp_message text not null,
  google_sheets_synced_at timestamptz,
  admin_email_sent_at timestamptz,
  raw_payload jsonb not null default '{}'::jsonb
);

create index if not exists contact_inquiries_created_at_idx on public.contact_inquiries (created_at desc);
create index if not exists contact_inquiries_email_idx on public.contact_inquiries (email);
create index if not exists contact_inquiries_session_id_idx on public.contact_inquiries (session_id);

alter table public.contact_inquiries enable row level security;

alter table public.contact_inquiries
  add column if not exists click_id text not null default '',
  add column if not exists landing_page_path text not null default '',
  add column if not exists page_history text not null default '[]',
  add column if not exists page_path text not null default '',
  add column if not exists page_url text not null default '',
  add column if not exists tracking_session_id text not null default '',
  add column if not exists msclkid text not null default '',
  add column if not exists ttclid text not null default '';
