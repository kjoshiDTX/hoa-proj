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
  Camera,
  X,
  Check,
  AlertTriangle,
  ChevronDown,
  BookOpen,
  Calendar,
  MessageSquare,
  Send,
  ArrowLeft,
  RefreshCw,
  Edit2,
} from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

type ScanStep = 'camera' | 'reviewing' | 'results';

interface ScanResult {
  flagged: boolean;
  confidence: 'low' | 'medium' | 'high';
  reason: string;
  citations: Array<{
    section: string;
    title: string;
    page: number;
  }>;
}

interface HOAScanScreenProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export default function HOAScanScreen({ onBack, onComplete }: HOAScanScreenProps) {
  const [step, setStep] = useState<ScanStep>('camera');
  const [showCitation, setShowCitation] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [note, setNote] = useState('');

  const result: ScanResult = {
    flagged: true,
    confidence: 'high',
    reason:
      'Lawn height exceeds community standards. The grass appears to be over 6 inches, which is above the 4-inch maximum.',
    citations: [
      {
        section: 'Section 4.2',
        title: 'Exterior Maintenance',
        page: 12,
      },
    ],
  };

  const handleCapture = () => {
    setStep('reviewing');
    setTimeout(() => {
      setStep('results');
    }, 2000);
  };

  const handleConfirmAndSend = () => {
    onComplete?.();
  };

  if (step === 'camera') {
    return (
      <View style={styles.cameraContainer}>
        <SafeAreaView style={styles.cameraHeader}>
          <TouchableOpacity style={styles.cancelButton} onPress={onBack}>
            <ArrowLeft size={24} color="#FFFFFF" />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <View style={styles.cameraViewfinder}>
          <View style={styles.viewfinderFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>

          <View style={styles.cameraInstructions}>
            <Camera size={64} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.instructionTitle}>Point camera at violation</Text>
            <Text style={styles.instructionSubtitle}>Make sure the issue is clearly visible</Text>
          </View>
        </View>

        <View style={styles.captureButtonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === 'reviewing') {
    return (
      <View style={styles.reviewingContainer}>
        <View style={styles.reviewingIcon}>
          <RefreshCw size={32} color={colorsRGB.primary} />
        </View>
        <Text style={styles.reviewingTitle}>Analyzing Photo</Text>
        <Text style={styles.reviewingSubtitle}>Checking for potential violations...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={20} color={colorsRGB.primary} />
          <Text style={styles.backText}>Scan Again</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoPreview}>
          <Camera size={48} color={colorsRGB.mutedForeground} />
          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeText}>Photo captured</Text>
          </View>
        </View>

        <View
          style={[
            styles.resultCard,
            result.flagged ? styles.resultCardFlagged : styles.resultCardSuccess,
          ]}
        >
          <View
            style={[
              styles.resultIcon,
              result.flagged ? styles.resultIconFlagged : styles.resultIconSuccess,
            ]}
          >
            {result.flagged ? (
              <AlertTriangle size={28} color="#EF4444" />
            ) : (
              <Check size={28} color="#4A9D7E" />
            )}
          </View>
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle}>
              {result.flagged ? 'Potential Violation' : 'No Issues Found'}
            </Text>
            <Text style={styles.resultConfidence}>
              Confidence: {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)}
            </Text>
          </View>
        </View>

        {result.flagged && (
          <>
            <View style={styles.warningCard}>
              <AlertTriangle size={20} color="#F59E0B" />
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>Human Review Required</Text>
                <Text style={styles.warningText}>
                  AI suggestions need your confirmation before sending to residents.
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Why It Was Flagged</Text>
              <Text style={styles.reasonText}>{result.reason}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Related Rules</Text>
              {result.citations.map((citation, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.citationCard}
                  onPress={() => setShowCitation(!showCitation)}
                >
                  <View style={styles.citationContent}>
                    <BookOpen size={20} color={colorsRGB.accent} />
                    <Text style={styles.citationText}>
                      {citation.section} – {citation.title}
                    </Text>
                  </View>
                  <ChevronDown
                    size={20}
                    color={colorsRGB.mutedForeground}
                    style={showCitation && styles.chevronRotated}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Actions</Text>

              <View style={styles.actionCard}>
                <View style={styles.actionLabel}>
                  <Calendar size={20} color={colorsRGB.mutedForeground} />
                  <Text style={styles.actionLabelText}>Set Fix-By Date</Text>
                </View>
                <TextInput
                  style={styles.dateInput}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={colorsRGB.mutedForeground}
                />
              </View>

              <View style={styles.actionCard}>
                <View style={styles.actionLabel}>
                  <MessageSquare size={20} color={colorsRGB.mutedForeground} />
                  <Text style={styles.actionLabelText}>Add Note (Optional)</Text>
                </View>
                <TextInput
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add any additional context..."
                  placeholderTextColor={colorsRGB.mutedForeground}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.actions}>
              <Button
                variant="default"
                size="full"
                onPress={handleConfirmAndSend}
                style={[styles.actionButton, styles.confirmButton]}
              >
                <Send size={20} color="#FFFFFF" />
                <Text style={styles.confirmButtonText}>Confirm & Send Notice</Text>
              </Button>

              <View style={styles.secondaryActions}>
                <Button variant="outline" size="sm" style={styles.secondaryButton}>
                  <Edit2 size={20} color={colorsRGB.primary} />
                  <Text style={styles.secondaryButtonText}>Edit Rules</Text>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={onBack}
                  style={styles.secondaryButton}
                >
                  <X size={20} color={colorsRGB.primary} />
                  <Text style={styles.secondaryButtonText}>Dismiss</Text>
                </Button>
              </View>
            </View>
          </>
        )}

        {!result.flagged && (
          <View style={styles.noIssuesContainer}>
            <Text style={styles.noIssuesText}>No violations were detected in this photo.</Text>
            <Button variant="default" size="full" onPress={onBack}>
              <Camera size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Scan Another</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraHeader: {
    zIndex: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 48,
  },
  cancelText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  cameraViewfinder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  viewfinderFrame: {
    position: 'absolute',
    top: 32,
    bottom: 32,
    left: 32,
    right: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FFFFFF',
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FFFFFF',
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FFFFFF',
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FFFFFF',
    borderBottomRightRadius: 12,
  },
  cameraInstructions: {
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 16,
  },
  instructionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  captureButtonContainer: {
    padding: 32,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#000000',
  },
  reviewingContainer: {
    flex: 1,
    backgroundColor: colorsRGB.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  reviewingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(44, 62, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  reviewingTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  reviewingSubtitle: {
    fontSize: 18,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
  },
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
  photoPreview: {
    aspectRatio: 4 / 3,
    backgroundColor: colorsRGB.muted,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  photoBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  photoBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resultCardFlagged: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  resultCardSuccess: {
    backgroundColor: 'rgba(74, 157, 126, 0.05)',
    borderColor: 'rgba(74, 157, 126, 0.3)',
  },
  resultIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultIconFlagged: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  resultIconSuccess: {
    backgroundColor: 'rgba(74, 157, 126, 0.15)',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  resultConfidence: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginTop: 2,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  reasonText: {
    fontSize: 18,
    color: colorsRGB.foreground,
    lineHeight: 26,
  },
  citationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colorsRGB.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  citationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  citationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  actionCard: {
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
  actionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  actionLabelText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  dateInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colorsRGB.secondary,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    fontSize: 18,
    color: colorsRGB.foreground,
  },
  noteInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colorsRGB.secondary,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    fontSize: 18,
    color: colorsRGB.foreground,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    marginTop: 0,
  },
  confirmButton: {
    backgroundColor: '#4A9D7E',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    marginTop: 0,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
  noIssuesContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noIssuesText: {
    fontSize: 18,
    color: colorsRGB.mutedForeground,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
