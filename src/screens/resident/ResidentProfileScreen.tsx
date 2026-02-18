import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
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
import { useAuth } from '../../contexts/AuthContext';

interface ResidentProfileScreenProps {
  onNavigate: (view: string) => void;
}

interface ProfileRowProps {
  icon: any;
  label: string;
  value?: string;
  onClick?: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

function ProfileRow({ icon: Icon, label, value, onClick, showArrow = true, danger = false }: ProfileRowProps) {
  return (
    <TouchableOpacity
      style={styles.profileRow}
      onPress={onClick}
      disabled={!onClick}
    >
      <View style={[styles.profileRowIcon, danger && styles.profileRowIconDanger]}>
        <Icon size={20} color={danger ? '#EF4444' : colorsRGB.mutedForeground} />
      </View>
      <View style={styles.profileRowContent}>
        <Text style={[styles.profileRowLabel, danger && styles.profileRowLabelDanger]}>
          {label}
        </Text>
        {value && (
          <Text style={styles.profileRowValue}>{value}</Text>
        )}
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
      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );
}

export default function ResidentProfileScreen({ onNavigate }: ResidentProfileScreenProps) {
  const { signOut, userProfile } = useAuth();

  const userName = userProfile?.full_name || 'Resident User';
  const address = userProfile?.property_address || '123 Willow Lane';
  const unitNumber = userProfile?.unit_number || '';
  const communityName = userProfile?.community_name || 'Willow Creek Estates';
  const email = userProfile?.email || 'user@email.com';
  const phone = userProfile?.phone || '(555) 123-4567';
  const balance = userProfile?.balance || 0;

  const fullAddress = unitNumber ? `${address}, ${unitNumber}` : address;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

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
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userAddress}>{fullAddress}</Text>
              <View style={styles.communityBadge}>
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
            value={`${fullAddress}, ${communityName}`}
            onClick={() => {}}
          />
        </ProfileSection>

        {/* Contact Info */}
        <ProfileSection title="CONTACT INFO">
          <ProfileRow
            icon={Phone}
            label="Phone"
            value={phone}
            onClick={() => {}}
          />
          <ProfileRow
            icon={Mail}
            label="Email"
            value={email}
            onClick={() => {}}
          />
          <ProfileRow
            icon={MessageSquare}
            label="Preferred Contact Method"
            value="Email"
            onClick={() => {}}
          />
        </ProfileSection>

        {/* Billing */}
        <ProfileSection title="BILLING">
          <ProfileRow
            icon={CreditCard}
            label="Dues & Payments"
            value={`Balance: $${balance.toFixed(2)}`}
            onClick={() => onNavigate('payments')}
          />
        </ProfileSection>

        {/* Notifications & Updates */}
        <ProfileSection title="NOTIFICATIONS & UPDATES">
          <ProfileRow
            icon={Bell}
            label="Notification Settings"
            value="Push, Email enabled"
            onClick={() => onNavigate('notification-settings')}
          />
          <ProfileRow
            icon={MessageSquare}
            label="Notices"
            value="2 unread"
            onClick={() => onNavigate('notices')}
          />
        </ProfileSection>

        {/* Help & Contact HOA */}
        <ProfileSection title="HELP & CONTACT HOA">
          <ProfileRow
            icon={Phone}
            label="Call HOA Office"
            value="(555) 987-6543"
            onClick={() => {}}
          />
          <ProfileRow
            icon={Mail}
            label="Email HOA"
            value="office@willowcreek.hoa"
            onClick={() => {}}
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
            onClick={() => {}}
          />
        </ProfileSection>

        {/* Accessibility */}
        <ProfileSection title="ACCESSIBILITY">
          <ProfileRow
            icon={Type}
            label="Text Size"
            value="Default"
            onClick={() => {}}
          />
          <ProfileRow
            icon={Eye}
            label="High Contrast"
            value="Off"
            onClick={() => {}}
          />
          <ProfileRow
            icon={Zap}
            label="Reduce Motion"
            value="Off"
            onClick={() => {}}
          />
        </ProfileSection>

        {/* Security & Account */}
        <ProfileSection title="SECURITY & ACCOUNT">
          <ProfileRow
            icon={Shield}
            label="Face ID / Touch ID"
            value="Enabled"
            onClick={() => {}}
          />
          <ProfileRow
            icon={Shield}
            label="Change Password"
            onClick={() => {}}
          />
          <ProfileRow
            icon={LogOut}
            label="Sign Out"
            danger
            onClick={handleSignOut}
          />
        </ProfileSection>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Community Connect v1.0.0</Text>
          <Text style={styles.footerText}>© 2026 {communityName} HOA</Text>
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
    backgroundColor: 'rgba(44, 62, 80, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  userAddress: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginTop: 2,
  },
  communityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
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
    borderRadius: 12,
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
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    overflow: 'hidden',
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
    paddingHorizontal: 16,
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  profileRowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRowIconDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  profileRowContent: {
    flex: 1,
  },
  profileRowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  profileRowLabelDanger: {
    color: '#EF4444',
  },
  profileRowValue: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 16,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
});
