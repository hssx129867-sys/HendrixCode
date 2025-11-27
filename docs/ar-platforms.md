# AR Platforms Guide

## Overview

This document explains the differences between ARKit, ARCore, and WebXR, and how they map to our unified AR interface layer.

## Platform Comparison

### ARKit (iOS)

**Platform**: iOS devices (iPhone 6S and newer, iPad Pro, iPad 5th gen+)

**Capabilities:**
- **World Tracking**: 6DOF (degrees of freedom) camera tracking
- **Plane Detection**: Horizontal and vertical surfaces
- **Hit Testing**: Ray casting against detected geometry
- **Light Estimation**: Real-world lighting conditions
- **Face Tracking**: Front camera face detection (iPhone X+)
- **Image Tracking**: Recognition of known 2D images
- **Object Scanning**: 3D object recognition

**Key APIs:**
- `ARSession`: Main session management
- `ARFrame`: Per-frame data (camera, anchors, planes)
- `ARPlaneAnchor`: Detected plane information
- `ARHitTestResult`: Hit test results
- `ARWorldMap`: Session persistence and sharing

**Coordinate System:**
- Right-handed coordinate system
- Y-up (vertical)
- Z points toward user
- Measurements in meters

**Limitations:**
- iOS only
- Requires A9 processor or better
- Privacy: Camera permission required
- Battery intensive

### ARCore (Android)

**Platform**: Android devices with ARCore support (100+ models)

**Capabilities:**
- **Motion Tracking**: 6DOF tracking
- **Environmental Understanding**: Plane detection (horizontal/vertical)
- **Hit Testing**: Surface detection and placement
- **Light Estimation**: Lighting estimation
- **Depth API**: Environmental depth map (select devices)
- **Augmented Images**: 2D image tracking
- **Augmented Faces**: Face mesh and tracking

**Key APIs:**
- `Session`: Session lifecycle
- `Frame`: Current frame data
- `Plane`: Detected surface information
- `HitResult`: Raycast results
- `Anchor`: Fixed points in space

**Coordinate System:**
- Right-handed coordinate system
- Y-up (vertical)
- Z points toward user
- Measurements in meters

**Limitations:**
- Android only
- Device compatibility varies
- Requires ARCore services installed
- Performance varies by device

### WebXR (Web Browsers)

**Platform**: Web browsers with WebXR support (Chrome, Firefox, Edge, Samsung Internet)

**Capabilities:**
- **Session Management**: Immersive AR sessions
- **Viewer Tracking**: Device pose tracking
- **Hit Testing**: Surface detection
- **Anchors**: Spatial anchors
- **Lighting Estimation**: Basic light estimation
- **DOM Overlays**: HTML UI over AR
- **Hand Tracking**: Experimental on some devices

**Key APIs:**
- `navigator.xr.requestSession('immersive-ar')`: Start AR
- `XRSession`: Session management
- `XRFrame`: Per-frame data
- `XRHitTestSource`: Hit test configuration
- `XRHitTestResult`: Hit test results
- `XRReferenceSpace`: Coordinate system
- `XRAnchor`: Spatial anchors

**Coordinate System:**
- Right-handed coordinate system
- Y-up (vertical)
- Z points toward user
- Measurements in meters

**Limitations:**
- Browser support varies
- Feature detection required
- Limited device capabilities
- HTTPS required
- Fewer features than native

## Platform Feature Matrix

| Feature | ARKit | ARCore | WebXR |
|---------|-------|--------|-------|
| World Tracking | ✓ | ✓ | ✓ |
| Plane Detection | ✓ | ✓ | ✓* |
| Hit Testing | ✓ | ✓ | ✓ |
| Anchors | ✓ | ✓ | ✓ |
| Light Estimation | ✓ | ✓ | ✓ (basic) |
| Image Tracking | ✓ | ✓ | ✗ |
| Face Tracking | ✓ | ✓ | ✗ |
| Environment Depth | ✓ (LiDAR) | ✓ (select) | ✗ |
| Occlusion | ✓ | ✓ | ✗ |
| Collaborative | ✓ | ✓ | ✗ |

*WebXR plane detection is limited compared to native

## Interface Mapping

Our AR foundation uses unified interfaces that abstract platform differences.

### IARSession

Maps to platform session objects:

**ARKit:**
```swift
ARSession → IARSession
- run() → start()
- pause() → stop()
- currentFrame → update() returns IARFrame
```

**ARCore:**
```java
Session → IARSession
- resume() → start()
- pause() → stop()
- update() → update() returns IARFrame
```

**WebXR:**
```javascript
XRSession → IARSession
- requestAnimationFrame() → update() loop
- end() → stop()
```

### IARFrame

Represents current AR state per frame:

**ARKit:**
```swift
ARFrame → IARFrame
- timestamp
- camera (ARCamera)
- anchors array → planes array
```

**ARCore:**
```java
Frame → IARFrame
- timestamp
- camera (Camera)
- updatedPlanes → planes array
```

**WebXR:**
```javascript
XRFrame → IARFrame
- time → timestamp
- getViewerPose() → camera
- Hit test results → planes (approximated)
```

### IARPlane

Detected surface information:

**ARKit:**
```swift
ARPlaneAnchor → IARPlane
- identifier → id
- transform → transform (Matrix4)
- extent → extent (Vector2)
- alignment → type
```

**ARCore:**
```java
Plane → IARPlane
- id string → id
- centerPose → transform
- extentX/Z → extent
- type → type
```

**WebXR:**
```javascript
XRHitTestResult → IARPlane (approximated)
- Planes not directly exposed
- Inferred from hit test results
- Limited metadata
```

### IARHitTestResult

Ray casting results:

**ARKit:**
```swift
ARHitTestResult → IARHitTestResult
- worldTransform → position, rotation
- anchor → plane
```

**ARCore:**
```java
HitResult → IARHitTestResult
- hitPose → position, rotation
- trackable → plane
```

**WebXR:**
```javascript
XRHitTestResult → IARHitTestResult
- getPose() → position, rotation
- Limited plane association
```

### IARAnchor

Fixed points in space:

**ARKit:**
```swift
ARAnchor → IARAnchor
- identifier → id
- transform → transform
- isTracked → tracking
```

**ARCore:**
```java
Anchor → IARAnchor
- id → id
- pose → transform
- trackingState → tracking
```

**WebXR:**
```javascript
XRAnchor → IARAnchor
- Native support
- anchorSpace.getPose() → transform
```

## Platform-Specific Considerations

### ARKit Specific

**Initialization:**
```typescript
// Requires proper ARWorldTrackingConfiguration
// Handle authorization status
// Configure plane detection
```

**Best Practices:**
- Check ARSession.isSupported before starting
- Handle ARSession.didFailWithError
- Process frame in displayLink or SceneKit/RealityKit delegate
- Use ARCoachingOverlayView for user guidance

### ARCore Specific

**Initialization:**
```typescript
// Check ArCoreApk.checkAvailability()
// Request camera permission
// Configure session with Config
```

**Best Practices:**
- Check isARCoreSupported() before use
- Handle camera permission properly
- Update() must be called each frame
- Show user guidance for surface detection

### WebXR Specific

**Initialization:**
```typescript
// Check navigator.xr availability
// Check 'immersive-ar' support
// Request necessary features
// Requires HTTPS
```

**Best Practices:**
- Feature detection for all APIs
- Graceful fallback for unsupported features
- Handle session ending events
- Provide HTML UI overlay for controls

## Platform Selection Strategy

The framework automatically selects the appropriate platform:

1. **Native iOS**: Use ARKit adapter
2. **Native Android**: Use ARCore adapter
3. **Web Browser**: Use WebXR adapter
4. **Fallback**: Mock adapter for development/testing

```typescript
// Automatic platform detection
const session = ARSessionFactory.create();
if (!await session.isSupported()) {
  console.error('AR not supported on this device');
  return;
}
await session.start();
```

## Development Workflow

### Local Development

- Use WebXR adapter in Chrome/Edge with WebXR emulator extension
- Test on device via USB debugging
- Use mock adapter for unit tests

### Testing

- **Emulator**: Limited AR support, use mock adapter
- **Device**: Full feature testing
- **Continuous Integration**: Automated tests with mock adapter

### Deployment

- **iOS**: Xcode project with ARKit
- **Android**: Android Studio with ARCore
- **Web**: Static hosting with HTTPS

## Troubleshooting

### ARKit Issues

- **"ARKit is not available"**: Check device compatibility
- **Poor tracking**: Ensure good lighting, textured surfaces
- **No planes detected**: Move device slowly, show textured floor

### ARCore Issues

- **"ARCore not installed"**: Prompt user to install ARCore
- **Session failed**: Check camera permissions
- **Tracking lost**: Need better lighting or surfaces

### WebXR Issues

- **"WebXR not supported"**: Update browser or use compatible device
- **HTTPS required**: Deploy with SSL certificate
- **No hit test results**: Feature not available on device

## Future Enhancements

1. **Cloud Anchors**: Persistent anchors across devices (ARKit + ARCore)
2. **Shared AR**: Multi-user AR experiences
3. **Scene Understanding**: Semantic understanding of environment
4. **Occlusion**: Real-world objects occlude virtual objects
5. **Depth API**: Better collision and physics

## Resources

### ARKit
- [Apple ARKit Documentation](https://developer.apple.com/documentation/arkit)
- [ARKit Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/arkit)

### ARCore
- [Google ARCore Documentation](https://developers.google.com/ar)
- [ARCore Supported Devices](https://developers.google.com/ar/devices)

### WebXR
- [WebXR Device API](https://www.w3.org/TR/webxr/)
- [Immersive Web Working Group](https://immersiveweb.dev/)
- [WebXR Samples](https://immersive-web.github.io/webxr-samples/)

## Conclusion

While ARKit, ARCore, and WebXR have different APIs and capabilities, our unified interface layer provides consistent cross-platform AR functionality. Understanding platform-specific quirks helps optimize the experience for each target platform.
