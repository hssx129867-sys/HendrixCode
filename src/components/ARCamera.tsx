import { useRef, useEffect, useState } from 'react';
import './ARCamera.css';

interface ARCameraProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  elfLocation: {
    id: string;
    name: string;
    location: string;
  };
}

export const ARCamera = ({ onCapture, onClose, elfLocation }: ARCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    let mounted = true;
    let mediaStream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        // Request camera access with environment (back) camera as default
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (!mounted) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }

        setStream(mediaStream);
        setError('');
      } catch (err) {
        if (!mounted) return;
        console.error('Error accessing camera:', err);
        setError('Unable to access camera. Please ensure camera permissions are granted.');
      }
    };

    void initCamera();

    return () => {
      mounted = false;
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const switchCamera = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Add AR overlay text
    context.font = 'bold 48px Arial';
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    context.lineWidth = 3;
    context.textAlign = 'center';
    
    const text = `Found ${elfLocation.name}! 🎄`;
    const x = canvas.width / 2;
    const y = 80;
    
    context.strokeText(text, x, y);
    context.fillText(text, x, y);

    // Add location info
    context.font = 'bold 32px Arial';
    const locationText = `Location: ${elfLocation.location}`;
    context.strokeText(locationText, x, y + 60);
    context.fillText(locationText, x, y + 60);

    // Convert canvas to data URL
    const imageData = canvas.toDataURL('image/jpeg', 0.9);

    // Show capture animation
    setTimeout(() => {
      setIsCapturing(false);
      onCapture(imageData);
    }, 500);
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  if (error) {
    return (
      <div className="ar-camera-container">
        <div className="ar-error">
          <div className="ar-error-icon">📷</div>
          <h2>Camera Access Required</h2>
          <p>{error}</p>
          <button className="btn-close-error" onClick={handleClose}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-camera-container">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="ar-video"
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {isCapturing && <div className="capture-flash" />}
      
      <div className="ar-overlay">
        <div className="ar-header">
          <button className="btn-ar-close" onClick={handleClose}>
            ✕
          </button>
          <div className="ar-title">
            <span className="ar-icon">🎯</span>
            <span>Find {elfLocation.name}</span>
          </div>
          <button className="btn-switch-camera" onClick={switchCamera}>
            🔄
          </button>
        </div>

        <div className="ar-hint-box">
          <div className="ar-hint-title">📍 Location Hint</div>
          <div className="ar-hint-text">{elfLocation.location}</div>
        </div>

        <div className="ar-reticle">
          <div className="reticle-corner reticle-tl"></div>
          <div className="reticle-corner reticle-tr"></div>
          <div className="reticle-corner reticle-bl"></div>
          <div className="reticle-corner reticle-br"></div>
          <div className="reticle-center">
            <span className="elf-emoji">🎅</span>
          </div>
        </div>

        <div className="ar-instructions">
          <p>🎯 Point your camera at the {elfLocation.location}</p>
          <p>📸 When you find the elf, tap the capture button!</p>
        </div>

        <div className="ar-controls">
          <button className="btn-capture" onClick={captureImage}>
            <span className="capture-ring"></span>
            <span className="capture-inner"></span>
          </button>
        </div>

        <div className="ar-help-text">
          Tap anywhere on the screen or use the button to capture
        </div>
      </div>
    </div>
  );
};
