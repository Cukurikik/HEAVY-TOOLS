import { Injectable } from '@angular/core';
import { AVAILABLE_PERMISSIONS, PluginPermission } from '../types/plugin.types';

/**
 * OMNI PLUGIN PERMISSION SERVICE
 * 
 * Validates and manages permissions requested by plugins.
 * Provides user confirmation dialog before granting access.
 */
@Injectable({ providedIn: 'root' })
export class PluginPermissionService {

  /** Human-readable descriptions for each permission */
  private readonly permissionDescriptions: Record<PluginPermission, string> = {
    'media.read': 'Read media files (video, audio, images)',
    'media.write': 'Write/modify media files',
    'media.convert': 'Convert files using the FFmpeg engine',
    'storage.read': 'Read data from local storage',
    'storage.write': 'Write data to local storage',
    'ui.toast': 'Display pop-up notifications',
    'ui.panel': 'Display custom UI panels',
    'network.fetch': 'Access the internet (HTTP requests)',
  };

  /**
   * Validates that all requested permissions are recognized.
   */
  validatePermissions(requested: string[]): { valid: boolean; unknown: string[] } {
    const unknown = requested.filter(
      p => !(AVAILABLE_PERMISSIONS as readonly string[]).includes(p)
    );
    return { valid: unknown.length === 0, unknown };
  }

  /**
   * Get human-readable description for a permission.
   */
  getDescription(permission: PluginPermission): string {
    return this.permissionDescriptions[permission] || permission;
  }

  /**
   * Returns all permission descriptions for the requested list.
   */
  getPermissionSummary(permissions: PluginPermission[]): { permission: string; description: string }[] {
    return permissions.map(p => ({
      permission: p,
      description: this.getDescription(p),
    }));
  }

  /**
   * Check if a specific API call is allowed based on granted permissions.
   */
  isApiCallAllowed(method: string, grantedPermissions: PluginPermission[]): boolean {
    const permissionMap: Record<string, PluginPermission> = {
      'ui.toast': 'ui.toast',
      'ui.showPanel': 'ui.panel',
      'media.convert': 'media.convert',
      'storage.read': 'storage.read',
      'storage.write': 'storage.write',
      'network.fetch': 'network.fetch',
    };

    const requiredPermission = permissionMap[method];
    if (!requiredPermission) return false;
    return grantedPermissions.includes(requiredPermission);
  }
}
