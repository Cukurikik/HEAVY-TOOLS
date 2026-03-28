/**
 * SettingFeatureDefinition
 * The standardized interface that ALL 300 setting feature files must export.
 * This ensures each file is self-contained with its own UI, validation, encryption, and events.
 */
export interface SettingFeatureDefinition {
  /** Unique identifier matching the slug: "theme-mode", "api-openai", etc. */
  id: string;
  /** Category folder: "ui" | "ai" | "video" | "audio" | "pdf" | "cloud" | "webhook" | "security" | "system" | "converter" */
  category: string;
  /** URL-safe slug: "theme-mode", "api-openai" */
  slug: string;
  /** Human-readable label shown in the Settings UI */
  label: string;
  /** Tooltip / description text */
  description: string;
  /** Determines which UI control to render */
  inputType: 'toggle' | 'text' | 'password' | 'dropdown' | 'slider' | 'color';
  /** Dropdown/select options (only for inputType: 'dropdown') */
  options?: any;
  /** The factory default value */
  defaultValue: any;

  /**
   * Backend Validator: Checks if the value is valid before saving.
   * For API keys, this can ping the external service to verify.
   */
  validate(value: any): Promise<boolean>;

  /**
   * Encryption Engine (Optional): Transforms the value BEFORE it hits the database.
   * Used primarily for API keys (AES-256-GCM encryption).
   */
  onBeforeSave?(value: any): Promise<any>;

  /**
   * Event Trigger: Fires AFTER the setting is changed and saved.
   * Used to restart workers, apply themes, clear caches, etc.
   */
  onAfterChange?(value: any): Promise<void>;
}
