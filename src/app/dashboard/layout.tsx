import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { Sidebar, MobileSidebar } from '@/components/layout/Sidebar'
import { getUserByClerkId } from '@/features/auth/server/user-service'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await getUserByClerkId(userId)

  // Redirect to onboarding if not completed
  if (user && !user.onboardingCompleted) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center gap-3">
            <MobileSidebar />
            <h1 className="text-lg md:text-xl font-semibold">SMS Remindful</h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
