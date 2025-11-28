/**
 * AR Capability Detection Utility
 * 
 * Determines whether real WebXR AR is available or if we should
 * fall back to mock/simulator mode.
 */

export type ARMode = 'real' | 'mock';

export interface ARCapabilityResult {
  mode: ARMode;
  reason: string;
  supported: boolean;
}

/**
 * Checks if the current environment supports WebXR AR.
 * Returns 'real' if WebXR AR is supported, 'mock' otherwise.
 * 
 * This function should be called in browser context only (after mount).
 * 
 * @param forceMode - Optional override to force a specific mode (useful for testing)
 * @returns Promise resolving to AR capability result
 */
export async function getARMode(forceMode?: ARMode): Promise<ARCapabilityResult> {
  // Check for forced mode (from environment or testing)
  if (forceMode) {
    return {
      mode: forceMode,
      reason: `Mode forced to '${forceMode}'`,
      supported: forceMode === 'real',
    };
  }

  // Check environment variable for forced mock mode
  if (import.meta.env.VITE_FORCE_MOCK_AR === 'true') {
    return {
      mode: 'mock',
      reason: 'Mock mode forced via VITE_FORCE_MOCK_AR environment variable',
      supported: false,
    };
  }

  // SSR/Node check - should never happen but adding as safety
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      mode: 'mock',
      reason: 'Not in browser context (SSR)',
      supported: false,
    };
  }

  // Check if navigator.xr exists
  if (!('xr' in navigator) || !navigator.xr) {
    return {
      mode: 'mock',
      reason: 'WebXR not available in this browser',
      supported: false,
    };
  }

  try {
    // Check if immersive-ar session is supported
    const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
    
    if (isARSupported) {
      return {
        mode: 'real',
        reason: 'WebXR immersive-ar is supported',
        supported: true,
      };
    } else {
      return {
        mode: 'mock',
        reason: 'WebXR available but immersive-ar not supported',
        supported: false,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      mode: 'mock',
      reason: `WebXR check failed: ${errorMessage}`,
      supported: false,
    };
  }
}

/**
 * Synchronous check if WebXR is likely available.
 * Use this for quick checks before attempting async AR initialization.
 * 
 * @returns true if WebXR API exists, false otherwise
 */
export function isWebXRAvailable(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return 'xr' in navigator && navigator.xr != null;
}

/**
 * Gets a user-friendly message about AR availability.
 * 
 * @param result - The AR capability result from getARMode()
 * @returns User-friendly message
 */
export function getARAvailabilityMessage(result: ARCapabilityResult): string {
  if (result.mode === 'real') {
    return '✅ AR Hardware Detected - Running in AR Mode';
  }
  
  // Generate appropriate message based on reason
  if (result.reason.includes('WebXR not available')) {
    return '📱 AR Simulator Mode - WebXR not supported on this browser. Try Chrome, Edge, or Safari on an AR-capable device.';
  }
  
  if (result.reason.includes('immersive-ar not supported')) {
    return '📱 AR Simulator Mode - Your browser supports WebXR but AR is not available on this device.';
  }
  
  if (result.reason.includes('forced') || result.reason.includes('Mock mode')) {
    return '📱 AR Simulator Mode (Developer Override)';
  }
  
  return '📱 AR Simulator Mode - AR hardware not detected';
}
