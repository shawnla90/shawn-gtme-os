import path from 'path'
import { getRPGProfile } from '@shawnos/shared/lib/rpg.server'
import { DEFAULT_PROFILE } from '@shawnos/shared/lib/rpg'
import type { RPGProfile } from '@shawnos/shared/lib/rpg'

/**
 * Public API endpoint for real-time RPG progression data.
 * 
 * Returns current level, XP, milestones, and avatar tier as JSON.
 * Data is sourced from data/progression/profile.json (public file).
 * 
 * Features:
 * - CORS enabled for public consumption
 * - 1-hour CDN cache
 * - Graceful fallback to default profile if data doesn't exist
 * 
 * @see https://shawnos.ai/api for full documentation
 */

// Resolve absolute path to the data directory (repo root)
const DATA_ROOT = path.join(process.cwd(), '../../../data')

export interface APIStatusResponse extends RPGProfile {
  meta: {
    api_version: string
    docs: string
  }
}

export function GET() {
  try {
    // Read profile.json from disk (returns null if doesn't exist)
    const profile = getRPGProfile(DATA_ROOT)

    // Use default profile if progression engine hasn't run yet
    const data = profile ?? DEFAULT_PROFILE

    // Build API response with meta fields
    const response: APIStatusResponse = {
      ...data,
      meta: {
        api_version: '1.0',
        docs: 'https://shawnos.ai/api',
      },
    }

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // CORS headers — allow all origins for public consumption
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        // Cache for 1 hour on CDN and browser
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    // Graceful error handling — log error but return default profile
    console.error('[API /status] Error reading profile:', error)

    const fallbackResponse: APIStatusResponse = {
      ...DEFAULT_PROFILE,
      meta: {
        api_version: '1.0',
        docs: 'https://shawnos.ai/api',
      },
    }

    return new Response(JSON.stringify(fallbackResponse, null, 2), {
      status: 200, // Return 200 even on error to avoid breaking external integrations
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        // Shorter cache on error fallback
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    })
  }
}

/**
 * Handle preflight OPTIONS requests for CORS
 */
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
    },
  })
}
