import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Home, Shield, ChevronRight } from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';

interface RoleSelectionScreenProps {
  onSelectRole: (role: 'resident' | 'hoa') => void;
}

export default function RoleSelectionScreen({ onSelectRole }: RoleSelectionScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colorsRGB.background} />
      
      <View style={styles.content}>
        {/* Logo / Brand */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Home size={40} color={colorsRGB.primaryForeground} />
          </View>
          <Text style={styles.title}>CommunityHub</Text>
          <Text style={styles.subtitle}>Your HOA compliance made simple</Text>
        </View>

        {/* Role Selection */}
        <View style={styles.roleSection}>
          <Text style={styles.question}>How will you use the app?</Text>

          <View style={styles.optionsContainer}>
            {/* Resident Option */}
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => onSelectRole('resident')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, styles.residentIcon]}>
                <Home size={32} color={colorsRGB.accent} />
              </View>
              <View style={styles.roleTextContainer}>
                <Text style={styles.roleTitle}>I'm a Resident</Text>
                <Text style={styles.roleDescription}>
                  View my cases, ask questions, submit fixes
                </Text>
              </View>
              <ChevronRight size={24} color={colorsRGB.mutedForeground} />
            </TouchableOpacity>

            {/* HOA Leader Option */}
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => onSelectRole('hoa')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, styles.hoaIcon]}>
                <Shield size={32} color={colorsRGB.primary} />
              </View>
              <View style={styles.roleTextContainer}>
                <Text style={styles.roleTitle}>I'm an HOA Leader</Text>
                <Text style={styles.roleDescription}>
                  Manage violations, review cases, admin tools
                </Text>
              </View>
              <ChevronRight size={24} color={colorsRGB.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.signInLink}>Sign in</Text>
          </Text>
        </View>
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
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colorsRGB.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'System',
    fontSize: 40,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
  },
  roleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  question: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  optionsContainer: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    minHeight: 100,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  residentIcon: {
    backgroundColor: 'rgba(74, 157, 126, 0.15)',
  },
  hoaIcon: {
    backgroundColor: 'rgba(44, 62, 80, 0.15)',
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  roleDescription: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 15,
    color: colorsRGB.mutedForeground,
  },
  signInLink: {
    color: colorsRGB.primary,
    fontWeight: '500',
  },
});
