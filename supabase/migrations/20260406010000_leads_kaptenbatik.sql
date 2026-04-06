create extension if not exists pgcrypto;

create table if not exists public.leads_kaptenbatik (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  name text not null default '',
  phone text not null default '',
  email text not null default '',
  message text not null default '',
  form_name text not null default 'contact_us',
  enquiry_category text not null default '',
  selected_service text not null default '',
  selected_product_ids jsonb not null default '[]'::jsonb,
  selected_product_names jsonb not null default '[]'::jsonb,
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  utm_content text not null default '',
  utm_term text not null default '',
  gclid text not null default '',
  fbclid text not null default '',
  msclkid text not null default '',
  ttclid text not null default '',
  click_id text not null default '',
  tracking_session_id text not null default '',
  landing_page_url text not null default '',
  landing_page_path text not null default '',
  page_url text not null default '',
  page_path text not null default '',
  page_history jsonb not null default '[]'::jsonb,
  referrer text not null default '',
  user_agent text not null default '',
  sheet_synced boolean not null default false,
  email_sent boolean not null default false,
  whatsapp_redirected boolean not null default false,
  ip_address text not null default '',
  raw_payload jsonb not null default '{}'::jsonb
);

create index if not exists leads_kaptenbatik_created_at_idx on public.leads_kaptenbatik (created_at desc);
create index if not exists leads_kaptenbatik_email_idx on public.leads_kaptenbatik (email);
create index if not exists leads_kaptenbatik_tracking_session_id_idx on public.leads_kaptenbatik (tracking_session_id);
create index if not exists leads_kaptenbatik_form_name_idx on public.leads_kaptenbatik (form_name);

alter table public.leads_kaptenbatik enable row level security;

alter table public.leads_kaptenbatik
  add column if not exists ip_address text not null default '',
  add column if not exists raw_payload jsonb not null default '{}'::jsonb;
