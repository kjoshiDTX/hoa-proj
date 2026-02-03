import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Pin, Bell, ChevronRight } from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';

type NoticeCategory = 'all' | 'trash' | 'pool' | 'meeting' | 'safety';

interface Notice {
  id: string;
  title: string;
  preview: string;
  category: 'trash' | 'pool' | 'meeting' | 'safety' | 'general';
  timestamp: string;
  isRead: boolean;
  isPinned: boolean;
}

interface ResidentNoticesScreenProps {
  onBack?: () => void;
  onNoticeClick?: (noticeId: string) => void;
}

const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Annual Meeting Reminder',
    preview: 'The HOA annual meeting is scheduled for January 20th at 6 PM in the clubhouse. All homeowners are encouraged to attend.',
    category: 'meeting',
    timestamp: '1h ago',
    isRead: false,
    isPinned: true,
  },
  {
    id: '2',
    title: 'Holiday Trash Schedule Change',
    preview: 'Due to the holiday, trash collection will be moved to Monday, January 6th instead of the usual Friday pickup.',
    category: 'trash',
    timestamp: '2h ago',
    isRead: false,
    isPinned: false,
  },
  {
    id: '3',
    title: 'Pool Maintenance Notice',
    preview: 'The community pool will be closed January 8-10 for annual maintenance and cleaning.',
    category: 'pool',
    timestamp: '1d ago',
    isRead: true,
    isPinned: false,
  },
  {
    id: '4',
    title: 'Safety Advisory: Lock Your Vehicles',
    preview: 'There have been reports of vehicle break-ins in the area. Please ensure your vehicles are locked and valuables are not visible.',
    category: 'safety',
    timestamp: '2d ago',
    isRead: true,
    isPinned: false,
  },
  {
    id: '5',
    title: 'New Recycling Guidelines',
    preview: 'Updated recycling guidelines are now in effect. Glass bottles and certain plastics must be sorted separately.',
    category: 'trash',
    timestamp: '3d ago',
    isRead: true,
    isPinned: false,
  },
];

const categoryConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
  trash: { label: 'Trash', bgColor: 'rgba(74, 157, 126, 0.1)', textColor: colorsRGB.accent },
  pool: { label: 'Pool', bgColor: 'rgba(59, 130, 246, 0.1)', textColor: '#3B82F6' },
  meeting: { label: 'Meeting', bgColor: 'rgba(245, 158, 11, 0.1)', textColor: '#F59E0B' },
  safety: { label: 'Safety', bgColor: 'rgba(239, 68, 68, 0.1)', textColor: '#EF4444' },
  general: { label: 'General', bgColor: colorsRGB.muted, textColor: colorsRGB.mutedForeground },
};

const filterOptions: { id: NoticeCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'trash', label: 'Trash' },
  { id: 'pool', label: 'Pool' },
  { id: 'meeting', label: 'Meeting' },
  { id: 'safety', label: 'Safety' },
];

export default function ResidentNoticesScreen({ onBack, onNoticeClick }: ResidentNoticesScreenProps) {
  const [filter, setFilter] = useState<NoticeCategory>('all');
  const [notices, setNotices] = useState<Notice[]>(mockNotices);

  const filteredNotices = notices.filter((n) => filter === 'all' || n.category === filter);

  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (!a.isRead && b.isRead) return -1;
    if (a.isRead && !b.isRead) return 1;
    return 0;
  });

  const unreadCount = notices.filter((n) => !n.isRead).length;

  const handleNoticeClick = (notice: Notice) => {
    setNotices((prev) => prev.map((n) => (n.id === notice.id ? { ...n, isRead: true } : n)));
    onNoticeClick?.(notice.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <ArrowLeft size={24} color={colorsRGB.foreground} />
            </TouchableOpacity>
          )}
          <View style={styles.headerText}>
            <Text style={styles.title}>Notices</Text>
            <Text style={styles.subtitle}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={styles.filtersScroll}
        >
          {filterOptions.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterButton, filter === f.id && styles.filterButtonActive]}
              onPress={() => setFilter(f.id)}
            >
              <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>
                {f.label}
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
        {sortedNotices.length > 0 ? (
          <View style={styles.noticesList}>
            {sortedNotices.map((notice) => {
              const category = categoryConfig[notice.category];
              return (
                <TouchableOpacity
                  key={notice.id}
                  style={[
                    styles.noticeCard,
                    !notice.isRead && styles.noticeCardUnread,
                  ]}
                  onPress={() => handleNoticeClick(notice)}
                  activeOpacity={0.7}
                >
                  <View style={styles.noticeContent}>
                    <View style={styles.noticeIndicator}>
                      {!notice.isRead && <View style={styles.unreadDot} />}
                    </View>

                    <View style={styles.noticeMain}>
                      <View style={styles.noticeMeta}>
                        <View style={[styles.categoryBadge, { backgroundColor: category.bgColor }]}>
                          <Text style={[styles.categoryText, { color: category.textColor }]}>
                            {category.label}
                          </Text>
                        </View>
                        {notice.isPinned && (
                          <View style={styles.pinnedBadge}>
                            <Pin size={12} color={colorsRGB.mutedForeground} />
                            <Text style={styles.pinnedText}>Pinned</Text>
                          </View>
                        )}
                      </View>

                      <Text
                        style={[
                          styles.noticeTitle,
                          !notice.isRead && styles.noticeTitleUnread,
                        ]}
                      >
                        {notice.title}
                      </Text>

                      <Text style={styles.noticePreview} numberOfLines={2}>
                        {notice.preview}
                      </Text>

                      <Text style={styles.noticeTimestamp}>{notice.timestamp}</Text>
                    </View>

                    <ChevronRight size={20} color={colorsRGB.mutedForeground} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Bell size={32} color={colorsRGB.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>No Notices Yet</Text>
            <Text style={styles.emptyText}>
              You'll see community updates and announcements here when they're posted.
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
    backgroundColor: colorsRGB.background,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
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
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colorsRGB.secondary,
    minHeight: 40,
    justifyContent: 'center',
  },
  filterButtonActive: {
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
  },
  noticesList: {
    gap: 12,
  },
  noticeCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  noticeCardUnread: {
    borderWidth: 2,
    borderColor: 'rgba(74, 157, 126, 0.2)',
    backgroundColor: 'rgba(74, 157, 126, 0.05)',
  },
  noticeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  noticeIndicator: {
    paddingTop: 4,
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colorsRGB.accent,
  },
  noticeMain: {
    flex: 1,
  },
  noticeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pinnedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.mutedForeground,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colorsRGB.mutedForeground,
    marginBottom: 4,
  },
  noticeTitleUnread: {
    color: colorsRGB.foreground,
    fontWeight: '700',
  },
  noticePreview: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    lineHeight: 22,
    marginBottom: 8,
  },
  noticeTimestamp: {
    fontSize: 14,
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
