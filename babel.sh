cat > App.tsx << 'EOF'
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RoleSelectionScreen from './src/screens/onboarding/RoleSelectionScreen';

// Resident Screens
import ResidentHomeScreen from './src/screens/resident/ResidentHomeScreen';
import ResidentCasesScreen from './src/screens/resident/ResidentCasesScreen';
import ResidentCaseDetailScreen from './src/screens/resident/ResidentCaseDetailScreen';
import ResidentReportScreen from './src/screens/resident/ResidentReportScreen';
import ResidentSageScreen from './src/screens/resident/ResidentSageScreen';
import ResidentProfileScreen from './src/screens/resident/ResidentProfileScreen';
import ResidentNoticesScreen from './src/screens/resident/ResidentNoticesScreen';
import ResidentPaymentsScreen from './src/screens/resident/ResidentPaymentsScreen';
import ResidentNotificationSettingsScreen from './src/screens/resident/ResidentNotificationSettingsScreen';
import ResidentRulebookScreen from './src/screens/resident/ResidentRulebookScreen';

// HOA Screens
import HOAHomeScreen from './src/screens/hoa/HOAHomeScreen';
import HOACasesScreen from './src/screens/hoa/HOACasesScreen';
import HOACaseDetailScreen from './src/screens/hoa/HOACaseDetailScreen';
import HOAReviewQueueScreen from './src/screens/hoa/HOAReviewQueueScreen';
import HOANoticesScreen from './src/screens/hoa/HOANoticesScreen';
import HOAAnalyticsScreen from './src/screens/hoa/HOAAnalyticsScreen';
import HOACaseReviewScreen from './src/screens/hoa/HOACaseReviewScreen';
import HOAHomeAnalyticsScreen from './src/screens/hoa/HOAHomeAnalyticsScreen';
import HOAActivityScreen from './src/screens/hoa/HOAActivityScreen';
import HOAAdminScreen from './src/screens/hoa/HOAAdminScreen';
import HOAScanScreen from './src/screens/hoa/HOAScanScreen';

import { BottomNav } from './src/components/layout/BottomNav';
import { colorsRGB } from './src/theme/colors';

const queryClient = new QueryClient();

type ResidentView =
  | 'home'
  | 'cases'
  | 'case-detail'
  | 'report'
  | 'sage'
  | 'profile'
  | 'notices'
  | 'payments'
  | 'notification-settings'
  | 'rulebook';

type HOAView =
  | 'home'
  | 'cases'
  | 'case-detail'
  | 'review-queue'
  | 'case-review'
  | 'hoa-notices'
  | 'analytics'
  | 'home-analytics'
  | 'activity'
  | 'admin'
  | 'scan';

export default function App() {
  const [role, setRole] = useState<'resident' | 'hoa' | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedHomeId, setSelectedHomeId] = useState<string | null>(null);
  const [currentResidentView, setCurrentResidentView] = useState<ResidentView>('home');
  const [currentHOAView, setCurrentHOAView] = useState<HOAView>('home');

  const handleSelectRole = (selectedRole: 'resident' | 'hoa') => {
    setRole(selectedRole);
    setActiveTab('home');
    setCurrentResidentView('home');
    setCurrentHOAView('home');
  };

  const handleNavigate = (view: string) => {
    if (role === 'resident') {
      if (['home', 'cases', 'report', 'sage', 'profile'].includes(view)) {
        setActiveTab(view);
        setCurrentResidentView(view as ResidentView);
        setSelectedCaseId(null);
      } else {
        setCurrentResidentView(view as ResidentView);
      }
    } else if (role === 'hoa') {
      if (['home', 'cases', 'analytics'].includes(view)) {
        setActiveTab(view);
        setCurrentHOAView(view as HOAView);
        setSelectedCaseId(null);
        setSelectedHomeId(null);
      } else {
        setCurrentHOAView(view as HOAView);
      }
    }
  };

  const handleResidentCaseClick = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentResidentView('case-detail');
  };

  const handleHOACaseClick = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentHOAView('case-detail');
  };

  const handleBackFromResidentCaseDetail = () => {
    setCurrentResidentView('cases');
    setActiveTab('cases');
    setSelectedCaseId(null);
  };

  const handleBackFromHOACaseDetail = () => {
    setCurrentHOAView('cases');
    setActiveTab('cases');
    setSelectedCaseId(null);
  };

  const handleBackToProfile = () => {
    setCurrentResidentView('profile');
    setActiveTab('profile');
  };

  const handleBackToHOACases = () => {
    setCurrentHOAView('cases');
    setActiveTab('cases');
  };

  const handleBackToHOAHome = () => {
    setCurrentHOAView('home');
    setActiveTab('home');
  };

  const handleBackToReviewQueue = () => {
    setCurrentHOAView('review-queue');
  };

  const handleBackToAnalytics = () => {
    setCurrentHOAView('analytics');
    setActiveTab('analytics');
  };

  const renderResidentScreen = () => {
    switch (currentResidentView) {
      case 'home':
        return <ResidentHomeScreen onNavigate={handleNavigate} />;
      case 'cases':
        return (
          <ResidentCasesScreen
            onCaseClick={handleResidentCaseClick}
            onUpload={(id) => console.log('Upload for case:', id)}
          />
        );
      case 'case-detail':
        return (
          <ResidentCaseDetailScreen
            caseId={selectedCaseId || undefined}
            onBack={handleBackFromResidentCaseDetail}
            onUpload={() => console.log('Upload photo')}
            onAppeal={() => console.log('Appeal')}
          />
        );
      case 'report':
        return (
          <ResidentReportScreen
            onNavigate={handleNavigate}
            onOpenSage={() => handleNavigate('sage')}
          />
        );
      case 'sage':
        return <ResidentSageScreen />;
      case 'profile':
        return <ResidentProfileScreen onNavigate={handleNavigate} />;
      case 'notices':
        return (
          <ResidentNoticesScreen
            onBack={handleBackToProfile}
            onNoticeClick={(id) => console.log('Notice clicked:', id)}
          />
        );
      case 'payments':
        return <ResidentPaymentsScreen onBack={handleBackToProfile} />;
      case 'notification-settings':
        return <ResidentNotificationSettingsScreen onBack={handleBackToProfile} />;
      case 'rulebook':
        return <ResidentRulebookScreen />;
      default:
        return (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              {currentResidentView.charAt(0).toUpperCase() + currentResidentView.slice(1)} Screen
            </Text>
          </View>
        );
    }
  };

  const renderHOAScreen = () => {
    switch (currentHOAView) {
      case 'home':
        return (
          <HOAHomeScreen
            onNavigate={handleNavigate}
            onQueueClick={(queue) => {
              console.log('Queue clicked:', queue);
              setCurrentHOAView('review-queue');
            }}
            onViewActivity={() => setCurrentHOAView('activity')}
          />
        );
      case 'cases':
        return (
          <HOACasesScreen
            onCaseClick={handleHOACaseClick}
            onReviewQueueClick={() => setCurrentHOAView('review-queue')}
            onScanClick={() => setCurrentHOAView('scan')}
            onCreateCase={() => console.log('Create case')}
          />
        );
      case 'case-detail':
        return (
          <HOACaseDetailScreen
            caseId={selectedCaseId || undefined}
            onBack={handleBackFromHOACaseDetail}
            onActionComplete={() => console.log('Action completed')}
          />
        );
      case 'review-queue':
        return (
          <HOAReviewQueueScreen
            onBack={handleBackToHOACases}
            onItemClick={(itemId) => {
              console.log('Review item clicked:', itemId);
              setSelectedCaseId(itemId);
              setCurrentHOAView('case-review');
            }}
          />
        );
      case 'case-review':
        return (
          <HOACaseReviewScreen
            itemId={selectedCaseId || undefined}
            onBack={handleBackToReviewQueue}
            onActionComplete={(action) => {
              console.log('Action completed:', action);
              setCurrentHOAView('review-queue');
            }}
          />
        );
      case 'hoa-notices':
        return <HOANoticesScreen onBack={handleBackToHOAHome} />;
      case 'analytics':
        return (
          <HOAAnalyticsScreen
            onBack={handleBackToHOAHome}
            onHomeClick={(homeId) => {
              console.log('Home clicked:', homeId);
              setSelectedHomeId(homeId);
              setCurrentHOAView('home-analytics');
            }}
            onCaseClick={(caseId) => {
              setSelectedCaseId(caseId);
              setCurrentHOAView('case-detail');
            }}
          />
        );
      case 'home-analytics':
        return (
          <HOAHomeAnalyticsScreen
            homeId={selectedHomeId || undefined}
            onBack={handleBackToAnalytics}
            onCaseClick={(caseId) => {
              setSelectedCaseId(caseId);
              setCurrentHOAView('case-detail');
            }}
          />
        );
      case 'activity':
        return (
          <HOAActivityScreen
            onBack={handleBackToHOAHome}
            onCaseClick={(caseId) => {
              setSelectedCaseId(caseId);
              setCurrentHOAView('case-detail');
            }}
          />
        );
      case 'admin':
        return <HOAAdminScreen onBack={handleBackToHOAHome} />;
      case 'scan':
        return (
          <HOAScanScreen
            onBack={() => setCurrentHOAView('home')}
            onComplete={() => {
              console.log('Scan completed');
              setCurrentHOAView('cases');
            }}
          />
        );
      default:
        return (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              {currentHOAView.charAt(0).toUpperCase() + currentHOAView.slice(1)} Screen
            </Text>
          </View>
        );
    }
  };

  if (!role) {
    return (
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <RoleSelectionScreen onSelectRole={handleSelectRole} />
        </QueryClientProvider>
      </SafeAreaProvider>
    );
  }

  // Hide bottom nav for sub-screens
  const hideNav =
    (role === 'resident' &&
      ['case-detail', 'notices', 'payments', 'notification-settings', 'rulebook'].includes(
        currentResidentView
      )) ||
    (role === 'hoa' &&
      [
        'case-detail',
        'review-queue',
        'case-review',
        'hoa-notices',
        'home-analytics',
        'activity',
        'admin',
        'scan',
      ].includes(currentHOAView));

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <View style={styles.container}>
          {role === 'resident' ? renderResidentScreen() : renderHOAScreen()}
          {!hideNav && (
            <BottomNav role={role} activeTab={activeTab} onTabChange={handleNavigate} />
          )}
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsRGB.background,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: colorsRGB.foreground,
  },
});
EOF