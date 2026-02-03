import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {
  Search,
  ChevronRight,
  Clock,
  Camera,
  AlertTriangle,
  Scale,
  CheckCircle,
  Eye,
  FileText,
  Plus,
  SortAsc,
  RefreshCw,
  Scan,
  MapPin,
  Calendar,
} from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

interface HOACasesScreenProps {
  onCaseClick?: (caseId: string) => void;
  onReviewQueueClick?: () => void;
  onScanClick?: () => void;
  onCreateCase?: () => void;
}

type CaseFilter = 'all' | 'needs-review' | 'overdue' | 'appeals' | 'remediation' | 'resolved';
type SortOption = 'due-soon' | 'newest' | 'oldest' | 'highest-risk';

export default function HOACasesScreen({
  onCaseClick,
  onReviewQueueClick,
  onScanClick,
  onCreateCase,
}: HOACasesScreenProps) {
  const [activeFilter, setActiveFilter] = useState<CaseFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('due-soon');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const queueCounts = {
    needsReview: 7,
    appealsDueSoon: 3,
    remediationSubmitted: 4,
    overdueFixes: 4,
    allOpen: 24,
  };

  const allCases = [
    {
      id: '1',
      title: 'Lawn Maintenance Required',
      address: '123 Oak Street, Unit A',
      status: 'Needs Review',
      statusKey: 'needs-review',
      statusColor: '#EF4444',
      statusBg: 'rgba(239, 68, 68, 0.15)',
      category: 'Exterior',
      dueDate: 'Jan 15',
      isOverdue: false,
      isDueSoon: true,
      lastUpdate: '2 hours ago',
      hasPhoto: true,
    },
    {
      id: '2',
      title: 'Trash Can Left Out',
      address: '456 Maple Avenue',
      status: 'Remediation Submitted',
      statusKey: 'remediation',
      statusColor: '#3B82F6',
      statusBg: 'rgba(59, 130, 246, 0.15)',
      category: 'Trash',
      dueDate: 'Jan 18',
      isOverdue: false,
      isDueSoon: false,
      lastUpdate: '1 day ago',
      hasPhoto: true,
    },
    {
      id: '3',
      title: 'Vehicle Parking Violation',
      address: '789 Pine Road, #12',
      status: 'Appealed',
      statusKey: 'appeals',
      statusColor: '#F59E0B',
      statusBg: 'rgba(245, 158, 11, 0.15)',
      category: 'Parking',
      dueDate: 'Jan 10',
      isOverdue: true,
      isDueSoon: false,
      lastUpdate: '3 days ago',
      hasPhoto: false,
    },
    {
      id: '4',
      title: 'Fence Height Violation',
      address: '321 Elm Drive',
      status: 'Sent',
      statusKey: 'all',
      statusColor: '#3B82F6',
      statusBg: 'rgba(59, 130, 246, 0.15)',
      category: 'Exterior',
      dueDate: 'Jan 12',
      isOverdue: true,
      isDueSoon: false,
      lastUpdate: '5 days ago',
      hasPhoto: false,
    },
    {
      id: '5',
      title: 'Exterior Paint Fading',
      address: '654 Birch Lane',
      status: 'Resolved',
      statusKey: 'resolved',
      statusColor: '#4A9D7E',
      statusBg: 'rgba(74, 157, 126, 0.15)',
      category: 'Exterior',
      dueDate: 'Jan 8',
      isOverdue: false,
      isDueSoon: false,
      lastUpdate: '1 week ago',
      hasPhoto: true,
    },
    {
      id: '6',
      title: 'Noise Complaint',
      address: '987 Cedar Court',
      status: 'Acknowledged',
      statusKey: 'all',
      statusColor: '#F59E0B',
      statusBg: 'rgba(245, 158, 11, 0.15)',
      category: 'Noise',
      dueDate: 'Jan 20',
      isOverdue: false,
      isDueSoon: false,
      lastUpdate: '4 hours ago',
      hasPhoto: false,
    },
  ];

  const filters: { key: CaseFilter; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: queueCounts.allOpen },
    { key: 'needs-review', label: 'Needs Review', count: queueCounts.needsReview },
    { key: 'overdue', label: 'Overdue', count: queueCounts.overdueFixes },
    { key: 'appeals', label: 'Appeals', count: queueCounts.appealsDueSoon },
    { key: 'remediation', label: 'Remediation', count: queueCounts.remediationSubmitted },
    { key: 'resolved', label: 'Resolved' },
  ];

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'due-soon', label: 'Due soon' },
    { key: 'newest', label: 'Newest first' },
    { key: 'oldest', label: 'Oldest first' },
    { key: 'highest-risk', label: 'Highest risk' },
  ];

  const filteredCases = allCases
    .filter((caseItem) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'overdue') return caseItem.isOverdue;
      return caseItem.statusKey === activeFilter;
    })
    .filter((caseItem) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        caseItem.title.toLowerCase().includes(query) ||
        caseItem.address.toLowerCase().includes(query) ||
        caseItem.category.toLowerCase().includes(query)
      );
    });

  const getStatusIcon = (statusKey: string) => {
    switch (statusKey) {
      case 'needs-review':
        return <Camera size={16} />;
      case 'appeals':
        return <Scale size={16} />;
      case 'remediation':
        return <RefreshCw size={16} />;
      case 'resolved':
        return <CheckCircle size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Cases</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortMenu(!showSortMenu)}
          >
            <SortAsc size={20} color={colorsRGB.foreground} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colorsRGB.mutedForeground} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search address, case ID, rule, resident"
            placeholderTextColor={colorsRGB.mutedForeground}
          />
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
              {filter.count !== undefined && (
                <View
                  style={[
                    styles.filterCount,
                    activeFilter === filter.key && styles.filterCountActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterCountText,
                      activeFilter === filter.key && styles.filterCountTextActive,
                    ]}
                  >
                    {filter.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {showSortMenu && (
          <View style={styles.sortMenu}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.sortOption, sortBy === option.key && styles.sortOptionActive]}
                onPress={() => {
                  setSortBy(option.key);
                  setShowSortMenu(false);
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === option.key && styles.sortOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity style={styles.quickAccessCard} onPress={onReviewQueueClick}>
              <View style={[styles.quickAccessIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <Camera size={20} color="#EF4444" />
              </View>
              <Text style={styles.quickAccessValue}>{queueCounts.needsReview}</Text>
              <Text style={styles.quickAccessLabel}>Needs Review</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={() => setActiveFilter('appeals')}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Scale size={20} color="#F59E0B" />
              </View>
              <Text style={styles.quickAccessValue}>{queueCounts.appealsDueSoon}</Text>
              <Text style={styles.quickAccessLabel}>Appeals Due Soon</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={() => setActiveFilter('remediation')}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <RefreshCw size={20} color="#3B82F6" />
              </View>
              <Text style={styles.quickAccessValue}>{queueCounts.remediationSubmitted}</Text>
              <Text style={styles.quickAccessLabel}>Remediation Submitted</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={() => setActiveFilter('overdue')}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <AlertTriangle size={20} color="#EF4444" />
              </View>
              <Text style={[styles.quickAccessValue, { color: '#EF4444' }]}>
                {queueCounts.overdueFixes}
              </Text>
              <Text style={styles.quickAccessLabel}>Overdue Fixes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeFilter === 'all'
                ? 'All Open Cases'
                : filters.find((f) => f.key === activeFilter)?.label}
            </Text>
            <Text style={styles.caseCount}>{filteredCases.length} cases</Text>
          </View>

          {filteredCases.length > 0 ? (
            <View style={styles.casesList}>
              {filteredCases.map((caseItem) => (
                <TouchableOpacity
                  key={caseItem.id}
                  style={styles.caseCard}
                  onPress={() => onCaseClick?.(caseItem.id)}
                >
                  <View style={styles.caseContent}>
                    <View style={[styles.caseIcon, { backgroundColor: caseItem.statusBg }]}>
                      {React.cloneElement(getStatusIcon(caseItem.statusKey) as React.ReactElement, {
                        color: caseItem.statusColor,
                      })}
                    </View>

                    <View style={styles.caseMain}>
                      <View style={styles.caseTitleRow}>
                        <Text style={styles.caseTitle} numberOfLines={1}>
                          {caseItem.title}
                        </Text>
                        {caseItem.isOverdue && (
                          <View style={styles.overdueBadge}>
                            <Text style={styles.overdueText}>Overdue</Text>
                          </View>
                        )}
                        {caseItem.isDueSoon && !caseItem.isOverdue && (
                          <View style={styles.dueSoonBadge}>
                            <Text style={styles.dueSoonText}>Due soon</Text>
                          </View>
                        )}
                        {caseItem.hasPhoto && <Camera size={16} color={colorsRGB.mutedForeground} />}
                      </View>

                      <View style={styles.caseAddress}>
                        <MapPin size={14} color={colorsRGB.mutedForeground} />
                        <Text style={styles.caseAddressText} numberOfLines={1}>
                          {caseItem.address}
                        </Text>
                      </View>

                      <View style={styles.caseMeta}>
                        <View style={[styles.statusBadge, { backgroundColor: caseItem.statusBg }]}>
                          <Text style={[styles.statusText, { color: caseItem.statusColor }]}>
                            {caseItem.status}
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Calendar size={14} color={colorsRGB.mutedForeground} />
                          <Text style={styles.metaText}>Due {caseItem.dueDate}</Text>
                        </View>
                        <Text style={styles.metaText}>· {caseItem.lastUpdate}</Text>
                      </View>
                    </View>

                    <ChevronRight size={20} color={colorsRGB.mutedForeground} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <CheckCircle size={32} color="#4A9D7E" />
              </View>
              <Text style={styles.emptyTitle}>No active cases</Text>
              <Text style={styles.emptyText}>
                {activeFilter === 'all'
                  ? 'All caught up! No open cases to review.'
                  : `No cases with "${filters.find((f) => f.key === activeFilter)?.label}" status.`}
              </Text>
              <View style={styles.emptyActions}>
                <Button variant="default" size="full" onPress={onReviewQueueClick}>
                  <Eye size={20} color="#FFFFFF" />
                  <Text style={styles.emptyButtonText}>Review Queue</Text>
                </Button>
                <Button variant="outline" size="full" onPress={onCreateCase} style={styles.emptyButton}>
                  <Plus size={20} color={colorsRGB.primary} />
                  <Text style={styles.emptyButtonOutlineText}>Create Case</Text>
                </Button>
                <Button variant="outline" size="full" onPress={onScanClick} style={styles.emptyButton}>
                  <Scan size={20} color={colorsRGB.primary} />
                  <Text style={styles.emptyButtonOutlineText}>Scan Property</Text>
                </Button>
              </View>
            </View>
          )}
        </View>
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  sortButton: {
    padding: 8,
    borderRadius: 12,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 17,
    zIndex: 1,
  },
  searchInput: {
    height: 56,
    paddingLeft: 48,
    paddingRight: 16,
    backgroundColor: colorsRGB.secondary,
    borderRadius: 16,
    fontSize: 16,
    color: colorsRGB.foreground,
  },
  filtersScroll: {
    marginHorizontal: -20,
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
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colorsRGB.secondary,
    minHeight: 40,
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
  filterCount: {
    paddingHorizontal: 6,
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
    color: colorsRGB.foreground,
  },
  filterCountTextActive: {
    color: '#FFFFFF',
  },
  sortMenu: {
    position: 'absolute',
    right: 20,
    top: 80,
    backgroundColor: colorsRGB.card,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 20,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  sortOptionActive: {
    backgroundColor: colorsRGB.primary,
  },
  sortOptionText: {
    fontSize: 14,
    color: colorsRGB.foreground,
  },
  sortOptionTextActive: {
    color: colorsRGB.primaryForeground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAccessCard: {
    width: '48%',
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickAccessIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickAccessValue: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  quickAccessLabel: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  caseCount: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  casesList: {
    gap: 12,
  },
  caseCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
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
  caseIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caseMain: {
    flex: 1,
  },
  caseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
    flex: 1,
  },
  overdueBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  overdueText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
  },
  dueSoonBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dueSoonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F59E0B',
  },
  caseAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  caseAddressText: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    flex: 1,
  },
  caseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
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
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.foreground,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 280,
    lineHeight: 22,
  },
  emptyActions: {
    width: '100%',
    gap: 12,
  },
  emptyButton: {
    marginTop: 0,
  },
  emptyButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  emptyButtonOutlineText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
});
