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
  FileText,
  Phone,
  MessageCircle,
  AlertCircle,
  ChevronRight,
  CreditCard,
  Sparkles,
} from 'lucide-react-native';
import { ActionCard } from '../../components/cards/ActionCard';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

interface NextAction {
  type: 'upload' | 'appeal' | 'review';
  caseId: string;
  caseTitle: string;
  dueDate: string;
  urgency?: 'due-soon' | 'overdue';
}

interface DuesInfo {
  balance: number;
  dueDate: string;
  status: 'due-soon' | 'overdue' | 'paid';
}

interface ResidentHomeScreenProps {
  userName?: string;
  communityName?: string;
  openCasesCount?: number;
  nearestDeadline?: string;
  nextAction?: NextAction | null;
  duesInfo?: DuesInfo;
  onNavigate: (tab: string) => void;
}

export default function ResidentHomeScreen({
  userName = 'Margaret',
  communityName = 'Willow Creek Estates',
  openCasesCount = 2,
  nearestDeadline = 'Jan 15',
  nextAction = {
    type: 'upload',
    caseId: '1',
    caseTitle: 'Lawn Maintenance Required',
    dueDate: 'Jan 15',
    urgency: 'due-soon',
  },
  duesInfo = {
    balance: 128.50,
    dueDate: 'Jan 15',
    status: 'due-soon',
  },
  onNavigate,
}: ResidentHomeScreenProps) {
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(duesInfo.balance);

  const statusConfig = {
    'due-soon': {
      label: 'Due soon',
      bgColor: 'rgba(245, 158, 11, 0.15)',
      textColor: '#F59E0B',
    },
    overdue: {
      label: 'Overdue',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      textColor: '#EF4444',
    },
    paid: {
      label: 'Paid',
      bgColor: 'rgba(74, 157, 126, 0.15)',
      textColor: '#4A9D7E',
    },
  };

  const urgencyConfig = {
    'due-soon': {
      label: 'Due soon',
      bgColor: 'rgba(245, 158, 11, 0.15)',
      textColor: '#F59E0B',
    },
    overdue: {
      label: 'Overdue',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      textColor: '#EF4444',
    },
  };

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const getActionLabel = (type: NextAction['type']) => {
    switch (type) {
      case 'upload':
        return 'Upload a fix photo';
      case 'appeal':
        return 'Submit your appeal';
      case 'review':
        return 'Review the response';
      default:
        return 'Take action';
    }
  };

  const hasNextAction = !!nextAction;

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

        {/* Compact Dues Bar */}
        <TouchableOpacity
          style={styles.duesBar}
          onPress={() => onNavigate('payments')}
          activeOpacity={0.7}
        >
          <View style={styles.duesContent}>
            <CreditCard size={20} color={colorsRGB.mutedForeground} />
            <Text style={styles.duesLabel}>Dues:</Text>
            <Text style={styles.duesAmount}>{formattedBalance}</Text>
            <Text style={styles.duesDue}>Due {duesInfo.dueDate}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusConfig[duesInfo.status].bgColor },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: statusConfig[duesInfo.status].textColor },
                ]}
              >
                {statusConfig[duesInfo.status].label}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colorsRGB.mutedForeground} />
        </TouchableOpacity>

        {/* Primary Action Cards */}
        <View style={styles.section}>
          {/* My Cases Card */}
          <TouchableOpacity
            style={[
              styles.casesCard,
              hasNextAction && styles.casesCardUrgent,
            ]}
            onPress={() => onNavigate('cases')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.casesIcon,
                hasNextAction && styles.casesIconUrgent,
              ]}
            >
              <FileText
                size={24}
                color={hasNextAction ? '#F59E0B' : colorsRGB.accent}
              />
            </View>

            <View style={styles.casesContent}>
              <View style={styles.casesTitleRow}>
                <Text style={styles.casesTitle}>My Cases</Text>
                {openCasesCount > 0 && (
                  <View style={styles.casesBadge}>
                    <Text style={styles.casesBadgeText}>{openCasesCount}</Text>
                  </View>
                )}
              </View>

              {hasNextAction && (
                <>
                  <View style={styles.actionNeededRow}>
                    <Text style={styles.actionNeededText}>ACTION NEEDED</Text>
                    {nextAction.urgency && (
                      <View
                        style={[
                          styles.urgencyBadge,
                          { backgroundColor: urgencyConfig[nextAction.urgency].bgColor },
                        ]}
                      >
                        <Text
                          style={[
                            styles.urgencyBadgeText,
                            { color: urgencyConfig[nextAction.urgency].textColor },
                          ]}
                        >
                          {urgencyConfig[nextAction.urgency].label}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.actionDescription}>
                    {getActionLabel(nextAction.type)} · Due {nextAction.dueDate}
                  </Text>
                </>
              )}

              <Text style={styles.casesSubtitle}>
                {openCasesCount > 0
                  ? `${openCasesCount} open · Next deadline: ${nearestDeadline}`
                  : 'No open cases'}
              </Text>
            </View>

            <ChevronRight size={20} color={colorsRGB.mutedForeground} />
          </TouchableOpacity>

          {/* Ask Sage Card */}
          <ActionCard
            title="Ask Sage"
            subtitle="Get quick answers about community rules, tickets, and payments."
            icon={<Sparkles size={24} color={colorsRGB.primary} />}
            onPress={() => onNavigate('sage')}
          />
        </View>

        {/* Latest Notices */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Notices</Text>
            <TouchableOpacity
              onPress={() => onNavigate('sage')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRight size={16} color={colorsRGB.accent} />
            </TouchableOpacity>
          </View>

          <View style={styles.noticesContainer}>
            {/* Notice 1 */}
            <TouchableOpacity
              style={styles.noticeCard}
              onPress={() => onNavigate('sage')}
              activeOpacity={0.7}
            >
              <View style={styles.noticeDot} />
              <View style={styles.noticeContent}>
                <View style={styles.noticeCategory}>
                  <Text style={styles.noticeCategoryText}>Trash</Text>
                </View>
                <Text style={styles.noticeTitle}>Holiday Trash Schedule Change</Text>
                <Text style={styles.noticeDescription} numberOfLines={2}>
                  Collection moved to Monday, Jan 6
                </Text>
              </View>
              <Text style={styles.noticeTime}>2h ago</Text>
            </TouchableOpacity>

            {/* Notice 2 */}
            <TouchableOpacity
              style={styles.noticeCard}
              onPress={() => onNavigate('sage')}
              activeOpacity={0.7}
            >
              <View style={[styles.noticeDot, styles.noticeDotInactive]} />
              <View style={styles.noticeContent}>
                <View style={[styles.noticeCategory, styles.noticeCategoryInactive]}>
                  <Text style={[styles.noticeCategoryText, styles.noticeCategoryTextInactive]}>
                    Pool
                  </Text>
                </View>
                <Text style={styles.noticeTitle}>Pool Maintenance Reminder</Text>
                <Text style={styles.noticeDescription} numberOfLines={2}>
                  Pool closed Jan 8-10 for cleaning
                </Text>
              </View>
              <Text style={styles.noticeTime}>1d ago</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Get Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpHeader}>
            <AlertCircle size={20} color={colorsRGB.accent} />
            <Text style={styles.helpTitle}>Need Help?</Text>
          </View>

          <View style={styles.helpButtons}>
            <TouchableOpacity style={styles.helpButton}>
              <Phone size={24} color={colorsRGB.foreground} />
              <Text style={styles.helpButtonText}>Call Office</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helpButton}>
              <MessageCircle size={24} color={colorsRGB.foreground} />
              <Text style={styles.helpButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.helpHours}>Office hours: Mon–Fri, 9 AM – 5 PM</Text>
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
    fontSize: 20,
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
  duesBar: {
    backgroundColor: colorsRGB.card,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  duesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  duesLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  duesAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
  },
  duesDue: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    gap: 16,
    marginBottom: 24,
  },
  casesCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  casesCardUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  casesIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 157, 126, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  casesIconUrgent: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  casesContent: {
    flex: 1,
  },
  casesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  casesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colorsRGB.foreground,
  },
  casesBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  casesBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  actionNeededRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  actionNeededText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  urgencyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgencyBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionDescription: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginBottom: 4,
  },
  casesSubtitle: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.3,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.accent,
  },
  noticesContainer: {
    gap: 12,
  },
  noticeCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  noticeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colorsRGB.accent,
    marginTop: 8,
  },
  noticeDotInactive: {
    backgroundColor: colorsRGB.border,
  },
  noticeContent: {
    flex: 1,
  },
  noticeCategory: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(74, 157, 126, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  noticeCategoryInactive: {
    backgroundColor: colorsRGB.muted,
  },
  noticeCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.accent,
  },
  noticeCategoryTextInactive: {
    color: colorsRGB.mutedForeground,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 2,
  },
  noticeDescription: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    lineHeight: 22,
  },
  noticeTime: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  helpSection: {
    backgroundColor: 'rgba(245, 243, 239, 0.5)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.3,
  },
  helpButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  helpButton: {
    flex: 1,
    backgroundColor: colorsRGB.card,
    borderWidth: 2,
    borderColor: colorsRGB.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  helpHours: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
  },
});
