-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password text not null,
  current_step integer,
  is_completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- User profile table (stores all profile data as JSON)
create table if not exists user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  profile_data jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Custom components table
create table if not exists custom_components (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  label text not null,
  type text not null check (type in ('text', 'textarea', 'date', 'number', 'email', 'phone', 'url', 'address')),
  required boolean default false,
  placeholder text default '',
  options jsonb,
  created_at timestamp with time zone default now()
);

-- Page configurations table
create table if not exists page_configs (
  id uuid primary key default gen_random_uuid(),
  page integer unique not null,
  title text,
  components jsonb not null default '[]',
  updated_at timestamp with time zone default now()
);

-- Insert built-in components if they don't exist
insert into custom_components (id, name, label, type, required, placeholder, created_at)
values 
  ('550e8400-e29b-41d4-a716-446655440001', 'aboutMe', 'About Me', 'textarea', false, 'Tell us about yourself...', now()),
  ('550e8400-e29b-41d4-a716-446655440002', 'birthdate', 'Birth Date', 'date', false, '', now()),
  ('550e8400-e29b-41d4-a716-446655440003', 'address', 'Address', 'address', false, '', now())
on conflict (name) do nothing;
