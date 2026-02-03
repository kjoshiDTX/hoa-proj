import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Camera,
  RefreshCw,
  Lock,
  Send,
} from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';

type ActivityType =
  | 'case_created'
  | 'decision_made'
  | 'status_change'
  | 'comment_resident'
  | 'comment_hoa_public'
  | 'comment_hoa_internal'
  | 'photo_submitted'
  | 'notice_sent';

type ActorRole = 'system' | 'hoa' | 'resident';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
  actorRole?: ActorRole;
  isInternal?: boolean;
  metadata?: Record<string, any>;
  imageUrl?: string;
}

interface CaseActivityFeedProps {
  activities: Activity[];
  viewerRole: 'hoa' | 'resident';
  filter?: 'all' | 'messages' | 'actions';
}

export function CaseActivityFeed({ activities, viewerRole, filter = 'all' }: CaseActivityFeedProps) {
  const getActivityIcon = (type: ActivityType, isInternal?: boolean) => {
    if (isInternal) {
      return <Lock size={16} color="#F59E0B" />;
    }

    switch (type) {
      case 'case_created':
        return <FileText size={16} color={colorsRGB.accent} />;
      case 'decision_made':
        return <CheckCircle size={16} color="#4A9D7E" />;
      case 'status_change':
        return <RefreshCw size={16} color="#3B82F6" />;
      case 'comment_resident':
      case 'comment_hoa_public':
      case 'comment_hoa_internal':
        return <MessageSquare size={16} color={colorsRGB.mutedForeground} />;
      case 'photo_submitted':
      case 'notice_sent':
        return <Camera size={16} color="#3B82F6" />;
      default:
        return <FileText size={16} color={colorsRGB.mutedForeground} />;
    }
  };

  const getActivityColor = (type: ActivityType, isInternal?: boolean) => {
    if (isInternal) {
      return 'rgba(245, 158, 11, 0.15)';
    }

    switch (type) {
      case 'case_created':
        return 'rgba(74, 157, 126, 0.15)';
      case 'decision_made':
        return 'rgba(74, 157, 126, 0.15)';
      case 'status_change':
        return 'rgba(59, 130, 246, 0.15)';
      case 'photo_submitted':
      case 'notice_sent':
        return 'rgba(59, 130, 246, 0.15)';
      default:
        return colorsRGB.secondary;
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (viewerRole === 'resident' && activity.isInternal) {
      return false;
    }

    if (filter === 'messages') {
      return ['comment_resident', 'comment_hoa_public', 'comment_hoa_internal'].includes(
        activity.type
      );
    }

    if (filter === 'actions') {
      return !['comment_resident', 'comment_hoa_public', 'comment_hoa_internal'].includes(
        activity.type
      );
    }

    return true;
  });

  return (
    <View style={styles.container}>
      {filteredActivities.map((activity, index) => {
        const isLast = index === filteredActivities.length - 1;

        return (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.timeline}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getActivityColor(activity.type, activity.isInternal) },
                ]}
              >
                {getActivityIcon(activity.type, activity.isInternal)}
              </View>
              {!isLast && <View style={styles.timelineLine} />}
            </View>

            <View style={styles.activityContent}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                {activity.isInternal && (
                  <View style={styles.internalBadge}>
                    <Lock size={12} color="#F59E0B" />
                    <Text style={styles.internalText}>Internal</Text>
                  </View>
                )}
              </View>

              {activity.description && (
                <Text style={styles.activityDescription}>{activity.description}</Text>
              )}

              <View style={styles.activityMeta}>
                {activity.actor && (
                  <Text style={styles.activityActor}>{activity.actor} · </Text>
                )}
                <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

interface CommentComposerProps {
  viewerRole: 'hoa' | 'resident';
  onSubmit?: (text: string, isInternal: boolean) => void;
}

export function CommentComposer({ viewerRole, onSubmit }: CommentComposerProps) {
  const [message, setMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit?.(message, isInternal);
      setMessage('');
    }
  };

  return (
    <View style={styles.composer}>
      {viewerRole === 'hoa' && (
        <View style={styles.composerToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, !isInternal && styles.toggleButtonActive]}
            onPress={() => setIsInternal(false)}
          >
            <Text style={[styles.toggleText, !isInternal && styles.toggleTextActive]}>
              Message resident
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, isInternal && styles.toggleButtonInternal]}
            onPress={() => setIsInternal(true)}
          >
            <Text style={[styles.toggleText, isInternal && styles.toggleTextInternal]}>
              Internal note
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.composerInput}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={isInternal ? 'Add internal note...' : 'Add a comment...'}
          placeholderTextColor={colorsRGB.mutedForeground}
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSubmit}
          disabled={!message.trim()}
        >
          <Send size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timeline: {
    alignItems: 'center',
    width: 32,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: colorsRGB.border,
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
    paddingBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colorsRGB.foreground,
  },
  internalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  internalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  activityDescription: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    lineHeight: 20,
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityActor: {
    fontSize: 14,
    fontWeight: '500',
    color: colorsRGB.mutedForeground,
  },
  activityTimestamp: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  composer: {
    gap: 8,
  },
  composerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: colorsRGB.secondary,
  },
  toggleButtonActive: {
    backgroundColor: colorsRGB.primary,
  },
  toggleButtonInternal: {
    backgroundColor: '#F59E0B',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '500',
    color: colorsRGB.secondaryForeground,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  toggleTextInternal: {
    color: '#FFFFFF',
  },
  composerInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 80,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colorsRGB.secondary,
    borderRadius: 12,
    fontSize: 16,
    color: colorsRGB.foreground,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colorsRGB.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
