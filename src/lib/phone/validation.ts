// Phone Number Validation using Twilio Lookup API
// Caches results in Firestore to avoid repeated lookups (lookups cost ~$0.005 each)

import twilio from 'twilio'
import { getAdminDb } from '@/lib/firebase/admin'

const PHONE_LOOKUPS_COLLECTION = 'phoneLookups'
const CACHE_EXPIRY_DAYS = 30 // Cache lookups for 30 days

// Carrier types from Twilio
export type CarrierType = 'mobile' | 'landline' | 'voip' | 'unknown'

export interface PhoneValidationResult {
  valid: boolean
  phoneNumber: string // E.164 format
  countryCode: string
  carrierType: CarrierType
  carrierName?: string
  canReceiveSMS: boolean
  error?: string
  cached?: boolean
}

interface PhoneLookupCache {
  phoneNumber: string
  valid: boolean
  countryCode: string
  carrierType: CarrierType
  carrierName?: string
  canReceiveSMS: boolean
  error?: string
  createdAt: Date
  expiresAt: Date
}

// Get Twilio client for lookup
function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured')
  }

  return twilio(accountSid, authToken)
}

// Check cache for existing lookup
async function getCachedLookup(phoneNumber: string): Promise<PhoneLookupCache | null> {
  try {
    const doc = await getAdminDb()
      .collection(PHONE_LOOKUPS_COLLECTION)
      .doc(phoneNumber.replace(/\+/g, '')) // Use phone as doc ID (without +)
      .get()

    if (!doc.exists) {
      return null
    }

    const data = doc.data() as PhoneLookupCache
    const expiresAt = data.expiresAt instanceof Date ? data.expiresAt : (data.expiresAt as FirebaseFirestore.Timestamp)?.toDate?.()

    // Check if cache is expired
    if (expiresAt && expiresAt < new Date()) {
      return null // Expired
    }

    return {
      ...data,
      createdAt: data.createdAt instanceof Date ? data.createdAt : (data.createdAt as FirebaseFirestore.Timestamp)?.toDate?.() || new Date(),
      expiresAt: expiresAt || new Date(),
    }
  } catch (error) {
    console.error('Error checking phone lookup cache:', error)
    return null
  }
}

// Save lookup result to cache
async function cacheLookup(result: PhoneValidationResult): Promise<void> {
  try {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

    await getAdminDb()
      .collection(PHONE_LOOKUPS_COLLECTION)
      .doc(result.phoneNumber.replace(/\+/g, ''))
      .set({
        phoneNumber: result.phoneNumber,
        valid: result.valid,
        countryCode: result.countryCode,
        carrierType: result.carrierType,
        carrierName: result.carrierName || null,
        canReceiveSMS: result.canReceiveSMS,
        error: result.error || null,
        createdAt: now,
        expiresAt,
      })
  } catch (error) {
    console.error('Error caching phone lookup:', error)
  }
}

// Validate phone number using Twilio Lookup API
export async function validatePhoneNumber(
  phoneNumber: string,
  skipCache = false
): Promise<PhoneValidationResult> {
  // Normalize phone number to E.164 format
  let normalizedPhone = phoneNumber.trim()
  if (!normalizedPhone.startsWith('+')) {
    // Assume US if no country code
    normalizedPhone = normalizedPhone.replace(/\D/g, '')
    if (normalizedPhone.length === 10) {
      normalizedPhone = '+1' + normalizedPhone
    } else if (normalizedPhone.length === 11 && normalizedPhone.startsWith('1')) {
      normalizedPhone = '+' + normalizedPhone
    } else {
      normalizedPhone = '+' + normalizedPhone
    }
  }

  // Check cache first (unless skipped)
  if (!skipCache) {
    const cached = await getCachedLookup(normalizedPhone)
    if (cached) {
      return {
        valid: cached.valid,
        phoneNumber: cached.phoneNumber,
        countryCode: cached.countryCode,
        carrierType: cached.carrierType,
        carrierName: cached.carrierName,
        canReceiveSMS: cached.canReceiveSMS,
        error: cached.error,
        cached: true,
      }
    }
  }

  try {
    const client = getTwilioClient()

    // Use Twilio Lookup v2 API with carrier info
    const lookup = await client.lookups.v2
      .phoneNumbers(normalizedPhone)
      .fetch({ fields: 'line_type_intelligence' })

    const lineTypeIntelligence = lookup.lineTypeIntelligence as {
      carrier_name?: string
      type?: string
    } | null

    // Determine carrier type
    let carrierType: CarrierType = 'unknown'
    const twilioType = lineTypeIntelligence?.type?.toLowerCase() || ''

    if (twilioType === 'mobile') {
      carrierType = 'mobile'
    } else if (twilioType === 'landline' || twilioType === 'fixedline') {
      carrierType = 'landline'
    } else if (twilioType === 'voip' || twilioType === 'nonFixedVoip') {
      carrierType = 'voip'
    }

    // Check if phone can receive SMS (mobile and voip can, landline cannot)
    const canReceiveSMS = carrierType === 'mobile' || carrierType === 'voip'

    const result: PhoneValidationResult = {
      valid: true,
      phoneNumber: lookup.phoneNumber,
      countryCode: lookup.countryCode || 'US',
      carrierType,
      carrierName: lineTypeIntelligence?.carrier_name,
      canReceiveSMS,
    }

    // Cache the result
    await cacheLookup(result)

    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Check for specific Twilio errors
    const isInvalidNumber = errorMessage.includes('not a valid phone number') ||
      errorMessage.includes('20404') // Twilio error code for invalid number

    const result: PhoneValidationResult = {
      valid: !isInvalidNumber,
      phoneNumber: normalizedPhone,
      countryCode: 'US',
      carrierType: 'unknown',
      canReceiveSMS: !isInvalidNumber, // Assume can receive if not explicitly invalid
      error: errorMessage,
    }

    // Cache invalid numbers too (to avoid repeated lookups)
    if (isInvalidNumber) {
      await cacheLookup(result)
    }

    return result
  }
}

// Quick validation without Twilio API (just format check)
export function isValidPhoneFormat(phoneNumber: string): boolean {
  const normalized = phoneNumber.replace(/\D/g, '')
  // US numbers: 10 digits or 11 digits starting with 1
  return (
    normalized.length === 10 ||
    (normalized.length === 11 && normalized.startsWith('1'))
  )
}

// Batch validate multiple phone numbers
export async function validatePhoneNumbers(
  phoneNumbers: string[]
): Promise<Map<string, PhoneValidationResult>> {
  const results = new Map<string, PhoneValidationResult>()

  // Process in parallel with rate limiting (Twilio has rate limits)
  const batchSize = 5
  for (let i = 0; i < phoneNumbers.length; i += batchSize) {
    const batch = phoneNumbers.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map((phone) => validatePhoneNumber(phone))
    )
    batch.forEach((phone, index) => {
      results.set(phone, batchResults[index])
    })
  }

  return results
}
