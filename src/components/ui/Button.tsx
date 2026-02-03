import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { colorsRGB } from '../../theme/colors';

type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'success';
type ButtonSize = 'default' | 'sm' | 'lg' | 'full';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  variant = 'default',
  size = 'default',
  onPress,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>
          {children}
        </Text>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  default: {
    backgroundColor: colorsRGB.primary,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colorsRGB.primary,
  },
  secondary: {
    backgroundColor: colorsRGB.secondary,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  success: {
    backgroundColor: '#4A9D7E',
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  size_default: {
    minHeight: 52,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  size_sm: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  size_lg: {
    minHeight: 60,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  size_full: {
    minHeight: 56,
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
  text_default: {
    color: colorsRGB.primaryForeground,
  },
  text_outline: {
    color: colorsRGB.primary,
  },
  text_secondary: {
    color: colorsRGB.secondaryForeground,
  },
  text_ghost: {
    color: colorsRGB.foreground,
  },
  text_success: {
    color: '#FFFFFF',
  },
});
