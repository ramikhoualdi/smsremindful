'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function TestSMS() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSendTest = async () => {
    if (!phoneNumber) {
      setResult({ success: false, message: 'Please enter a phone number' })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/sms/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setResult({ success: true, message: 'Test SMS sent! Check your phone.' })
        setPhoneNumber('')
      } else {
        setResult({ success: false, message: data.error || 'Failed to send SMS' })
      }
    } catch (error) {
      setResult({ success: false, message: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="testPhone">Phone Number</Label>
        <div className="flex gap-2">
          <Input
            id="testPhone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 555 123 4567"
            type="tel"
            className="flex-1"
          />
          <Button onClick={handleSendTest} disabled={isLoading || !phoneNumber}>
            {isLoading ? 'Sending...' : 'Send Test'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Include country code (e.g., +1 for US). With Twilio trial, you can only send to verified numbers.
        </p>
      </div>

      {result && (
        <div
          className={`rounded-lg p-3 text-sm ${
            result.success
              ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  )
}
