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
  AlertCircle,
  FileText,
  Wrench,
  Building2,
  CreditCard,
  Key,
  Package,
  Paintbrush,
  HelpCircle,
  ChevronRight,
  Lightbulb,
  Trees,
  Phone,
  Volume2,
  Sparkles,
  Camera,
  CheckCircle,
} from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

type ReportView = 'home' | 'select-type' | 'new-ticket' | 'my-tickets' | 'confirmation';

interface IssueType {
  id: string;
  title: string;
  description: string;
  examples: string;
  icon: any;
}

interface ResidentReportScreenProps {
  onNavigate?: (view: string) => void;
  onOpenSage?: () => void;
}

const issueTypes: IssueType[] = [
  {
    id: 'maintenance',
    title: 'Maintenance / Repairs',
    description: 'Something in the community needs fixing.',
    examples: 'Streetlight out, pothole, irrigation leak, broken gate, damaged sign',
    icon: Wrench,
  },
  {
    id: 'amenity',
    title: 'Amenity Request',
    description: 'Help with pool, clubhouse, gym, or bookings.',
    examples: 'Booking questions, deposit questions, damage report',
    icon: Building2,
  },
  {
    id: 'account',
    title: 'Account / Admin Help',
    description: 'Help with payments, profile, or app settings.',
    examples: 'Pay dues, update email/phone, not receiving notices',
    icon: CreditCard,
  },
  {
    id: 'security',
    title: 'Security & Access',
    description: 'Gate codes, key fobs, callbox, or guest access.',
    examples: 'Key fob not working, gate stuck, callbox issue',
    icon: Key,
  },
  {
    id: 'package',
    title: 'Lost Package / Found Item',
    description: 'Report a missing package or something you found.',
    examples: 'Missing delivery, found a package by mailboxes',
    icon: Package,
  },
  {
    id: 'acc',
    title: 'Architectural / ACC Request',
    description: 'Request approval for exterior changes.',
    examples: 'Paint, fence, landscaping changes, solar panels',
    icon: Paintbrush,
  },
  {
    id: 'other',
    title: 'Other',
    description: "Not sure which one fits? Choose this.",
    examples: '',
    icon: HelpCircle,
  },
];

const quickIssues = [
  { id: 'streetlight', label: 'Streetlight out', icon: Lightbulb, typeId: 'maintenance' },
  { id: 'landscaping', label: 'Landscaping', icon: Trees, typeId: 'maintenance' },
  { id: 'gate', label: 'Gate/key fob', icon: Key, typeId: 'security' },
  { id: 'pool', label: 'Pool/clubhouse', icon: Building2, typeId: 'amenity' },
  { id: 'noise', label: 'Noise concern', icon: Volume2, typeId: 'other' },
  { id: 'package', label: 'Lost package', icon: Package, typeId: 'package' },
  { id: 'approval', label: 'Request approval', icon: Paintbrush, typeId: 'acc' },
];

export default function ResidentReportScreen({ onNavigate, onOpenSage }: ResidentReportScreenProps) {
  const [view, setView] = useState<ReportView>('home');
  const [selectedIssueType, setSelectedIssueType] = useState<string | null>(null);
  const [preselectedType, setPreselectedType] = useState<string | null>(null);

  const handleReportIssue = () => {
    setPreselectedType(null);
    setView('select-type');
  };

  const handleQuickIssue = (typeId: string) => {
    setPreselectedType(typeId);
    setView('select-type');
  };

  const handleSelectIssueType = (typeId: string) => {
    setSelectedIssueType(typeId);
    setView('new-ticket');
  };

  const handleSubmitTicket = () => {
    setView('confirmation');
  };

  const handleBackToHome = () => {
    setView('home');
    setSelectedIssueType(null);
    setPreselectedType(null);
  };

  if (view === 'select-type') {
    return (
      <SelectIssueType
        preselectedType={preselectedType}
        onSelect={handleSelectIssueType}
        onBack={handleBackToHome}
        onOpenSage={onOpenSage}
      />
    );
  }

  if (view === 'new-ticket') {
    return (
      <IssueDetailsForm
        issueType={selectedIssueType || 'other'}
        onBack={() => setView('select-type')}
        onSubmit={handleSubmitTicket}
      />
    );
  }

  if (view === 'confirmation') {
    return (
      <TicketConfirmation
        onViewTickets={() => setView('my-tickets')}
        onSubmitAnother={handleBackToHome}
      />
    );
  }

  if (view === 'my-tickets') {
    return (
      <ResidentMyTickets
        onBack={handleBackToHome}
        onTicketClick={(id) => console.log('View ticket:', id)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Report</Text>
          <Text style={styles.subtitle}>
            Need help with something in the community? Start here.
          </Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleReportIssue}>
            <View style={styles.primaryButtonContent}>
              <AlertCircle size={24} color={colorsRGB.primaryForeground} />
              <View style={styles.primaryButtonText}>
                <Text style={styles.primaryButtonTitle}>Report an Issue</Text>
                <Text style={styles.primaryButtonSubtitle}>Submit a new request or concern</Text>
              </View>
              <ChevronRight size={20} color={colorsRGB.primaryForeground} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => setView('my-tickets')}>
            <View style={styles.secondaryButtonContent}>
              <FileText size={24} color={colorsRGB.primary} />
              <View style={styles.secondaryButtonText}>
                <Text style={styles.secondaryButtonTitle}>My Tickets</Text>
                <Text style={styles.secondaryButtonSubtitle}>View and track your requests</Text>
              </View>
              <ChevronRight size={20} color={colorsRGB.primary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Issues</Text>
          <View style={styles.grid}>
            {quickIssues.map((issue) => {
              const Icon = issue.icon;
              return (
                <TouchableOpacity
                  key={issue.id}
                  style={styles.quickIssueCard}
                  onPress={() => handleQuickIssue(issue.typeId)}
                >
                  <View style={styles.quickIssueIcon}>
                    <Icon size={20} color={colorsRGB.mutedForeground} />
                  </View>
                  <Text style={styles.quickIssueLabel}>{issue.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.emergencyCard}>
          <Phone size={20} color="#EF4444" />
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>Emergency?</Text>
            <Text style={styles.emergencyDescription}>
              For urgent safety issues, call 911. For HOA emergencies, call the emergency line.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Select Issue Type Component
function SelectIssueType({ preselectedType, onSelect, onBack, onOpenSage }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronRight size={20} color={colorsRGB.mutedForeground} style={{ transform: [{ rotate: '180deg' }] }} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Select Issue Type</Text>
          <Text style={styles.stepText}>Step 1 of 3</Text>
        </View>

        {preselectedType && (
          <View style={styles.preselectedCard}>
            <Text style={styles.preselectedText}>
              Selected: {issueTypes.find((t) => t.id === preselectedType)?.title}
            </Text>
            <Text style={styles.preselectedSubtext}>
              Tap to confirm or choose a different type below.
            </Text>
          </View>
        )}

        <View style={styles.issueTypeList}>
          {issueTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = preselectedType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.issueTypeCard, isSelected && styles.issueTypeCardSelected]}
                onPress={() => onSelect(type.id)}
              >
                <View style={[styles.issueTypeIcon, isSelected && styles.issueTypeIconSelected]}>
                  <Icon size={24} color={colorsRGB.accent} />
                </View>
                <View style={styles.issueTypeContent}>
                  <Text style={styles.issueTypeTitle}>{type.title}</Text>
                  <Text style={styles.issueTypeDescription}>{type.description}</Text>
                  {type.examples && (
                    <Text style={styles.issueTypeExamples} numberOfLines={1}>
                      e.g., {type.examples}
                      <Text style={styles.moreText}> …more</Text>
                    </Text>
                  )}
                </View>
                <ChevronRight size={20} color={colorsRGB.mutedForeground} />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.sageButton} onPress={onOpenSage}>
          <Sparkles size={20} color={colorsRGB.accent} />
          <Text style={styles.sageButtonText}>Not sure? Ask Sage</Text>
        </TouchableOpacity>

        <View style={styles.emergencyCard}>
          <Phone size={20} color="#EF4444" />
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>Emergency?</Text>
            <Text style={styles.emergencyDescriptionSmall}>Call 911 for safety issues.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Issue Details Form Component
function IssueDetailsForm({ issueType, onBack, onSubmit }: any) {
  const [formData, setFormData] = useState({
    description: '',
    location: 'my-address',
    urgency: 'medium',
    contactPreference: 'app',
  });

  const selectedType = issueTypes.find((t) => t.id === issueType);
  const showUrgency = issueType === 'maintenance' || issueType === 'security';
  const Icon = selectedType?.icon || HelpCircle;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronRight size={20} color={colorsRGB.mutedForeground} style={{ transform: [{ rotate: '180deg' }] }} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.formHeader}>
          <View style={styles.formHeaderIcon}>
            <Icon size={20} color={colorsRGB.accent} />
          </View>
          <View>
            <Text style={styles.formTitle}>{selectedType?.title || 'Report an Issue'}</Text>
            <Text style={styles.stepText}>Step 2 of 3</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>What's the issue? *</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Describe what's happening..."
            placeholderTextColor={colorsRGB.mutedForeground}
            multiline
            numberOfLines={5}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Where is this?</Text>
          <TouchableOpacity
            style={[
              styles.locationOption,
              formData.location === 'my-address' && styles.locationOptionSelected,
            ]}
            onPress={() => setFormData({ ...formData, location: 'my-address' })}
          >
            <Text style={styles.locationText}>My address (123 Willow Lane)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.locationOption,
              formData.location === 'common-area' && styles.locationOptionSelected,
            ]}
            onPress={() => setFormData({ ...formData, location: 'common-area' })}
          >
            <Text style={styles.locationText}>Common area / Other location</Text>
          </TouchableOpacity>
        </View>

        {showUrgency && (
          <View style={styles.formSection}>
            <Text style={styles.label}>How urgent is this?</Text>
            <View style={styles.urgencyRow}>
              {['low', 'medium', 'high'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.urgencyButton,
                    formData.urgency === level && styles[`urgencyButton${level.charAt(0).toUpperCase() + level.slice(1)}`],
                  ]}
                  onPress={() => setFormData({ ...formData, urgency: level })}
                >
                  <Text
                    style={[
                      styles.urgencyButtonText,
                      formData.urgency === level && styles.urgencyButtonTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.formSection}>
          <Text style={styles.label}>Add a photo (recommended)</Text>
          <TouchableOpacity style={styles.photoButton}>
            <Camera size={40} color={colorsRGB.mutedForeground} />
            <Text style={styles.photoButtonTitle}>Tap to add photo</Text>
            <Text style={styles.photoButtonSubtitle}>A photo helps us understand the issue</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>How should we contact you?</Text>
          <View style={styles.contactRow}>
            {[
              { id: 'app', label: 'In-app' },
              { id: 'email', label: 'Email' },
              { id: 'phone', label: 'Phone' },
            ].map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.contactButton,
                  formData.contactPreference === option.id && styles.contactButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, contactPreference: option.id })}
              >
                <Text
                  style={[
                    styles.contactButtonText,
                    formData.contactPreference === option.id && styles.contactButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          variant="default"
          size="full"
          onPress={onSubmit}
          style={[styles.submitButton, !formData.description.trim() && styles.submitButtonDisabled]}
        >
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

// Ticket Confirmation Component
function TicketConfirmation({ onViewTickets, onSubmitAnother }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.confirmationContainer}>
        <View style={styles.confirmationIcon}>
          <CheckCircle size={40} color="#4A9D7E" />
        </View>
        <Text style={styles.confirmationTitle}>Ticket Submitted</Text>
        <Text style={styles.confirmationSubtitle}>
          Thanks! We received your request and will be in touch soon.
        </Text>

        <View style={styles.ticketNumberCard}>
          <Text style={styles.ticketNumberLabel}>Ticket Number</Text>
          <Text style={styles.ticketNumber}>TKT-2026-0042</Text>
        </View>

        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What happens next?</Text>
          <Text style={styles.nextStepsText}>• We'll review your request within 1-2 business days</Text>
          <Text style={styles.nextStepsText}>• You'll get updates in the app and via your contact preference</Text>
          <Text style={styles.nextStepsText}>• Check "My Tickets" to track progress</Text>
        </View>

        <Button variant="default" size="full" onPress={onViewTickets} style={styles.confirmationButton}>
          <Text style={styles.confirmationButtonText}>View My Tickets</Text>
        </Button>
        <Button variant="ghost" size="full" onPress={onSubmitAnother} style={styles.confirmationSecondaryButton}>
          <Text style={styles.confirmationSecondaryButtonText}>Submit Another</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

// My Tickets Component
const statusConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
  submitted: { label: 'Submitted', bgColor: 'rgba(59, 130, 246, 0.15)', textColor: '#3B82F6' },
  'in-review': { label: 'In Review', bgColor: 'rgba(245, 158, 11, 0.15)', textColor: '#F59E0B' },
  assigned: { label: 'Assigned', bgColor: 'rgba(74, 157, 126, 0.15)', textColor: '#4A9D7E' },
  'in-progress': { label: 'In Progress', bgColor: 'rgba(147, 51, 234, 0.15)', textColor: '#9333EA' },
  'waiting-vendor': { label: 'Waiting on Vendor', bgColor: 'rgba(107, 114, 128, 0.15)', textColor: '#6B7280' },
  completed: { label: 'Completed', bgColor: 'rgba(74, 157, 126, 0.15)', textColor: '#4A9D7E' },
};

const mockTickets = [
  {
    id: '1',
    title: 'Streetlight out on Maple Drive',
    status: 'in-progress',
    category: 'Maintenance',
    date: 'Jan 2, 2026',
  },
  {
    id: '2',
    title: 'Pool booking question',
    status: 'completed',
    category: 'Amenity',
    date: 'Dec 28, 2025',
  },
];

function ResidentMyTickets({ onBack, onTicketClick }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronRight size={20} color={colorsRGB.mutedForeground} style={{ transform: [{ rotate: '180deg' }] }} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>My Tickets</Text>
          <Text style={styles.subtitle}>Track your requests and get updates</Text>
        </View>

        {mockTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <FileText size={32} color={colorsRGB.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>No tickets yet</Text>
            <Text style={styles.emptyText}>When you submit a request, it will appear here.</Text>
          </View>
        ) : (
          <View style={styles.ticketsList}>
            {mockTickets.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={styles.ticketCard}
                onPress={() => onTicketClick(ticket.id)}
              >
                <View style={styles.ticketContent}>
                  <View
                    style={[
                      styles.ticketStatus,
                      { backgroundColor: statusConfig[ticket.status].bgColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.ticketStatusText,
                        { color: statusConfig[ticket.status].textColor },
                      ]}
                    >
                      {statusConfig[ticket.status].label}
                    </Text>
                  </View>
                  <Text style={styles.ticketTitle}>{ticket.title}</Text>
                  <Text style={styles.ticketMeta}>
                    {ticket.category} · {ticket.date}
                  </Text>
                </View>
                <ChevronRight size={20} color={colorsRGB.mutedForeground} />
              </TouchableOpacity>
            ))}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: colorsRGB.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryButtonText: {
    flex: 1,
  },
  primaryButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colorsRGB.primaryForeground,
    marginBottom: 2,
  },
  primaryButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(250, 248, 245, 0.8)',
  },
  secondaryButton: {
    backgroundColor: colorsRGB.card,
    borderWidth: 2,
    borderColor: colorsRGB.primary,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secondaryButtonText: {
    flex: 1,
  },
  secondaryButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 2,
  },
  secondaryButtonSubtitle: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickIssueCard: {
    width: '48%',
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickIssueIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIssueLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    lineHeight: 20,
  },
  emergencyDescriptionSmall: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
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
  stepText: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  preselectedCard: {
    backgroundColor: 'rgba(74, 157, 126, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74, 157, 126, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  preselectedText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.accent,
    marginBottom: 4,
  },
  preselectedSubtext: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
  },
  issueTypeList: {
    gap: 12,
    marginBottom: 24,
  },
  issueTypeCard: {
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
  issueTypeCardSelected: {
    borderWidth: 2,
    borderColor: colorsRGB.accent,
  },
  issueTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 157, 126, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueTypeIconSelected: {
    backgroundColor: 'rgba(74, 157, 126, 0.2)',
  },
  issueTypeContent: {
    flex: 1,
  },
  issueTypeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 2,
  },
  issueTypeDescription: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginBottom: 4,
  },
  issueTypeExamples: {
    fontSize: 14,
    color: 'rgba(107, 114, 128, 0.8)',
  },
  moreText: {
    color: colorsRGB.accent,
  },
  sageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginBottom: 24,
  },
  sageButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.accent,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  formHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 157, 126, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.3,
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
  textarea: {
    backgroundColor: colorsRGB.secondary,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: colorsRGB.foreground,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  locationOption: {
    backgroundColor: colorsRGB.secondary,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    minHeight: 56,
    justifyContent: 'center',
  },
  locationOptionSelected: {
    borderColor: colorsRGB.primary,
    backgroundColor: 'rgba(44, 62, 80, 0.05)',
  },
  locationText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  urgencyButtonLow: {
    backgroundColor: '#4A9D7E',
  },
  urgencyButtonMedium: {
    backgroundColor: '#F59E0B',
  },
  urgencyButtonHigh: {
    backgroundColor: '#EF4444',
  },
  urgencyButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.secondaryForeground,
    textTransform: 'capitalize',
  },
  urgencyButtonTextActive: {
    color: '#FFFFFF',
  },
  photoButton: {
    paddingVertical: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colorsRGB.border,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  photoButtonTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.foreground,
    marginTop: 8,
  },
  photoButtonSubtitle: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  contactButtonSelected: {
    backgroundColor: colorsRGB.primary,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.secondaryForeground,
  },
  contactButtonTextActive: {
    color: colorsRGB.primaryForeground,
  },
  submitButton: {
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.primaryForeground,
  },
  confirmationContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 48,
    alignItems: 'center',
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
  confirmationTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  confirmationSubtitle: {
    fontSize: 20,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 320,
  },
  ticketNumberCard: {
    backgroundColor: colorsRGB.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  ticketNumberLabel: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginBottom: 4,
  },
  ticketNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colorsRGB.foreground,
    fontFamily: 'Courier',
  },
  nextStepsCard: {
    backgroundColor: 'rgba(74, 157, 126, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(74, 157, 126, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    width: '100%',
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 8,
  },
  nextStepsText: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginBottom: 4,
  },
  confirmationButton: {
    width: '100%',
    marginBottom: 12,
  },
  confirmationButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.primaryForeground,
  },
  confirmationSecondaryButton: {
    width: '100%',
  },
  confirmationSecondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
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
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
  },
  ticketsList: {
    gap: 12,
  },
  ticketCard: {
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
  ticketContent: {
    flex: 1,
  },
  ticketStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  ticketStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 2,
  },
  ticketMeta: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
});
