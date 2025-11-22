import type { AvatarType } from '../types';

interface AvatarProps {
  type: AvatarType;
  size?: 'small' | 'medium' | 'large';
}

export const Avatar = ({ type, size = 'medium' }: AvatarProps) => {
  const sizeMap = {
    small: '40px',
    medium: '60px',
    large: '80px',
  };

  const avatarStyle = {
    width: sizeMap[size],
    height: sizeMap[size],
    fontSize: size === 'small' ? '20px' : size === 'medium' ? '30px' : '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
  };

  const getEmoji = () => {
    switch (type) {
      case 'star':
        return '⭐';
      case 'robot':
        return '🤖';
      case 'lightbulb':
        return '💡';
      case 'rocket':
        return '🚀';
      default:
        return '😊';
    }
  };

  return <div style={avatarStyle}>{getEmoji()}</div>;
};
