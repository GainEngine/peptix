/**
 * PersonIcon — wraps Phosphor `User` with app-default thin weight.
 * Keep as a wrapper so call sites never import phosphor directly
 * and we can swap the underlying icon in one place if needed.
 */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { User } from 'phosphor-react-native';

interface PersonIconProps {
  onPress?: () => void;
  size?: number;
  color?: string;
}

export function PersonIcon({ onPress, size = 22, color = '#FFFFFF' }: PersonIconProps) {
  const icon = <User size={size} color={color} weight="thin" />;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {icon}
      </TouchableOpacity>
    );
  }

  return icon;
}
