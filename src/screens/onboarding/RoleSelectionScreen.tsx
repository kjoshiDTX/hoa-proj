import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Users, LogOut } from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

interface RoleSelectionScreenProps {
  onSelectRole?: (role: 'resident' | 'hoa') => void;
}

export default function RoleSelectionScreen({ onSelectRole }: RoleSelectionScreenProps) {
  const { signOut, userProfile } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome{userProfile?.full_name ? `, ${userProfile.full_name}` : ''}</Text>
          <Text style={styles.subtitle}>Choose your role to continue</Text>
        </View>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => onSelectRole?.('resident')}
          >
            <View style={styles.roleIconContainer}>
              <Home size={48} color={colorsRGB.primary} />
            </View>
            <Text style={styles.roleTitle}>Resident</Text>
            <Text style={styles.roleDescription}>
              View cases, submit reports, and manage your property
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => onSelectRole?.('hoa')}
          >
            <View style={styles.roleIconContainer}>
              <Users size={48} color={colorsRGB.primary} />
            </View>
            <Text style={styles.roleTitle}>HOA Board</Text>
            <Text style={styles.roleDescription}>
              Review cases, manage community, and oversee compliance
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color={colorsRGB.mutedForeground} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsRGB.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
  },
  roleContainer: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  roleIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(44, 62, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colorsRGB.foreground,
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    padding: 16,
  },
  signOutText: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    fontWeight: '500',
  },
});
