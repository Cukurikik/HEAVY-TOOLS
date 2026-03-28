import type { SettingFeatureDefinition } from './types';
import { rawFeatures } from './features';

/**
 * Settings Registry
 * Auto-discovers and aggregates all 300 feature definitions into a single runtime map.
 * This is the "brain" that the API and Dynamic UI Renderer consume.
 */
class SettingsRegistryClass {
  private features: Map<string, SettingFeatureDefinition> = new Map();
  private byCategory: Map<string, SettingFeatureDefinition[]> = new Map();

  constructor() {
    for (const feature of rawFeatures) {
      if (feature && feature.id && feature.category) {
        this.features.set(feature.id, feature);
        const catList = this.byCategory.get(feature.category) || [];
        catList.push(feature);
        this.byCategory.set(feature.category, catList);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[SettingsRegistry] Loaded ${this.features.size} feature definitions across ${this.byCategory.size} categories.`);
    }
  }

  /** Get a single feature by its 3-digit ID */
  getById(id: string): SettingFeatureDefinition | undefined {
    return this.features.get(id);
  }

  /** Get all features for a category */
  getByCategory(category: string): SettingFeatureDefinition[] {
    return this.byCategory.get(category) || [];
  }

  /** Get all features as an array */
  getAll(): SettingFeatureDefinition[] {
    return Array.from(this.features.values());
  }

  /** Get all category names */
  getCategories(): string[] {
    return Array.from(this.byCategory.keys());
  }

  /** Get the full schema for the Dynamic UI Renderer (serializable) */
  getSchema() {
    return this.getAll().map(f => ({
      id: f.id,
      category: f.category,
      slug: f.slug,
      label: f.label,
      description: f.description,
      inputType: f.inputType,
      options: f.options,
      defaultValue: f.defaultValue,
    }));
  }

  /** Build a defaults map for initializing new user settings */
  getDefaults(): Record<string, any> {
    const defaults: Record<string, any> = {};
    for (const [id, feature] of this.features) {
      if (feature.inputType === 'toggle') {
        // Toggle features: the _enabled key IS the primary value
        defaults[`${feature.slug}_enabled`] = feature.defaultValue;
      } else {
        // Non-toggle features: _enabled defaults to false, slug holds the config value
        defaults[`${feature.slug}_enabled`] = false;
        defaults[feature.slug] = feature.defaultValue;
      }
    }
    return defaults;
  }
}

export const SettingsRegistry = new SettingsRegistryClass();
