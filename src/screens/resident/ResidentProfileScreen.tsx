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
  User,
  Home,
  Phone,
  Mail,
  Bell,
  MessageSquare,
  HelpCircle,
  Shield,
  ChevronRight,
  Eye,
  Type,
  Zap,
  LogOut,
  CheckCircle2,
  Clock,
  CreditCard,
} from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';

interface ResidentProfileScreenProps {
  onNavigate?: (view: string) => void;
  userName?: string;
  address?: string;
  communityName?: string;
  email?: string;
  phone?: string;
}

interface ProfileRowProps {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

function ProfileRow({ icon: Icon, label, value, onPress, showArrow = true, danger = false }: ProfileRowProps) {
  return (
    <TouchableOpacity
      style={styles.profileRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.rowIcon,
          danger && styles.rowIconDanger,
        ]}
      >
        <Icon size={20} color={danger ? '#EF4444' : colorsRGB.mutedForeground} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>
          {label}
        </Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
      </View>
      {showArrow && (
        <ChevronRight size={20} color={colorsRGB.mutedForeground} />
      )}
    </TouchableOpacity>
  );
}

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function ResidentProfileScreen({
  onNavigate,
  userName = 'Margaret Johnson',
  address = '123 Willow Lane',
  communityName = 'Willow Creek Estates',
  email = 'margaret.j@email.com',
  phone = '(555) 123-4567',
}: ResidentProfileScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with User Info */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.avatar}>
              <User size={40} color={colorsRGB.accent} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userAddress}>{address}</Text>
              <View style={styles.communityRow}>
                <Text style={styles.communityName}>{communityName}</Text>
                <View style={styles.verifiedBadge}>
                  <CheckCircle2 size={12} color="#4A9D7E" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* My Home */}
        <ProfileSection title="MY HOME">
          <ProfileRow
            icon={Home}
            label="Address"
            value={`${address}, ${communityName}`}
            onPress={() => {}}
          />
        </ProfileSection>

        {/* Contact Info */}
        <ProfileSection title="CONTACT INFO">
          <ProfileRow icon={Phone} label="Phone" value={phone} onPress={() => {}} />
          <ProfileRow icon={Mail} label="Email" value={email} onPress={() => {}} />
          <ProfileRow
            icon={MessageSquare}
            label="Preferred Contact Method"
            value="Email"
            onPress={() => {}}
          />
        </ProfileSection>

        {/* Dues & Payments */}
        <ProfileSection title="BILLING">
          <ProfileRow
            icon={CreditCard}
            label="Dues & Payments"
            value="Balance: $128.50"
            onPress={() => onNavigate?.('payments')}
          />
        </ProfileSection>

        {/* Notifications & Notices */}
        <ProfileSection title="NOTIFICATIONS & UPDATES">
          <ProfileRow
            icon={Bell}
            label="Notification Settings"
            value="Push, Email enabled"
            onPress={() => onNavigate?.('notification-settings')}
          />
          <ProfileRow
            icon={MessageSquare}
            label="Notices"
            value="2 unread"
            onPress={() => onNavigate?.('notices')}
          />
        </ProfileSection>

        {/* Help & Contact */}
        <ProfileSection title="HELP & CONTACT HOA">
          <ProfileRow
            icon={Phone}
            label="Call HOA Office"
            value="(555) 987-6543"
            onPress={() => {}}
          />
          <ProfileRow
            icon={Mail}
            label="Email HOA"
            value="office@willowcreek.hoa"
            onPress={() => {}}
          />
          <ProfileRow
            icon={Clock}
            label="Office Hours"
            value="Mon–Fri, 9 AM – 5 PM"
            showArrow={false}
          />
          <ProfileRow
            icon={HelpCircle}
            label="After-Hours Emergencies"
            value="Call (555) 911-0000"
            onPress={() => {}}
          />
        </ProfileSection>

        {/* Accessibility */}
        <ProfileSection title="ACCESSIBILITY">
          <ProfileRow
            icon={Type}
            label="Text Size"
            value="Default"
            onPress={() => onNavigate?.('text-size')}
          />
          <ProfileRow icon={Eye} label="High Contrast" value="Off" onPress={() => {}} />
          <ProfileRow icon={Zap} label="Reduce Motion" value="Off" onPress={() => {}} />
        </ProfileSection>

        {/* Security */}
        <ProfileSection title="SECURITY & ACCOUNT">
          <ProfileRow
            icon={Shield}
            label="Face ID / Touch ID"
            value="Enabled"
            onPress={() => {}}
          />
          <ProfileRow icon={Shield} label="Change Password" onPress={() => {}} />
          <ProfileRow icon={LogOut} label="Sign Out" danger onPress={() => {}} />
        </ProfileSection>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Community Connect v1.0.0</Text>
          <Text style={styles.footerText}>© 2026 Willow Creek Estates HOA</Text>
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
    marginBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 157, 126, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  userName: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  userAddress: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginBottom: 4,
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  communityName: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.accent,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(74, 157, 126, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A9D7E',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.mutedForeground,
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 4,
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(213, 217, 224, 0.5)',
    minHeight: 56,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  rowLabelDanger: {
    color: '#EF4444',
  },
  rowValue: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
});
