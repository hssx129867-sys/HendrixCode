# AR Integration Roadmap

## Current State (December 2024)

### What's Working
- ✅ AR capability detection (`getARMode()` in `utils/arCapability.ts`)
- ✅ Mock AR implementations (`MockARGame`, `MockARDemo`)
- ✅ Cockpit-themed AR wrappers (`ARGameWrapper`, `ARDemoWrapper`)
- ✅ Automatic mode detection (real vs mock)
- ✅ Full game flow demonstration in mock mode
- ✅ Proper lifecycle management and cleanup
- ✅ Error handling and fallback UI

### Real AR Implementation Status

The real AR engine exists at `src/samples/ar-mini-game/ARTargetDrop.ts` and `src/samples/ar-demo/PlaceCubeDemo.ts`. These implementations are **fully functional** but currently **cannot be directly imported** into the main React app due to TypeScript configuration differences.

#### Why Real AR Isn't Integrated Yet

1. **TypeScript Configuration Mismatch**:
   - Main app uses `verbatimModuleSyntax: true` and `erasableSyntaxOnly: true`
   - AR samples were developed with different TypeScript settings
   - The samples use WebXR types that aren't available in the main app's type definitions

2. **Module Boundary Design**:
   - AR samples are intentionally excluded from the main app build (`tsconfig.app.json` line 28)
   - This separation was designed to allow independent development of AR features
   - Integration requires bridging this module boundary carefully

## Integration Path: Real AR → React App

### Option 1: TypeScript Configuration Alignment (Recommended)

**Steps**:
1. Update `tsconfig.app.json` to allow AR sample imports
2. Add WebXR types to the main app's type definitions
3. Fix type import statements in AR samples (add `type` keyword where needed)
4. Remove constructor parameter initializers that violate `erasableSyntaxOnly`
5. Create adapter classes that wrap real AR implementations with the mock interface
6. Update wrappers to instantiate real AR adapters when `mode === 'real'`

**Estimated Effort**: 2-4 hours

**Files to Modify**:
```
tsconfig.app.json                              # Remove samples from exclude
src/types/webxr.ts                             # Ensure WebXR types are available
src/samples/ar-mini-game/**                    # Fix type imports
src/samples/ar-demo/**                         # Fix type imports
src/components/ar/RealARGameAdapter.ts         # Create adapter (NEW)
src/components/ar/RealARDemoAdapter.ts         # Create adapter (NEW)
src/components/ar/ARGameWrapper.tsx            # Add real AR instantiation
src/components/ar/ARDemoWrapper.tsx            # Add real AR instantiation
```

**Implementation Template**:

```typescript
// src/components/ar/RealARGameAdapter.ts
import { ARTargetDrop } from '../../samples/ar-mini-game/ARTargetDrop';
import type { GameState, MockARGameSession } from './MockARGame';

export class RealARGameAdapter implements MockARGameSession {
  private arGame: ARTargetDrop;
  
  constructor() {
    this.arGame = new ARTargetDrop();
  }
  
  // Implement all methods to match MockARGameSession interface
  // Map real AR game state to mock interface
}
```

```typescript
// In ARGameWrapper.tsx
const initGame = async () => {
  const capability = await getARMode();
  
  let game: MockARGameSession;
  if (capability.mode === 'real') {
    game = new RealARGameAdapter();
  } else {
    game = new MockARGame();
  }
  
  // Rest of initialization...
};
```

### Option 2: Dynamic Import with Build-Time Splitting

**Steps**:
1. Build AR samples separately with their own tsconfig
2. Load real AR implementations dynamically at runtime
3. Use webpack/vite code splitting to load AR bundle only when needed

**Estimated Effort**: 4-6 hours

**Pros**: Clean module separation
**Cons**: More complex build configuration, async loading overhead

### Option 3: WebXR Polyfill Approach

**Steps**:
1. Add WebXR polyfill for non-AR devices
2. Unify real and mock implementations under single interface
3. Remove need for separate mock classes

**Estimated Effort**: 6-8 hours

**Pros**: Single code path for all devices
**Cons**: Requires significant refactoring, polyfill overhead

## Recommended Next Steps

### Immediate (Can Do Now)
1. ✅ Document the integration path (this file)
2. ✅ Ensure mock implementations accurately represent real AR flow
3. ✅ Add user gesture requirement for AR session start (Phase 2)
4. ✅ Improve error messaging and retry logic (Phase 2)
5. ✅ Verify build configuration for production (Phase 3)

### Short Term (1-2 days)
1. **Fix TypeScript Configuration** (Option 1 above)
   - Align tsconfig settings
   - Create adapter classes
   - Wire up real AR implementations
2. **Test on Real Hardware**
   - Deploy to Vercel
   - Test on WebXR-capable device
   - Verify fallback behavior
3. **Add Integration Tests**
   - Test adapter lifecycle
   - Test mode switching
   - Test error scenarios

### Medium Term (1 week)
1. **Complete Cockpit Theme Coverage**
   - Update all remaining pages
   - Ensure consistent navigation
   - Validate responsive behavior
2. **Comprehensive Testing**
   - Add unit tests for adapters
   - Add integration tests for wrappers
   - Add E2E tests for AR flows
3. **Documentation**
   - Update README with AR testing instructions
   - Create developer guide for adding new AR features
   - Document troubleshooting steps

## Testing Real AR

### On WebXR-Capable Device
1. Deploy to Vercel (HTTPS required)
2. Access `/ar-game/play` or `/ar-demo/play` on device
3. Grant camera permissions when prompted
4. Scan environment to detect surfaces
5. Tap to place objects/start game

### Expected Behavior
- **Real AR Mode**: WebXR session starts, camera feed shows, surface detection works
- **Mock Mode**: Simulator UI shows, game/demo logic runs without camera
- **Error Cases**: Clear error messages with retry option

### Verification Checklist
- [ ] AR mode is detected correctly (`getARMode()`)
- [ ] Real AR starts on WebXR devices
- [ ] Mock mode works on non-AR devices
- [ ] Error handling covers all failure scenarios
- [ ] Cleanup happens correctly on unmount
- [ ] No memory leaks (animation frames, listeners)
- [ ] Navigation works (back button, exit)
- [ ] UI remains responsive during AR session

## Known Issues & Limitations

### Current Limitations
1. Real AR classes not yet integrated (TypeScript configuration)
2. No user gesture gate for AR session start (requires Phase 2)
3. Limited error recovery options (requires Phase 2)
4. Some pages don't use cockpit theme yet (requires Phase 4-5)

### Platform Support
- ✅ Chrome for Android (ARCore)
- ✅ Safari on iOS (ARKit via WebXR Device API)
- ✅ Chrome/Edge on Windows with compatible hardware
- ⚠️ Firefox has limited WebXR support
- ❌ Desktop Safari doesn't support WebXR

## Resources

### Documentation
- [WebXR Device API Specification](https://www.w3.org/TR/webxr/)
- [WebXR AR Module](https://www.w3.org/TR/webxr-ar-module-1/)
- [AR Foundation README](../AR_FOUNDATION_README.md)
- [Cockpit Design System](./cockpit-design-system.md)

### Code References
- AR Capability Detection: `src/utils/arCapability.ts`
- Mock Implementations: `src/components/ar/MockAR*.ts`
- Real Implementations: `src/samples/ar-*/`
- Wrappers: `src/components/ar/AR*Wrapper.tsx`
- Platform Layer: `src/platform/`

## Contributing

When adding new AR features:
1. Start with mock implementation following existing patterns
2. Implement real AR version in `src/samples/`
3. Create adapter to bridge mock and real interfaces
4. Update wrappers to use adapter based on capability detection
5. Add tests for both mock and real modes
6. Update documentation with new feature details

---

**Last Updated**: December 2024  
**Status**: Mock AR working, Real AR implementation pending TypeScript configuration fix
