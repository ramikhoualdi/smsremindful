// US Phone Number Validation Utilities

/**
 * Validates if a phone number is a US phone number
 * US numbers: +1 followed by 10 digits, or just 10 digits
 */
export function isUSPhoneNumber(phone: string): boolean {
  if (!phone) return false

  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '')

  // Check for +1 followed by 10 digits
  if (cleaned.startsWith('+1') && cleaned.length === 12) {
    return true
  }

  // Check for 1 followed by 10 digits (without +)
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    return true
  }

  // Check for just 10 digits (US number without country code)
  if (!cleaned.startsWith('+') && cleaned.length === 10) {
    return true
  }

  return false
}

/**
 * Normalizes a US phone number to E.164 format (+1XXXXXXXXXX)
 * Returns null if not a valid US number
 */
export function normalizeUSPhoneNumber(phone: string): string | null {
  if (!phone) return null

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')

  // Handle 10-digit number (add +1)
  if (digits.length === 10) {
    return `+1${digits}`
  }

  // Handle 11-digit number starting with 1
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`
  }

  return null
}

/**
 * Formats a US phone number for display: (XXX) XXX-XXXX
 */
export function formatUSPhoneNumber(phone: string): string {
  const normalized = normalizeUSPhoneNumber(phone)
  if (!normalized) return phone

  // Extract the 10 digits after +1
  const digits = normalized.slice(2)
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

/**
 * Error message for non-US phone numbers
 */
export const US_PHONE_ERROR = 'Only US phone numbers (+1) are supported at this time'
