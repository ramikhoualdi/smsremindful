'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CalendarConnectionProps {
  isConnected: boolean
  connectedEmail?: string
  lastSyncedAt?: Date
}

export function CalendarConnection({
  isConnected,
  connectedEmail,
  lastSyncedAt,
}: CalendarConnectionProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [syncResult, setSyncResult] = useState<{
    created: number
    updated: number
    deleted: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = () => {
    window.location.href = '/api/calendar/google/connect'
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Google Calendar?')) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/calendar/google/disconnect', {
        method: 'POST',
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error disconnecting:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    setIsLoading(true)
    setSyncResult(null)
    setError(null)

    try {
      const res = await fetch('/api/calendar/google/sync', {
        method: 'POST',
      })

      const data = await res.json()

      if (res.ok) {
        setSyncResult({
          created: data.created,
          updated: data.updated,
          deleted: data.deleted,
        })
        router.refresh()
      } else {
        setError(data.error || 'Failed to sync calendar')
      }
    } catch (err) {
      console.error('Error syncing:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <GoogleCalendarIcon />
          </div>
          <div>
            <p className="font-medium">Google Calendar</p>
            <p className="text-sm text-muted-foreground">
              {isConnected
                ? `Connected as ${connectedEmail}`
                : 'Sync appointments from your Google Calendar'}
            </p>
          </div>
        </div>
        <Badge variant={isConnected ? 'default' : 'outline'}>
          {isConnected ? 'Connected' : 'Not Connected'}
        </Badge>
      </div>

      {isConnected && lastSyncedAt && (
        <p className="text-sm text-muted-foreground">
          Last synced: {lastSyncedAt.toLocaleString()}
        </p>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {syncResult && (
        <div className="rounded-lg bg-muted p-3 text-sm">
          Sync complete: {syncResult.created} created, {syncResult.updated} updated,{' '}
          {syncResult.deleted} removed
        </div>
      )}

      {isConnected ? (
        <div className="flex gap-2">
          <Button onClick={handleSync} disabled={isLoading} className="flex-1">
            {isLoading ? 'Syncing...' : 'Sync Now'}
          </Button>
          <Button
            variant="outline"
            onClick={handleDisconnect}
            disabled={isLoading}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={handleConnect} className="w-full" disabled={isLoading}>
          Connect Google Calendar
        </Button>
      )}
    </div>
  )
}

function GoogleCalendarIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-15A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v15a2.5 2.5 0 0 1-2.5 2.5zM9.5 7H7v2h2.5V7zm0 4H7v2h2.5v-2zm0 4H7v2h2.5v-2zm4 0h-2v2h2v-2zm0-4h-2v2h2v-2zm0-4h-2v2h2V7zm4 8h-2v2h2v-2zm0-4h-2v2h2v-2zm0-4h-2v2h2V7z"
      />
    </svg>
  )
}
