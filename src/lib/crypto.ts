/**
 * Phase 3: Security & Encryption Vault
 * Uses standard Web Crypto API (AES-GCM) to locally encrypt 
 * Bring-Your-Own-Key (BYOK) inputs before syncing to Cloud.
 */

// Generate a derivation key based on user ID and an environment salt
const getSymmetricKey = async (userId: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(userId + (process.env.NEXT_PUBLIC_VAULT_SALT || 'omnitool-default-salt')),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('omnitool-unique-salt-v1'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

export async function encryptApiKey(apiKey: string, userId: string): Promise<string> {
  if (!apiKey) return '';
  const key = await getSymmetricKey(userId);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(apiKey)
  );

  // Combine IV and Ciphertext as Base64 for storage
  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);

  // Convert Uint8Array to base64 string
  return btoa(String.fromCharCode(...combined));
}

export async function decryptApiKey(encryptedBase64: string, userId: string): Promise<string> {
  if (!encryptedBase64) return '';
  try {
    const key = await getSymmetricKey(userId);
    const combinedStr = atob(encryptedBase64);
    const combined = new Uint8Array(combinedStr.length);
    for (let i = 0; i < combinedStr.length; i++) {
        combined[i] = combinedStr.charCodeAt(i);
    }

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (error) {
    console.error('Vault Decryption failed:', error);
    return ''; // Return empty fallback on failed decryption
  }
}
