-- SUPABASE DATABASE SETUP
-- Ejecutar en SQL Editor de Supabase Console
-- Esto crea la estructura base de la base de datos con RLS

-- 1. Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_net";

-- 2. Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  name text,
  avatar_url text,
  role text default 'agent' check (role in ('admin', 'agent', 'client')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create leads table
create table if not exists public.leads (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text,
  source text default 'contact_form' check (source in ('contact_form', 'email', 'referral', 'other')),
  status text default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'rejected')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create projects table
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  status text default 'planning' check (status in ('planning', 'in_progress', 'completed', 'on_hold')),
  budget numeric,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create activity_logs table (audit trail)
create table if not exists public.activity_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null check (action in ('create', 'update', 'delete', 'login', 'logout')),
  entity_type text not null check (entity_type in ('lead', 'project', 'profile', 'auth')),
  entity_id uuid,
  entity_name text,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries on activity_logs
create index if not exists activity_logs_user_id_idx on public.activity_logs(user_id);
create index if not exists activity_logs_entity_type_idx on public.activity_logs(entity_type);
create index if not exists activity_logs_created_at_idx on public.activity_logs(created_at desc);

-- 6. Create comments table (for leads and projects)
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  entity_type text not null check (entity_type in ('lead', 'project')),
  entity_id uuid not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for comments
create index if not exists comments_entity_idx on public.comments(entity_type, entity_id);
create index if not exists comments_user_id_idx on public.comments(user_id);
create index if not exists comments_created_at_idx on public.comments(created_at desc);

-- 7. Create attachments table (for file uploads on leads and projects)
create table if not exists public.attachments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  entity_type text not null check (entity_type in ('lead', 'project')),
  entity_id uuid not null,
  file_name text not null,
  file_size bigint not null,
  mime_type text not null,
  storage_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for attachments
create index if not exists attachments_entity_idx on public.attachments(entity_type, entity_id);
create index if not exists attachments_user_id_idx on public.attachments(user_id);
create index if not exists attachments_created_at_idx on public.attachments(created_at desc);

-- 8. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.projects enable row level security;
alter table public.activity_logs enable row level security;
alter table public.comments enable row level security;
alter table public.attachments enable row level security;

-- 6. RLS Policies for profiles
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 7. RLS Policies for leads
drop policy if exists "Users can view their own leads" on public.leads;
create policy "Users can view their own leads"
  on public.leads for select
  using (client_id = auth.uid());

drop policy if exists "Admins can view all leads" on public.leads;
create policy "Admins can view all leads"
  on public.leads for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Users can create leads" on public.leads;
create policy "Users can create leads"
  on public.leads for insert
  with check (client_id = auth.uid());

drop policy if exists "Users can update their own leads" on public.leads;
create policy "Users can update their own leads"
  on public.leads for update
  using (client_id = auth.uid());

-- 8. RLS Policies for projects
drop policy if exists "Users can view their own projects" on public.projects;
create policy "Users can view their own projects"
  on public.projects for select
  using (client_id = auth.uid());

drop policy if exists "Users can create projects" on public.projects;
create policy "Users can create projects"
  on public.projects for insert
  with check (client_id = auth.uid());

drop policy if exists "Users can update their own projects" on public.projects;
create policy "Users can update their own projects"
  on public.projects for update
  using (client_id = auth.uid());

-- 9. RLS Policies for activity_logs
drop policy if exists "Users can view their own activity logs" on public.activity_logs;
create policy "Users can view their own activity logs"
  on public.activity_logs for select
  using (user_id = auth.uid());

drop policy if exists "Admins can view all activity logs" on public.activity_logs;
create policy "Admins can view all activity logs"
  on public.activity_logs for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "System can insert activity logs" on public.activity_logs;
create policy "System can insert activity logs"
  on public.activity_logs for insert
  with check (true);

-- 10. RLS Policies for comments
create policy "Users can view comments on their entities"
  on public.comments for select
  using (
    (entity_type = 'lead' and exists (
      select 1 from public.leads
      where id = entity_id and client_id = auth.uid()
    ))
    or
    (entity_type = 'project' and exists (
      select 1 from public.projects
      where id = entity_id and client_id = auth.uid()
    ))
  );

create policy "Users can create comments on their entities"
  on public.comments for insert
  with check (
    user_id = auth.uid() and
    (
      (entity_type = 'lead' and exists (
        select 1 from public.leads
        where id = entity_id and client_id = auth.uid()
      ))
      or
      (entity_type = 'project' and exists (
        select 1 from public.projects
        where id = entity_id and client_id = auth.uid()
      ))
    )
  );

create policy "Users can update their own comments"
  on public.comments for update
  using (user_id = auth.uid());

create policy "Users can delete their own comments"
  on public.comments for delete
  using (user_id = auth.uid());

-- 11. RLS Policies for attachments
create policy "Users can view attachments on their entities"
  on public.attachments for select
  using (
    (entity_type = 'lead' and exists (
      select 1 from public.leads
      where id = entity_id and client_id = auth.uid()
    ))
    or
    (entity_type = 'project' and exists (
      select 1 from public.projects
      where id = entity_id and client_id = auth.uid()
    ))
  );

create policy "Users can create attachments on their entities"
  on public.attachments for insert
  with check (
    user_id = auth.uid() and
    (
      (entity_type = 'lead' and exists (
        select 1 from public.leads
        where id = entity_id and client_id = auth.uid()
      ))
      or
      (entity_type = 'project' and exists (
        select 1 from public.projects
        where id = entity_id and client_id = auth.uid()
      ))
    )
  );

create policy "Users can delete their own attachments"
  on public.attachments for delete
  using (user_id = auth.uid());

-- 12. Create team_invitations table (for inviting users to workspace)
create table if not exists public.team_invitations (
  id uuid default uuid_generate_v4() primary key,
  inviter_id uuid references public.profiles(id) on delete cascade not null,
  email text not null,
  role text default 'agent' check (role in ('admin', 'agent', 'client')),
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected', 'expired')),
  token text unique not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for team_invitations
create index if not exists team_invitations_email_idx on public.team_invitations(email);
create index if not exists team_invitations_token_idx on public.team_invitations(token);
create index if not exists team_invitations_status_idx on public.team_invitations(status);

-- Enable RLS for team_invitations
alter table public.team_invitations enable row level security;

-- 11. RLS Policies for team_invitations
drop policy if exists "Admins can view all invitations" on public.team_invitations;
create policy "Admins can view all invitations"
  on public.team_invitations for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Admins can create invitations" on public.team_invitations;
create policy "Admins can create invitations"
  on public.team_invitations for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Admins can update invitations" on public.team_invitations;
create policy "Admins can update invitations"
  on public.team_invitations for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Admins can delete invitations" on public.team_invitations;
create policy "Admins can delete invitations"
  on public.team_invitations for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 12. Auto-create profile on signup (trigger)
create or replace function public.trigger_create_profile()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    'agent'
  );
  return new;
end;
$$ language plpgsql;

-- Drop trigger if exists to avoid conflicts
drop trigger if exists on_user_created on auth.users;

create trigger on_user_created
  after insert on auth.users
  for each row
  execute function public.trigger_create_profile();

-- 10. Trigger para n8n: Cuando se crea un lead, envía webhook a n8n
create or replace function public.trigger_n8n_lead()
returns trigger as $$
begin
  perform net.http_post(
    url := 'https://n8n.example.com/webhook/nuevo-lead',
    body := jsonb_build_object(
      'record', new,
      'event', 'lead.created'
    ),
    headers := jsonb_build_object('Content-Type', 'application/json')
  );
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_lead_created on public.leads;

create trigger on_lead_created
  after insert on public.leads
  for each row
  execute function public.trigger_n8n_lead();

-- 10. Índices para optimización
create index if not exists idx_leads_client_id on public.leads(client_id);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created_at on public.leads(created_at);
create index if not exists idx_projects_client_id on public.projects(client_id);
create index if not exists idx_projects_status on public.projects(status);

-- 11. Storage buckets setup
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('attachments', 'attachments', false) on conflict do nothing;

-- RLS Policies for storage.objects (avatars bucket)
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- RLS Policies for storage.objects (attachments bucket)
drop policy if exists "Users can view attachments they own or on their entities" on storage.objects;
create policy "Users can view attachments they own or on their entities"
  on storage.objects for select
  using (
    bucket_id = 'attachments' and (
      -- Owner of the file (check folder name)
      (storage.foldername(name))[1] = auth.uid()::text
      or
      -- Attachment belongs to user's lead/project (parsed from storage path)
      exists (
        select 1 from public.attachments
        where storage_path = name and user_id = auth.uid()
      )
    )
  );

drop policy if exists "Authenticated users can upload attachments" on storage.objects;
create policy "Authenticated users can upload attachments"
  on storage.objects for insert
  with check (bucket_id = 'attachments' and auth.uid() is not null);

drop policy if exists "Users can delete their own attachments" on storage.objects;
create policy "Users can delete their own attachments"
  on storage.objects for delete
  using (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text);
