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
  AlertCircle,
  Clock,
  Camera,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Scan,
  FileText,
  Plus,
  BarChart3,
} from 'lucide-react-native';
import { QueueCard } from '../../components/cards/QueueCard';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

interface HOAHomeScreenProps {
  userName?: string;
  communityName?: string;
  onNavigate: (tab: string) => void;
  onQueueClick?: (queue: string) => void;
  onViewActivity?: () => void;
}

export default function HOAHomeScreen({
  userName = 'Sarah',
  communityName = 'Willow Creek Estates',
  onNavigate,
  onQueueClick,
  onViewActivity,
}: HOAHomeScreenProps) {
  const [showAllQueues, setShowAllQueues] = useState(false);
  const [showFullStats, setShowFullStats] = useState(false);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const weeklyStats = {
    newCases: 12,
    resolved: 8,
    avgResolve: '12d',
  };

  const queueCounts = {
    needsReview: 7,
    needsReviewUrgent: 3,
    overdue: 3,
    appealsDue: 4,
    appealsDueUrgent: 2,
    remediationSubmitted: 6,
    openCases: 24,
  };

  const recentActivity = [
    { action: 'New appeal submitted', address: '456 Oak Street', time: '15m ago' },
    { action: 'Remediation photo uploaded', address: '789 Maple Ave', time: '1h ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.communityName}>{communityName}</Text>
        </View>

        {/* Weekly Snapshot */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.statsCard}
            onPress={() => setShowFullStats(!showFullStats)}
          >
            <View style={styles.statsCompact}>
              <View style={styles.statsRow}>
                <Text style={styles.statValue}>{weeklyStats.newCases}</Text>
                <Text style={styles.statLabel}> new</Text>
                <Text style={styles.statSeparator}> · </Text>
                <Text style={[styles.statValue, styles.statSuccess]}>{weeklyStats.resolved}</Text>
                <Text style={styles.statLabel}> resolved</Text>
                <Text style={styles.statSeparator}> · </Text>
                <Text style={styles.statLabel}>Avg </Text>
                <Text style={styles.statValue}>{weeklyStats.avgResolve}</Text>
              </View>
              <View style={styles.statsToggle}>
                {showFullStats ? (
                  <ChevronUp size={16} color={colorsRGB.mutedForeground} />
                ) : (
                  <ChevronDown size={16} color={colorsRGB.mutedForeground} />
                )}
              </View>
            </View>

            {showFullStats && (
              <View style={styles.statsExpanded}>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <View style={styles.statItemHeader}>
                      <Text style={styles.statItemValue}>{weeklyStats.newCases}</Text>
                      <TrendingUp size={12} color="#F59E0B" />
                    </View>
                    <Text style={styles.statItemLabel}>New Cases</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statItemValue, styles.statItemSuccess]}>
                      {weeklyStats.resolved}
                    </Text>
                    <Text style={styles.statItemLabel}>Resolved</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statItemValue}>{weeklyStats.avgResolve}</Text>
                    <Text style={styles.statItemLabel}>Avg Time</Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analyticsButton}
            onPress={() => onNavigate('analytics')}
          >
            <BarChart3 size={16} color={colorsRGB.accent} />
            <Text style={styles.analyticsText}>View analytics</Text>
            <ArrowRight size={12} color={colorsRGB.accent} />
          </TouchableOpacity>
        </View>

        {/* Priority Queues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority Queues</Text>

          <View style={styles.queues}>
            <QueueCard
              title="Needs Review"
              count={queueCounts.needsReview}
              icon={<Camera size={22} />}
              colorClass="bg-urgency-high/15 text-urgency-high"
              urgentCount={queueCounts.needsReviewUrgent}
              onClick={() => onQueueClick?.('needs-review')}
            />

            <QueueCard
              title="Overdue Fixes"
              count={queueCounts.overdue}
              icon={<AlertCircle size={22} />}
              colorClass="bg-destructive/15 text-destructive"
              urgentCount={queueCounts.overdue}
              onClick={() => onQueueClick?.('overdue')}
            />

            <QueueCard
              title="Appeals Due Soon"
              count={queueCounts.appealsDue}
              icon={<Clock size={22} />}
              colorClass="bg-urgency-medium/15 text-urgency-medium"
              urgentCount={queueCounts.appealsDueUrgent}
              onClick={() => onQueueClick?.('appeals')}
            />
          </View>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowAllQueues(!showAllQueues)}
          >
            <Text style={styles.toggleText}>
              {showAllQueues ? 'Show less' : 'See all queues'}
            </Text>
            {showAllQueues ? (
              <ChevronUp size={16} color={colorsRGB.mutedForeground} />
            ) : (
              <ChevronDown size={16} color={colorsRGB.mutedForeground} />
            )}
          </TouchableOpacity>

          {showAllQueues && (
            <View style={styles.queues}>
              <QueueCard
                title="Remediation Submitted"
                count={queueCounts.remediationSubmitted}
                icon={<Camera size={22} />}
                colorClass="bg-status-remediation/15 text-status-remediation"
                onClick={() => onQueueClick?.('remediation')}
              />

              <QueueCard
                title="All Open Cases"
                count={queueCounts.openCases}
                icon={<FileText size={22} />}
                colorClass="bg-secondary text-foreground"
                onClick={() => onNavigate('cases')}
              />
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onNavigate('scan')}
            >
              <Scan size={20} color={colorsRGB.primary} />
              <Text style={styles.actionText}>Start Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onNavigate('hoa-notices')}
            >
              <FileText size={20} color={colorsRGB.primary} />
              <Text style={styles.actionText}>New Notice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => console.log('Create case')}
            >
              <Plus size={20} color={colorsRGB.primary} />
              <Text style={styles.actionText}>New Case</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={onViewActivity}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityList}>
            {recentActivity.map((item, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <CheckCircle size={16} color={colorsRGB.mutedForeground} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction} numberOfLines={1}>
                    {item.action}
                  </Text>
                  <Text style={styles.activityAddress}>{item.address}</Text>
                </View>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            ))}
          </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    color: colorsRGB.mutedForeground,
  },
  userName: {
    fontSize: 32,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.accent,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: 'rgba(245, 243, 239, 0.5)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statsCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  statSuccess: {
    color: '#4A9D7E',
  },
  statLabel: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  statSeparator: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  statsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsExpanded: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colorsRGB.border,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statItemValue: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.3,
  },
  statItemSuccess: {
    color: '#4A9D7E',
  },
  statItemLabel: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  analyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    marginTop: 8,
  },
  analyticsText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.accent,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  queues: {
    gap: 10,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    marginTop: 12,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.mutedForeground,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colorsRGB.card,
    borderWidth: 2,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colorsRGB.foreground,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.accent,
  },
  activityList: {
    gap: 10,
  },
  activityItem: {
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    minWidth: 0,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  activityAddress: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
  },
});
