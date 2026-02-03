import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import {
  ArrowLeft,
  Camera,
  MapPin,
  FileText,
  CheckCircle,
  Send,
  X,
  User,
  Calendar,
  Scale,
  RefreshCw,
  MoreVertical,
  Clock,
  Lock,
} from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { CaseActivityFeed } from '../../components/timeline/CaseActivityFeed';
import { colorsRGB } from '../../theme/colors';

interface HOACaseDetailScreenProps {
  caseId?: string;
  onBack: () => void;
  onActionComplete?: () => void;
}

export default function HOACaseDetailScreen({
  caseId,
  onBack,
  onActionComplete,
}: HOACaseDetailScreenProps) {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const caseData = {
    id: caseId || 'case-1',
    title: 'Lawn Maintenance Required',
    address: '123 Oak Street, Unit A',
    residentName: 'John Smith',
    status: 'needs-review' as const,
    statusLabel: 'Needs Review',
    priority: 'high' as const,
    category: 'Exterior / Landscaping',
    dueDate: 'Jan 15, 2026',
    createdDate: 'Jan 2, 2026',
    isOverdue: false,
    isDueSoon: true,
    rule: 'Section 4.1 – All lawns must be maintained at a height not exceeding 4 inches.',
  };

  const photos = [
    { id: '1', url: 'https://via.placeholder.com/200', type: 'original', date: 'Jan 2' },
    { id: '2', url: 'https://via.placeholder.com/200', type: 'remediation', date: 'Jan 10' },
  ];

  const activities = [
    {
      id: '1',
      type: 'case_created' as const,
      title: 'Case created from scan',
      timestamp: 'Jan 2, 10:30 AM',
      actorRole: 'system' as const,
    },
    {
      id: '2',
      type: 'decision_made' as const,
      title: 'Violation confirmed',
      description: 'Notice sent to resident.',
      timestamp: 'Jan 2, 11:00 AM',
      actor: 'Sarah J.',
      actorRole: 'hoa' as const,
    },
    {
      id: '3',
      type: 'status_change' as const,
      title: 'Status changed to Sent',
      timestamp: 'Jan 2, 11:00 AM',
      metadata: { newStatus: 'Sent' },
    },
    {
      id: '4',
      type: 'comment_resident' as const,
      title: 'Resident message',
      description: "I've scheduled lawn service for this weekend. Will submit photos after.",
      timestamp: 'Jan 5, 2:15 PM',
      actor: 'John S.',
      actorRole: 'resident' as const,
    },
    {
      id: '5',
      type: 'comment_hoa_public' as const,
      title: 'HOA response',
      description: 'Thank you for the update. Please submit remediation photos by Jan 15.',
      timestamp: 'Jan 5, 3:00 PM',
      actor: 'Sarah J.',
      actorRole: 'hoa' as const,
    },
    {
      id: '6',
      type: 'comment_hoa_internal' as const,
      title: 'Internal note',
      description: 'Resident has history of timely compliance. Low risk.',
      timestamp: 'Jan 5, 3:05 PM',
      actor: 'Sarah J.',
      actorRole: 'hoa' as const,
      isInternal: true,
    },
    {
      id: '7',
      type: 'photo_submitted' as const,
      title: 'Remediation photo submitted',
      timestamp: 'Jan 10, 9:00 AM',
      actor: 'John S.',
      actorRole: 'resident' as const,
    },
  ];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    console.log(isInternalNote ? 'Internal note:' : 'Message to resident:', messageText);
    setMessageText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color={colorsRGB.foreground} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {caseData.title}
          </Text>
          <View style={styles.headerBadges}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{caseData.statusLabel}</Text>
            </View>
            {caseData.isDueSoon && <Text style={styles.dueSoonText}>Due soon</Text>}
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowActionMenu(true)}>
          <MoreVertical size={20} color={colorsRGB.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MapPin size={16} color={colorsRGB.mutedForeground} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{caseData.address}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <User size={16} color={colorsRGB.mutedForeground} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Resident</Text>
              <Text style={styles.infoValue}>{caseData.residentName}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={16} color={colorsRGB.mutedForeground} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Due Date</Text>
              <Text style={styles.infoValue}>{caseData.dueDate}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <FileText size={16} color={colorsRGB.mutedForeground} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Rule Citation</Text>
              <Text style={styles.infoValue}>{caseData.rule}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evidence Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosContainer}>
            {photos.map((photo) => (
              <View key={photo.id} style={styles.photoWrapper}>
                <Image source={{ uri: photo.url }} style={styles.photo} />
                <View
                  style={[
                    styles.photoLabel,
                    photo.type === 'remediation' && styles.photoLabelRemediation,
                  ]}
                >
                  <Text style={[styles.photoLabelText, photo.type === 'remediation' && styles.photoLabelTextRemediation]}>
                    {photo.type === 'original' ? 'Original' : 'Fix'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
              <CheckCircle size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonTextPrimary}>Approve Fix</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <X size={16} color={colorsRGB.primary} />
              <Text style={styles.actionButtonText}>Reject Fix</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <RefreshCw size={16} color={colorsRGB.primary} />
              <Text style={styles.actionButtonText}>Request More</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <FileText size={16} color={colorsRGB.primary} />
              <Text style={styles.actionButtonText}>Send Notice</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case Timeline</Text>
          <CaseActivityFeed activities={activities} viewerRole="hoa" />
        </View>
      </ScrollView>

      <View style={styles.composer}>
        <View style={styles.composerToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, !isInternalNote && styles.toggleButtonActive]}
            onPress={() => setIsInternalNote(false)}
          >
            <Text style={[styles.toggleText, !isInternalNote && styles.toggleTextActive]}>
              Message resident
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, isInternalNote && styles.toggleButtonInternal]}
            onPress={() => setIsInternalNote(true)}
          >
            <Text style={[styles.toggleText, isInternalNote && styles.toggleTextInternal]}>
              Internal note
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.composerInput}>
          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
            placeholder={isInternalNote ? 'Add internal note...' : 'Message to resident...'}
            placeholderTextColor={colorsRGB.mutedForeground}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showActionMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionMenu(false)}
        >
          <View style={styles.actionMenu}>
            <TouchableOpacity style={styles.menuItem}>
              <Scale size={16} color={colorsRGB.foreground} />
              <Text style={styles.menuItemText}>Escalate to board</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <User size={16} color={colorsRGB.foreground} />
              <Text style={styles.menuItemText}>Assign owner</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Clock size={16} color={colorsRGB.foreground} />
              <Text style={styles.menuItemText}>Extend deadline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <X size={16} color="#EF4444" />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Close case</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorsRGB.border,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.3,
  },
  headerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
  },
  dueSoonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F59E0B',
  },
  menuButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 180,
  },
  infoCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  photosContainer: {
    gap: 12,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 112,
    height: 112,
    borderRadius: 12,
    backgroundColor: colorsRGB.secondary,
  },
  photoLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: colorsRGB.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  photoLabelRemediation: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  photoLabelText: {
    fontSize: 12,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  photoLabelTextRemediation: {
    color: '#3B82F6',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    flex: 1,
    minWidth: '47%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colorsRGB.card,
    borderWidth: 2,
    borderColor: colorsRGB.border,
  },
  actionButtonPrimary: {
    backgroundColor: colorsRGB.primary,
    borderColor: colorsRGB.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
  actionButtonTextPrimary: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  composer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colorsRGB.background,
    borderTopWidth: 1,
    borderTopColor: colorsRGB.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 32,
  },
  composerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: colorsRGB.secondary,
  },
  toggleButtonActive: {
    backgroundColor: colorsRGB.primary,
  },
  toggleButtonInternal: {
    backgroundColor: '#F59E0B',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '500',
    color: colorsRGB.secondaryForeground,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  toggleTextInternal: {
    color: '#FFFFFF',
  },
  composerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: colorsRGB.secondary,
    borderRadius: 12,
    fontSize: 16,
    color: colorsRGB.foreground,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colorsRGB.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingRight: 20,
  },
  actionMenu: {
    backgroundColor: colorsRGB.card,
    borderRadius: 12,
    padding: 8,
    marginLeft: 'auto',
    minWidth: 192,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 14,
    color: colorsRGB.foreground,
  },
  menuItemTextDanger: {
    color: '#EF4444',
  },
});
