/**
 * WebXR Type Definitions
 * 
 * Re-export WebXR types from @types/webxr for consistency
 */

/**
 * Type guard to check if navigator has XR support
 */
export function hasXRSupport(navigator: Navigator): boolean {
  return 'xr' in navigator && navigator.xr !== undefined;
}

/**
 * Helper to safely check WebXR AR session support
 */
export async function isARSupported(): Promise<boolean> {
  if (!('xr' in navigator) || !navigator.xr) {
    return false;
  }

  try {
    const supported = await navigator.xr.isSessionSupported('immersive-ar');
    return supported || false;
  } catch (error) {
    console.warn('WebXR AR support check failed:', error);
    return false;
  }
}

