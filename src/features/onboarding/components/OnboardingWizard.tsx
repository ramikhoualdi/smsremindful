'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface OnboardingWizardProps {
  userName: string
  isCalendarConnected: boolean
  connectedEmail?: string
}

type Step = 'profile' | 'calendar' | 'test'

export function OnboardingWizard({
  userName,
  isCalendarConnected,
  connectedEmail,
}: OnboardingWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Profile form state
  const [clinicName, setClinicName] = useState('')
  const [clinicPhone, setClinicPhone] = useState('')

  // Test SMS state
  const [testPhone, setTestPhone] = useState('')
  const [testSent, setTestSent] = useState(false)

  const steps: Step[] = ['profile', 'calendar', 'test']
  const currentStepIndex = steps.indexOf(currentStep)

  const handleProfileSubmit = async () => {
    if (!clinicName.trim()) {
      setError('Please enter your clinic name')
      return
    }
    if (!clinicPhone.trim()) {
      setError('Please enter your clinic phone number')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicName, clinicPhone }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save profile')
      }

      setCurrentStep('calendar')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectCalendar = () => {
    window.location.href = '/api/calendar/google/connect?redirect=/onboarding'
  }

  const handleSendTestSMS = async () => {
    if (!testPhone.trim()) {
      setError('Please enter a phone number')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/sms/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: testPhone }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send test SMS')
      }

      setTestSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send test SMS')
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/user/complete-onboarding', {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to complete onboarding')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete setup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkipToEnd = async () => {
    if (currentStep === 'calendar') {
      setCurrentStep('test')
    } else {
      await handleComplete()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index <= currentStepIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Profile</span>
            <span>Calendar</span>
            <span>Test</span>
          </div>
        </div>

        {/* Step content */}
        <Card>
          {currentStep === 'profile' && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Welcome, {userName}!</CardTitle>
                <CardDescription>
                  Let&apos;s set up your clinic profile. This information appears in SMS
                  reminders so patients know who&apos;s contacting them.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name *</Label>
                  <Input
                    id="clinicName"
                    placeholder="e.g., Smile Dental Care"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicPhone">Clinic Phone *</Label>
                  <Input
                    id="clinicPhone"
                    placeholder="e.g., (555) 123-4567"
                    value={clinicPhone}
                    onChange={(e) => setClinicPhone(e.target.value)}
                  />
                </div>

                {/* Preview */}
                <div className="rounded-lg bg-muted/50 p-4 mt-6">
                  <p className="text-xs text-muted-foreground mb-2">Preview of your SMS:</p>
                  <p className="text-sm">
                    SMS Remindful: Hi Alex, your appointment at{' '}
                    <span className="font-medium">{clinicName || '[Clinic Name]'}</span> is
                    tomorrow at 2:00 PM. Call{' '}
                    <span className="font-medium">{clinicPhone || '[Phone]'}</span> to
                    reschedule.
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  className="w-full cursor-pointer"
                  onClick={handleProfileSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Continue'}
                </Button>
              </CardContent>
            </>
          )}

          {currentStep === 'calendar' && (
            <>
              <CardHeader>
                <CardTitle>Connect Your Calendar</CardTitle>
                <CardDescription>
                  Import appointments automatically from your calendar - no manual entry
                  needed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <GoogleCalendarIcon />
                    </div>
                    <div>
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-muted-foreground">
                        {isCalendarConnected
                          ? `Connected as ${connectedEmail}`
                          : 'Sync your appointments automatically'}
                      </p>
                    </div>
                  </div>
                  {isCalendarConnected && (
                    <span className="text-sm text-green-600 font-medium">Connected</span>
                  )}
                </div>

                {!isCalendarConnected && (
                  <Button
                    className="w-full cursor-pointer"
                    onClick={handleConnectCalendar}
                  >
                    Connect Google Calendar
                  </Button>
                )}

                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  <strong>Coming soon:</strong> Microsoft Outlook calendar integration
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    onClick={handleSkipToEnd}
                  >
                    Skip for now
                  </Button>
                  {isCalendarConnected && (
                    <Button
                      className="flex-1 cursor-pointer"
                      onClick={() => setCurrentStep('test')}
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 'test' && (
            <>
              <CardHeader>
                <CardTitle>Test Your Setup</CardTitle>
                <CardDescription>
                  Send yourself a test message to make sure everything works correctly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!testSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="testPhone">Your Phone Number</Label>
                      <Input
                        id="testPhone"
                        placeholder="e.g., (555) 987-6543"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        US phone numbers only. This will use 1 SMS credit.
                      </p>
                    </div>

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button
                      className="w-full cursor-pointer"
                      onClick={handleSendTestSMS}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Test SMS'}
                    </Button>
                  </>
                ) : (
                  <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
                    <div className="text-3xl mb-2">&#10003;</div>
                    <p className="font-medium text-green-800 dark:text-green-300">
                      Test SMS sent!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Check your phone for the message.
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    onClick={handleSkipToEnd}
                  >
                    {testSent ? 'Skip' : 'Skip for now'}
                  </Button>
                  <Button
                    className="flex-1 cursor-pointer"
                    onClick={handleComplete}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Finishing...' : 'Finish Setup'}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          You can always update these settings later in your dashboard.
        </p>
      </div>
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
