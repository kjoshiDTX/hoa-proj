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
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  FileText,
  AlertTriangle,
  Clock,
  Key,
  Moon,
  CheckCircle2,
} from 'lucide-react-native';
import { Switch } from '../../components/ui/Switch';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

interface ResidentNotificationSettingsScreenProps {
  onBack?: () => void;
}

interface ToggleRowProps {
  icon: any;
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

function ToggleRow({ icon: Icon, label, description, enabled, onToggle, disabled }: ToggleRowProps) {
  return (
    <View style={[styles.toggleRow, disabled && styles.toggleRowDisabled]}>
      <View style={styles.toggleIcon}>
        <Icon size={20} color={colorsRGB.mutedForeground} />
      </View>
      <View style={styles.toggleContent}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {description && <Text style={styles.toggleDescription}>{description}</Text>}
      </View>
      <Switch checked={enabled} onCheckedChange={onToggle} disabled={disabled} />
    </View>
  );
}

export default function ResidentNotificationSettingsScreen({ onBack }: ResidentNotificationSettingsScreenProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const [casesEnabled, setCasesEnabled] = useState(true);
  const [ticketsEnabled, setTicketsEnabled] = useState(true);
  const [noticesEnabled, setNoticesEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [securityEnabled, setSecurityEnabled] = useState(true);

  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('07:00');

  const [digestMode, setDigestMode] = useState<'instant' | 'daily'>('instant');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={24} color={colorsRGB.foreground} />
          </TouchableOpacity>
        )}
        <View style={styles.headerText}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Control how you receive updates</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {!pushEnabled && (
          <View style={styles.warningCard}>
            <AlertTriangle size={20} color="#F59E0B" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Push notifications are disabled</Text>
              <Text style={styles.warningText}>
                Enable push notifications to receive real-time updates about your cases and community notices.
              </Text>
              <TouchableOpacity style={styles.warningButton} onPress={() => setPushEnabled(true)}>
                <Text style={styles.warningButtonText}>Enable Push</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATION CHANNELS</Text>
          <View style={styles.sectionCard}>
            <ToggleRow
              icon={Smartphone}
              label="Push Notifications"
              description="Receive alerts on your device"
              enabled={pushEnabled}
              onToggle={setPushEnabled}
            />
            <ToggleRow
              icon={Mail}
              label="Email"
              description="Get updates in your inbox"
              enabled={emailEnabled}
              onToggle={setEmailEnabled}
            />
            <ToggleRow
              icon={MessageSquare}
              label="SMS (Text Messages)"
              description="Receive text alerts"
              enabled={smsEnabled}
              onToggle={setSmsEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WHAT YOU'LL RECEIVE</Text>
          <View style={styles.sectionCard}>
            <ToggleRow
              icon={FileText}
              label="Cases"
              description="New notices, deadline reminders, status changes"
              enabled={casesEnabled}
              onToggle={setCasesEnabled}
            />
            <ToggleRow
              icon={AlertTriangle}
              label="Tickets"
              description="Updates and replies on your requests"
              enabled={ticketsEnabled}
              onToggle={setTicketsEnabled}
            />
            <ToggleRow
              icon={Bell}
              label="Notices"
              description="Community announcements and urgent alerts"
              enabled={noticesEnabled}
              onToggle={setNoticesEnabled}
            />
            <ToggleRow
              icon={Clock}
              label="Reminders"
              description="Fix-by and appeal-by date reminders"
              enabled={remindersEnabled}
              onToggle={setRemindersEnabled}
            />
            <ToggleRow
              icon={Key}
              label="Security & Access"
              description="Gate access and key fob alerts"
              enabled={securityEnabled}
              onToggle={setSecurityEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTICES FREQUENCY</Text>
          <View style={styles.sectionCard}>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioOption,
                  digestMode === 'instant' && styles.radioOptionActive,
                ]}
                onPress={() => setDigestMode('instant')}
              >
                <View style={styles.radioCircle}>
                  {digestMode === 'instant' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.radioContent}>
                  <Text style={styles.radioLabel}>Instant</Text>
                  <Text style={styles.radioDescription}>Get notifications as they happen</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioOption,
                  digestMode === 'daily' && styles.radioOptionActive,
                ]}
                onPress={() => setDigestMode('daily')}
              >
                <View style={styles.radioCircle}>
                  {digestMode === 'daily' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.radioContent}>
                  <Text style={styles.radioLabel}>Daily Digest</Text>
                  <Text style={styles.radioDescription}>Receive a summary each morning</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUIET HOURS</Text>
          <View style={styles.sectionCard}>
            <ToggleRow
              icon={Moon}
              label="Enable Quiet Hours"
              description="Pause non-urgent notifications during set times"
              enabled={quietHoursEnabled}
              onToggle={setQuietHoursEnabled}
            />

            {quietHoursEnabled && (
              <View style={styles.quietHoursInputs}>
                <View style={styles.timeInputGroup}>
                  <Text style={styles.timeLabel}>Start</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={quietStart}
                    onChangeText={setQuietStart}
                    placeholder="22:00"
                  />
                </View>
                <View style={styles.timeInputGroup}>
                  <Text style={styles.timeLabel}>End</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={quietEnd}
                    onChangeText={setQuietEnd}
                    placeholder="07:00"
                  />
                </View>
              </View>
            )}

            {quietHoursEnabled && (
              <Text style={styles.quietNote}>
                Urgent safety alerts will still come through during quiet hours.
              </Text>
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.saveContainer}>
        <Button
          variant={saved ? 'success' : 'default'}
          size="full"
          onPress={handleSave}
          style={saved && styles.savedButton}
        >
          {saved ? (
            <>
              <CheckCircle2 size={20} color="#FFFFFF" />
              <Text style={styles.savedButtonText}>Settings Saved</Text>
            </>
          ) : (
            <Text style={styles.saveButtonText}>Save Settings</Text>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorsRGB.border,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
    marginBottom: 12,
  },
  warningButton: {
    backgroundColor: colorsRGB.card,
    borderWidth: 2,
    borderColor: colorsRGB.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  warningButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.mutedForeground,
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(213, 217, 224, 0.5)',
  },
  toggleRowDisabled: {
    opacity: 0.5,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleContent: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  toggleDescription: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 2,
  },
  radioGroup: {
    gap: 8,
    padding: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    backgroundColor: colorsRGB.secondary,
  },
  radioOptionActive: {
    borderColor: colorsRGB.primary,
    backgroundColor: 'rgba(44, 62, 80, 0.05)',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colorsRGB.mutedForeground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colorsRGB.primary,
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  radioDescription: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 2,
  },
  quietHoursInputs: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
    paddingHorizontal: 12,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colorsRGB.border,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.mutedForeground,
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: colorsRGB.secondary,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    color: colorsRGB.foreground,
  },
  quietNote: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  saveContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colorsRGB.background,
    borderTopWidth: 1,
    borderTopColor: colorsRGB.border,
  },
  savedButton: {
    backgroundColor: '#4A9D7E',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  savedButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
