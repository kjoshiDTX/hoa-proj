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
  Upload,
  AlertTriangle,
  Calendar,
  BookOpen,
  ChevronDown,
  Camera,
} from 'lucide-react-native';
import { StatusBadge, UrgencyBadge } from '../../components/ui/StatusBadge';
import { CaseActivityFeed, CommentComposer } from '../../components/timeline/CaseActivityFeed';
import { WaitingOnReviewCard } from '../../components/photo/WaitingOnReviewCard';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

type ActivityFilter = 'all' | 'messages' | 'actions';

interface ResidentCaseDetailScreenProps {
  caseId?: string;
  onBack?: () => void;
  onUpload?: () => void;
  onAppeal?: () => void;
}

export default function ResidentCaseDetailScreen({
  onBack,
  onUpload,
  onAppeal,
}: ResidentCaseDetailScreenProps) {
  const [showCitation, setShowCitation] = useState(false);
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');

  const caseData = {
    title: 'Lawn Maintenance Required',
    address: '123 Willow Lane',
    status: 'remediation' as const,
    fixByDate: 'January 15, 2026',
    daysRemaining: 7,
    isWaitingOnReview: true,
    submittedPhotoDate: 'January 8, 2026',
    description:
      'Your front lawn has grass that exceeds the allowed height of 4 inches. Please mow your lawn to meet community standards.',
    citation: {
      section: 'Section 4.2',
      title: 'Exterior Maintenance',
      page: 12,
      excerpt:
        'Lawns must be maintained at a height not exceeding 4 inches. Yards should be free of weeds and maintained in good condition.',
    },
  };

  const mockActivities = [
    {
      id: '1',
      type: 'photo_submitted' as const,
      title: 'Your photo was submitted',
      description: 'Waiting for HOA to review your fix photo.',
      timestamp: '2 hours ago',
      actor: 'You',
      actorRole: 'resident' as const,
      imageUrl: '/placeholder.jpg',
    },
    {
      id: '2',
      type: 'comment_hoa_public' as const,
      title: 'Message from HOA',
      description: 'Please make sure to include the full front yard in your photo. Thank you!',
      timestamp: 'Jan 6, 2026',
      actor: 'Sarah (HOA)',
      actorRole: 'hoa' as const,
    },
    {
      id: '3',
      type: 'notice_sent' as const,
      title: 'Notice sent to you',
      description: 'Violation notice mailed and emailed.',
      timestamp: 'Jan 4, 2026',
      actor: 'HOA',
      actorRole: 'hoa' as const,
    },
    {
      id: '4',
      type: 'case_created' as const,
      title: 'Case created by HOA',
      description: 'Violation identified during community review.',
      timestamp: 'Jan 3, 2026',
      actor: 'HOA',
      actorRole: 'hoa' as const,
    },
  ];

  const nextStep = caseData.isWaitingOnReview
    ? null
    : {
        action: 'Upload fix photo',
        description: 'Take a photo showing your completed work',
      };

  const filters: { id: ActivityFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'messages', label: 'Messages' },
    { id: 'actions', label: 'Actions' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color={colorsRGB.primary} />
          <Text style={styles.backText}>Back to Cases</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Status */}
        <View style={styles.titleSection}>
          <View style={styles.badges}>
            <StatusBadge status={caseData.status} />
            {!caseData.isWaitingOnReview && caseData.daysRemaining && (
              <UrgencyBadge level="high" label={`${caseData.daysRemaining} days left`} />
            )}
          </View>

          <Text style={styles.title}>{caseData.title}</Text>
          <Text style={styles.address}>{caseData.address}</Text>
        </View>

        {/* Next Step Card OR Waiting on Review */}
        {caseData.isWaitingOnReview ? (
          <View style={styles.section}>
            <WaitingOnReviewCard
              submittedDate={caseData.submittedPhotoDate}
              expectedDays={3}
            />
          </View>
        ) : (
          nextStep && (
            <View style={styles.nextStepCard}>
              <View style={styles.nextStepContent}>
                <View style={styles.nextStepIcon}>
                  <Camera size={24} color={colorsRGB.accent} />
                </View>
                <View style={styles.nextStepText}>
                  <Text style={styles.nextStepLabel}>NEXT STEP</Text>
                  <Text style={styles.nextStepAction}>{nextStep.action}</Text>
                  <Text style={styles.nextStepDescription}>{nextStep.description}</Text>
                </View>
              </View>
              <Button variant="success" size="full" onPress={onUpload} style={styles.nextStepButton}>
                <Upload size={20} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>Upload Fix Photo</Text>
              </Button>
            </View>
          )
        )}

        {/* Fix By Date */}
        {caseData.status !== 'resolved' && !caseData.isWaitingOnReview && (
          <View style={styles.fixByCard}>
            <View style={styles.fixByIcon}>
              <Calendar size={24} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.fixByLabel}>FIX BY DATE</Text>
              <Text style={styles.fixByDate}>{caseData.fixByDate}</Text>
            </View>
          </View>
        )}

        {/* What Happened */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Happened</Text>
          <Text style={styles.description}>{caseData.description}</Text>

          <TouchableOpacity
            onPress={() => setShowCitation(!showCitation)}
            style={styles.citationButton}
          >
            <View style={styles.citationContent}>
              <BookOpen size={20} color={colorsRGB.accent} />
              <Text style={styles.citationText}>
                {caseData.citation.section} – {caseData.citation.title}
              </Text>
            </View>
            <ChevronDown
              size={20}
              color={colorsRGB.mutedForeground}
              style={[
                styles.chevron,
                showCitation && styles.chevronRotated,
              ]}
            />
          </TouchableOpacity>

          {showCitation && (
            <View style={styles.citationExpanded}>
              <Text style={styles.citationPage}>Page {caseData.citation.page}</Text>
              <Text style={styles.citationExcerpt}>"{caseData.citation.excerpt}"</Text>
            </View>
          )}
        </View>

        {/* Case Activity Feed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case Timeline</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
            style={styles.filtersScroll}
          >
            {filters.map((f) => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setActivityFilter(f.id)}
                style={[
                  styles.filterButton,
                  activityFilter === f.id && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    activityFilter === f.id && styles.filterTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <CaseActivityFeed
            activities={mockActivities}
            viewerRole="resident"
            filter={activityFilter}
          />
        </View>

        {/* Comment Composer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send a Message</Text>
          <CommentComposer viewerRole="resident" />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {!caseData.isWaitingOnReview && caseData.status !== 'resolved' && (
            <Button variant="success" size="full" onPress={onUpload}>
              <Upload size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Upload Fix Photo</Text>
            </Button>
          )}

          {caseData.status !== 'resolved' && (
            <Button variant="outline" size="full" onPress={onAppeal} style={styles.appealButton}>
              <AlertTriangle size={20} color={colorsRGB.primary} />
              <Text style={styles.appealButtonText}>Appeal This Decision</Text>
            </Button>
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
    backgroundColor: colorsRGB.background,
    borderBottomWidth: 1,
    borderBottomColor: colorsRGB.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    marginLeft: -8,
    paddingHorizontal: 8,
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
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  address: {
    fontSize: 20,
    color: colorsRGB.mutedForeground,
  },
  section: {
    marginBottom: 32,
  },
  nextStepCard: {
    backgroundColor: 'rgba(74, 157, 126, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74, 157, 126, 0.3)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  nextStepContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  nextStepIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 157, 126, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepText: {
    flex: 1,
  },
  nextStepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.accent,
    letterSpacing: 1,
    marginBottom: 4,
  },
  nextStepAction: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  nextStepDescription: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
  },
  nextStepButton: {
    marginTop: 16,
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  fixByCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  fixByIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixByLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
    letterSpacing: 1,
    marginBottom: 4,
  },
  fixByDate: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 18,
    color: colorsRGB.foreground,
    lineHeight: 28,
    marginBottom: 16,
  },
  citationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 243, 239, 0.5)',
    borderWidth: 1,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    padding: 16,
  },
  citationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  citationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colorsRGB.foreground,
  },
  chevron: {
    marginLeft: 8,
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  citationExpanded: {
    marginTop: 8,
    padding: 16,
    backgroundColor: 'rgba(245, 243, 239, 0.5)',
    borderRadius: 12,
  },
  citationPage: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginBottom: 8,
  },
  citationExcerpt: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colorsRGB.mutedForeground,
    lineHeight: 22,
  },
  filtersScroll: {
    marginBottom: 16,
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
  actions: {
    gap: 12,
    marginTop: 16,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  appealButton: {
    marginTop: 0,
  },
  appealButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
});
