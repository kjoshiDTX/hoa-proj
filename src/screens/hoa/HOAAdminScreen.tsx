import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Users,
  FileText,
  Mail,
  CreditCard,
  Bell,
  Shield,
  ChevronRight,
  Plus,
  Search,
  Edit3,
  Upload,
  Eye,
  Building,
  BookOpen,
  Link,
  MessageSquare,
  AlertCircle,
  LogOut,
} from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

type AdminView =
  | 'hub'
  | 'users'
  | 'community-settings'
  | 'rules'
  | 'templates'
  | 'integrations'
  | 'notifications';

interface HOAAdminScreenProps {
  onBack?: () => void;
}

export default function HOAAdminScreen({ onBack }: HOAAdminScreenProps) {
  const [currentView, setCurrentView] = useState<AdminView>('hub');
  const [searchQuery, setSearchQuery] = useState('');
  const { signOut, userProfile } = useAuth();

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

  const users = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@willowcreek.hoa', role: 'Admin', status: 'active' },
    { id: '2', name: 'Michael Chen', email: 'michael@willowcreek.hoa', role: 'Reviewer', status: 'active' },
    { id: '3', name: 'Emily Davis', email: 'emily@willowcreek.hoa', role: 'Board', status: 'active' },
    { id: '4', name: 'Robert Smith', email: 'robert@willowcreek.hoa', role: 'Manager', status: 'pending' },
  ];

  const roles = [
    { name: 'Admin', description: 'Full access to all features', count: 2 },
    { name: 'Reviewer', description: 'Can review and approve cases', count: 3 },
    { name: 'Board', description: 'Read-only access to reports', count: 4 },
    { name: 'Manager', description: 'Property management access', count: 1 },
  ];

  const templates = [
    { id: '1', name: 'Violation Notice', description: 'Standard violation notification', lastEdited: '2 days ago' },
    { id: '2', name: 'Warning Letter', description: 'First warning for minor violations', lastEdited: '1 week ago' },
    { id: '3', name: 'Appeal Response - Approved', description: 'Appeal approval template', lastEdited: '3 days ago' },
    { id: '4', name: 'Appeal Response - Denied', description: 'Appeal denial template', lastEdited: '3 days ago' },
    { id: '5', name: 'Fine Notice', description: 'Fine assessment notification', lastEdited: '2 weeks ago' },
  ];

  const ruleCategories = [
    { name: 'Exterior & Landscaping', ruleCount: 24, lastUpdated: 'Jan 5, 2026' },
    { name: 'Parking & Vehicles', ruleCount: 12, lastUpdated: 'Dec 15, 2025' },
    { name: 'Trash & Recycling', ruleCount: 8, lastUpdated: 'Jan 2, 2026' },
    { name: 'Noise & Nuisance', ruleCount: 6, lastUpdated: 'Nov 20, 2025' },
    { name: 'Architectural Changes', ruleCount: 18, lastUpdated: 'Jan 3, 2026' },
    { name: 'Common Areas', ruleCount: 10, lastUpdated: 'Dec 28, 2025' },
  ];

  const adminSections = [
    {
      id: 'users',
      title: 'Users & Roles',
      description: 'Manage team members and permissions',
      icon: Users,
      badge: `${users.length} users`,
    },
    {
      id: 'community-settings',
      title: 'Community Settings',
      description: 'HOA info, SLA defaults, branding',
      icon: Building,
      badge: null,
    },
    {
      id: 'rules',
      title: 'Rules & Documents',
      description: 'Rulebook, categories, version history',
      icon: BookOpen,
      badge: `${ruleCategories.reduce((sum, cat) => sum + cat.ruleCount, 0)} rules`,
    },
    {
      id: 'templates',
      title: 'Templates',
      description: 'Notice and message templates',
      icon: FileText,
      badge: `${templates.length} templates`,
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Payments, email, SMS connections',
      icon: Link,
      badge: null,
    },
    {
      id: 'notifications',
      title: 'Notification Controls',
      description: 'Alert triggers and preferences',
      icon: Bell,
      badge: null,
    },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  // Users View
  if (currentView === 'users') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => setCurrentView('hub')}>
              <ArrowLeft size={24} color={colorsRGB.foreground} />
            </TouchableOpacity>
            <Text style={styles.title}>Users & Roles</Text>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color={colorsRGB.mutedForeground} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search users..."
              placeholderTextColor={colorsRGB.mutedForeground}
            />
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Button variant="default" size="full" style={styles.addButton}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Add User</Text>
          </Button>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Roles</Text>
            <View style={styles.rolesGrid}>
              {roles.map((role) => (
                <View key={role.name} style={styles.roleCard}>
                  <View style={styles.roleHeader}>
                    <Text style={styles.roleName}>{role.name}</Text>
                    <View style={styles.roleCount}>
                      <Text style={styles.roleCountText}>{role.count}</Text>
                    </View>
                  </View>
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Team Members</Text>
            {users.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{getInitials(user.name)}</Text>
                </View>
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
                    {user.status === 'pending' && (
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingText}>Pending</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
                  <Text style={styles.userRole}>{user.role}</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Edit3 size={16} color={colorsRGB.mutedForeground} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Templates View
  if (currentView === 'templates') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => setCurrentView('hub')}>
              <ArrowLeft size={24} color={colorsRGB.foreground} />
            </TouchableOpacity>
            <Text style={styles.title}>Templates</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Button variant="default" size="full" style={styles.addButton}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Create Template</Text>
          </Button>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Templates</Text>
            {templates.map((template) => (
              <View key={template.id} style={styles.templateCard}>
                <View style={styles.templateIcon}>
                  <FileText size={20} color={colorsRGB.mutedForeground} />
                </View>
                <View style={styles.templateInfo}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDescription}>{template.description}</Text>
                  <Text style={styles.templateEdited}>Edited {template.lastEdited}</Text>
                </View>
                <View style={styles.templateActions}>
                  <TouchableOpacity style={styles.iconButton}>
                    <Eye size={16} color={colorsRGB.mutedForeground} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Edit3 size={16} color={colorsRGB.mutedForeground} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Integrations View
  if (currentView === 'integrations') {
    const integrations = [
      { name: 'Stripe Payments', description: 'Process dues and fines', status: 'not-connected', icon: CreditCard },
      { name: 'Email (SendGrid)', description: 'Send notices and alerts', status: 'connected', icon: Mail },
      { name: 'SMS (Twilio)', description: 'Text notifications', status: 'not-connected', icon: MessageSquare },
    ];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => setCurrentView('hub')}>
              <ArrowLeft size={24} color={colorsRGB.foreground} />
            </TouchableOpacity>
            <Text style={styles.title}>Integrations</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {integrations.map((integration) => {
            const IconComponent = integration.icon;
            return (
              <View key={integration.name} style={styles.integrationCard}>
                <View
                  style={[
                    styles.integrationIcon,
                    integration.status === 'connected' && styles.integrationIconConnected,
                  ]}
                >
                  <IconComponent
                    size={24}
                    color={integration.status === 'connected' ? '#4A9D7E' : colorsRGB.mutedForeground}
                  />
                </View>
                <View style={styles.integrationInfo}>
                  <View style={styles.integrationHeader}>
                    <Text style={styles.integrationName}>{integration.name}</Text>
                    {integration.status === 'connected' && (
                      <View style={styles.connectedBadge}>
                        <Text style={styles.connectedText}>Connected</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.integrationDescription}>{integration.description}</Text>
                </View>
                <Button
                  variant={integration.status === 'connected' ? 'outline' : 'default'}
                  size="sm"
                  style={styles.integrationButton}
                >
                  <Text
                    style={[
                      styles.integrationButtonText,
                      integration.status === 'connected' && styles.integrationButtonTextOutline,
                    ]}
                  >
                    {integration.status === 'connected' ? 'Configure' : 'Connect'}
                  </Text>
                </Button>
              </View>
            );
          })}

          <View style={styles.infoCard}>
            <AlertCircle size={20} color={colorsRGB.mutedForeground} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Coming soon</Text>
              <Text style={styles.infoText}>
                More integrations including QuickBooks, property management systems, and more.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Admin Hub (Main View)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Admin</Text>
        <Text style={styles.mainSubtitle}>Manage your HOA settings</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {adminSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <TouchableOpacity
              key={section.id}
              style={styles.adminCard}
              onPress={() => setCurrentView(section.id as AdminView)}
            >
              <View style={styles.adminIcon}>
                <IconComponent size={24} color={colorsRGB.primary} />
              </View>
              <View style={styles.adminInfo}>
                <View style={styles.adminHeader}>
                  <Text style={styles.adminTitle}>{section.title}</Text>
                  {section.badge && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminBadgeText}>{section.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.adminDescription}>{section.description}</Text>
              </View>
              <ChevronRight size={20} color={colorsRGB.mutedForeground} />
            </TouchableOpacity>
          );
        })}

        <View style={styles.quickInfo}>
          <Shield size={20} color={colorsRGB.mutedForeground} />
          <Text style={styles.quickInfoText}>
            You have <Text style={styles.quickInfoBold}>Admin</Text> access. Some settings require
            board approval.
          </Text>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorsRGB.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  mainSubtitle: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  searchContainer: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  searchInput: {
    height: 48,
    paddingLeft: 48,
    paddingRight: 16,
    backgroundColor: colorsRGB.secondary,
    borderRadius: 12,
    fontSize: 16,
    color: colorsRGB.foreground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  addButton: {
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  roleCard: {
    width: '48%',
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  roleCount: {
    backgroundColor: colorsRGB.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  roleCountText: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
  },
  roleDescription: {
    fontSize: 12,
    color: colorsRGB.mutedForeground,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(44, 62, 80, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
    flex: 1,
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F59E0B',
  },
  userEmail: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginTop: 2
    ,
},
userRole: {
fontSize: 12,
color: colorsRGB.accent,
marginTop: 2,
},
editButton: {
padding: 8,
borderRadius: 8,
},
templateCard: {
flexDirection: 'row',
alignItems: 'flex-start',
gap: 16,
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
templateIcon: {
width: 40,
height: 40,
borderRadius: 12,
backgroundColor: colorsRGB.secondary,
alignItems: 'center',
justifyContent: 'center',
},
templateInfo: {
flex: 1,
},
templateName: {
fontSize: 16,
fontWeight: '500',
color: colorsRGB.foreground,
marginBottom: 2,
},
templateDescription: {
fontSize: 14,
color: colorsRGB.mutedForeground,
marginBottom: 4,
},
templateEdited: {
fontSize: 12,
color: colorsRGB.mutedForeground,
},
templateActions: {
flexDirection: 'row',
gap: 8,
},
iconButton: {
padding: 8,
borderRadius: 8,
},
integrationCard: {
flexDirection: 'row',
alignItems: 'flex-start',
gap: 16,
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
integrationIcon: {
width: 48,
height: 48,
borderRadius: 12,
backgroundColor: colorsRGB.secondary,
alignItems: 'center',
justifyContent: 'center',
},
integrationIconConnected: {
backgroundColor: 'rgba(74, 157, 126, 0.15)',
},
integrationInfo: {
flex: 1,
},
integrationHeader: {
flexDirection: 'row',
alignItems: 'center',
gap: 8,
marginBottom: 4,
},
integrationName: {
fontSize: 16,
fontWeight: '500',
color: colorsRGB.foreground,
},
connectedBadge: {
backgroundColor: 'rgba(74, 157, 126, 0.15)',
paddingHorizontal: 8,
paddingVertical: 2,
borderRadius: 4,
},
connectedText: {
fontSize: 12,
fontWeight: '500',
color: '#4A9D7E',
},
integrationDescription: {
fontSize: 14,
color: colorsRGB.mutedForeground,
},
integrationButton: {
marginTop: 0,
alignSelf: 'flex-start',
},
integrationButtonText: {
fontSize: 14,
fontWeight: '500',
color: '#FFFFFF',
},
integrationButtonTextOutline: {
color: colorsRGB.primary,
},
infoCard: {
flexDirection: 'row',
alignItems: 'flex-start',
gap: 12,
backgroundColor: 'rgba(245, 243, 239, 0.5)',
borderRadius: 16,
padding: 16,
marginTop: 12,
},
infoContent: {
flex: 1,
},
infoTitle: {
fontSize: 16,
fontWeight: '500',
color: colorsRGB.foreground,
marginBottom: 4,
},
infoText: {
fontSize: 14,
color: colorsRGB.mutedForeground,
lineHeight: 20,
},
adminCard: {
flexDirection: 'row',
alignItems: 'center',
gap: 16,
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
adminIcon: {
width: 48,
height: 48,
borderRadius: 12,
backgroundColor: 'rgba(44, 62, 80, 0.1)',
alignItems: 'center',
justifyContent: 'center',
},
adminInfo: {
flex: 1,
},
adminHeader: {
flexDirection: 'row',
alignItems: 'center',
gap: 8,
},
adminTitle: {
fontSize: 16,
fontWeight: '500',
color: colorsRGB.foreground,
},
adminBadge: {
backgroundColor: colorsRGB.secondary,
paddingHorizontal: 8,
paddingVertical: 2,
borderRadius: 10,
},
adminBadgeText: {
fontSize: 12,
color: colorsRGB.mutedForeground,
},
adminDescription: {
fontSize: 14,
color: colorsRGB.mutedForeground,
marginTop: 2,
},
quickInfo: {
flexDirection: 'row',
alignItems: 'flex-start',
gap: 12,
backgroundColor: colorsRGB.card,
borderRadius: 16,
padding: 16,
marginTop: 12,
marginBottom: 12,
shadowColor: '#2A3342',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.06,
shadowRadius: 8,
elevation: 3,
},
quickInfoText: {
flex: 1,
fontSize: 14,
color: colorsRGB.mutedForeground,
lineHeight: 20,
},
quickInfoBold: {
fontWeight: '500',
color: colorsRGB.foreground,
},
signOutButton: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
gap: 12,
backgroundColor: colorsRGB.card,
borderRadius: 12,
padding: 16,
borderWidth: 1,
borderColor: 'rgba(239, 68, 68, 0.3)',
},
signOutText: {
fontSize: 16,
fontWeight: '600',
color: '#EF4444',
},
});
