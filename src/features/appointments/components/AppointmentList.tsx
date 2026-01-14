'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import type { Appointment } from '../types'
import { isUSPhoneNumber, US_PHONE_ERROR } from '@/utils/phone'

interface AppointmentListProps {
  appointments: Appointment[]
  isCalendarConnected: boolean
}

export function AppointmentList({ appointments, isCalendarConnected }: AppointmentListProps) {
  const router = useRouter()
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const missingPhoneCount = appointments.filter((a) => !a.patientPhone).length

  const openEditDialog = (appointment: Appointment) => {
    setPhoneNumber(appointment.patientPhone || '')
    setEditingAppointment(appointment)
    setError(null)
  }

  const handleUpdatePhone = async () => {
    if (!editingAppointment) return

    // Validate US phone number (allow empty to clear)
    if (phoneNumber && !isUSPhoneNumber(phoneNumber)) {
      setError(US_PHONE_ERROR)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/appointments/${editingAppointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientPhone: phoneNumber }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update phone number')
      }

      setEditingAppointment(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isCalendarConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Your Calendar</CardTitle>
          <CardDescription>
            Connect your Google Calendar to sync appointments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once connected, your appointments will appear here with patient names,
            phone numbers, and scheduled times.
          </p>
          <Button asChild>
            <Link href="/dashboard/settings">Go to Settings</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Upcoming Appointments</CardTitle>
          <CardDescription>
            Your calendar is connected but no appointments were found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Try syncing your calendar again or add appointments to your Google Calendar.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Warning banner for missing phone numbers */}
      {missingPhoneCount > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
          <div className="flex items-start gap-3">
            <WarningIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                {missingPhoneCount} appointment{missingPhoneCount !== 1 ? 's' : ''} missing phone number{missingPhoneCount !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                SMS reminders cannot be sent without phone numbers. Click &quot;Add Phone&quot; on each appointment to add the patient&apos;s phone number, or add it to your Google Calendar event description and sync again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Appointment list */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card
            key={appointment.id}
            className={!appointment.patientPhone ? 'border-amber-200 dark:border-amber-900' : ''}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="font-medium">{appointment.patientName}</p>
                {appointment.patientPhone ? (
                  <p className="text-sm text-muted-foreground">
                    {appointment.patientPhone}
                  </p>
                ) : (
                  <button
                    onClick={() => openEditDialog(appointment)}
                    className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <PlusIcon className="h-3 w-3" />
                    Add phone number
                  </button>
                )}
                {appointment.location && (
                  <p className="text-sm text-muted-foreground">
                    {appointment.location}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right space-y-1">
                  <p className="font-medium">
                    {format(appointment.appointmentTime, 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(appointment.appointmentTime, 'h:mm a')} -{' '}
                    {format(appointment.endTime, 'h:mm a')}
                  </p>
                  <Badge
                    variant={
                      !appointment.patientPhone
                        ? 'outline'
                        : appointment.reminderSent
                          ? 'default'
                          : 'secondary'
                    }
                  >
                    {!appointment.patientPhone
                      ? 'No Phone'
                      : appointment.reminderSent
                        ? 'Reminder Sent'
                        : 'Pending'}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(appointment)}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit phone number dialog */}
      <Dialog
        open={!!editingAppointment}
        onOpenChange={(open) => !open && setEditingAppointment(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Phone Number</DialogTitle>
            <DialogDescription>
              {editingAppointment?.patientName} - {editingAppointment && format(editingAppointment.appointmentTime, 'MMM d, yyyy h:mm a')}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Patient Phone Number</label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              type="tel"
            />
            <p className="text-xs text-muted-foreground">
              US phone numbers only (+1). Format: (555) 123-4567
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAppointment(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePhone} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Phone Number'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  )
}
