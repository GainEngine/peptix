/**
 * UNIX App — Text component
 *
 * Typed wrapper around RN Text that enforces theme typography.
 * Avoids scattering raw style props across screens.
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { textStyles, colors } from '../../theme';

type Variant = keyof typeof textStyles;

interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export function Text({
  variant = 'body',
  color = colors.text.primary,
  align,
  style,
  ...props
}: TextProps) {
  return (
    <RNText
      style={[
        textStyles[variant],
        { color },
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...props}
    />
  );
}
