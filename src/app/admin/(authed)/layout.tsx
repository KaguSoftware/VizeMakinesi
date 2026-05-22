import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { ToastProvider } from '@/components/admin/ui/Toast'
import { DirtyFormProvider } from '@/lib/hooks/useUnsavedChanges'

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: adminProfile } = await supabase
    .from('admin_profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminProfile) {
    // User exists in auth but not in admin_profiles — sign out and redirect
    await supabase.auth.signOut()
    redirect('/admin/login')
  }

  return (
    <ToastProvider>
      <DirtyFormProvider>
        <div className="min-h-screen md:flex bg-cream text-navy">
          <AdminSidebar email={user.email} />
          <main className="flex-1 min-w-0 px-5 py-8 md:p-12 overflow-x-hidden">
            {children}
          </main>
        </div>
      </DirtyFormProvider>
    </ToastProvider>
  )
}
