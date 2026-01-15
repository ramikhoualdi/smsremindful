'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer')
        setIsLoading(false)
      } else {
        console.error('No portal URL returned:', data.error)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Portal error:', error)
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading} variant="outline">
      {isLoading ? 'Loading...' : 'Manage Subscription'}
    </Button>
  )
}
