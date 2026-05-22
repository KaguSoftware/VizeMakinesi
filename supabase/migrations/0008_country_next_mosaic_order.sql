-- Atomic helper for assigning the next mosaic_order to a new country.
-- Avoids the read-then-write race in the previous client-side implementation:
-- two concurrent createCountry() calls could read the same max and write the
-- same order. This function locks the table briefly and returns coalesce(max, 0)+1
-- inside a single transaction.

create or replace function public.next_country_mosaic_order()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  next_order integer;
begin
  lock table public.countries in share row exclusive mode;
  select coalesce(max(mosaic_order), 0) + 1 into next_order from public.countries;
  return next_order;
end;
$$;

revoke all on function public.next_country_mosaic_order() from public;
grant execute on function public.next_country_mosaic_order() to authenticated;
