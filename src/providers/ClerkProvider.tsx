'use client'

import { ClerkProvider as BaseClerkProvider } from '@clerk/nextjs'

interface ClerkProviderProps {
  children: React.ReactNode
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <BaseClerkProvider
      appearance={{
        elements: {
          formButtonPrimary:
            'bg-primary text-primary-foreground hover:bg-primary/90',
          card: 'shadow-none',
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  )
}
