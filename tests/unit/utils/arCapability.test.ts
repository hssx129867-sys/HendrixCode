import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getARMode, isWebXRAvailable, getARAvailabilityMessage } from '../../../src/utils/arCapability';
import type { NavigatorWithXR } from '../../../src/types/webxr';

describe('AR Capability Detection', () => {
  // Store original global values
  let originalWindow: typeof globalThis.window | undefined;
  let originalNavigator: typeof globalThis.navigator | undefined;

  beforeEach(() => {
    originalWindow = globalThis.window;
    originalNavigator = globalThis.navigator;
  });

  afterEach(() => {
    // Restore originals
    if (originalWindow) {
      (globalThis as any).window = originalWindow;
    } else {
      delete (globalThis as any).window;
    }
    if (originalNavigator) {
      (globalThis as any).navigator = originalNavigator;
    } else {
      delete (globalThis as any).navigator;
    }
  });

  describe('getARMode', () => {
    it('should return mock mode when forced', async () => {
      const result = await getARMode('mock');
      expect(result.mode).toBe('mock');
      expect(result.supported).toBe(false);
      expect(result.reason).toContain('forced');
    });

    it('should return real mode when forced', async () => {
      const result = await getARMode('real');
      expect(result.mode).toBe('real');
      expect(result.supported).toBe(true);
      expect(result.reason).toContain('forced');
    });

    it('should return mock mode when navigator.xr is not available', async () => {
      // Mock browser context with navigator without xr
      (globalThis as any).window = {};
      (globalThis as any).navigator = {} as Navigator;

      const result = await getARMode();
      expect(result.mode).toBe('mock');
      expect(result.supported).toBe(false);
      expect(result.reason).toContain('WebXR not available');
    });

    it('should return real mode when WebXR AR is supported', async () => {
      // Mock browser context with WebXR support
      (globalThis as any).window = {};
      (globalThis as any).navigator = {
        xr: {
          isSessionSupported: vi.fn().mockResolvedValue(true),
        },
      } as unknown as NavigatorWithXR;

      const result = await getARMode();
      expect(result.mode).toBe('real');
      expect(result.supported).toBe(true);
      expect(result.reason).toContain('immersive-ar is supported');
    });

    it('should return mock mode when WebXR exists but AR is not supported', async () => {
      // Mock browser context with WebXR but no AR support
      (globalThis as any).window = {};
      (globalThis as any).navigator = {
        xr: {
          isSessionSupported: vi.fn().mockResolvedValue(false),
        },
      } as unknown as NavigatorWithXR;

      const result = await getARMode();
      expect(result.mode).toBe('mock');
      expect(result.supported).toBe(false);
      expect(result.reason).toContain('immersive-ar not supported');
    });

    it('should handle errors gracefully', async () => {
      // Mock browser context with navigator that throws an error
      (globalThis as any).window = {};
      (globalThis as any).navigator = {
        xr: {
          isSessionSupported: vi.fn().mockRejectedValue(new Error('Test error')),
        },
      } as unknown as NavigatorWithXR;

      const result = await getARMode();
      expect(result.mode).toBe('mock');
      expect(result.supported).toBe(false);
      expect(result.reason).toContain('WebXR check failed');
      expect(result.reason).toContain('Test error');
    });
  });

  describe('isWebXRAvailable', () => {
    it('should return true when navigator.xr exists', () => {
      (globalThis as any).window = {};
      (globalThis as any).navigator = {
        xr: {},
      } as unknown as NavigatorWithXR;

      expect(isWebXRAvailable()).toBe(true);
    });

    it('should return false when navigator.xr does not exist', () => {
      (globalThis as any).window = {};
      (globalThis as any).navigator = {} as Navigator;

      expect(isWebXRAvailable()).toBe(false);
    });

    it('should return false when navigator.xr is null', () => {
      (globalThis as any).window = {};
      (globalThis as any).navigator = {
        xr: null,
      } as unknown as NavigatorWithXR;

      expect(isWebXRAvailable()).toBe(false);
    });
  });

  describe('getARAvailabilityMessage', () => {
    it('should return success message for real mode', () => {
      const result = {
        mode: 'real' as const,
        reason: 'WebXR immersive-ar is supported',
        supported: true,
      };
      
      const message = getARAvailabilityMessage(result);
      expect(message).toContain('AR Hardware Detected');
      expect(message).toContain('AR Mode');
    });

    it('should return appropriate message when WebXR not available', () => {
      const result = {
        mode: 'mock' as const,
        reason: 'WebXR not available in this browser',
        supported: false,
      };
      
      const message = getARAvailabilityMessage(result);
      expect(message).toContain('AR Simulator Mode');
      expect(message).toContain('WebXR not supported');
    });

    it('should return appropriate message when AR not supported', () => {
      const result = {
        mode: 'mock' as const,
        reason: 'WebXR available but immersive-ar not supported',
        supported: false,
      };
      
      const message = getARAvailabilityMessage(result);
      expect(message).toContain('AR Simulator Mode');
      expect(message).toContain('AR is not available');
    });

    it('should return appropriate message for forced mode', () => {
      const result = {
        mode: 'mock' as const,
        reason: 'Mode forced to mock',
        supported: false,
      };
      
      const message = getARAvailabilityMessage(result);
      expect(message).toContain('AR Simulator Mode');
      expect(message).toContain('Developer Override');
    });
  });
});
