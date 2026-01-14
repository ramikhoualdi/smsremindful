'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { REMINDER_TIMINGS, type ReminderSchedule, type ReminderTiming } from '../types'
import type { Template } from '@/features/templates/types'
import type { SMSLog } from '../types'
import { format } from 'date-fns'

interface ReminderSettingsProps {
  schedules: ReminderSchedule[]
  templates: Template[]
  smsLogs: SMSLog[]
}

export function ReminderSettings({
  schedules: initialSchedules,
  templates,
  smsLogs,
}: ReminderSettingsProps) {
  const router = useRouter()
  const [schedules, setSchedules] = useState(initialSchedules)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state for new schedule
  const [newTiming, setNewTiming] = useState<ReminderTiming>('day')
  const [newTemplateId, setNewTemplateId] = useState<string>('')

  const handleToggleSchedule = async (scheduleId: string, enabled: boolean) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/reminders/${scheduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      })

      if (!res.ok) {
        throw new Error('Failed to update schedule')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSchedule = async () => {
    if (!newTemplateId) {
      setError('Please select a template')
      return
    }

    // Check if timing already exists
    if (schedules.some((s) => s.timing === newTiming)) {
      setError('A schedule for this timing already exists')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timing: newTiming,
          templateId: newTemplateId,
          enabled: true,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to create schedule')
      }

      setNewTemplateId('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/reminders/${scheduleId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete schedule')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getTemplateName = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    return template?.name || 'Unknown Template'
  }

  // Get available timings (not yet configured)
  const availableTimings = Object.entries(REMINDER_TIMINGS).filter(
    ([key]) => !schedules.some((s) => s.timing === key)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reminder Settings</h2>
          <p className="text-muted-foreground">
            Configure when to send SMS reminders to patients
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Reminder Schedule</CardTitle>
          <CardDescription>
            Choose when reminders should be sent before appointments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {schedules.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reminder schedules configured yet. Add one below.
            </p>
          ) : (
            schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {REMINDER_TIMINGS[schedule.timing]?.label || schedule.timing}
                    </span>
                    {schedule.enabled ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Using template: {getTemplateName(schedule.templateId)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={schedule.enabled ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => handleToggleSchedule(schedule.id, !schedule.enabled)}
                    disabled={isLoading}
                  >
                    {schedule.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}

          {availableTimings.length > 0 && templates.length > 0 && (
            <div className="mt-6 space-y-4 rounded-lg border p-4">
              <h4 className="font-medium">Add New Schedule</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">When to send</label>
                  <Select
                    value={newTiming}
                    onValueChange={(v) => setNewTiming(v as ReminderTiming)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimings.map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template to use</label>
                  <Select value={newTemplateId} onValueChange={setNewTemplateId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleCreateSchedule}
                disabled={isLoading || !newTemplateId}
              >
                {isLoading ? 'Adding...' : 'Add Schedule'}
              </Button>
            </div>
          )}

          {templates.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Create a template first before setting up reminder schedules.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sent Reminders</CardTitle>
          <CardDescription>History of reminders sent to patients</CardDescription>
        </CardHeader>
        <CardContent>
          {smsLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reminders have been sent yet.
            </p>
          ) : (
            <div className="space-y-3">
              {smsLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{log.phoneNumber}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {log.message}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        log.status === 'delivered'
                          ? 'default'
                          : log.status === 'sent'
                            ? 'secondary'
                            : log.status === 'failed'
                              ? 'destructive'
                              : 'outline'
                      }
                    >
                      {log.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {log.sentAt
                        ? format(log.sentAt, 'MMM d, h:mm a')
                        : format(log.createdAt, 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
