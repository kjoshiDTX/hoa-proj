import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  Camera,
  FileText,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  Activity,
} from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

interface HOAHomeScreenProps {
  onNavigate: (view: string) => void;
  onQueueClick: (queue: string) => void;
  onViewActivity: () => void;
}

export default function HOAHomeScreen({
  onNavigate,
  onQueueClick,
  onViewActivity,
}: HOAHomeScreenProps) {
  const { userProfile } = useAuth();

  const userName = userProfile?.full_name?.split(' ')[0] || 'Board Member';

  const stats = [
    { label: 'Open Cases', value: '12', icon: FileText, color: colorsRGB.primary },
    { label: 'Pending Review', value: '8', icon: Clock, color: '#F59E0B' },
    { label: 'Resolved', value: '45', icon: CheckCircle, color: '#4A9D7E' },
    { label: 'SLA at Risk', value: '3', icon: AlertCircle, color: '#EF4444' },
  ];

  const reviewQueue = [
    { id: '1', title: 'Remediation Photos', count: 5, urgency: 'high' },
    { id: '2', title: 'New Submissions', count: 3, urgency: 'medium' },
    { id: '3', title: 'Appeals', count: 2, urgency: 'high' },
  ];

  const quickActions = [
    {
      id: 'scan',
      icon: Camera,
      label: 'Scan Violation',
      color: colorsRGB.primary,
      onPress: () => onNavigate('scan'),
    },
    {
      id: 'notice',
      icon: FileText,
      label: 'Post Notice',
      color: '#3B82F6',
      onPress: () => onNavigate('hoa-notices'),
    },
    {
      id: 'analytics',
      icon: TrendingUp,
      label: 'Analytics',
      color: '#8B5CF6',
      onPress: () => onNavigate('analytics'),
    },
    {
      id: 'admin',
      icon: Users,
      label: 'Admin',
      color: colorsRGB.accent,
      onPress: () => onNavigate('admin'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}</Text>
          <Text style={styles.subtitle}>Willow Creek Estates HOA</Text>
        </View>
        <TouchableOpacity style={styles.activityButton} onPress={onViewActivity}>
          <Activity size={24} color={colorsRGB.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <stat.icon size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Review Queue */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Review Queue</Text>
            <TouchableOpacity onPress={() => onQueueClick('all')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.queueList}>
            {reviewQueue.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.queueCard}
                onPress={() => onQueueClick(item.id)}
              >
                <View style={styles.queueContent}>
                  <Text style={styles.queueTitle}>{item.title}</Text>
                  <View style={styles.queueBadge}>
                    <Text style={styles.queueCount}>{item.count}</Text>
                  </View>
                </View>
                {item.urgency === 'high' && (
                  <View style={styles.urgentBadge}>
                    <AlertCircle size={16} color="#EF4444" />
                    <Text style={styles.urgentText}>Urgent</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colorsRGB.border,
  },
  greeting: {
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
  activityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colorsRGB.foreground,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.accent,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  queueList: {
    gap: 12,
  },
  queueCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  queueContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  queueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
  },
  queueBadge: {
    backgroundColor: colorsRGB.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  queueCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  urgentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.foreground,
    textAlign: 'center',
  },
});
