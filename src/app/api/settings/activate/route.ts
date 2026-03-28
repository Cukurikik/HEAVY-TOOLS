import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SettingsRegistry } from '@/modules/settings-engine/registry';
import { getAdminFirestore } from '@/lib/firebase-admin';

/**
 * POST /api/settings/activate
 * 
 * When a setting is changed in the UI, this endpoint:
 * 1. Validates via SettingsRegistry
 * 2. Runs encryption hooks (onBeforeSave) if present
 * 3. Fires the engine activation hook (onAfterChange)
 * 4. Persists to Firebase Firestore
 * 
 * Body: { slug: string, value: any }
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'anonymous';

    const { slug, value } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    // Find the feature definition by slug
    const allFeatures = SettingsRegistry.getAll();
    const feature = allFeatures.find(f => f.slug === slug);

    if (!feature) {
      return NextResponse.json({ 
        error: `Feature "${slug}" not found in registry`,
        activated: false 
      }, { status: 404 });
    }

    const result: {
      slug: string;
      validated: boolean;
      activated: boolean;
      persisted: boolean;
      encrypted?: boolean;
      error?: string;
    } = {
      slug,
      validated: false,
      activated: false,
      persisted: false,
    };

    // Step 1: Run the backend validator
    try {
      result.validated = await feature.validate(value);
    } catch (e) {
      result.validated = false;
      result.error = `Validation failed: ${e instanceof Error ? e.message : 'Unknown'}`;
      return NextResponse.json(result, { status: 422 });
    }

    // Step 2: Run encryption hook if present (for API keys, tokens)
    if (feature.onBeforeSave) {
      try {
        await feature.onBeforeSave(value);
        result.encrypted = true;
      } catch (e) {
        result.encrypted = false;
        console.warn(`[Activate] Encryption hook failed for ${slug}:`, e);
      }
    }

    // Step 3: Fire the engine activation hook
    if (feature.onAfterChange) {
      try {
        await feature.onAfterChange(value);
        result.activated = true;
        console.log(`[Activate] ✅ Engine activated for "${slug}" = ${JSON.stringify(value)}`);
      } catch (e) {
        result.activated = false;
        result.error = `Activation failed: ${e instanceof Error ? e.message : 'Unknown'}`;
        console.error(`[Activate] ❌ Engine activation failed for "${slug}":`, e);
      }
    } else {
      result.activated = true;
    }

    // Step 4: Persist to Firebase Firestore
    try {
      const firestore = getAdminFirestore();
      const docRef = firestore.collection('users').doc(userId).collection('config').doc('settings');
      await docRef.set({ [slug]: value }, { merge: true });

      result.persisted = true;
      console.log(`[Activate] 💾 Persisted "${slug}" to Firebase for user "${userId}".`);
    } catch (dbErr) {
      console.error(`[Activate] ❌ Firebase persistence failed:`, dbErr);
      // Still return success for the activation — persistence failure is non-blocking
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Activate] Fatal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
