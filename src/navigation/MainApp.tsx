import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RoleSelectionScreen from '../screens/onboarding/RoleSelectionScreen';

// Import all screens...
import ResidentHomeScreen from '../screens/resident/ResidentHomeScreen';
import ResidentCasesScreen from '../screens/resident/ResidentCasesScreen';
import ResidentCaseDetailScreen from '../screens/resident/ResidentCaseDetailScreen';
import ResidentReportScreen from '../screens/resident/ResidentReportScreen';
import ResidentSageScreen from '../screens/resident/ResidentSageScreen';
import ResidentProfileScreen from '../screens/resident/ResidentProfileScreen';
import ResidentNoticesScreen from '../screens/resident/ResidentNoticesScreen';
import ResidentPaymentsScreen from '../screens/resident/ResidentPaymentsScreen';
import ResidentNotificationSettingsScreen from '../screens/resident/ResidentNotificationSettingsScreen';
import ResidentRulebookScreen from '../screens/resident/ResidentRulebookScreen';

import HOAHomeScreen from '../screens/hoa/HOAHomeScreen';
import HOACasesScreen from '../screens/hoa/HOACasesScreen';
import HOACaseDetailScreen from '../screens/hoa/HOACaseDetailScreen';
import HOAReviewQueueScreen from '../screens/hoa/HOAReviewQueueScreen';
import HOANoticesScreen from '../screens/hoa/HOANoticesScreen';
import HOAAnalyticsScreen from '../screens/hoa/HOAAnalyticsScreen';
import HOACaseReviewScreen from '../screens/hoa/HOACaseReviewScreen';
import HOAHomeAnalyticsScreen from '../screens/hoa/HOAHomeAnalyticsScreen';
import HOAActivityScreen from '../screens/hoa/HOAActivityScreen';
import HOAAdminScreen from '../screens/hoa/HOAAdminScreen';
import HOAScanScreen from '../screens/hoa/HOAScanScreen';

import { BottomNav } from '../components/layout/BottomNav';
import { colorsRGB } from '../theme/colors';

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

interface MainAppProps {
  initialRole?: 'resident' | 'hoa';
}

export default function MainApp({ initialRole }: MainAppProps) {
  const [role, setRole] = useState<'resident' | 'hoa' | null>(initialRole || null);
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

  // Show role selection if no role selected and initialRole not provided
  if (!role && !initialRole) {
    return <RoleSelectionScreen onSelectRole={handleSelectRole} />;
  }

  const handleNavigate = (view: string) => {
    const currentRole = role || initialRole;
    if (currentRole === 'resident') {
      if (['home', 'cases', 'report', 'sage', 'profile'].includes(view)) {
        setActiveTab(view);
        setCurrentResidentView(view as ResidentView);
        setSelectedCaseId(null);
      } else {
        setCurrentResidentView(view as ResidentView);
      }
    } else if (currentRole === 'hoa') {
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

  const currentRole = role || initialRole!;
  const hideNav =
    (currentRole === 'resident' &&
      ['case-detail', 'notices', 'payments', 'notification-settings', 'rulebook'].includes(
        currentResidentView
      )) ||
    (currentRole === 'hoa' &&
      [
        'case-detail',
        'review-queue',
        'case-review',
        'hoa-notices',
        'home-analytics',
        'activity',
        'scan',
      ].includes(currentHOAView));

  return (
    <View style={styles.container}>
      {currentRole === 'resident' ? renderResidentScreen() : renderHOAScreen()}
      {!hideNav && (
        <BottomNav role={currentRole} activeTab={activeTab} onTabChange={handleNavigate} />
      )}
    </View>
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
