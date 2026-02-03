import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';

interface QueueCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  colorClass: string;
  urgentCount?: number;
  onClick?: () => void;
}

export function QueueCard({
  title,
  count,
  icon,
  colorClass,
  urgentCount,
  onClick,
}: QueueCardProps) {
  // Parse color class to get background and text colors
  const getColors = (colorClass: string) => {
    if (colorClass.includes('urgency-high')) {
      return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' };
    } else if (colorClass.includes('destructive')) {
      return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' };
    } else if (colorClass.includes('urgency-medium')) {
      return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' };
    } else if (colorClass.includes('status-remediation')) {
      return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' };
    } else {
      return { bg: colorsRGB.secondary, text: colorsRGB.foreground };
    }
  };

  const colors = getColors(colorClass);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onClick}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
        {React.cloneElement(icon as React.ReactElement, {
          color: colors.text,
        })}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {urgentCount !== undefined && urgentCount > 0 && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>{urgentCount} urgent</Text>
          </View>
        )}
      </View>

      <View style={styles.countContainer}>
        <Text style={styles.count}>{count}</Text>
        <ChevronRight size={20} color={colorsRGB.mutedForeground} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 2,
  },
  urgentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  count: {
    fontSize: 24,
    fontWeight: '600',
    color: colorsRGB.foreground,
  },
});
