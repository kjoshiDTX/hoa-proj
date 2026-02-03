import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {
  Home,
  FileText,
  User,
  Camera,
  Settings,
  AlertCircle,
  Sparkles,
  BarChart3,
} from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';

type UserRole = 'resident' | 'hoa';

interface NavItem {
  id: string;
  label: string;
  icon: (props: { size: number; color: string }) => JSX.Element;
}

interface BottomNavProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const residentTabs: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'cases', label: 'My Cases', icon: FileText },
  { id: 'report', label: 'Report', icon: AlertCircle },
  { id: 'sage', label: 'Sage', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: User },
];

const hoaTabs: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'scan', label: 'Scan', icon: Camera },
  { id: 'cases', label: 'Cases', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'admin', label: 'Admin', icon: Settings },
];

export function BottomNav({ role, activeTab, onTabChange }: BottomNavProps) {
  const tabs = role === 'resident' ? residentTabs : hoaTabs;

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Icon
              size={24}
              color={isActive ? colorsRGB.primary : colorsRGB.mutedForeground}
            />
            <Text
              style={[
                styles.label,
                isActive && styles.labelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colorsRGB.card,
    borderTopWidth: 1,
    borderTopColor: colorsRGB.border,
    paddingBottom: 0,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 64,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colorsRGB.mutedForeground,
    marginTop: 4,
  },
  labelActive: {
    color: colorsRGB.primary,
  },
});
