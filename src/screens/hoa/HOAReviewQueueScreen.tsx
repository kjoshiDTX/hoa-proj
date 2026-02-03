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
  Camera,
  Clock,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';

type QueueFilter = 'all' | 'photos' | 'appeals' | 'overdue';

interface ReviewItem {
  id: string;
  address: string;
  unit?: string;
  type: 'photo_review' | 'appeal' | 'new_case';
  submittedAt: string;
  suggestedCategory?: string;
  residentName?: string;
  isUrgent?: boolean;
  slaHours?: number;
}

interface HOAReviewQueueScreenProps {
  queueType?: string;
  onBack?: () => void;
  onItemClick?: (itemId: string) => void;
}

const mockReviewItems: ReviewItem[] = [
  {
    id: '1',
    address: '123 Willow Lane',
    unit: 'Unit 12A',
    type: 'photo_review',
    submittedAt: '2 hours ago',
    suggestedCategory: 'Lawn Maintenance',
    residentName: 'John Smith',
    isUrgent: true,
    slaHours: 4,
  },
  {
    id: '2',
    address: '456 Oak Street',
    type: 'photo_review',
    submittedAt: '5 hours ago',
    suggestedCategory: 'Fence Repair',
    residentName: 'Maria Garcia',
    slaHours: 20,
  },
  {
    id: '3',
    address: '789 Maple Ave',
    type: 'appeal',
    submittedAt: '1 day ago',
    suggestedCategory: 'Exterior Paint',
    residentName: 'Robert Chen',
    isUrgent: true,
    slaHours: 2,
  },
  {
    id: '4',
    address: '321 Pine Road',
    type: 'photo_review',
    submittedAt: '3 days ago',
    suggestedCategory: 'Trash Storage',
    residentName: 'Emily Johnson',
    isUrgent: true,
    slaHours: 0,
  },
];

export default function HOAReviewQueueScreen({
  queueType = 'all',
  onBack,
  onItemClick,
}: HOAReviewQueueScreenProps) {
  const [filter, setFilter] = useState<QueueFilter>('all');

  const filters: { id: QueueFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: mockReviewItems.length },
    {
      id: 'photos',
      label: 'Photos',
      count: mockReviewItems.filter((i) => i.type === 'photo_review').length,
    },
    {
      id: 'appeals',
      label: 'Appeals',
      count: mockReviewItems.filter((i) => i.type === 'appeal').length,
    },
    {
      id: 'overdue',
      label: 'Overdue',
      count: mockReviewItems.filter((i) => i.slaHours === 0).length,
    },
  ];

  const filteredItems = mockReviewItems.filter((item) => {
    if (filter === 'photos') return item.type === 'photo_review';
    if (filter === 'appeals') return item.type === 'appeal';
    if (filter === 'overdue') return item.slaHours === 0;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.slaHours === 0 && b.slaHours !== 0) return -1;
    if (b.slaHours === 0 && a.slaHours !== 0) return 1;
    return (a.slaHours || 999) - (b.slaHours || 999);
  });

  const getTypeLabel = (type: ReviewItem['type']) => {
    switch (type) {
      case 'photo_review':
        return 'Photo Review';
      case 'appeal':
        return 'Appeal';
      case 'new_case':
        return 'New Case';
    }
  };

  const getTypeColors = (type: ReviewItem['type']) => {
    switch (type) {
      case 'photo_review':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' };
      case 'appeal':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' };
      case 'new_case':
        return { bg: 'rgba(44, 62, 80, 0.15)', text: colorsRGB.primary };
    }
  };

  const getSLAColors = (slaHours?: number) => {
    if (slaHours === 0) {
      return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' };
    } else if (slaHours !== undefined && slaHours <= 8) {
      return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' };
    }
    return { bg: colorsRGB.muted, text: colorsRGB.mutedForeground };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={20} color={colorsRGB.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>Review Queue</Text>
          <Text style={styles.subtitle}>{sortedItems.length} items need your review</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={styles.filtersScroll}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
              onPress={() => setFilter(f.id)}
            >
              <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>
                {f.label}
              </Text>
              <View style={[styles.filterCount, filter === f.id && styles.filterCountActive]}>
                <Text
                  style={[
                    styles.filterCountText,
                    filter === f.id && styles.filterCountTextActive,
                  ]}
                >
                  {f.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.trustLabel}>
          <AlertCircle size={20} color={colorsRGB.accent} />
          <Text style={styles.trustText}>
            <Text style={styles.trustTextBold}>Human review required</Text> — AI suggestions shown,
            but you make all decisions.
          </Text>
        </View>

        {sortedItems.length > 0 ? (
          <View style={styles.reviewList}>
            {sortedItems.map((item) => {
              const typeColors = getTypeColors(item.type);
              const slaColors = getSLAColors(item.slaHours);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.reviewCard}
                  onPress={() => onItemClick?.(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.reviewContent}>
                    <View style={[styles.reviewIcon, { backgroundColor: typeColors.bg }]}>
                      {item.type === 'photo_review' ? (
                        <Camera size={24} color={typeColors.text} />
                      ) : (
                        <AlertCircle size={24} color={typeColors.text} />
                      )}
                    </View>

                    <View style={styles.reviewMain}>
                      <View style={styles.reviewBadges}>
                        <View style={[styles.typeBadge, { backgroundColor: typeColors.bg }]}>
                          <Text style={[styles.typeBadgeText, { color: typeColors.text }]}>
                            {getTypeLabel(item.type)}
                          </Text>
                        </View>

                        {item.slaHours !== undefined && (
                          <View style={[styles.slaBadge, { backgroundColor: slaColors.bg }]}>
                            <Clock size={12} color={slaColors.text} />
                            <Text style={[styles.slaBadgeText, { color: slaColors.text }]}>
                              {item.slaHours === 0 ? 'Overdue' : `${item.slaHours}h left`}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.reviewAddress}>{item.address}</Text>
                      {item.unit && <Text style={styles.reviewUnit}>{item.unit}</Text>}

                      {item.suggestedCategory && (
                        <Text style={styles.reviewCategory}>
                          <Text style={styles.reviewCategoryLabel}>Suggested: </Text>
                          {item.suggestedCategory}
                        </Text>
                      )}

                      <Text style={styles.reviewMeta}>
                        {item.residentName} · {item.submittedAt}
                      </Text>
                    </View>

                    <ChevronRight size={24} color={colorsRGB.mutedForeground} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Camera size={32} color="#4A9D7E" />
            </View>
            <Text style={styles.emptyTitle}>Queue is Clear!</Text>
            <Text style={styles.emptyText}>
              No items need your review right now. Great work staying on top of things!
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorsRGB.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: -8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 48,
  },
  backText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  filtersScroll: {
    marginHorizontal: -20,
    marginBottom: 24,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colorsRGB.secondary,
    minHeight: 48,
  },
  filterChipActive: {
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
  filterCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: colorsRGB.muted,
  },
  filterCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: colorsRGB.mutedForeground,
  },
  filterCountTextActive: {
    color: '#FFFFFF',
  },
  trustLabel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(74, 157, 126, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74, 157, 126, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  trustText: {
    flex: 1,
    fontSize: 16,
    color: colorsRGB.foreground,
    lineHeight: 22,
  },
  trustTextBold: {
    fontWeight: '600',
  },
  reviewList: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  reviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewMain: {
    flex: 1,
  },
  reviewBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  slaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  slaBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviewAddress: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  reviewUnit: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
  },
  reviewCategory: {
    fontSize: 16,
    color: colorsRGB.foreground,
    marginTop: 8,
  },
  reviewCategoryLabel: {
    color: colorsRGB.mutedForeground,
  },
  reviewMeta: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(74, 157, 126, 0.15)',
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
