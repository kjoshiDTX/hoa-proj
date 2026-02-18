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
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

interface ResidentHomeScreenProps {
  onNavigate: (view: string) => void;
}

export default function ResidentHomeScreen({ onNavigate }: ResidentHomeScreenProps) {
  const { userProfile } = useAuth();

  const userName = userProfile?.full_name?.split(' ')[0] || 'Margaret';
  const communityName = userProfile?.community_name || 'Willow Creek Estates';
  const balance = userProfile?.balance || 128.50;

  const openCasesCount = 2;
  const nearestDeadline = 'Jan 15';
  const nextAction = {
    type: 'upload',
    caseId: '1',
    caseTitle: 'Lawn Maintenance Required',
    dueDate: 'Jan 15',
    urgency: 'due-soon',
  };
  const duesInfo = {
    balance: balance,
    dueDate: 'Jan 15',
    status: 'due-soon' as const,
  };

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(duesInfo.balance);

  const statusConfig = {
    'due-soon': {
      label: 'Due soon',
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.15)',
    },
    overdue: {
      label: 'Overdue',
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.15)',
    },
    paid: {
      label: 'Paid',
      color: '#4A9D7E',
      bgColor: 'rgba(74, 157, 126, 0.15)',
    },
  };

  const urgencyConfig = {
    'due-soon': {
      label: 'Due soon',
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.15)',
    },
    overdue: {
      label: 'Overdue',
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.15)',
    },
  };

  const getActionLabel = (type: string) => {
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
          <Text style={styles.greetingText}>{greeting},</Text>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.communityName}>{communityName}</Text>
        </View>

        {/* Compact Dues Bar */}
        <TouchableOpacity
          style={styles.duesBar}
          onPress={() => onNavigate('payments')}
        >
          <View style={styles.duesContent}>
            <CreditCard size={20} color={colorsRGB.mutedForeground} />
            <Text style={styles.duesLabel}>Dues:</Text>
            <Text style={styles.duesAmount}>{formattedBalance}</Text>
            <Text style={styles.duesDate}>Due {duesInfo.dueDate}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusConfig[duesInfo.status].bgColor },
              ]}
            >
              <Text
                style={[styles.statusText, { color: statusConfig[duesInfo.status].color }]}
              >
                {statusConfig[duesInfo.status].label}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colorsRGB.mutedForeground} />
        </TouchableOpacity>

        {/* Primary Action Cards */}
        <View style={styles.actionCardsSection}>
          {/* My Cases Card */}
          <TouchableOpacity
            style={[
              styles.casesCard,
              hasNextAction && styles.casesCardActive,
            ]}
            onPress={() => onNavigate('cases')}
          >
            <View style={styles.casesCardContent}>
              <View
                style={[
                  styles.casesIcon,
                  hasNextAction
                    ? { backgroundColor: 'rgba(245, 158, 11, 0.15)' }
                    : { backgroundColor: 'rgba(44, 62, 80, 0.1)' },
                ]}
              >
                <FileText
                  size={24}
                  color={hasNextAction ? '#F59E0B' : colorsRGB.accent}
                />
              </View>
              <View style={styles.casesInfo}>
                <View style={styles.casesTitleRow}>
                  <Text style={styles.casesTitle}>My Cases</Text>
                  {openCasesCount > 0 && (
                    <View style={styles.casesCountBadge}>
                      <Text style={styles.casesCountText}>{openCasesCount}</Text>
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
                              styles.urgencyText,
                              { color: urgencyConfig[nextAction.urgency].color },
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
            </View>
          </TouchableOpacity>

          {/* Ask Sage Card */}
          <TouchableOpacity style={styles.sageCard} onPress={() => onNavigate('sage')}>
            <View style={styles.sageIcon}>
              <Sparkles size={24} color={colorsRGB.primary} />
            </View>
            <View style={styles.sageInfo}>
              <Text style={styles.sageTitle}>Ask Sage</Text>
              <Text style={styles.sageSubtitle}>
                Get quick answers about community rules, tickets, and payments.
              </Text>
            </View>
            <ChevronRight size={20} color={colorsRGB.mutedForeground} />
          </TouchableOpacity>
        </View>

        {/* Latest Notices */}
        <View style={styles.noticesSection}>
          <View style={styles.noticesHeader}>
            <Text style={styles.noticesTitle}>Latest Notices</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => onNavigate('sage')}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRight size={16} color={colorsRGB.accent} />
            </TouchableOpacity>
          </View>

          <View style={styles.noticesList}>
            <TouchableOpacity style={styles.noticeCard} onPress={() => onNavigate('sage')}>
              <View style={styles.noticeDot} />
              <View style={styles.noticeContent}>
                <View style={styles.noticeCategoryBadge}>
                  <Text style={styles.noticeCategoryText}>Trash</Text>
                </View>
                <Text style={styles.noticeTitle}>Holiday Trash Schedule Change</Text>
                <Text style={styles.noticeDescription}>
                  Collection moved to Monday, Jan 6
                </Text>
              </View>
              <Text style={styles.noticeTime}>2h ago</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.noticeCard} onPress={() => onNavigate('sage')}>
              <View style={[styles.noticeDot, styles.noticeDotInactive]} />
              <View style={styles.noticeContent}>
                <View style={styles.noticeCategoryBadgeInactive}>
                  <Text style={styles.noticeCategoryTextInactive}>Pool</Text>
                </View>
                <Text style={styles.noticeTitle}>Pool Maintenance Reminder</Text>
                <Text style={styles.noticeDescription}>
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
              <Phone size={24} color={colorsRGB.primary} />
              <Text style={styles.helpButtonText}>Call Office</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helpButton}>
              <MessageCircle size={24} color={colorsRGB.primary} />
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
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  greetingText: {
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
  duesBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colorsRGB.card,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  duesDate: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionCardsSection: {
    gap: 16,
    marginBottom: 24,
  },
  casesCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  casesCardActive: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  casesCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  casesIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  casesInfo: {
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
  casesCountBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  casesCountText: {
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
  urgencyText: {
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
  sageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sageIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(44, 62, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sageInfo: {
    flex: 1,
  },
  sageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 4,
  },
  sageSubtitle: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  noticesSection: {
    marginBottom: 24,
  },
  noticesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  noticesTitle: {
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
  noticesList: {
    gap: 12,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
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
  noticeCategoryBadge: {
    backgroundColor: 'rgba(44, 62, 80, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  noticeCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.accent,
  },
  noticeCategoryBadgeInactive: {
    backgroundColor: colorsRGB.muted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  noticeCategoryTextInactive: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.mutedForeground,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 4,
  },
  noticeDescription: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
  },
  noticeTime: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  helpSection: {
    backgroundColor: 'rgba(245, 243, 239, 0.3)',
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
    backgroundColor: colorsRGB.background,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  helpHours: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
  },
});
