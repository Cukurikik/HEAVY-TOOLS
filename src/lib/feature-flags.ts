/**
 * 70. Feature Flagging Video
 * Hardcoded toggles or remote-fetching logic to safely disable/enable
 * specific heavy video tools without redeploying.
 */
export const FEATURE_FLAGS = {
  // Turn off AI Upscaler if our local ONNX models or Cloud proxies are failing widely
  enableAiUpscaler: process.env.FLAG_ENABLE_AI_UPSCALER === 'true' || true,
  
  // Turn off auto-subtitle if OpenAI Whisper API billing is exhausted
  enableAutoSubtitle: process.env.FLAG_ENABLE_AUTO_SUBTITLE === 'true' || true,
  
  // Enforce global maintenance mode over Cloud Video functionalities
  cloudRenderMaintenance: process.env.FLAG_CLOUD_MAINTENANCE === 'true' || false,
}

export function isFeatureActive(featureName: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[featureName] ?? false;
}
