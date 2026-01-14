'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ClinicInfoFormProps {
  initialClinicName: string
  initialClinicPhone: string
}

export function ClinicInfoForm({ initialClinicName, initialClinicPhone }: ClinicInfoFormProps) {
  const router = useRouter()
  const [clinicName, setClinicName] = useState(initialClinicName)
  const [clinicPhone, setClinicPhone] = useState(initialClinicPhone)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSave = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicName, clinicPhone }),
      })

      if (res.ok) {
        setResult({ success: true, message: 'Settings saved successfully!' })
        router.refresh()
      } else {
        const data = await res.json()
        setResult({ success: false, message: data.error || 'Failed to save settings' })
      }
    } catch (error) {
      setResult({ success: false, message: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="clinicName">Clinic Name</Label>
        <Input
          id="clinicName"
          placeholder="Your Dental Practice"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="clinicPhone">Clinic Phone</Label>
        <Input
          id="clinicPhone"
          placeholder="+1 (555) 123-4567"
          value={clinicPhone}
          onChange={(e) => setClinicPhone(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          This phone number will be shown in SMS reminders for patients to call back
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

      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}
