import { useState } from 'react';

/**
 * Custom hook for AR session retry logic
 * 
 * Provides consistent retry functionality across AR pages.
 * Handles clearing error state and reloading the page to restart AR initialization.
 * 
 * @returns Object with retry handler and error state management
 */
export const useARRetry = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  const handleRetry = () => {
    setError(null);
    setIsSupported(null);
    window.location.reload();
  };

  const handleError = (errorMessage: string) => {
    console.error('AR Session Error:', errorMessage);
    setError(errorMessage);
    
    // Check if it's a support error
    if (errorMessage.includes('not supported') || errorMessage.includes('NOT_SUPPORTED')) {
      setIsSupported(false);
    }
  };

  return {
    error,
    isSupported,
    handleRetry,
    handleError,
  };
};
