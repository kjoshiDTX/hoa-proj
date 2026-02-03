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
  Home,
  MessageSquare,
  Plus,
  FileText,
  ChevronRight,
  Clock,
  CheckCircle,
  Calendar,
  Camera,
  User,
  ExternalLink,
} from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

interface HOAHomeAnalyticsScreenProps {
  homeId?: string;
  onBack: () => void;
  onCaseClick?: (caseId: string) => void;
}

type TabType = 'overview' | 'cases' | 'history';

export default function HOAHomeAnalyticsScreen({
  homeId,
  onBack,
  onCaseClick,
}: HOAHomeAnalyticsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const homeData = {
    address: '123 Oak Street, Unit A',
    resident: 'John & Mary Smith',
    moveInDate: 'Mar 2019',
    status: {
      openCases: 3,
      overdue: 1,
    },
  };

  const kpis = {
    totalCases: 12,
    casesLast30: 3,
    casesLast90: 5,
    resolvedRate: 75,
    avgDaysToResolve: 14,
    appealsCount: 2,
    appealSuccessRate: 50,
    slaBreaches: 1,
  };

  const repeatCategories = [
    { name: 'Trash can visibility', count: 4 },
    { name: 'Lawn maintenance', count: 3 },
    { name: 'Vehicle parking', count: 2 },
  ];

  const casesList = [
    {
      id: '1',
      title: 'Trash Can Left Out',
      status: 'Remediation Submitted',
      statusColor: '#3B82F6',
      dueDate: 'Jan 18',
      lastUpdate: '2 hours ago',
      isOverdue: false,
    },
    {
      id: '2',
      title: 'Lawn Maintenance Required',
      status: 'Sent',
      statusColor: '#3B82F6',
      dueDate: 'Jan 15',
      lastUpdate: '1 day ago',
      isOverdue: true,
    },
    {
      id: '3',
      title: 'Vehicle on Lawn',
      status: 'Appealed',
      statusColor: '#F59E0B',
      dueDate: 'Jan 20',
      lastUpdate: '3 days ago',
      isOverdue: false,
    },
  ];

  const activityLog = [
    { date: 'Jan 12, 2025', action: 'Remediation photo submitted', type: 'resident' },
    { date: 'Jan 10, 2025', action: 'Notice sent for Trash Can violation', type: 'hoa' },
    { date: 'Jan 8, 2025', action: 'Appeal submitted for Vehicle on Lawn', type: 'resident' },
    { date: 'Jan 5, 2025', action: 'Case created: Lawn Maintenance', type: 'hoa' },
    { date: 'Dec 28, 2024', action: 'Case resolved: Exterior Paint', type: 'hoa' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={24} color={colorsRGB.foreground} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.address} numberOfLines={1}>
              {homeData.address}
            </Text>
            <View style={styles.residentInfo}>
              <User size={16} color={colorsRGB.mutedForeground} />
              <Text style={styles.residentText}>{homeData.resident}</Text>
            </View>
          </View>
        </View>

        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{homeData.status.openCases} open cases</Text>
          </View>
          {homeData.status.overdue > 0 && (
            <View style={styles.overdueBadge}>
              <Text style={styles.overdueBadgeText}>{homeData.status.overdue} overdue</Text>
            </View>
          )}
        </View>

        <View style={styles.quickActions}>
          <Button variant="outline" size="sm" style={styles.quickActionButton}>
            <FileText size={16} color={colorsRGB.primary} />
            <Text style={styles.quickActionText}>View Cases</Text>
          </Button>
          <Button variant="outline" size="sm" style={styles.quickActionButton}>
            <MessageSquare size={16} color={colorsRGB.primary} />
            <Text style={styles.quickActionText}>Message</Text>
          </Button>
          <Button variant="outline" size="sm" style={styles.quickActionButton}>
            <Plus size={16} color={colorsRGB.primary} />
            <Text style={styles.quickActionText}>New Case</Text>
          </Button>
        </View>

        <View style={styles.tabs}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'cases', label: 'Cases' },
            { id: 'history', label: 'History' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id as TabType)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.kpiGrid}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{kpis.totalCases}</Text>
                  <Text style={styles.kpiLabel}>Total Cases</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={[styles.kpiValue, styles.kpiValueSuccess]}>
                    {kpis.resolvedRate}%
                  </Text>
                  <Text style={styles.kpiLabel}>Resolved Rate</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{kpis.casesLast30}</Text>
                  <Text style={styles.kpiLabel}>Last 30 Days</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{kpis.avgDaysToResolve}d</Text>
                  <Text style={styles.kpiLabel}>Avg Resolve</Text>
                </View>
              </View>

              <View style={styles.kpiGridSmall}>
                <View style={styles.kpiCardSmall}>
                  <Text style={styles.kpiValueSmall}>{kpis.appealsCount}</Text>
                  <Text style={styles.kpiLabelSmall}>Appeals</Text>
                </View>
                <View style={styles.kpiCardSmall}>
                  <Text style={styles.kpiValueSmall}>{kpis.appealSuccessRate}%</Text>
                  <Text style={styles.kpiLabelSmall}>Appeal Win</Text>
                </View>
                <View style={styles.kpiCardSmall}>
                  <Text style={[styles.kpiValueSmall, styles.kpiValueUrgent]}>
                    {kpis.slaBreaches}
                  </Text>
                  <Text style={styles.kpiLabelSmall}>SLA Breach</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Repeat Issues</Text>
              <View style={styles.card}>
                {repeatCategories.map((category, index) => (
                  <View key={index} style={styles.repeatItem}>
                    <Text style={styles.repeatName}>{category.name}</Text>
                    <View style={styles.repeatBadge}>
                      <Text style={styles.repeatCount}>{category.count} times</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.infoCard}>
                <Calendar size={20} color={colorsRGB.mutedForeground} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Seasonal Pattern</Text>
                  <Text style={styles.infoText}>
                    Most issues occur in summer months (June–August). Lawn maintenance is the top
                    category during this period.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.moveInCard}>
                <Home size={20} color={colorsRGB.mutedForeground} />
                <View style={styles.moveInContent}>
                  <Text style={styles.moveInLabel}>Resident since</Text>
                  <Text style={styles.moveInValue}>{homeData.moveInDate}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'cases' && (
          <View style={styles.tabContent}>
            {casesList.length > 0 ? (
              casesList.map((caseItem) => (
                <TouchableOpacity
                  key={caseItem.id}
                  style={styles.caseCard}
                  onPress={() => onCaseClick?.(caseItem.id)}
                >
                  <View style={[styles.caseDot, { backgroundColor: caseItem.statusColor }]} />
                  <View style={styles.caseContent}>
                    <View style={styles.caseTitleRow}>
                      <Text style={styles.caseTitle} numberOfLines={1}>
                        {caseItem.title}
                      </Text>
                      {caseItem.isOverdue && (
                        <View style={styles.caseOverdueBadge}>
                          <Text style={styles.caseOverdueText}>Overdue</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.caseStatus}>{caseItem.status}</Text>
                    <View style={styles.caseMeta}>
                      <View style={styles.caseMetaItem}>
                        <Clock size={16} color={colorsRGB.mutedForeground} />
                        <Text style={styles.caseMetaText}>Due {caseItem.dueDate}</Text>
                      </View>
                      <Text style={styles.caseMetaText}>· {caseItem.lastUpdate}</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={colorsRGB.mutedForeground} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <CheckCircle size={32} color="#4A9D7E" />
                </View>
                <Text style={styles.emptyTitle}>No open cases</Text>
                <Text style={styles.emptyText}>This home has no active violations</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'history' && (
          <View style={styles.tabContent}>
            <Text style={styles.historySubtitle}>
              Activity log showing key decisions and submissions
            </Text>

            <View style={styles.timeline}>
              <View style={styles.timelineLine} />
              {activityLog.map((activity, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      activity.type === 'hoa' ? styles.timelineDotHOA : styles.timelineDotResident,
                    ]}
                  >
                    {activity.type === 'hoa' ? (
                      <FileText size={12} color="#FFFFFF" />
                    ) : (
                      <Camera size={12} color={colorsRGB.mutedForeground} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineAction}>{activity.action}</Text>
                    <Text style={styles.timelineDate}>{activity.date}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attachments</Text>
              <View style={styles.card}>
                <View style={styles.attachmentsGrid}>
                  {[1, 2, 3].map((i) => (
                    <View key={i} style={styles.attachmentItem}>
                      <Camera size={24} color={colorsRGB.mutedForeground} />
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View all attachments</Text>
                  <ExternalLink size={16} color={colorsRGB.accent} />
                </TouchableOpacity>
              </View>
            </View>
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
  headerInfo: {
    flex: 1,
  },
  address: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.3,
  },
  residentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  residentText: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colorsRGB.secondary,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  overdueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 20,
  },
  overdueBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickActionButton: {
    flex: 1,
    marginTop: 0,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
  tabs: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: colorsRGB.secondary,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colorsRGB.card,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.mutedForeground,
  },
  tabTextActive: {
    color: colorsRGB.foreground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  tabContent: {
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.3,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    width: '48%',
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
  kpiValueSuccess: {
    color: '#4A9D7E',
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
  kpiGridSmall: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCardSmall: {
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
  kpiValueSmall: {
    fontSize: 18,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.3,
  },
  kpiLabelSmall: {
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
  repeatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  repeatName: {
    fontSize: 16,
    color: colorsRGB.foreground,
  },
  repeatBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  repeatCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F59E0B',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(245, 243, 239, 0.5)',
    borderRadius: 16,
    padding: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    lineHeight: 20,
  },
  moveInCard: {
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
  moveInContent: {
    flex: 1,
  },
  moveInLabel: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  moveInValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
    marginTop: 2,
  },
  caseCard: {
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
  caseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  caseContent: {
    flex: 1,
  },
  caseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  caseTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  caseOverdueBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  caseOverdueText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
  },
  caseStatus: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginBottom: 8,
  },
  caseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  caseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  caseMetaText: {
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
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.foreground,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
  },
  historySubtitle: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  timeline: {
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 16,
    bottom: 16,
    width: 2,
    backgroundColor: colorsRGB.border,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineDotHOA: {
    backgroundColor: colorsRGB.primary,
  },
  timelineDotResident: {
    backgroundColor: colorsRGB.secondary,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineAction: {
    fontSize: 16,
    color: colorsRGB.foreground,
  },
  timelineDate: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  attachmentsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  attachmentItem: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colorsRGB.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.accent,
  },
});
