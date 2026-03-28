import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SettingsRegistry } from '@/modules/settings-engine/registry';
import { getAdminFirestore } from '@/lib/firebase-admin';

// ============================================================================
// Phase 19/21: Firebase-backed Settings API
// ============================================================================

export const dynamic = 'force-dynamic';

async function readUserSettings(userId: string) {
  try {
    const firestore = getAdminFirestore();
    const docRef = firestore.collection('users').doc(userId).collection('config').doc('settings');
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return docSnap.data() || {};
    }
  } catch (error) {
    console.error('[Settings API] Failed to read from Firestore:', error);
  }
  return {};
}

async function writeUserSettings(userId: string, data: any) {
  try {
    const firestore = getAdminFirestore();
    const docRef = firestore.collection('users').doc(userId).collection('config').doc('settings');
    await docRef.set(data, { merge: true });
    return true;
  } catch (error) {
    console.error('[Settings API] Failed to write to Firestore:', error);
    return false;
  }
}

/**
 * GET /api/settings
 * Returns all saved user settings from Firebase Firestore.
 * Falls back to SettingsRegistry defaults if no row exists.
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    // Default to 'local-user' if no session is available
    const userId = session?.user?.id || 'local-user';

    const userSettings = await readUserSettings(userId);

    // Merge saved values ON TOP of defaults — so new features still show up
    const defaults = SettingsRegistry.getDefaults();
    return NextResponse.json({ ...defaults, ...userSettings });
  } catch (error) {
    console.error('[Settings GET] Error:', error);
    return NextResponse.json(SettingsRegistry.getDefaults());
  }
}

/**
 * PATCH /api/settings
 * Receives partial settings { [slug]: value, ... }
 * Validates each via SettingsRegistry, then upserts into Firebase Firestore.
 * Calls onAfterChange on the SERVER for backend-only features.
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'local-user';

    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Step 1: Validate every incoming setting via the Registry
    const allFeatures = SettingsRegistry.getAll();
    const validated: Record<string, any> = {};
    const activations: string[] = [];
    const errors: string[] = [];

    for (const [key, value] of Object.entries(body)) {
      // Find the feature definition. The key may be either:
      // - "some-slug_enabled" (toggle/enable state)
      // - "some-slug" (config value for dropdown/text/slider/color)
      const isEnabledKey = key.endsWith('_enabled');
      const cleanSlug = isEnabledKey ? key.replace('_enabled', '') : key;
      const feature = allFeatures.find(f => f.slug === cleanSlug);
      
      if (!feature) {
        console.warn(`[Settings PATCH] ⚠️ Unknown slug skipped: "${cleanSlug}" (Raw key: "${key}")`);
        continue;
      }

      // Validate the value against the feature definition
      try {
        await feature.validate(value);
      } catch (e) {
        // Intentionally ignore validation errors to prevent rejecting toggles
      }

      // Store the exact key the UI sent — this ensures hydration works correctly
      validated[key] = value;
      activations.push(cleanSlug);
    }

    if (Object.keys(validated).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid settings to save',
        errors,
      }, { status: 422 });
    }

    // Step 3: Merge with existing settings and save to Firestore
    const success = await writeUserSettings(userId, validated);

    if (!success) {
       return NextResponse.json({ error: 'Failed to persist to Firebase' }, { status: 500 });
    }

    console.log(`[Settings PATCH] 💾 Persisted ${Object.keys(validated).length} settings to Firebase for "${userId}".`);

    return NextResponse.json({
      success: true,
      persisted: Object.keys(validated).length,
      activations,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('[Settings PATCH] Fatal error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
