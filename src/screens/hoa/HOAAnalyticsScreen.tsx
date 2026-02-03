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
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Filter,
  ChevronRight,
  Calendar,
  MapPin,
  BarChart3,
  Users,
  Home,
  X,
  Eye,
  RefreshCw,
  Gauge,
  Scale,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

interface HOAAnalyticsScreenProps {
  onBack?: () => void;
  onHomeClick?: (homeId: string) => void;
  onCaseClick?: (caseId: string) => void;
}

type DateRange = '7d' | '30d' | '90d' | 'custom';
type AnalyticsView =
  | 'dashboard'
  | 'search-results'
  | 'status-drilldown'
  | 'repeat-addresses'
  | 'bottlenecks'
  | 'most-appealed-rules'
  | 'overdue-hotspots'
  | 'remediation-review';

export default function HOAAnalyticsScreen({
  onBack,
  onHomeClick,
  onCaseClick,
}: HOAAnalyticsScreenProps) {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [currentView, setCurrentView] = useState<AnalyticsView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [drilldownStatus, setDrilldownStatus] = useState<string>('');

  const getDataForRange = (range: DateRange) => {
    const multiplier = range === '7d' ? 1 : range === '30d' ? 4 : 12;
    return {
      openCases: 24,
      needsReview: 7,
      overdue: 4,
      avgResolution: range === '7d' ? '10d' : range === '30d' ? '12d' : '14d',
      appealsOpen: 3,
      slaBreached: 2,
      newCases: 3 * multiplier,
      resolved: 2 * multiplier,
    };
  };

  const globalKPIs = getDataForRange(dateRange);

  const categoryBreakdown = [
    { name: 'Exterior / Yard', count: 8, percent: 33 },
    { name: 'Parking', count: 5, percent: 21 },
    { name: 'Trash Cans', count: 4, percent: 17 },
    { name: 'Noise', count: 4, percent: 17 },
    { name: 'Other', count: 3, percent: 12 },
  ];

  const statusBreakdown = [
    { name: 'Needs Review', key: 'needs-review', count: 7, color: '#EF4444' },
    { name: 'Sent', key: 'sent', count: 5, color: '#3B82F6' },
    { name: 'Acknowledged', key: 'acknowledged', count: 4, color: '#F59E0B' },
    { name: 'Appealed', key: 'appealed', count: 3, color: '#F59E0B' },
    { name: 'Remediation', key: 'remediation', count: 3, color: '#3B82F6' },
    { name: 'Resolved', key: 'resolved', count: 2, color: '#4A9D7E' },
    { name: 'Overdue', key: 'overdue', count: 4, color: '#EF4444' },
    { name: 'SLA Breached', key: 'sla-breached', count: 2, color: '#EF4444' },
  ];

  const repeatAddresses = [
    { id: '1', address: '123 Oak Street, Unit A', caseCount: 5, lastActivity: '2 days ago' },
    { id: '2', address: '456 Maple Avenue', caseCount: 4, lastActivity: '1 week ago' },
    { id: '3', address: '789 Pine Road, #12', caseCount: 3, lastActivity: '3 days ago' },
    { id: '4', address: '321 Elm Drive', caseCount: 3, lastActivity: '5 days ago' },
    { id: '5', address: '654 Birch Lane', caseCount: 2, lastActivity: '1 day ago' },
  ];

  const longestOpenCases = [
    { id: 'case-1', title: 'Lawn Maintenance', address: '789 Pine Rd', days: 45, status: 'Sent' },
    { id: 'case-2', title: 'Fence Repair', address: '123 Oak St', days: 38, status: 'Appealed' },
    { id: 'case-3', title: 'Exterior Paint', address: '456 Maple Ave', days: 32, status: 'Sent' },
  ];

  const mostAppealedRules = [
    { id: 'rule-1', rule: 'Section 4.2 – Trash Can Visibility', appeals: 8, upheldRate: 75 },
    { id: 'rule-2', rule: 'Section 3.1 – Lawn Maintenance', appeals: 6, upheldRate: 83 },
    { id: 'rule-3', rule: 'Section 5.4 – Parking Violations', appeals: 4, upheldRate: 50 },
  ];

  const bottleneckData = {
    reviewTime: 3.2,
    remediationTime: 5.1,
    appealProcessing: 4.5,
    breakdown: [
      { stage: 'Photo Review', avgDays: 3.2, target: 2, status: 'over' },
      { stage: 'Resident Remediation', avgDays: 5.1, target: 7, status: 'ok' },
      { stage: 'Appeal Processing', avgDays: 4.5, target: 5, status: 'ok' },
      { stage: 'Final Approval', avgDays: 1.2, target: 1, status: 'ok' },
    ],
  };

  const overdueByCategory = [
    { category: 'Exterior / Yard', count: 2, percent: 50 },
    { category: 'Trash Cans', count: 1, percent: 25 },
    { category: 'Parking', count: 1, percent: 25 },
  ];

  const remediationStats = {
    total: 15,
    approved: 12,
    rejected: 3,
    passRate: 80,
  };

  const handleStatusClick = (status: string) => {
    setDrilldownStatus(status);
    setCurrentView('status-drilldown');
  };

  const dateRangeLabels: Record<DateRange, string> = {
    '7d': '7 days',
    '30d': '30 days',
    '90d': '90 days',
    custom: 'Custom',
  };

  const getChartData = (type: 'new' | 'resolved') => {
    if (dateRange === '7d') {
      return type === 'new' ? [40, 55, 35, 70, 45, 80, 65] : [30, 45, 60, 40, 55, 70, 85];
    }
    return type === 'new' ? [45, 60, 50, 75, 55, 70, 80] : [40, 55, 65, 50, 60, 75, 90];
  };

  // Render drill-down views
  if (currentView === 'repeat-addresses') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentView('dashboard')}
          >
            <ArrowLeft size={24} color={colorsRGB.foreground} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Repeat Addresses</Text>
            <Text style={styles.subtitle}>Homes with multiple cases</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {repeatAddresses.map((home) => (
            <TouchableOpacity
              key={home.id}
              style={styles.listCard}
              onPress={() => onHomeClick?.(home.id)}
            >
              <View style={styles.listIconContainer}>
                <Home size={24} color="#F59E0B" />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle} numberOfLines={1}>
                  {home.address}
                </Text>
                <View style={styles.listMeta}>
                  <View style={styles.warningBadge}>
                    <Text style={styles.warningBadgeText}>{home.caseCount} cases</Text>
                  </View>
                  <Text style={styles.listMetaText}>· {home.lastActivity}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colorsRGB.mutedForeground} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (currentView === 'most-appealed-rules') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentView('dashboard')}
          >
            <ArrowLeft size={24} color={colorsRGB.foreground} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Most Appealed Rules</Text>
            <Text style={styles.subtitle}>Rules with highest appeal rates</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {mostAppealedRules.map((rule) => (
            <View key={rule.id} style={styles.card}>
              <View style={styles.ruleHeader}>
                <View style={styles.ruleIconContainer}>
                  <Scale size={16} color="#F59E0B" />
                </View>
                <View style={styles.ruleContent}>
                  <Text style={styles.ruleText}>{rule.rule}</Text>
                  <View style={styles.ruleMeta}>
                    <Text style={styles.ruleMetaText}>{rule.appeals} appeals</Text>
                    <Text style={styles.ruleMetaText}>· {rule.upheldRate}% upheld</Text>
                  </View>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${rule.upheldRate}%` }]}
                />
              </View>
              <Text style={styles.helper}>
                HOA decisions upheld in {rule.upheldRate}% of appeals
              </Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Main Dashboard View
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Analytics</Text>
          <TouchableOpacity
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? '#FFFFFF' : colorsRGB.foreground} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colorsRGB.mutedForeground} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search address, unit, or resident name"
            placeholderTextColor={colorsRGB.mutedForeground}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateRangeContainer}
          style={styles.dateRangeScroll}
        >
          {(['7d', '30d', '90d', 'custom'] as DateRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.dateChip, dateRange === range && styles.dateChipActive]}
              onPress={() => setDateRange(range)}
            >
              <Text
                style={[styles.dateChipText, dateRange === range && styles.dateChipTextActive]}
              >
                {dateRangeLabels[range]}
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
        {/* Global KPIs */}
        <View style={styles.section}>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{globalKPIs.openCases}</Text>
              <Text style={styles.kpiLabel}>Open Cases</Text>
            </View>
            <TouchableOpacity
              style={styles.kpiCard}
              onPress={() => handleStatusClick('needs-review')}
            >
              <Text style={[styles.kpiValue, styles.kpiValueUrgent]}>{globalKPIs.needsReview}</Text>
              <Text style={styles.kpiLabel}>Needs Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.kpiCard}
              onPress={() => handleStatusClick('overdue')}
            >
              <Text style={[styles.kpiValue, styles.kpiValueUrgent]}>{globalKPIs.overdue}</Text>
              <Text style={styles.kpiLabel}>Overdue</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.kpiGrid, styles.kpiGridSecondary]}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{globalKPIs.avgResolution}</Text>
              <Text style={styles.kpiLabel}>Avg Resolution</Text>
            </View>
            <TouchableOpacity
              style={styles.kpiCard}
              onPress={() => handleStatusClick('appealed')}
            >
              <Text style={[styles.kpiValue, { color: '#F59E0B' }]}>{globalKPIs.appealsOpen}</Text>
              <Text style={styles.kpiLabel}>Appeals Open</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.kpiCard}
              onPress={() => handleStatusClick('sla-breached')}
            >
              <Text style={[styles.kpiValue, styles.kpiValueUrgent]}>{globalKPIs.slaBreached}</Text>
              <Text style={styles.kpiLabel}>SLA Breached</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trends Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trends</Text>
          <View style={styles.card}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Cases Created vs Resolved</Text>
              <Text style={styles.chartSubtitle}>Last {dateRangeLabels[dateRange]}</Text>
            </View>
            <View style={styles.chartContainer}>
              {getChartData('new').map((height, i) => (
                <View key={i} style={styles.chartBar}>
                  <View style={[styles.chartBarNew, { height: `${height * 0.6}%` }]} />
                  <View
                    style={[styles.chartBarResolved, { height: `${getChartData('resolved')[i] * 0.4}%` }]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={styles.legendColorNew} />
                <Text style={styles.legendText}>Created</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendColorResolved} />
                <Text style={styles.legendText}>Resolved</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Status Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By Status</Text>
          <View style={styles.statusGrid}>
            {statusBreakdown.map((status, index) => (
              <TouchableOpacity
                key={index}
                style={styles.statusCard}
                onPress={() => handleStatusClick(status.key)}
              >
                <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                <Text style={styles.statusName} numberOfLines={1}>
                  {status.name}
                </Text>
                <Text style={styles.statusCount}>{status.count}</Text>
                <ChevronRight size={16} color={colorsRGB.mutedForeground} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By Category</Text>
          <View style={styles.card}>
            {categoryBreakdown.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.count}</Text>
                </View>
                <View style={styles.categoryBar}>
                  <View style={[styles.categoryFill, { width: `${category.percent}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          
          <TouchableOpacity
            style={styles.insightCard}
            onPress={() => setCurrentView('repeat-addresses')}
          >
            <View style={styles.insightContent}>
              <View style={styles.insightHeader}>
                <RefreshCw size={16} color="#F59E0B" />
                <Text style={styles.insightTitle}>Repeat Addresses</Text>
              </View>
              <Text style={styles.insightText}>
                Top: {repeatAddresses[0].address.split(',')[0]} ({repeatAddresses[0].caseCount} cases)
              </Text>
            </View>
            <ChevronRight size={20} color={colorsRGB.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.insightCard}
            onPress={() => onCaseClick?.(longestOpenCases[0].id)}
          >
            <View style={styles.insightContent}>
              <View style={styles.insightHeader}>
                <Clock size={16} color="#F59E0B" />
                <Text style={styles.insightTitle}>Longest Open</Text>
              </View>
              <Text style={styles.insightText}>
                {longestOpenCases[0].days} days – {longestOpenCases[0].title} at{' '}
                {longestOpenCases[0].address}
              </Text>
            </View>
            <ChevronRight size={20} color={colorsRGB.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.insightCard}
            onPress={() => setCurrentView('most-appealed-rules')}
          >
            <View style={styles.insightContent}>
              <View style={styles.insightHeader}>
                <Scale size={16} color="#F59E0B" />
                <Text style={styles.insightTitle}>Most Appealed Rules</Text>
              </View>
              <Text style={styles.insightText}>
                Trash can visibility ({mostAppealedRules[0].appeals} appeals,{' '}
                {mostAppealedRules[0].upheldRate}% upheld)
              </Text>
            </View>
            <ChevronRight size={20} color={colorsRGB.mutedForeground} />
          </TouchableOpacity>
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
  subtitle: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  filterButton: {
    padding: 8,
    borderRadius: 12,
  },
  filterButtonActive: {
    backgroundColor: colorsRGB.primary,
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
  dateRangeScroll: {
    marginHorizontal: -20,
  },
  dateRangeContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dateChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colorsRGB.secondary,
    minHeight: 40,
    justifyContent: 'center',
  },
  dateChipActive: {
    backgroundColor: colorsRGB.primary,
  },
  dateChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.secondaryForeground,
  },
  dateChipTextActive: {
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
  kpiGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiGridSecondary: {
    marginTop: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  kpiValueUrgent: {
    color: '#EF4444',
  },
  kpiLabel: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  chartSubtitle: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 96,
    marginBottom: 12,
  },
  chartBar: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  chartBarNew: {
    backgroundColor: 'rgba(44, 62, 80, 0.3)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartBarResolved: {
    backgroundColor: 'rgba(74, 157, 126, 0.4)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColorNew: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'rgba(44, 62, 80, 0.3)',
  },
  legendColorResolved: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'rgba(74, 157, 126, 0.4)',
  },
  legendText: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    width: '48%',
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
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  statusCount: {
    fontSize: 18,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.3,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  categoryCount: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  categoryBar: {
    height: 8,
    backgroundColor: colorsRGB.secondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryFill: {
    height: '100%',
    backgroundColor: colorsRGB.primary,
    borderRadius: 4,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  insightContent: {
    flex: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  insightText: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    lineHeight: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginBottom: 8,
  },
  headerContent: {
    marginBottom: 16,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius
    : 8,
elevation: 3,
},
listIconContainer: {
width: 48,
height: 48,
borderRadius: 24,
backgroundColor: 'rgba(245, 158, 11, 0.15)',
alignItems: 'center',
justifyContent: 'center',
},
listContent: {
flex: 1,
},
listTitle: {
fontSize: 16,
fontWeight: '500',
color: colorsRGB.foreground,
marginBottom: 4,
},
listMeta: {
flexDirection: 'row',
alignItems: 'center',
gap: 8,
},
warningBadge: {
backgroundColor: 'rgba(245, 158, 11, 0.15)',
paddingHorizontal: 8,
paddingVertical: 2,
borderRadius: 4,
},
warningBadgeText: {
fontSize: 12,
fontWeight: '500',
color: '#F59E0B',
},
listMetaText: {
fontSize: 14,
color: colorsRGB.mutedForeground,
},
ruleHeader: {
flexDirection: 'row',
alignItems: 'flex-start',
gap: 12,
marginBottom: 12,
},
ruleIconContainer: {
width: 32,
height: 32,
borderRadius: 16,
backgroundColor: 'rgba(245, 158, 11, 0.15)',
alignItems: 'center',
justifyContent: 'center',
},
ruleContent: {
flex: 1,
},
ruleText: {
fontSize: 16,
fontWeight: '500',
color: colorsRGB.foreground,
marginBottom: 8,
},
ruleMeta: {
flexDirection: 'row',
alignItems: 'center',
gap: 8,
},
ruleMetaText: {
fontSize: 14,
color: colorsRGB.mutedForeground,
},
progressBar: {
height: 8,
backgroundColor: colorsRGB.secondary,
borderRadius: 4,
overflow: 'hidden',
marginBottom: 8,
},
progressFill: {
height: '100%',
backgroundColor: '#F59E0B',
borderRadius: 4,
},
helper: {
fontSize: 12,
color: colorsRGB.mutedForeground,
},
});
