// components/AvatarGroup.jsx
import React from 'react';
import Avatar from './Avatar';

const AvatarGroup = ({
  users = [],
  maxCount = 5,
  size = 'md',
  spacing = 'overlap', // 'overlap' or 'spaced'
  className = '',
}) => {
  const displayedUsers = users.slice(0, maxCount);
  const excess = users.length - maxCount;

  const spacingClasses = {
    overlap: '-space-x-2',
    spaced: 'space-x-2'
  };

  return (
    <div className={`flex ${spacingClasses[spacing]} ${className}`}>
      {displayedUsers.map((user, index) => (
        <Avatar
          key={index}
          src={user.src}
          fallbackText={user.name}
          size={size}
          className="border-2 border-white"
        />
      ))}
      {excess > 0 && (
        <Avatar
          fallbackText={`+${excess}`}
          size={size}
          className="border-2 border-white bg-gray-400 text-white"
        />
      )}
    </div>
  );
};

export default AvatarGroup;