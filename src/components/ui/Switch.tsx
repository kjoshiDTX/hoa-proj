import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { colorsRGB } from '../../theme/colors';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked, onCheckedChange, disabled }: SwitchProps) {
  const translateX = React.useRef(new Animated.Value(checked ? 20 : 0)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: checked ? 20 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [checked, translateX]);

  return (
    <TouchableOpacity
      style={[
        styles.track,
        checked && styles.trackActive,
        disabled && styles.trackDisabled,
      ]}
      onPress={() => !disabled && onCheckedChange(!checked)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateX }] },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colorsRGB.muted,
    padding: 2,
    justifyContent: 'center',
  },
  trackActive: {
    backgroundColor: colorsRGB.accent,
  },
  trackDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
