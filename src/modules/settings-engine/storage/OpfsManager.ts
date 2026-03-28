/**
 * OpfsManager 
 * Central "Brain" for Origin Private File System cleanup and soft-limits.
 */
export class OpfsManager {
  /**
   * Initializes the OPFS Root Directory for Omni-Tool cache.
   */
  static async getRootDirectory() {
    if (!navigator.storage || !navigator.storage.getDirectory) {
      throw new Error('OPFS is not supported in this environment.');
    }
    return await navigator.storage.getDirectory();
  }

  /**
   * Enforces the Auto-Delete Garbage Collection based on user settings.
   * @param autoDeleteDays - User setting for retention.
   */
  static async runGarbageCollection(autoDeleteDays: number): Promise<{ deletedCount: number, freedBytes: number }> {
    if (autoDeleteDays >= 9999) return { deletedCount: 0, freedBytes: 0 }; // Never delete
    
    try {
      const rootDir = await this.getRootDirectory();
      const expirationMs = autoDeleteDays * 24 * 60 * 60 * 1000;
      const now = Date.now();
      
      let deletedCount = 0;
      let freedBytes = 0;

      // Iterating through files in the root folder
      // @ts-ignore - values() method exists on FileSystemDirectoryHandle async iterators
      for await (const [name, handle] of rootDir.entries()) {
        if (handle.kind === 'file') {
          const file = await handle.getFile();
          if (now - file.lastModified > expirationMs) {
             freedBytes += file.size;
             await rootDir.removeEntry(name);
             deletedCount++;
          }
        }
      }

      console.log(`[OpfsManager] GC Complete. Deleted ${deletedCount} obsolete files. Freed ${(freedBytes / 1024 / 1024).toFixed(2)} MB.`);
      return { deletedCount, freedBytes };
    } catch (e) {
      console.error('[OpfsManager] Failed to run garbage collection:', e);
      return { deletedCount: 0, freedBytes: 0 };
    }
  }

  /**
   * Safely check if a new 4K render will exceed the user's allocated soft limit
   */
  static async checkAllocationCap(limitGB: number, projectedBytesRequired: number): Promise<boolean> {
    const limitBytes = limitGB * 1024 * 1024 * 1024;
    
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const currentUsage = estimate.usage || 0;
      
      if (currentUsage + projectedBytesRequired > limitBytes) {
        return false; // Limit Reached
      }
    }
    return true; // Safe to proceed
  }
}
