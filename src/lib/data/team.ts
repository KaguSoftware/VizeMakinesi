import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';

export type TeamMemberRow = Database['public']['Tables']['team_members']['Row'];

export async function getTeamMembers(): Promise<TeamMemberRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as TeamMemberRow[];
}
