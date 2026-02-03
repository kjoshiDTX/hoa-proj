import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Switch,
} from 'react-native';
import {
  ChevronRight,
  Plus,
  Bell,
  Clock,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Link,
  Send,
  Save,
  Eye,
  Trash2,
  Building2,
  Wrench,
  Shield,
  CreditCard,
  BookOpen,
  HelpCircle,
  Calendar,
  ChevronLeft,
} from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

type NoticeView = 'list' | 'compose' | 'preview' | 'scheduled' | 'success';

interface Notice {
  id: string;
  title: string;
  summary: string;
  category: string;
  status: 'draft' | 'scheduled' | 'posted';
  postedAt?: string;
  scheduledFor?: string;
  urgency: 'normal' | 'important' | 'urgent';
}

interface HOANoticesScreenProps {
  onBack?: () => void;
}

const categories = [
  { id: 'trash', label: 'Trash & Recycling', icon: Trash2 },
  { id: 'amenities', label: 'Amenities', icon: Building2 },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'safety', label: 'Safety & Security', icon: Shield },
  { id: 'meetings', label: 'Meetings & Events', icon: Calendar },
  { id: 'dues', label: 'Payments & Dues', icon: CreditCard },
  { id: 'rules', label: 'Rules & Compliance', icon: BookOpen },
  { id: 'other', label: 'Other', icon: HelpCircle },
];

const affectedOptions = [
  { id: 'everyone', label: 'Everyone' },
  { id: 'specific-streets', label: 'Specific streets/buildings' },
  { id: 'pool-users', label: 'Pool users' },
  { id: 'unpaid-dues', label: 'Unpaid dues' },
  { id: 'custom', label: 'Custom' },
];

const actionDestinations = [
  { id: 'none', label: 'No action link' },
  { id: 'ticket', label: 'Create a ticket' },
  { id: 'dues', label: 'Pay dues' },
  { id: 'details', label: 'View details' },
  { id: 'sage', label: 'Open Sage' },
];

const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Holiday Trash Schedule Change',
    summary: 'Collection moved to Monday, Jan 6',
    category: 'trash',
    status: 'posted',
    postedAt: '2h ago',
    urgency: 'important',
  },
  {
    id: '2',
    title: 'Pool Maintenance Reminder',
    summary: 'Pool closed Jan 8-10 for cleaning',
    category: 'amenities',
    status: 'posted',
    postedAt: '1d ago',
    urgency: 'normal',
  },
  {
    id: '3',
    title: 'Q1 Dues Reminder',
    summary: 'First quarter dues due January 15th',
    category: 'dues',
    status: 'scheduled',
    scheduledFor: 'Jan 10, 9:00 AM',
    urgency: 'important',
  },
];

export default function HOANoticesScreen({ onBack }: HOANoticesScreenProps) {
  const [view, setView] = useState<NoticeView>('list');
  const [notices] = useState<Notice[]>(mockNotices);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    summary: '',
    details: '',
    affected: 'everyone',
    startDate: '',
    startTime: '',
    endDate: '',
    actionRequired: false,
    actionText: '',
    actionDeadline: '',
    actionDestination: 'none',
    urgency: 'normal' as 'normal' | 'important' | 'urgent',
    delivery: 'in-app',
  });

  const handleCreateNotice = () => {
    setFormData({
      title: '',
      category: '',
      summary: '',
      details: '',
      affected: 'everyone',
      startDate: '',
      startTime: '',
      endDate: '',
      actionRequired: false,
      actionText: '',
      actionDeadline: '',
      actionDestination: 'none',
      urgency: 'normal',
      delivery: 'in-app',
    });
    setView('compose');
  };

  if (view === 'compose') {
    return (
      <NoticeComposer
        formData={formData}
        setFormData={setFormData}
        onBack={() => setView('list')}
        onPreview={() => setView('preview')}
        onSaveDraft={() => setView('list')}
      />
    );
  }

  if (view === 'preview') {
    return (
      <NoticePreview
        formData={formData}
        onBack={() => setView('compose')}
        onPost={() => setView('success')}
        onSchedule={() => setView('scheduled')}
      />
    );
  }

  if (view === 'scheduled') {
    return (
      <ScheduledConfirmation
        onViewScheduled={() => setView('list')}
        onCreateAnother={handleCreateNotice}
      />
    );
  }

  if (view === 'success') {
    return (
      <PostedConfirmation
        onViewNotices={() => setView('list')}
        onCreateAnother={handleCreateNotice}
      />
    );
  }

  const postedNotices = notices.filter((n) => n.status === 'posted');
  const scheduledNotices = notices.filter((n) => n.status === 'scheduled');
  const draftNotices = notices.filter((n) => n.status === 'draft');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={20} color={colorsRGB.mutedForeground} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Notices</Text>
            <Text style={styles.subtitle}>Manage community announcements</Text>
          </View>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateNotice}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {scheduledNotices.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={12} color={colorsRGB.mutedForeground} />
              <Text style={styles.sectionTitle}>SCHEDULED</Text>
            </View>
            {scheduledNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </View>
        )}

        {postedNotices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>POSTED</Text>
            {postedNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </View>
        )}

        {draftNotices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DRAFTS</Text>
            {draftNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </View>
        )}

        {notices.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Bell size={32} color={colorsRGB.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>No notices yet</Text>
            <Text style={styles.emptyText}>Post your first community announcement.</Text>
            <Button variant="default" size="full" onPress={handleCreateNotice}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Create Notice</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function NoticeCard({ notice }: { notice: Notice }) {
  const borderColor =
    notice.urgency === 'urgent'
      ? '#EF4444'
      : notice.urgency === 'important'
      ? '#F59E0B'
      : 'transparent';

  return (
    <TouchableOpacity style={[styles.noticeCard, { borderLeftColor: borderColor }]}>
      <View style={styles.noticeContent}>
        <View style={styles.noticeHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{notice.category}</Text>
          </View>
          {notice.status === 'scheduled' && (
            <View style={styles.scheduledBadge}>
              <Clock size={12} color={colorsRGB.mutedForeground} />
              <Text style={styles.scheduledText}>{notice.scheduledFor}</Text>
            </View>
          )}
        </View>

        <Text style={styles.noticeTitle}>{notice.title}</Text>
        <Text style={styles.noticeSummary} numberOfLines={1}>
          {notice.summary}
        </Text>
      </View>

      {notice.postedAt && <Text style={styles.noticeTime}>{notice.postedAt}</Text>}

      <ChevronRight size={20} color={colorsRGB.mutedForeground} />
    </TouchableOpacity>
  );
}

// Composer, Preview, and Confirmation components would continue similarly...
// Due to length, I'll create them as separate components

function NoticeComposer({ formData, setFormData, onBack, onPreview, onSaveDraft }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={20} color={colorsRGB.mutedForeground} />
          <Text style={styles.backText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Post a Notice</Text>
        <Text style={styles.subtitle}>Create a community announcement</Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Short and specific..."
            placeholderTextColor={colorsRGB.mutedForeground}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
          <Text style={styles.helper}>Short and specific.</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    formData.category === cat.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, category: cat.id })}
                >
                  <IconComponent
                    size={20}
                    color={formData.category === cat.id ? colorsRGB.primary : colorsRGB.accent}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      formData.category === cat.id && styles.categoryLabelActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Quick Summary *</Text>
          <TextInput
            style={styles.input}
            placeholder="One sentence residents can scan..."
            placeholderTextColor={colorsRGB.mutedForeground}
            value={formData.summary}
            onChangeText={(text) => setFormData({ ...formData, summary: text })}
          />
          <Text style={styles.helper}>One sentence residents can scan.</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Details (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional information..."
            placeholderTextColor={colorsRGB.mutedForeground}
            value={formData.details}
            onChangeText={(text) => setFormData({ ...formData, details: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Urgency</Text>
          <View style={styles.urgencyButtons}>
            {(['normal', 'important', 'urgent'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.urgencyButton,
                  formData.urgency === level && styles.urgencyButtonActive,
                  formData.urgency === level && level === 'urgent' && styles.urgencyButtonUrgent,
                  formData.urgency === level &&
                    level === 'important' &&
                    styles.urgencyButtonImportant,
                ]}
                onPress={() => setFormData({ ...formData, urgency: level })}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    formData.urgency === level && styles.urgencyTextActive,
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.composerActions}>
        <Button variant="outline" size="full" onPress={onSaveDraft} style={styles.actionButton}>
          <Save size={16} color={colorsRGB.primary} />
          <Text style={styles.actionButtonOutlineText}>Save Draft</Text>
        </Button>
        <Button
          variant="default"
          size="full"
          onPress={onPreview}
          disabled={!formData.title || !formData.category || !formData.summary}
          style={styles.actionButton}
        >
          <Eye size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Preview</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

function NoticePreview({ formData, onBack, onPost, onSchedule }: any) {
  const category = categories.find((c) => c.id === formData.category);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={20} color={colorsRGB.mutedForeground} />
          <Text style={styles.backText}>Edit</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Preview Notice</Text>
        <Text style={styles.subtitle}>This is how residents will see it</Text>

        <View
          style={[
            styles.previewCard,
            formData.urgency === 'urgent' && styles.previewCardUrgent,
            formData.urgency === 'important' && styles.previewCardImportant,
          ]}
        >
          <View style={styles.previewHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category?.label || formData.category}</Text>
            </View>
            {formData.urgency !== 'normal' && (
              <View
                style={[
                  styles.urgencyBadge,
                  formData.urgency === 'urgent' && styles.urgencyBadgeUrgent,
                  formData.urgency === 'important' && styles.urgencyBadgeImportant,
                ]}
              >
                <Text
                  style={[
                    styles.urgencyBadgeText,
                    formData.urgency === 'urgent' && styles.urgencyBadgeTextUrgent,
                    formData.urgency === 'important' && styles.urgencyBadgeTextImportant,
                  ]}
                >
                  {formData.urgency}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.previewTitle}>{formData.title || 'Notice Title'}</Text>
          <Text style={styles.previewSummary}>
            {formData.summary || 'Notice summary will appear here.'}
          </Text>

          {formData.details && <Text style={styles.previewDetails}>{formData.details}</Text>}

          <View style={styles.previewMeta}>
            <Text style={styles.previewMetaText}>Posted by HOA</Text>
            <Text style={styles.previewMetaText}>·</Text>
            <Text style={styles.previewMetaText}>Just now</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.composerActions}>
        <Button variant="outline" size="full" onPress={onSchedule} style={styles.actionButton}>
          <Calendar size={16} color={colorsRGB.primary} />
          <Text style={styles.actionButtonOutlineText}>Schedule</Text>
        </Button>
        <Button variant="default" size="full" onPress={onPost} style={styles.actionButton}>
          <Send size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Post Now</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

function PostedConfirmation({ onViewNotices, onCreateAnother }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.confirmationContainer}>
        <View style={styles.confirmationIcon}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <Text style={styles.confirmationTitle}>Notice Posted</Text>
        <Text style={styles.confirmationText}>
          Your notice has been published and residents have been notified.
        </Text>

        <Button variant="default" size="full" onPress={onViewNotices} style={styles.confirmationButton}>
          <Text style={styles.buttonText}>View All Notices</Text>
        </Button>
        <Button variant="ghost" size="full" onPress={onCreateAnother}>
          <Text style={styles.ghostButtonText}>Create Another</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

function ScheduledConfirmation({ onViewScheduled, onCreateAnother }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.confirmationContainer}>
        <View style={[styles.confirmationIcon, { backgroundColor: 'rgba(74, 157, 126, 0.2)' }]}>
          <Calendar size={40} color={colorsRGB.accent} />
        </View>
        <Text style={styles.confirmationTitle}>Notice Scheduled</Text>
        <Text style={styles.confirmationText}>
          Your notice will be posted at the scheduled time.
        </Text>

        <Button variant="default" size="full" onPress={onViewScheduled} style={styles.confirmationButton}>
          <Text style={styles.buttonText}>View Scheduled Notices</Text>
        </Button>
        <Button variant="ghost" size="full" onPress={onCreateAnother}>
          <Text style={styles.ghostButtonText}>Create Another</Text>
        </Button>
      </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    marginLeft: -8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colorsRGB.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  noticeContent: {
    flex: 1,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: 'rgba(74, 157, 126, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.accent,
    textTransform: 'capitalize',
  },
  scheduledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduledText: {
    fontSize: 12,
    fontWeight: '500',
    color: colorsRGB.mutedForeground,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 4,
  },
  noticeSummary: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  noticeTime: {
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
    borderRadius: 16,
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
    marginBottom: 24,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colorsRGB.secondary,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    color: colorsRGB.foreground,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helper: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    backgroundColor: colorsRGB.secondary,
  },
  categoryButtonActive: {
    borderColor: colorsRGB.primary,
    backgroundColor: 'rgba(44, 62, 80, 0.05)',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.foreground,
    flex: 1,
  },
  categoryLabelActive: {
    color: colorsRGB.primary,
  },
  urgencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
  },
  urgencyButtonActive: {
    backgroundColor: colorsRGB.primary,
  },
  urgencyButtonUrgent: {
    backgroundColor: '#EF4444',
  },
  urgencyButtonImportant: {
    backgroundColor: '#F59E0B',
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.secondaryForeground,
    textTransform: 'capitalize',
  },
  urgencyTextActive: {
    color: '#FFFFFF',
  },
  composerActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: colorsRGB.background,
    borderTopWidth: 1,
    borderTopColor: colorsRGB.border,
    paddingBottom: 32,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  actionButtonOutlineText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
  previewCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  previewCardUrgent: {
    borderLeftColor: '#EF4444',
  },
  previewCardImportant: {
    borderLeftColor: '#F59E0B',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgencyBadgeUrgent: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  urgencyBadgeImportant: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  urgencyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  urgencyBadgeTextUrgent: {
    color: '#EF4444',
  },
  urgencyBadgeTextImportant: {
    color: '#F59E0B',
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  previewSummary: {
    fontSize: 18,
    color: colorsRGB.foreground,
    marginBottom: 16,
    lineHeight: 24,
  },
  previewDetails: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginBottom: 16,
    lineHeight: 22,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
previewMetaText: {
fontSize: 14,
color: colorsRGB.mutedForeground,
},
confirmationContainer: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
paddingHorizontal: 20,
},
confirmationIcon: {
width: 80,
height: 80,
borderRadius: 40,
backgroundColor: 'rgba(74, 157, 126, 0.2)',
alignItems: 'center',
justifyContent: 'center',
marginBottom: 24,
},
checkmark: {
fontSize: 40,
color: '#4A9D7E',
},
confirmationTitle: {
fontSize: 28,
fontWeight: '400',
color: colorsRGB.foreground,
marginBottom: 8,
letterSpacing: -0.5,
},
confirmationText: {
fontSize: 18,
color: colorsRGB.mutedForeground,
textAlign: 'center',
marginBottom: 32,
maxWidth: 320,
lineHeight: 24,
},
confirmationButton: {
marginBottom: 12,
},
buttonText: {
fontSize: 18,
fontWeight: '500',
color: '#FFFFFF',
},
ghostButtonText: {
fontSize: 18,
fontWeight: '500',
color: colorsRGB.primary,
},
});
