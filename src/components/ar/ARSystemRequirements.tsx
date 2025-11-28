/**
 * AR System Requirements Component
 * 
 * Reusable component displaying AR system requirements and recommended hardware.
 * Used in error states across AR pages to maintain consistency.
 */

export const ARSystemRequirements = () => {
  return (
    <div className="ar-error-suggestions">
      <h3>SYSTEM REQUIREMENTS</h3>
      <ul>
        <li>📱 AR-capable device (iPad, iPhone, or Android with ARCore)</li>
        <li>🌐 WebXR-compatible browser (Chrome, Edge, or Safari)</li>
        <li>🔒 HTTPS connection (automatic on Vercel deployment)</li>
        <li>📷 Camera permissions granted</li>
      </ul>
      
      <h3>RECOMMENDED HARDWARE</h3>
      <ul>
        <li>iPad Pro or iPad Air (iOS 13+)</li>
        <li>iPhone 6S or newer (iOS 13+)</li>
        <li>Android phones with ARCore support</li>
      </ul>
    </div>
  );
};
