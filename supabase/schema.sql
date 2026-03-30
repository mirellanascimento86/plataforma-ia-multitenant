-- ============================================
-- PLATAFORMA MULTI-TENANT - BANCO DE DADOS
-- ============================================

-- Tabela de Empresas (Tenants)
create table public.empresas (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  slug text unique not null,
  cnpj text,
  email text not null,
  telefone text,
  ativa boolean default true,
  plano text default 'gratuito',
  criada_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Usuários
create table public.usuarios (
  id uuid references auth.users on delete cascade primary key,
  empresa_id uuid references public.empresas(id) on delete cascade not null,
  email text not null,
  nome text not null,
  cargo text default 'admin_empresa',
  ativo boolean default true,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Robôs
create table public.robos (
  id uuid default gen_random_uuid() primary key,
  empresa_id uuid references public.empresas(id) on delete cascade not null,
  nome text not null,
  descricao text,
  ativo boolean default true,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Conversas
create table public.conversas (
  id uuid default gen_random_uuid() primary key,
  empresa_id uuid references public.empresas(id) on delete cascade not null,
  cliente_nome text,
  cliente_telefone text not null,
  status text default 'ativa',
  ultima_mensagem text,
  criada_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Políticas de segurança
alter table public.empresas enable row level security;
alter table public.usuarios enable row level security;
alter table public.robos enable row level security;
alter table public.conversas enable row level security;

-- Política: Usuários só veem dados da sua empresa
create policy "isolation_empresa_usuarios" on public.usuarios
  for all using (empresa_id in (
    select empresa_id from public.usuarios where id = auth.uid()
  ));

create policy "isolation_empresa_robos" on public.robos
  for all using (empresa_id in (
    select empresa_id from public.usuarios where id = auth.uid()
  ));

create policy "isolation_empresa_conversas" on public.conversas
  for all using (empresa_id in (
    select empresa_id from public.usuarios where id = auth.uid()
  ));
