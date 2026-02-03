import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  Camera,
  Check,
  X,
  AlertCircle,
  MessageSquare,
  Calendar,
  Edit3,
  Clock,
  Send,
  Eye,
  Image as ImageIcon,
} from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { CaseActivityFeed, CommentComposer } from '../../components/timeline/CaseActivityFeed';
import { colorsRGB } from '../../theme/colors';

type ReviewAction = 'confirm' | 'dismiss' | 'request_info';
type ActivityFilter = 'all' | 'messages' | 'actions';

interface HOACaseReviewScreenProps {
  itemId?: string;
  onBack?: () => void;
  onActionComplete?: (action: ReviewAction) => void;
}

export default function HOACaseReviewScreen({
  onBack,
  onActionComplete,
}: HOACaseReviewScreenProps) {
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');
  const [showDecisionNote, setShowDecisionNote] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ReviewAction | null>(null);
  const [decisionNote, setDecisionNote] = useState('');

  const reviewData = {
    address: '123 Willow Lane',
    unit: 'Unit 12A',
    residentName: 'John Smith',
    submittedAt: 'Jan 8, 2026 at 2:30 PM',
    type: 'photo_review' as const,
    suggestedViolation: {
      category: 'Lawn Maintenance',
      rule: 'Section 4.2 – Exterior Maintenance',
      excerpt: 'Lawns must be maintained at a height not exceeding 4 inches.',
      confidence: 92,
    },
    currentFixByDate: 'January 15, 2026',
  };

  const mockActivities = [
    {
      id: '1',
      type: 'photo_submitted' as const,
      title: 'Remediation photo submitted',
      description: 'Resident uploaded a photo showing completed lawn work.',
      timestamp: '2 hours ago',
      actor: 'John Smith',
      actorRole: 'resident' as const,
    },
    {
      id: '2',
      type: 'notice_sent' as const,
      title: 'Violation notice sent',
      timestamp: 'Jan 4, 2026',
      actor: 'System',
      actorRole: 'system' as const,
    },
    {
      id: '3',
      type: 'case_created' as const,
      title: 'Case created',
      description: 'Violation identified during community scan.',
      timestamp: 'Jan 3, 2026',
      actor: 'Sarah (HOA)',
      actorRole: 'hoa' as const,
    },
    {
      id: '4',
      type: 'comment_hoa_internal' as const,
      title: 'Internal note',
      description: 'Spoke with resident on phone. They said they will complete by this weekend.',
      timestamp: 'Jan 5, 2026',
      actor: 'Sarah',
      actorRole: 'hoa' as const,
      isInternal: true,
    },
  ];

  const handleActionClick = (action: ReviewAction) => {
    setSelectedAction(action);
    setShowDecisionNote(true);
  };

  const handleConfirmAction = () => {
    if (selectedAction) {
      onActionComplete?.(selectedAction);
    }
    setShowDecisionNote(false);
    setSelectedAction(null);
    setDecisionNote('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={20} color={colorsRGB.primary} />
          <Text style={styles.backText}>Back to Queue</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Property Info */}
        <View style={styles.propertyInfo}>
          <View style={styles.badges}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>Photo Review</Text>
            </View>
            <View style={styles.urgentBadge}>
              <Clock size={12} color="#EF4444" />
              <Text style={styles.urgentText}>4h left</Text>
            </View>
          </View>

          <Text style={styles.address}>{reviewData.address}</Text>
          <Text style={styles.unit}>
            {reviewData.unit} · {reviewData.residentName}
          </Text>
          <Text style={styles.submitted}>Submitted {reviewData.submittedAt}</Text>
        </View>

        {/* Submitted Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submitted Photo</Text>
          <View style={styles.photoContainer}>
            <ImageIcon size={64} color={colorsRGB.mutedForeground} />
            <TouchableOpacity style={styles.viewFullButton}>
              <Eye size={16} color="#FFFFFF" />
              <Text style={styles.viewFullText}>View Full</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Suggestion */}
        <View style={styles.section}>
          <View style={styles.aiSuggestion}>
            <View style={styles.aiHeader}>
              <AlertCircle size={20} color={colorsRGB.accent} />
              <Text style={styles.aiTitle}>AI SUGGESTION (HUMAN REVIEW REQUIRED)</Text>
            </View>

            <View style={styles.aiContent}>
              <View style={styles.aiItem}>
                <Text style={styles.aiLabel}>Suggested category</Text>
                <Text style={styles.aiValue}>{reviewData.suggestedViolation.category}</Text>
              </View>

              <View style={styles.aiItem}>
                <Text style={styles.aiLabel}>Cited rule</Text>
                <TouchableOpacity style={styles.ruleRow}>
                  <Text style={styles.ruleText}>{reviewData.suggestedViolation.rule}</Text>
                  <Edit3 size={16} color={colorsRGB.primary} />
                </TouchableOpacity>
                <Text style={styles.ruleExcerpt}>"{reviewData.suggestedViolation.excerpt}"</Text>
              </View>

              <View style={styles.confidenceRow}>
                <View style={styles.confidenceBar}>
                  <View
                    style={[
                      styles.confidenceFill,
                      { width: `${reviewData.suggestedViolation.confidence}%` },
                    ]}
                  />
                </View>
                <Text style={styles.confidenceText}>
                  {reviewData.suggestedViolation.confidence}% match
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fix-by Date */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.dateCard}>
            <View style={styles.dateIconContainer}>
              <Calendar size={20} color="#F59E0B" />
            </View>
            <View style={styles.dateContent}>
              <Text style={styles.dateLabel}>Fix-by date</Text>
              <Text style={styles.dateValue}>{reviewData.currentFixByDate}</Text>
            </View>
            <Edit3 size={20} color={colorsRGB.primary} />
          </TouchableOpacity>
        </View>

        {/* Decision Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Decision</Text>

          <View style={styles.actionsContainer}>
            <Button
              variant="default"
              size="full"
              onPress={() => handleActionClick('confirm')}
              style={[styles.actionButton, styles.approveButton]}
            >
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Approve Fix & Close Case</Text>
            </Button>

            <Button
              variant="outline"
              size="full"
              onPress={() => handleActionClick('dismiss')}
              style={[styles.actionButton, styles.rejectButton]}
            >
              <X size={20} color="#EF4444" />
              <Text style={styles.rejectButtonText}>Reject — Fix Not Acceptable</Text>
            </Button>

            <Button
              variant="outline"
              size="full"
              onPress={() => handleActionClick('request_info')}
              style={styles.actionButton}
            >
              <MessageSquare size={20} color={colorsRGB.primary} />
              <Text style={styles.requestButtonText}>Request More Information</Text>
            </Button>
          </View>
        </View>

        {/* Case Activity Feed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case Timeline</Text>

          <View style={styles.filterChips}>
            {(['all', 'messages', 'actions'] as ActivityFilter[]).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, activityFilter === filter && styles.filterChipActive]}
                onPress={() => setActivityFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activityFilter === filter && styles.filterChipTextActive,
                  ]}
                >
                  {filter === 'all' ? 'All' : filter === 'messages' ? 'Messages' : 'Actions'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CaseActivityFeed activities={mockActivities} viewerRole="hoa" filter={activityFilter} />
        </View>

        {/* Comment Composer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Comment or Note</Text>
          <CommentComposer viewerRole="hoa" />
        </View>
      </ScrollView>

      {/* Decision Note Modal */}
      <Modal
        visible={showDecisionNote}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDecisionNote(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedAction === 'confirm' && 'Approve Fix'}
              {selectedAction === 'dismiss' && 'Reject Fix'}
              {selectedAction === 'request_info' && 'Request Information'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {selectedAction === 'confirm' && 'Add a note for the resident about the approval.'}
              {selectedAction === 'dismiss' && 'Explain why the fix was not acceptable.'}
              {selectedAction === 'request_info' && 'What additional information do you need?'}
            </Text>

            <TextInput
              style={styles.modalTextArea}
              value={decisionNote}
              onChangeText={setDecisionNote}
              placeholder={
                selectedAction === 'confirm'
                  ? 'Great job! Your fix has been approved...'
                  : selectedAction === 'dismiss'
                  ? 'The submitted photo shows...'
                  : 'Please provide...'
              }
              placeholderTextColor={colorsRGB.mutedForeground}
              multiline
              numberOfLines={5}
            />

            <View style={styles.modalActions}>
              <Button
                variant={selectedAction === 'dismiss' ? 'outline' : 'default'}
                size="full"
                onPress={handleConfirmAction}
                style={[
                  styles.modalButton,
                  selectedAction === 'dismiss' && styles.modalRejectButton,
                ]}
              >
                <Send size={20} color="#FFFFFF" />
                <Text style={styles.modalButtonText}>
                  {selectedAction === 'confirm' && 'Approve & Notify Resident'}
                  {selectedAction === 'dismiss' && 'Reject & Notify Resident'}
                  {selectedAction === 'request_info' && 'Send Request'}
                </Text>
              </Button>

              <Button
                variant="ghost"
                size="full"
                onPress={() => {
                  setShowDecisionNote(false);
                  setSelectedAction(null);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
  propertyInfo: {
    marginBottom: 24,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  address: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 18,
    color: colorsRGB.mutedForeground,
    marginBottom: 4,
  },
  submitted: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  photoContainer: {
    aspectRatio: 4 / 3,
    backgroundColor: colorsRGB.muted,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  viewFullButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewFullText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  aiSuggestion: {
    backgroundColor: 'rgba(245, 243, 239, 0.5)',
    borderWidth: 1,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    padding: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.accent,
    letterSpacing: 0.5,
  },
  aiContent: {
    gap: 12,
  },
  aiItem: {
    gap: 4,
  },
  aiLabel: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  aiValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colorsRGB.foreground,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  ruleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  ruleExcerpt: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    fontStyle: 'italic',
    marginTop: 4,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: colorsRGB.muted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#4A9D7E',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.mutedForeground,
  },
  dateCard: {
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
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContent: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: colorsRGB
    .mutedForeground,
},
dateValue: {
fontSize: 16,
fontWeight: '600',
color: colorsRGB.foreground,
marginTop: 2,
},
actionsContainer: {
gap: 12,
},
actionButton: {
marginTop: 0,
},
approveButton: {
backgroundColor: '#4A9D7E',
},
rejectButton: {
borderColor: '#EF4444',
},
actionButtonText: {
fontSize: 18,
fontWeight: '500',
color: '#FFFFFF',
},
rejectButtonText: {
fontSize: 18,
fontWeight: '500',
color: '#EF4444',
},
requestButtonText: {
fontSize: 18,
fontWeight: '500',
color: colorsRGB.primary,
},
filterChips: {
flexDirection: 'row',
gap: 8,
marginBottom: 16,
},
filterChip: {
paddingHorizontal: 16,
paddingVertical: 8,
borderRadius: 20,
backgroundColor: colorsRGB.secondary,
},
filterChipActive: {
backgroundColor: colorsRGB.primary,
},
filterChipText: {
fontSize: 14,
fontWeight: '500',
color: colorsRGB.secondaryForeground,
},
filterChipTextActive: {
color: colorsRGB.primaryForeground,
},
modalOverlay: {
flex: 1,
backgroundColor: 'rgba(0, 0, 0, 0.5)',
justifyContent: 'flex-end',
},
modalContent: {
backgroundColor: colorsRGB.card,
borderTopLeftRadius: 24,
borderTopRightRadius: 24,
padding: 24,
paddingBottom: 40,
},
modalTitle: {
fontSize: 20,
fontWeight: '400',
color: colorsRGB.foreground,
marginBottom: 8,
letterSpacing: -0.3,
},
modalSubtitle: {
fontSize: 16,
color: colorsRGB.mutedForeground,
marginBottom: 16,
lineHeight: 22,
},
modalTextArea: {
minHeight: 120,
padding: 16,
backgroundColor: 'rgba(245, 243, 239, 0.5)',
borderWidth: 1,
borderColor: colorsRGB.border,
borderRadius: 12,
fontSize: 16,
color: colorsRGB.foreground,
textAlignVertical: 'top',
marginBottom: 16,
},
modalActions: {
gap: 12,
},
modalButton: {
marginTop: 0,
},
modalRejectButton: {
backgroundColor: '#EF4444',
},
modalButtonText: {
fontSize: 18,
fontWeight: '500',
color: '#FFFFFF',
},
modalCancelText: {
fontSize: 18,
fontWeight: '500',
color: colorsRGB.primary,
},
});
