import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner = ({
  size = 'medium',
  message,
}: LoadingSpinnerProps) => {
  return (
    <div className="ui-loading-spinner">
      <div className={`ui-spinner ui-spinner--${size}`}>
        <div className="ui-spinner__circle"></div>
      </div>
      {message && <p className="ui-loading-spinner__message">{message}</p>}
    </div>
  );
};
