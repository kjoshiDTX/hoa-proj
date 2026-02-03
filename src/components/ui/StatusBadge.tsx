import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colorsRGB } from '../../theme/colors';

type StatusType =
  | 'sent'
  | 'acknowledged'
  | 'appealed'
  | 'remediation'
  | 'resolved'
  | 'overdue'
  | 'needs-review';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const getStatusColors = (status: StatusType) => {
    switch (status) {
      case 'sent':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' };
      case 'acknowledged':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' };
      case 'appealed':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' };
      case 'remediation':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' };
      case 'resolved':
        return { bg: 'rgba(74, 157, 126, 0.15)', text: '#4A9D7E' };
      case 'overdue':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' };
      case 'needs-review':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' };
      default:
        return { bg: colorsRGB.secondary, text: colorsRGB.foreground };
    }
  };

  const colors = getStatusColors(status);
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{displayLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
