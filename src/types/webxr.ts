/**
 * WebXR Type Definitions
 * 
 * Shared type definitions for WebXR API extensions to the Navigator interface.
 * This provides type safety for WebXR feature detection across AR components.
 */

/**
 * Extended Navigator interface with WebXR support
 */
export interface NavigatorWithXR extends Navigator {
  xr?: {
    isSessionSupported: (mode: string) => Promise<boolean>;
    requestSession?: (mode: string, options?: XRSessionInit) => Promise<XRSession>;
  };
}

/**
 * XR Session initialization options
 */
export interface XRSessionInit {
  requiredFeatures?: string[];
  optionalFeatures?: string[];
}

/**
 * XR Session interface (basic)
 */
export interface XRSession {
  end(): Promise<void>;
  requestAnimationFrame(callback: XRFrameRequestCallback): number;
  cancelAnimationFrame(handle: number): void;
}

/**
 * XR Frame request callback
 */
export type XRFrameRequestCallback = (time: DOMHighResTimeStamp, frame: XRFrame) => void;

/**
 * XR Frame interface (basic)
 */
export interface XRFrame {
  session: XRSession;
}

/**
 * Type guard to check if navigator has XR support
 */
export function hasXRSupport(navigator: Navigator): navigator is NavigatorWithXR {
  return 'xr' in navigator;
}

/**
 * Helper to safely check WebXR AR session support
 */
export async function isARSupported(): Promise<boolean> {
  if (!hasXRSupport(navigator)) {
    return false;
  }

  try {
    const supported = await navigator.xr?.isSessionSupported('immersive-ar');
    return supported || false;
  } catch (error) {
    console.warn('WebXR AR support check failed:', error);
    return false;
  }
}
