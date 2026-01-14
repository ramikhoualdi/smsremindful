import { z } from 'zod'

// Template variables that can be used in SMS messages
export const TEMPLATE_VARIABLES = {
  patientName: '{{patientName}}',
  appointmentDate: '{{appointmentDate}}',
  appointmentTime: '{{appointmentTime}}',
  clinicName: '{{clinicName}}',
  clinicPhone: '{{clinicPhone}}',
} as const

export type TemplateVariable = keyof typeof TEMPLATE_VARIABLES

// Zod schemas
export const templateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, 'Name is required').max(100),
  content: z.string().min(1, 'Content is required').max(500),
  isDefault: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  content: z.string().min(1, 'Content is required').max(500),
  isDefault: z.boolean().optional().default(false),
})

export const updateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  content: z.string().min(1).max(500).optional(),
  isDefault: z.boolean().optional(),
})

// TypeScript types
export type Template = z.infer<typeof templateSchema>
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>

// Default templates - include opt-out text for A2P 10DLC compliance
export const DEFAULT_TEMPLATES: Omit<Template, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Appointment Reminder - 1 Day Before',
    content: 'SMS Remindful: Hi {{patientName}}, this is a reminder of your appointment tomorrow at {{appointmentTime}} with {{clinicName}}. Please call {{clinicPhone}} if you need to reschedule. Reply STOP to opt out.',
    isDefault: true,
  },
  {
    name: 'Appointment Reminder - Same Day',
    content: 'SMS Remindful: Hi {{patientName}}, reminder - your appointment at {{clinicName}} is TODAY at {{appointmentTime}}. Please arrive a few minutes early. Reply STOP to opt out.',
    isDefault: false,
  },
  {
    name: 'Appointment Reminder - 1 Week Before',
    content: 'SMS Remindful: Hi {{patientName}}, reminder of your upcoming appointment on {{appointmentDate}} at {{appointmentTime}} with {{clinicName}}. Reply STOP to opt out.',
    isDefault: false,
  },
]

// Helper to interpolate template variables
export function interpolateTemplate(
  template: string,
  variables: {
    patientName?: string
    appointmentDate?: string
    appointmentTime?: string
    clinicName?: string
    clinicPhone?: string
  }
): string {
  let result = template

  if (variables.patientName) {
    result = result.replace(/\{\{patientName\}\}/g, variables.patientName)
  }
  if (variables.appointmentDate) {
    result = result.replace(/\{\{appointmentDate\}\}/g, variables.appointmentDate)
  }
  if (variables.appointmentTime) {
    result = result.replace(/\{\{appointmentTime\}\}/g, variables.appointmentTime)
  }
  if (variables.clinicName) {
    result = result.replace(/\{\{clinicName\}\}/g, variables.clinicName)
  }
  if (variables.clinicPhone) {
    result = result.replace(/\{\{clinicPhone\}\}/g, variables.clinicPhone)
  }

  return result
}
