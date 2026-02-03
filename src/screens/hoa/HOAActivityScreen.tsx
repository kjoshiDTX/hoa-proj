import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle,
  Camera,
  Scale,
  AlertCircle,
  FileText,
  MessageSquare,
  Filter,
} from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';

interface HOAActivityScreenProps {
  onBack: () => void;
  onCaseClick?: (caseId: string) => void;
}

type ActivityFilter = 'all' | 'submissions' | 'decisions' | 'appeals' | 'system';

export default function HOAActivityScreen({ onBack, onCaseClick }: HOAActivityScreenProps) {
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('all');

  const activities = [
    {
      id: '1',
      type: 'submission',
      action: 'New appeal submitted',
      address: '456 Oak Street',
      time: '15m ago',
      caseId: 'case-1',
      icon: Scale,
      iconColor: '#F59E0B',
    },
    {
      id: '2',
      type: 'submission',
      action: 'Remediation photo uploaded',
      address: '789 Maple Ave',
      time: '1h ago',
      caseId: 'case-2',
      icon: Camera,
      iconColor: '#3B82F6',
    },
    {
      id: '3',
      type: 'decision',
      action: 'Case resolved',
      address: '321 Pine Road',
      time: '2h ago',
      caseId: 'case-3',
      icon: CheckCircle,
      iconColor: '#4A9D7E',
    },
    {
      id: '4',
      type: 'decision',
      action: 'Violation confirmed',
      address: '654 Elm Drive',
      time: '3h ago',
      caseId: 'case-4',
      icon: FileText,
      iconColor: colorsRGB.foreground,
    },
    {
      id: '5',
      type: 'submission',
      action: 'New photo for review',
      address: '987 Cedar Court',
      time: '4h ago',
      caseId: 'case-5',
      icon: Camera,
      iconColor: '#EF4444',
    },
    {
      id: '6',
      type: 'appeals',
      action: 'Appeal approved',
      address: '234 Birch Lane',
      time: '5h ago',
      caseId: 'case-6',
      icon: Scale,
      iconColor: '#4A9D7E',
    },
    {
      id: '7',
      type: 'system',
      action: 'SLA deadline approaching',
      address: '567 Walnut Way',
      time: '6h ago',
      caseId: 'case-7',
      icon: AlertCircle,
      iconColor: '#F59E0B',
    },
    {
      id: '8',
      type: 'decision',
      action: 'Remediation approved',
      address: '890 Spruce St',
      time: '1d ago',
      caseId: 'case-8',
      icon: CheckCircle,
      iconColor: '#4A9D7E',
    },
    {
      id: '9',
      type: 'submission',
      action: 'Resident message received',
      address: '123 Oak Street',
      time: '1d ago',
      caseId: 'case-9',
      icon: MessageSquare,
      iconColor: colorsRGB.primary,
    },
    {
      id: '10',
      type: 'system',
      action: 'Case became overdue',
      address: '456 Pine Road',
      time: '2d ago',
      caseId: 'case-10',
      icon: AlertCircle,
      iconColor: '#EF4444',
    },
  ];

  const filters: { key: ActivityFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'submissions', label: 'Submissions' },
    { key: 'decisions', label: 'Decisions' },
    { key: 'appeals', label: 'Appeals' },
    { key: 'system', label: 'System' },
  ];

  const filteredActivities = activities.filter((activity) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'submissions') return activity.type === 'submission';
    if (activeFilter === 'decisions') return activity.type === 'decision';
    if (activeFilter === 'appeals') return activity.type === 'appeals';
    if (activeFilter === 'system') return activity.type === 'system';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={24} color={colorsRGB.foreground} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Activity</Text>
            <Text style={styles.subtitle}>Recent actions and updates</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={styles.filtersScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterChip, activeFilter === filter.key && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text
                style={[styles.filterText, activeFilter === filter.key && styles.filterTextActive]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredActivities.length > 0 ? (
          <View style={styles.activityList}>
            {filteredActivities.map((item) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.activityCard}
                  onPress={() => onCaseClick?.(item.caseId)}
                >
                  <View style={styles.activityIcon}>
                    <IconComponent size={20} color={item.iconColor} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityAction} numberOfLines={1}>
                      {item.action}
                    </Text>
                    <Text style={styles.activityAddress}>{item.address}</Text>
                  </View>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Filter size={32} color={colorsRGB.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>No activity</Text>
            <Text style={styles.emptyText}>No activity matching the selected filter</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsRGB.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorsRGB.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 2,
  },
  filtersScroll: {
    marginHorizontal: -20,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colorsRGB.secondary,
  },
  filterChipActive: {
    backgroundColor: colorsRGB.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.secondaryForeground,
  },
  filterTextActive: {
    color: colorsRGB.primaryForeground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  activityList: {
    gap: 8,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.foreground,
    marginBottom: 2,
  },
  activityAddress: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
  },
  activityTime: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.foreground,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
  },
});
