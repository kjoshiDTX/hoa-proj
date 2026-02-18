import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import RoleSelectionScreen from './src/screens/onboarding/RoleSelectionScreen';
import MainApp from './src/navigation/MainApp';
import { colorsRGB } from './src/theme/colors';

const queryClient = new QueryClient();

function AppContent() {
  const { session, userProfile, loading, hasAdminAccess } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'resident' | 'hoa' | null>(null);

  // Reset selected role when user changes (logout/login)
  useEffect(() => {
    if (!session) {
      setSelectedRole(null);
    }
  }, [session?.user?.id]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colorsRGB.primary} />
      </View>
    );
  }

  // Not logged in - show login screen
  if (!session || !userProfile) {
    return <LoginScreen />;
  }

  // Admin user who hasn't selected a role yet - show role selection
  if (hasAdminAccess && !selectedRole) {
    return <RoleSelectionScreen onSelectRole={setSelectedRole} />;
  }

  // Admin user who selected a role - show that app
  if (hasAdminAccess && selectedRole) {
    return <MainApp initialRole={selectedRole} />;
  }

  // Resident-only user - go straight to resident app
  return <MainApp initialRole="resident" />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorsRGB.background,
  },
});
