import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';

interface WaitingOnReviewCardProps {
  submittedDate: string;
  expectedDays?: number;
}

export function WaitingOnReviewCard({ submittedDate, expectedDays = 3 }: WaitingOnReviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.icon}>
          <Clock size={24} color={colorsRGB.accent} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.title}>Waiting on HOA Review</Text>
          <Text style={styles.submitted}>
            Your photo was submitted on {submittedDate}
          </Text>
          <Text style={styles.description}>
            Reviews usually take {expectedDays} business days. You'll get a notification when there's an update.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(74, 157, 126, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74, 157, 126, 0.3)',
    borderRadius: 12,
    padding: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 157, 126, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  submitted: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colorsRGB.foreground,
    lineHeight: 22,
  },
});
