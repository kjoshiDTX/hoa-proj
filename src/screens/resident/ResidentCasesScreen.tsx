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
  FileText,
  Upload,
  ChevronRight,
  Clock,
  AlertTriangle,
} from 'lucide-react-native';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

type FilterType = 'all' | 'action' | 'closed';

interface Case {
  id: string;
  title: string;
  address: string;
  status: 'draft' | 'sent' | 'acknowledged' | 'appealed' | 'remediation' | 'resolved';
  fixByDate?: string;
  daysUntilDue?: number;
  actionNeeded?: string;
}

interface ResidentCasesScreenProps {
  onCaseClick?: (caseId: string) => void;
  onUpload?: (caseId: string) => void;
}

function getUrgencyInfo(daysUntilDue?: number): { label: string; level: 'high' | 'medium' | 'low' } | null {
  if (daysUntilDue === undefined) return null;

  if (daysUntilDue < 0) {
    return { label: 'Overdue', level: 'high' };
  } else if (daysUntilDue === 0) {
    return { label: 'Due today', level: 'high' };
  } else if (daysUntilDue === 1) {
    return { label: 'Due tomorrow', level: 'high' };
  } else if (daysUntilDue <= 3) {
    return { label: `Due in ${daysUntilDue} days`, level: 'medium' };
  } else if (daysUntilDue <= 7) {
    return { label: `Due in ${daysUntilDue} days`, level: 'low' };
  }
  return { label: `Due in ${daysUntilDue} days`, level: 'low' };
}

const mockCases: Case[] = [
  {
    id: '1',
    title: 'Lawn Maintenance Required',
    address: '123 Willow Lane',
    status: 'sent',
    fixByDate: 'Jan 15, 2026',
    daysUntilDue: 1,
    actionNeeded: 'Upload fix photo',
  },
  {
    id: '2',
    title: 'Exterior Paint Touch-up',
    address: '123 Willow Lane',
    status: 'acknowledged',
    fixByDate: 'Jan 22, 2026',
    daysUntilDue: 8,
    actionNeeded: 'Upload fix photo',
  },
  {
    id: '3',
    title: 'Fence Repair Notice',
    address: '123 Willow Lane',
    status: 'remediation',
    fixByDate: 'Jan 18, 2026',
    daysUntilDue: 4,
    actionNeeded: 'Waiting on HOA review',
  },
  {
    id: '4',
    title: 'Trash Can Storage',
    address: '123 Willow Lane',
    status: 'resolved',
  },
];

const urgencyColors = {
  high: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' },
  medium: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' },
  low: { bg: 'rgba(74, 157, 126, 0.15)', text: '#4A9D7E' },
};

export default function ResidentCasesScreen({ onCaseClick, onUpload }: ResidentCasesScreenProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All Cases' },
    { id: 'action', label: 'Waiting on Me' },
    { id: 'closed', label: 'Closed' },
  ];

  const filteredCases = mockCases.filter((c) => {
    if (filter === 'action') return c.status !== 'resolved' && c.status !== 'remediation';
    if (filter === 'closed') return c.status === 'resolved';
    return true;
  });

  const sortedCases = [...filteredCases].sort((a, b) => {
    if (a.status === 'resolved' && b.status !== 'resolved') return 1;
    if (b.status === 'resolved' && a.status !== 'resolved') return -1;

    const aWaiting = a.status === 'remediation';
    const bWaiting = b.status === 'remediation';
    if (!aWaiting && bWaiting) return -1;
    if (aWaiting && !bWaiting) return 1;

    const aDays = a.daysUntilDue ?? 999;
    const bDays = b.daysUntilDue ?? 999;
    return aDays - bDays;
  });

  const openCount = mockCases.filter((c) => c.status !== 'resolved').length;
  const actionCount = mockCases.filter((c) => c.status !== 'resolved' && c.status !== 'remediation').length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Cases</Text>
          <Text style={styles.subtitle}>
            {openCount} open · {actionCount} need{actionCount !== 1 ? '' : 's'} your action
          </Text>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={styles.filtersScroll}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[
                styles.filterButton,
                filter === f.id && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f.id && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cases List */}
        {sortedCases.length > 0 ? (
          <View style={styles.casesList}>
            {sortedCases.map((caseItem) => {
              const urgency = getUrgencyInfo(caseItem.daysUntilDue);
              const isWaitingOnHOA = caseItem.status === 'remediation';
              const showUploadButton = caseItem.status !== 'resolved' && caseItem.status !== 'remediation';

              return (
                <View key={caseItem.id} style={styles.caseCard}>
                  <TouchableOpacity
                    onPress={() => onCaseClick?.(caseItem.id)}
                    style={styles.caseContent}
                    activeOpacity={0.7}
                  >
                    <View style={styles.caseInfo}>
                      {/* Status and Urgency Badges */}
                      <View style={styles.badges}>
                        <StatusBadge status={caseItem.status} />
                        {urgency && caseItem.status !== 'resolved' && (
                          <View
                            style={[
                              styles.urgencyBadge,
                              { backgroundColor: urgencyColors[urgency.level].bg },
                            ]}
                          >
                            {urgency.level === 'high' && (
                              <AlertTriangle size={12} color={urgencyColors[urgency.level].text} />
                            )}
                            <Text
                              style={[
                                styles.urgencyText,
                                { color: urgencyColors[urgency.level].text },
                              ]}
                            >
                              {urgency.label}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Case Title */}
                      <Text style={styles.caseTitle}>{caseItem.title}</Text>

                      {/* Address */}
                      <Text style={styles.caseAddress}>{caseItem.address}</Text>

                      {/* Action Needed */}
                      {caseItem.actionNeeded && caseItem.status !== 'resolved' && (
                        <View style={styles.actionRow}>
                          <Clock
                            size={16}
                            color={isWaitingOnHOA ? colorsRGB.mutedForeground : colorsRGB.accent}
                          />
                          <Text
                            style={[
                              styles.actionText,
                              {
                                color: isWaitingOnHOA
                                  ? colorsRGB.mutedForeground
                                  : colorsRGB.accent,
                              },
                            ]}
                          >
                            {isWaitingOnHOA
                              ? 'Waiting on HOA review'
                              : `Action needed: ${caseItem.actionNeeded}`}
                          </Text>
                        </View>
                      )}
                    </View>

                    <ChevronRight size={24} color={colorsRGB.mutedForeground} />
                  </TouchableOpacity>

                  {/* Upload Button */}
                  {showUploadButton && (
                    <View style={styles.uploadSection}>
                      <Button
                        variant="success"
                        size="full"
                        onPress={() => onUpload?.(caseItem.id)}
                      >
                        <Upload size={20} color="#FFFFFF" />
                        <Text style={styles.uploadText}>Upload Fix Photo</Text>
                      </Button>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <FileText size={32} color={colorsRGB.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>No Cases Found</Text>
            <Text style={styles.emptyText}>
              {filter === 'action'
                ? "You're all caught up! No cases need your action right now."
                : filter === 'closed'
                ? 'No closed cases yet.'
                : "You don't have any cases. Great job keeping things in order!"}
            </Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  filtersScroll: {
    marginBottom: 24,
    marginHorizontal: -20,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colorsRGB.secondary,
    minHeight: 48,
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colorsRGB.primary,
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.secondaryForeground,
  },
  filterTextActive: {
    color: colorsRGB.primaryForeground,
  },
  casesList: {
    gap: 16,
  },
  caseCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  caseContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  caseInfo: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  caseTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  caseAddress: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  uploadSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colorsRGB.border,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
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
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
});
