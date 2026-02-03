import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  BookOpen,
  Clock,
  Car,
  Trash2,
  Home,
  Paintbrush,
  Calendar,
  HelpCircle,
  Bell,
  Pin,
  ChevronRight,
  Lightbulb,
  MessageSquare,
} from 'lucide-react-native';
import { colorsRGB } from '../../theme/colors';
import { Button } from '../../components/ui/Button';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  citation?: {
    section: string;
    title: string;
    page: number;
    excerpt?: string;
  };
  timestamp: string;
  dateGroup?: string;
}

interface Notice {
  id: string;
  title: string;
  preview: string;
  category: 'trash' | 'pool' | 'safety' | 'meeting' | 'maintenance' | 'dues';
  timestamp: string;
  isRead: boolean;
  isPinned?: boolean;
}

type TabType = 'chat' | 'browse' | 'notices';
type NoticeView = 'list' | 'detail';

const rulebookCategories = [
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'exterior', label: 'Exterior & Landscaping', icon: Home },
  { id: 'trash', label: 'Trash & Recycling', icon: Trash2 },
  { id: 'modifications', label: 'Modifications & ACC', icon: Paintbrush },
  { id: 'amenities', label: 'Amenities', icon: Calendar },
  { id: 'general', label: 'General Rules', icon: BookOpen },
];

const quickHelpTopics = [
  { id: 'deadlines', label: 'Understanding deadlines', icon: Clock },
  { id: 'appeals', label: 'How to appeal', icon: FileText },
  { id: 'upload', label: 'Uploading fix photos', icon: HelpCircle },
  { id: 'report', label: 'Reporting an issue', icon: HelpCircle },
];

const popularQuestions = [
  'Trash can rules',
  'Guest parking',
  'Exterior changes',
  'How to appeal',
  'Holiday decorations',
  'Quiet hours',
];

const categoryConfig: Record<Notice['category'], { label: string; bgColor: string; textColor: string }> = {
  trash: { label: 'Trash', bgColor: 'rgba(74, 157, 126, 0.1)', textColor: colorsRGB.accent },
  pool: { label: 'Pool', bgColor: 'rgba(59, 130, 246, 0.1)', textColor: '#3B82F6' },
  safety: { label: 'Safety', bgColor: 'rgba(239, 68, 68, 0.1)', textColor: '#EF4444' },
  meeting: { label: 'Meeting', bgColor: 'rgba(147, 51, 234, 0.1)', textColor: '#9333EA' },
  maintenance: { label: 'Maintenance', bgColor: 'rgba(245, 158, 11, 0.1)', textColor: '#F59E0B' },
  dues: { label: 'Dues', bgColor: 'rgba(74, 157, 126, 0.1)', textColor: '#4A9D7E' },
};

const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Holiday Trash Schedule Change',
    preview: 'Collection moved to Monday, Jan 6 due to the New Year holiday.',
    category: 'trash',
    timestamp: '2h ago',
    isRead: false,
    isPinned: true,
  },
  {
    id: '2',
    title: 'Pool Maintenance Reminder',
    preview: 'Pool closed Jan 8-10 for annual deep cleaning and inspection.',
    category: 'pool',
    timestamp: '1d ago',
    isRead: false,
  },
  {
    id: '3',
    title: 'Community Safety Meeting',
    preview: 'Join us Jan 15 at the clubhouse for our quarterly safety review.',
    category: 'meeting',
    timestamp: '2d ago',
    isRead: true,
  },
];

export default function ResidentSageScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set());
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [noticeView, setNoticeView] = useState<NoticeView>('list');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [sageAssistResponse, setSageAssistResponse] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const toggleCitation = (messageId: string) => {
    setExpandedCitations((prev) => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: 'Just now',
      dateGroup: 'Today',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response: Message;

      if (lowerText.includes('trash') || lowerText.includes('garbage')) {
        response = {
          id: (Date.now() + 1).toString(),
          text: "Trash cans must be stored out of view from the street. You can put them curbside after 5 PM the evening before collection, and must retrieve them by 8 PM on collection day.",
          isBot: true,
          citation: {
            section: 'Section 5.3',
            title: 'Waste Management',
            page: 18,
            excerpt:
              'All waste receptacles shall be stored within the garage or behind a fence/enclosure that screens them from street view. Receptacles may be placed at the curb no earlier than 5:00 PM on the day preceding scheduled collection.',
          },
          timestamp: 'Just now',
          dateGroup: 'Today',
        };
      } else if (lowerText.includes('parking') || lowerText.includes('guest')) {
        response = {
          id: (Date.now() + 1).toString(),
          text: 'Guest vehicles may park in visitor spots for up to 72 hours. Street parking is limited to 4 hours during daytime. Overnight street parking requires a permit.',
          isBot: true,
          citation: {
            section: 'Section 7.1',
            title: 'Parking Regulations',
            page: 24,
            excerpt:
              'Visitor parking spaces are designated for guests only, with a maximum stay of 72 consecutive hours. Street parking between 8:00 AM and 10:00 PM is limited to 4 hours.',
          },
          timestamp: 'Just now',
          dateGroup: 'Today',
        };
      } else {
        response = {
          id: (Date.now() + 1).toString(),
          text: "I couldn't find a specific answer about that in your community rulebook. Try rephrasing your question, or browse the rulebook categories below for more options.",
          isBot: true,
          timestamp: 'Just now',
          dateGroup: 'Today',
        };
      }

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      if (input === '') {
        setInput('What are my deadlines?');
      }
    } else {
      setIsListening(true);
    }
  };

  const handleNoticeClick = (notice: Notice) => {
    setNotices((prev) => prev.map((n) => (n.id === notice.id ? { ...n, isRead: true } : n)));
    setSelectedNotice(notice);
    setNoticeView('detail');
    setSageAssistResponse(null);
  };

  const handleSageAssist = (action: 'summarize' | 'affect' | 'next') => {
    if (!selectedNotice) return;

    let response = '';
    switch (action) {
      case 'summarize':
        response = `This notice is about ${selectedNotice.title.toLowerCase()}. ${selectedNotice.preview} No action is required unless you're directly affected.`;
        break;
      case 'affect':
        response =
          selectedNotice.category === 'dues'
            ? 'Yes, this affects you. Your Q1 dues payment of $128.50 is due by January 15th. You can pay through the app or by mailing a check.'
            : "Based on your account, this notice applies to all residents in your community. Mark your calendar if the dates affect your plans.";
        break;
      case 'next':
        response =
          selectedNotice.category === 'dues'
            ? "Your next step is to pay your dues before January 15th. Tap 'Pay Now' in the Dues section, or set a reminder so you don't forget."
            : "No action is required right now. This is for your information. If you have questions, you can ask me or contact the HOA office.";
        break;
    }
    setSageAssistResponse(response);
  };

  const hasMessages = messages.length > 0;
  const unreadCount = notices.filter((n) => !n.isRead).length;

  const renderChatTab = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.chatContainer}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesScroll}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {!hasMessages ? (
          <View style={styles.emptyChat}>
            <View style={styles.sageIcon}>
              <Sparkles size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.emptyTitle}>Hi, I'm Sage</Text>
            <Text style={styles.emptySubtitle}>
              Your community assistant. Ask me anything about rules, deadlines, or how to get things done.
            </Text>

            <TouchableOpacity style={styles.voiceButton} onPress={toggleVoiceInput}>
              <Mic size={24} color={colorsRGB.accent} />
              <Text style={styles.voiceButtonText}>Ask by voice</Text>
            </TouchableOpacity>

            <View style={styles.popularSection}>
              <Text style={styles.popularTitle}>POPULAR QUESTIONS</Text>
              <View style={styles.popularGrid}>
                {popularQuestions.map((question) => (
                  <TouchableOpacity
                    key={question}
                    style={styles.popularQuestion}
                    onPress={() => handleSend(question)}
                  >
                    <Text style={styles.popularQuestionText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.messagesList}>
            {messages.map((message) => (
              <View key={message.id} style={styles.messageWrapper}>
                <View
                  style={[
                    styles.messageBubble,
                    message.isBot ? styles.messageBubbleBot : styles.messageBubbleUser,
                  ]}
                >
                  <Text style={[styles.messageText, !message.isBot && styles.messageTextUser]}>
                    {message.text}
                  </Text>
                </View>

                {message.citation && (
                  <View style={styles.citationCard}>
                    <TouchableOpacity
                      style={styles.citationButton}
                      onPress={() => toggleCitation(message.id)}
                    >
                      <FileText size={20} color={colorsRGB.accent} />
                      <View style={styles.citationContent}>
                        <Text style={styles.citationTitle}>
                          {message.citation.section} – {message.citation.title}
                        </Text>
                        <Text style={styles.citationPage}>Page {message.citation.page}</Text>
                      </View>
                      {expandedCitations.has(message.id) ? (
                        <ChevronUp size={20} color={colorsRGB.mutedForeground} />
                      ) : (
                        <ChevronDown size={20} color={colorsRGB.mutedForeground} />
                      )}
                    </TouchableOpacity>

                    {expandedCitations.has(message.id) && message.citation.excerpt && (
                      <View style={styles.citationExcerpt}>
                        <Text style={styles.citationExcerptText}>"{message.citation.excerpt}"</Text>
                      </View>
                    )}
                  </View>
                )}

                <Text
                  style={[
                    styles.messageTimestamp,
                    !message.isBot && styles.messageTimestampRight,
                  ]}
                >
                  {message.timestamp}
                </Text>
              </View>
            ))}

            {isTyping && (
              <View style={styles.typingIndicator}>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDots}>
                    <View style={[styles.typingDot, { opacity: 0.4 }]} />
                    <View style={[styles.typingDot, { opacity: 0.6 }]} />
                    <View style={[styles.typingDot, { opacity: 0.8 }]} />
                  </View>
                  <Text style={styles.typingText}>Sage is thinking...</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.micButton, isListening && styles.micButtonActive]}
          onPress={toggleVoiceInput}
        >
          {isListening ? (
            <MicOff size={24} color="#FFFFFF" />
          ) : (
            <Mic size={24} color={colorsRGB.primary} />
          )}
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={isListening ? 'Listening...' : 'Ask Sage...'}
            placeholderTextColor={colorsRGB.mutedForeground}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSend(input)}
            editable={!isListening}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => handleSend(input)}
            disabled={!input.trim() || isListening}
          >
            <Send size={20} color={input.trim() ? colorsRGB.accent : colorsRGB.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {isListening && (
        <View style={styles.listeningIndicator}>
          <Text style={styles.listeningText}>Listening... Tap the mic button when you're done.</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );

  const renderBrowseTab = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.browseContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.searchContainer}>
        <Search size={20} color={colorsRGB.mutedForeground} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search the rulebook..."
          placeholderTextColor={colorsRGB.mutedForeground}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>BROWSE BY CATEGORY</Text>
        <View style={styles.categoriesGrid}>
          {rulebookCategories.map((category) => {
            const Icon = category.icon;
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleSend(`Tell me about ${category.label}`)}
              >
                <View style={styles.categoryIcon}>
                  <Icon size={20} color={colorsRGB.accent} />
                </View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>QUICK HELP</Text>
        <View style={styles.helpList}>
          {quickHelpTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <TouchableOpacity
                key={topic.id}
                style={styles.helpTopic}
                onPress={() => handleSend(`How do I ${topic.label.toLowerCase()}?`)}
              >
                <View style={styles.helpIcon}>
                  <Icon size={16} color={colorsRGB.accent} />
                </View>
                <Text style={styles.helpLabel}>{topic.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );

  const renderNoticesTab = () => {
    if (noticeView === 'detail' && selectedNotice) {
      return renderNoticeDetail();
    }

    const pinnedNotices = notices.filter((n) => n.isPinned);
    const regularNotices = notices.filter((n) => !n.isPinned);

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.noticesContent}
        showsVerticalScrollIndicator={false}
      >
        {notices.length === 0 ? (
          <View style={styles.emptyNotices}>
            <View style={styles.emptyNoticesIcon}>
              <Bell size={32} color={colorsRGB.mutedForeground} />
            </View>
            <Text style={styles.emptyNoticesTitle}>No notices yet</Text>
            <Text style={styles.emptyNoticesText}>Updates from your HOA will appear here.</Text>
          </View>
        ) : (
          <View style={styles.noticesList}>
            {pinnedNotices.length > 0 && (
              <View style={styles.noticesSection}>
                <View style={styles.pinnedHeader}>
                  <Pin size={12} color={colorsRGB.mutedForeground} />
                  <Text style={styles.noticesSectionTitle}>PINNED</Text>
                </View>
                {pinnedNotices.map((notice) => (
                  <NoticeCard key={notice.id} notice={notice} onPress={() => handleNoticeClick(notice)} />
                ))}
              </View>
            )}

            {regularNotices.length > 0 && (
              <View style={styles.noticesSection}>
                {pinnedNotices.length > 0 && (
                  <Text style={styles.noticesSectionTitle}>RECENT</Text>
                )}
                {regularNotices.map((notice) => (
                  <NoticeCard key={notice.id} notice={notice} onPress={() => handleNoticeClick(notice)} />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderNoticeDetail = () => {
    if (!selectedNotice) return null;

    const category = categoryConfig[selectedNotice.category];

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.noticeDetailContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setNoticeView('list');
            setSelectedNotice(null);
            setSageAssistResponse(null);
          }}
        >
          <ChevronRight size={20} color={colorsRGB.mutedForeground} style={{ transform: [{ rotate: '180deg' }] }} />
          <Text style={styles.backText}>Back to Notices</Text>
        </TouchableOpacity>

        <View style={styles.noticeDetailMeta}>
          <View style={[styles.noticeCategoryBadge, { backgroundColor: category.bgColor }]}>
            <Text style={[styles.noticeCategoryText, { color: category.textColor }]}>
              {category.label}
            </Text>
          </View>
          {selectedNotice.isPinned && <Pin size={16} color={colorsRGB.accent} />}
        </View>

        <Text style={styles.noticeDetailTitle}>{selectedNotice.title}</Text>
        <Text style={styles.noticeDetailPosted}>Posted by HOA · {selectedNotice.timestamp}</Text>

        <Text style={styles.noticeDetailBody}>{selectedNotice.preview}</Text>
        <Text style={styles.noticeDetailInfo}>
          If you have any questions about this notice, please contact the HOA office during business hours or use Sage to get quick answers.
        </Text>

        <View style={styles.sageAssistCard}>
          <View style={styles.sageAssistHeader}>
            <View style={styles.sageAssistIcon}>
              <Sparkles size={20} color={colorsRGB.accent} />
            </View>
            <View>
              <Text style={styles.sageAssistTitle}>Sage Assist</Text>
              <Text style={styles.sageAssistSubtitle}>Let me help you understand this notice</Text>
            </View>
          </View>

          <View style={styles.sageActions}>
            <TouchableOpacity
              style={styles.sageAction}
              onPress={() => handleSageAssist('summarize')}
            >
              <Lightbulb size={20} color={colorsRGB.accent} />
              <Text style={styles.sageActionText}>Summarize this</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sageAction}
              onPress={() => handleSageAssist('affect')}
            >
              <HelpCircle size={20} color={colorsRGB.accent} />
              <Text style={styles.sageActionText}>Does this affect me?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sageAction}
              onPress={() => handleSageAssist('next')}
            >
              <MessageSquare size={20} color={colorsRGB.accent} />
              <Text style={styles.sageActionText}>What should I do next?</Text>
            </TouchableOpacity>
          </View>

          {sageAssistResponse && (
            <View style={styles.sageResponse}>
              <Text style={styles.sageResponseText}>{sageAssistResponse}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Sparkles size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Sage</Text>
            <Text style={styles.headerSubtitle}>Your community assistant</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          {[
            { id: 'chat' as TabType, label: 'Chat' },
            { id: 'browse' as TabType, label: 'Browse Rules' },
            { id: 'notices' as TabType, label: 'Notices', badge: unreadCount > 0 ? unreadCount : undefined },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => {
                setActiveTab(tab.id);
                if (tab.id === 'notices') {
                  setNoticeView('list');
                  setSelectedNotice(null);
                }
              }}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {tab.badge && activeTab !== tab.id && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'chat' && renderChatTab()}
      {activeTab === 'browse' && renderBrowseTab()}
      {activeTab === 'notices' && renderNoticesTab()}
    </SafeAreaView>
  );
}

function NoticeCard({ notice, onPress }: { notice: Notice; onPress: () => void }) {
  const category = categoryConfig[notice.category];

  return (
    <TouchableOpacity style={styles.noticeCard} onPress={onPress}>
      <View style={[styles.noticeIndicator, { backgroundColor: notice.isRead ? colorsRGB.border : colorsRGB.accent }]} />

      <View style={styles.noticeContent}>
        <View style={styles.noticeMeta}>
          <View style={[styles.noticeCategoryBadge, { backgroundColor: category.bgColor }]}>
            <Text style={[styles.noticeCategoryText, { color: category.textColor }]}>{category.label}</Text>
          </View>
          {notice.isPinned && <Pin size={12} color={colorsRGB.accent} />}
        </View>

        <Text style={[styles.noticeTitle, !notice.isRead && styles.noticeTitleUnread]}>
          {notice.title}
        </Text>
        <Text style={styles.noticePreview} numberOfLines={1}>
          {notice.preview}
        </Text>
      </View>

      <Text style={styles.noticeTimestamp}>{notice.timestamp}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsRGB.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colorsRGB.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colorsRGB.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colorsRGB.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    backgroundColor: colorsRGB.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.secondaryForeground,
  },
  tabTextActive: {
    color: colorsRGB.primaryForeground,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatContainer: {
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  emptyChat: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  sageIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colorsRGB.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colorsRGB.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 280,
    lineHeight: 22,
},
voiceButton: {
flexDirection: 'row',
alignItems: 'center',
gap: 12,
paddingHorizontal: 24,
paddingVertical: 16,
borderRadius: 16,
backgroundColor: 'rgba(74, 157, 126, 0.1)',
borderWidth: 1,
borderColor: 'rgba(74, 157, 126, 0.3)',
marginBottom: 32,
},
voiceButtonText: {
fontSize: 18,
fontWeight: '500',
color: colorsRGB.accent,
},
popularSection: {
width: '100%',
},
popularTitle: {
fontSize: 12,
fontWeight: '600',
color: colorsRGB.mutedForeground,
letterSpacing: 1,
marginBottom: 12,
textAlign: 'center',
},
popularGrid: {
flexDirection: 'row',
flexWrap: 'wrap',
gap: 8,
justifyContent: 'center',
},
popularQuestion: {
paddingHorizontal: 16,
paddingVertical: 12,
borderRadius: 12,
backgroundColor: colorsRGB.secondary,
borderWidth: 1,
borderColor: colorsRGB.border,
minHeight: 48,
justifyContent: 'center',
},
popularQuestionText: {
fontSize: 16,
fontWeight: '500',
color: colorsRGB.secondaryForeground,
},
messagesList: {
gap: 16,
},
messageWrapper: {
maxWidth: '90%',
},
messageBubble: {
borderRadius: 16,
paddingHorizontal: 20,
paddingVertical: 16,
},
messageBubbleBot: {
backgroundColor: colorsRGB.card,
borderTopLeftRadius: 4,
alignSelf: 'flex-start',
shadowColor: '#2A3342',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.06,
shadowRadius: 8,
elevation: 3,
},
messageBubbleUser: {
backgroundColor: colorsRGB.primary,
borderTopRightRadius: 4,
alignSelf: 'flex-end',
},
messageText: {
fontSize: 16,
color: colorsRGB.foreground,
lineHeight: 22,
},
messageTextUser: {
color: colorsRGB.primaryForeground,
},
citationCard: {
marginTop: 12,
backgroundColor: 'rgba(245, 243, 239, 0.5)',
borderRadius: 12,
borderWidth: 1,
borderColor: colorsRGB.border,
overflow: 'hidden',
},
citationButton: {
flexDirection: 'row',
alignItems: 'center',
gap: 12,
padding: 16,
},
citationContent: {
flex: 1,
},
citationTitle: {
fontSize: 14,
fontWeight: '600',
color: colorsRGB.foreground,
marginBottom: 2,
},
citationPage: {
fontSize: 12,
color: colorsRGB.mutedForeground,
},
citationExcerpt: {
paddingHorizontal: 16,
paddingBottom: 16,
borderTopWidth: 1,
borderTopColor: colorsRGB.border,
},
citationExcerptText: {
fontSize: 14,
fontStyle: 'italic',
color: colorsRGB.mutedForeground,
lineHeight: 20,
},
messageTimestamp: {
fontSize: 12,
color: colorsRGB.mutedForeground,
marginTop: 6,
},
messageTimestampRight: {
textAlign: 'right',
},
typingIndicator: {
maxWidth: '90%',
},
typingBubble: {
flexDirection: 'row',
alignItems: 'center',
gap: 8,
backgroundColor: colorsRGB.card,
borderRadius: 16,
borderTopLeftRadius: 4,
paddingHorizontal: 20,
paddingVertical: 16,
shadowColor: '#2A3342',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.06,
shadowRadius: 8,
elevation: 3,
},
typingDots: {
flexDirection: 'row',
gap: 4,
},
typingDot: {
width: 8,
height: 8,
borderRadius: 4,
backgroundColor: colorsRGB.accent,
},
typingText: {
fontSize: 14,
color: colorsRGB.mutedForeground,
},
inputContainer: {
flexDirection: 'row',
padding: 16,
gap: 12,
borderTopWidth: 1,
borderTopColor: colorsRGB.border,
backgroundColor: colorsRGB.background,
},
micButton: {
width: 56,
height: 56,
borderRadius: 12,
backgroundColor: colorsRGB.card,
borderWidth: 2,
borderColor: colorsRGB.primary,
alignItems: 'center',
justifyContent: 'center',
},
micButtonActive: {
backgroundColor: colorsRGB.accent,
borderColor: colorsRGB.accent,
},
inputWrapper: {
flex: 1,
flexDirection: 'row',
alignItems: 'center',
backgroundColor: colorsRGB.secondary,
borderWidth: 1,
borderColor: colorsRGB.border,
borderRadius: 12,
paddingHorizontal: 16,
},
input: {
flex: 1,
fontSize: 18,
color: colorsRGB.foreground,
paddingVertical: 16,
},
sendButton: {
width: 40,
height: 40,
alignItems: 'center',
justifyContent: 'center',
},
listeningIndicator: {
paddingVertical: 12,
alignItems: 'center',
},
listeningText: {
fontSize: 14,
color: colorsRGB.accent,
},
scrollView: {
flex: 1,
},
browseContent: {
padding: 20,
},
searchContainer: {
position: 'relative',
marginBottom: 24,
},
searchIcon: {
position: 'absolute',
left: 16,
top: 18,
zIndex: 1,
},
searchInput: {
paddingLeft: 48,
paddingRight: 20,
paddingVertical: 16,
backgroundColor: colorsRGB.secondary,
borderWidth: 1,
borderColor: colorsRGB.border,
borderRadius: 12,
fontSize: 18,
color: colorsRGB.foreground,
minHeight: 56,
},
section: {
marginBottom: 32,
},
sectionLabel: {
fontSize: 12,
fontWeight: '600',
color: colorsRGB.mutedForeground,
letterSpacing: 1,
marginBottom: 16,
},
categoriesGrid: {
flexDirection: 'row',
flexWrap: 'wrap',
gap: 12,
},
categoryCard: {
width: '48%',
flexDirection: 'row',
alignItems: 'center',
gap: 12,
backgroundColor: colorsRGB.card,
borderWidth: 1,
borderColor: colorsRGB.border,
borderRadius: 12,
padding: 16,
minHeight: 64,
shadowColor: '#2A3342',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.06,
shadowRadius: 8,
elevation: 3,
},
categoryIcon: {
width: 40,
height: 40,
borderRadius: 8,
backgroundColor: 'rgba(74, 157, 126, 0.1)',
alignItems: 'center',
justifyContent: 'center',
},
categoryLabel: {
flex: 1,
fontSize: 16,
fontWeight: '500',
color: colorsRGB.foreground,
},
helpList: {
gap: 8,
},
helpTopic: {
flexDirection: 'row',
alignItems: 'center',
gap: 12,
backgroundColor: colorsRGB.secondary,
borderWidth: 1,
borderColor: colorsRGB.border,
borderRadius: 12,
padding: 16,
minHeight: 56,
},
helpIcon: {
width: 32,
height: 32,
borderRadius: 8,
backgroundColor: 'rgba(74, 157, 126, 0.1)',
alignItems: 'center',
justifyContent: 'center',
},
helpLabel: {
fontSize: 16,
fontWeight: '500',
color: colorsRGB.foreground,
},
noticesContent: {
padding: 20,
},
emptyNotices: {
alignItems: 'center',
paddingVertical: 48,
},
emptyNoticesIcon: {
width: 64,
height: 64,
borderRadius: 16,
backgroundColor: colorsRGB.secondary,
alignItems: 'center',
justifyContent: 'center',
marginBottom: 16,
},
emptyNoticesTitle: {
fontSize: 20,
fontWeight: '400',
color: colorsRGB.foreground,
marginBottom: 8,
letterSpacing: -0.3,
},
emptyNoticesText: {
fontSize: 16,
color: colorsRGB.mutedForeground,
textAlign: 'center',
maxWidth: 280,
},
noticesList: {
gap: 16,
},
noticesSection: {
marginBottom: 16,
},
pinnedHeader: {
flexDirection: 'row',
alignItems: 'center',
gap: 4,
marginBottom: 12,
},
noticesSectionTitle: {
fontSize: 12,
fontWeight: '600',
color: colorsRGB.mutedForeground,
letterSpacing: 1,
},
noticeCard: {
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
noticeIndicator: {
width: 10,
height: 10,
borderRadius: 5,
marginTop: 8,
},
noticeContent: {
flex: 1,
},
noticeMeta: {
flexDirection: 'row',
alignItems: 'center',
gap: 8,
marginBottom: 8,
},
noticeCategoryBadge: {
paddingHorizontal: 8,
paddingVertical: 2,
borderRadius: 4,
},
noticeCategoryText: {
fontSize: 12,
fontWeight: '600',
},
noticeTitle: {
fontSize: 16,
fontWeight: '600',
color: colorsRGB.foreground,
marginBottom: 2,
},
noticeTitleUnread: {
fontWeight: '700',
},
noticePreview: {
fontSize: 16,
color: colorsRGB.mutedForeground,
},
noticeTimestamp: {
fontSize: 14,
color: colorsRGB.mutedForeground,
},
noticeDetailContent: {
padding: 20,
},
backButton: {
flexDirection: 'row',
alignItems: 'center',
gap: 8,
marginBottom: 16,
marginLeft: -8,
paddingHorizontal: 8,
paddingVertical: 8,
},
backText: {
fontSize: 16,
fontWeight: '500',
color: colorsRGB.mutedForeground,
},
noticeDetailMeta: {
flexDirection: 'row',
alignItems: 'center',
gap: 8,
marginBottom: 12,
},
noticeDetailTitle: {
fontSize: 28,
fontWeight: '400',
color: colorsRGB.foreground,
marginBottom: 8,
letterSpacing: -0.5,
},
noticeDetailPosted: {
fontSize: 14,
color: colorsRGB.mutedForeground,
marginBottom: 24,
},
noticeDetailBody: {
fontSize: 18,
color: colorsRGB.foreground,
lineHeight: 28,
marginBottom: 16,
},
noticeDetailInfo: {
fontSize: 16,
color: colorsRGB.mutedForeground,
lineHeight: 22,
marginBottom: 32,
},
sageAssistCard: {
backgroundColor: 'rgba(74, 157, 126, 0.05)',
borderWidth: 1,
borderColor: 'rgba(74, 157, 126, 0.2)',
borderRadius: 16,
padding: 20,
},
sageAssistHeader: {
flexDirection: 'row',
alignItems: 'center',
gap: 12,
marginBottom: 16,
},
sageAssistIcon: {
width: 40,
height: 40,
borderRadius: 12,
backgroundColor: 'rgba(74, 157, 126, 0.2)',
alignItems: 'center',
justifyContent: 'center',
},
sageAssistTitle: {
fontSize: 16,
fontWeight: '600',
color: colorsRGB.foreground,
},
sageAssistSubtitle: {
fontSize: 14,
color: colorsRGB.mutedForeground,
},
sageActions: {
gap: 8,
marginBottom: 16,
},
sageAction: {
flexDirection: 'row',
alignItems: 'center',
gap: 12,
backgroundColor: colorsRGB.background,
borderRadius: 12,
padding: 12,
},
sageActionText: {
fontSize: 16,
fontWeight: '500',
color: colorsRGB.foreground,
},
sageResponse: {
backgroundColor: colorsRGB.background,
borderRadius: 12,
padding: 16,
borderWidth: 1,
borderColor: colorsRGB.border,
},
sageResponseText: {
fontSize: 16,
color: colorsRGB.foreground,
lineHeight: 22,
},
});
