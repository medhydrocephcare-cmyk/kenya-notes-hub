-- Fix "permission denied for function has_role" in production.
--
-- Root cause: migration 20260727145702 created public.has_role() as
-- SECURITY DEFINER (correct — it needs to read public.user_roles for an
-- arbitrary _user_id, which the caller's own row-level "read own roles"
-- policy would not otherwise allow). The very next migration,
-- 20260727145717, then revoked EXECUTE on has_role() from
-- public/anon/authenticated and granted it only to service_role.
--
-- SECURITY DEFINER only changes whose privileges the function BODY runs
-- with — it does not waive the caller's need for EXECUTE to invoke the
-- function at all. Migration 20260728092211 (the papers table) added RLS
-- policies that call public.has_role(auth.uid(), 'admin') for the anon
-- and authenticated roles (papers public read, and the admin
-- insert/update/delete policies). Any RLS-governed query run as anon or
-- authenticated — i.e. every normal page load and the admin API — has
-- therefore been failing with "permission denied for function has_role"
-- since that revoke landed.

-- Re-affirm the function: SECURITY DEFINER, with search_path locked to
-- `public` so it cannot be redirected by a caller-controlled search_path
-- (idempotent — matches the original definition, no behavioural change).
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

-- Callers evaluated under RLS as anon or authenticated must be able to
-- invoke has_role() for policies that reference it to work at all.
-- service_role also needs it directly (e.g. server-side admin scripts).
grant execute on function public.has_role(uuid, public.app_role) to anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant execute on function public.has_role(uuid, public.app_role) to service_role;

-- public.grant_admin_for_verified_email() is intentionally left revoked
-- from anon/authenticated: it is only ever invoked by the auth.users
-- trigger (which runs with the trigger owner's privileges), never called
-- directly by a client role, so no change is needed there.
