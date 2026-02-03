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
import { Send, BookOpen, Mic, MicOff, ChevronDown, ChevronUp, FileText } from 'lucide-react-native';
import { SuggestionChips } from '../../components/chat/SuggestionChips';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

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
}

export default function ResidentRulebookScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set());
  const scrollViewRef = useRef<ScrollView>(null);

  const suggestions = [
    'Trash can rules',
    'Guest parking',
    'Exterior changes',
    'How to appeal',
    'Holiday decorations',
  ];

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
          text: "Trash cans must be stored out of view from the street, except on collection days. You may place them curbside after 5 PM the evening before collection, and must retrieve them by 8 PM on collection day.",
          isBot: true,
          citation: {
            section: 'Section 5.3',
            title: 'Waste Management',
            page: 18,
            excerpt:
              'All waste receptacles shall be stored within the garage or behind a fence/enclosure that screens them from street view. Receptacles may be placed at the curb no earlier than 5:00 PM on the day preceding scheduled collection and must be removed by 8:00 PM on collection day.',
          },
          timestamp: 'Just now',
        };
      } else if (lowerText.includes('parking') || lowerText.includes('guest')) {
        response = {
          id: (Date.now() + 1).toString(),
          text: 'Guest vehicles may park in designated visitor spots for up to 72 hours. Street parking is limited to 4 hours during daytime. Overnight street parking requires a permit from the HOA office.',
          isBot: true,
          citation: {
            section: 'Section 7.1',
            title: 'Parking Regulations',
            page: 24,
            excerpt:
              'Visitor parking spaces are designated for guests only, with a maximum stay of 72 consecutive hours. Street parking is permitted between 8:00 AM and 10:00 PM for up to 4 hours. Overnight street parking (10:00 PM - 8:00 AM) requires prior approval.',
          },
          timestamp: 'Just now',
        };
      } else if (lowerText.includes('appeal')) {
        response = {
          id: (Date.now() + 1).toString(),
          text: 'You have 14 days from the date of a violation notice to file an appeal. Submit your appeal in writing through the app or by mail, including any supporting evidence. The board will review within 30 days.',
          isBot: true,
          citation: {
            section: 'Section 2.4',
            title: 'Appeals Process',
            page: 8,
            excerpt:
              'Any homeowner may appeal a violation notice within fourteen (14) calendar days of receipt. Appeals must be submitted in writing and may include photographs, witness statements, or other relevant documentation. The Board shall convene within thirty (30) days to review the appeal.',
          },
          timestamp: 'Just now',
        };
      } else if (lowerText.includes('holiday') || lowerText.includes('decoration')) {
        response = {
          id: (Date.now() + 1).toString(),
          text: 'Holiday decorations may be displayed up to 30 days before and must be removed within 14 days after the holiday. Lights should not be excessively bright or cause disturbance to neighbors.',
          isBot: true,
          citation: {
            section: 'Section 4.7',
            title: 'Seasonal Decorations',
            page: 15,
            excerpt:
              'Seasonal and holiday decorations may be installed no more than thirty (30) days prior to the applicable holiday and must be removed within fourteen (14) days following the holiday. Decorations shall not create excessive light, sound, or visual disturbance to neighboring properties.',
          },
          timestamp: 'Just now',
        };
      } else {
        response = {
          id: (Date.now() + 1).toString(),
          text: "I couldn't find a specific rule about that in your community's rulebook. Try rephrasing your question, or contact the HOA office for help with your specific situation.",
          isBot: true,
          timestamp: 'Just now',
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
        setInput('What are the trash can rules?');
      }
    } else {
      setIsListening(true);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <BookOpen size={24} color={colorsRGB.accent} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Ask the Rulebook</Text>
            <Text style={styles.headerSubtitle}>Get quick answers about community rules</Text>
          </View>
        </View>
      </View>

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
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <BookOpen size={40} color={colorsRGB.accent} />
              </View>
              <Text style={styles.emptyTitle}>What would you like to know?</Text>
              <Text style={styles.emptySubtitle}>
                Ask any question about your community's rules and guidelines.
              </Text>

              <View style={styles.suggestionsSection}>
                <Text style={styles.suggestionsTitle}>POPULAR QUESTIONS</Text>
                <View style={styles.suggestionsGrid}>
                  {suggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      style={styles.suggestionChip}
                      onPress={() => handleSend(suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
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
                          <Text style={styles.citationExcerptText}>
                            "{message.citation.excerpt}"
                          </Text>
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
                    <Text style={styles.typingText}>Looking up rules...</Text>
                  </View>
                </View>
              )}

              {messages.length > 0 && !isTyping && (
                <View style={styles.followUpSection}>
                  <Text style={styles.followUpTitle}>Ask another question:</Text>
                  <SuggestionChips suggestions={suggestions} onSelect={handleSend} />
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
              placeholder={isListening ? 'Listening...' : 'Type your question...'}
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
              <Send size={20} color={input.trim() ? colorsRGB.primary : colorsRGB.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {isListening && (
          <View style={styles.listeningIndicator}>
            <Text style={styles.listeningText}>
              Listening... Tap the mic button when you're done speaking.
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
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
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colorsRGB.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 157, 126, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
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
  chatContainer: {
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 157, 126, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
  suggestionsSection: {
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.mutedForeground,
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: 'center',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colorsRGB.secondary,
    borderWidth: 1,
    borderColor: colorsRGB.border,
    minHeight: 48,
    justifyContent: 'center',
  },
  suggestionText: {
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
    paddingTop: 12,
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
    backgroundColor: colorsRGB.mutedForeground,
  },
  typingText: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  followUpSection: {
    paddingTop: 16,
  },
  followUpTitle: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    marginBottom: 12,
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
});
