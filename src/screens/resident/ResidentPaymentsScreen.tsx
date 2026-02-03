import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  ArrowLeft,
  CreditCard,
  Shield,
  ExternalLink,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { colorsRGB } from '../../theme/colors';

type PaymentStep = 'summary' | 'redirect' | 'success' | 'processing' | 'failed';
type PaymentStatus = 'due-soon' | 'overdue' | 'paid';

interface ResidentPaymentsScreenProps {
  onBack: () => void;
  balance?: number;
  dueDate?: string;
  status?: PaymentStatus;
  communityName?: string;
  unitNumber?: string;
}

function StatusPill({ status }: { status: PaymentStatus }) {
  const config = {
    'due-soon': {
      label: 'Due soon',
      bgColor: 'rgba(245, 158, 11, 0.15)',
      textColor: '#F59E0B',
    },
    overdue: {
      label: 'Overdue',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      textColor: '#EF4444',
    },
    paid: {
      label: 'Paid',
      bgColor: 'rgba(74, 157, 126, 0.15)',
      textColor: '#4A9D7E',
    },
  };

  const { label, bgColor, textColor } = config[status];

  return (
    <View style={[styles.statusPill, { backgroundColor: bgColor }]}>
      <Text style={[styles.statusPillText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

export default function ResidentPaymentsScreen({
  onBack,
  balance = 128.5,
  dueDate = 'Jan 15',
  status = 'due-soon',
  communityName = 'Willow Creek Estates',
  unitNumber = 'Unit 12A',
}: ResidentPaymentsScreenProps) {
  const [step, setStep] = useState<PaymentStep>('summary');

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);

  if (step === 'summary') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={24} color={colorsRGB.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dues & Payments</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View style={styles.balanceIcon}>
                <CreditCard size={24} color={colorsRGB.accent} />
              </View>
              <View>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <StatusPill status={status} />
              </View>
            </View>

            <View style={styles.balanceAmount}>
              <Text style={styles.balanceValue}>{formattedBalance}</Text>
              <View style={styles.dueDateRow}>
                <Clock size={20} color={colorsRGB.mutedForeground} />
                <Text style={styles.dueDateText}>Due {dueDate}</Text>
              </View>
            </View>

            <Button
              variant="default"
              size="full"
              onPress={() => setStep('redirect')}
              style={[styles.payButton, status === 'paid' && styles.payButtonDisabled]}
            >
              <CreditCard size={20} color="#FFFFFF" />
              <Text style={styles.payButtonText}>Continue to Payment</Text>
            </Button>

            <Button variant="outline" size="full" onPress={() => console.log('View statement')} style={styles.statementButton}>
              <FileText size={20} color={colorsRGB.primary} />
              <Text style={styles.statementButtonText}>View Statement</Text>
            </Button>
          </View>

          <View style={styles.securityNote}>
            <Shield size={20} color={colorsRGB.mutedForeground} />
            <Text style={styles.securityText}>
              You'll be redirected to our secure payment provider to complete your payment.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'redirect') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setStep('summary')}>
            <ArrowLeft size={24} color={colorsRGB.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Secure Payment</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.providerBadge}>
            <Shield size={20} color={colorsRGB.accent} />
            <Text style={styles.providerText}>Powered by Stripe</Text>
          </View>

          <View style={styles.redirectMessage}>
            <View style={styles.redirectIcon}>
              <ExternalLink size={40} color={colorsRGB.accent} />
            </View>
            <Text style={styles.redirectTitle}>You're leaving the app to pay securely</Text>
            <Text style={styles.redirectSubtitle}>
              Your payment will be processed by our trusted provider.
            </Text>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>PAYMENT DETAILS</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>{formattedBalance}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Community</Text>
              <Text style={styles.detailValueSmall}>{communityName}</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Text style={styles.detailLabel}>Account</Text>
              <Text style={styles.detailValueSmall}>{unitNumber}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              variant="default"
              size="full"
              onPress={() => {
                setStep('processing');
                setTimeout(() => {
                  setStep(Math.random() > 0.3 ? 'success' : 'failed');
                }, 2000);
              }}
            >
              <ExternalLink size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Open Payment Portal</Text>
            </Button>

            <Button variant="outline" size="full" onPress={() => setStep('summary')} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Button>
          </View>

          <Text style={styles.helperText}>
            After you pay, you'll return to the app automatically.
          </Text>

          <View style={styles.trustBullets}>
            <View style={styles.trustBullet}>
              <CheckCircle2 size={16} color="#4A9D7E" />
              <Text style={styles.trustText}>Your card details are not stored in this app.</Text>
            </View>
            <View style={styles.trustBullet}>
              <CheckCircle2 size={16} color="#4A9D7E" />
              <Text style={styles.trustText}>Payments may take 1–2 business days to post.</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'processing') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.processingIcon}>
            <Loader2 size={40} color={colorsRGB.accent} />
          </View>
          <Text style={styles.processingTitle}>Payment processing</Text>
          <Text style={styles.processingText}>
            This may take a moment. Please don't close the app.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.successIcon}>
            <CheckCircle2 size={48} color="#4A9D7E" />
          </View>

          <Text style={styles.successTitle}>Payment submitted</Text>

          <Text style={styles.successText}>
            Thanks! We received your payment of{' '}
            <Text style={styles.successAmount}>{formattedBalance}</Text>.
          </Text>

          <Text style={styles.successNote}>
            We'll update your balance when the payment posts (typically 1–2 business days).
          </Text>

          <View style={styles.successActions}>
            <Button variant="default" size="full" onPress={onBack}>
              <Text style={styles.successButtonText}>Back to Home</Text>
            </Button>

            <Button variant="outline" size="full" onPress={() => console.log('View receipt')} style={styles.receiptButton}>
              <FileText size={20} color={colorsRGB.primary} />
              <Text style={styles.receiptButtonText}>View Receipt</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'failed') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.failedIcon}>
            <AlertCircle size={48} color="#EF4444" />
          </View>

          <Text style={styles.failedTitle}>Payment not completed</Text>

          <Text style={styles.failedText}>
            Something went wrong with your payment. No charges have been made.
          </Text>

          <View style={styles.failedActions}>
            <Button variant="default" size="full" onPress={() => setStep('redirect')}>
              <Text style={styles.failedButtonText}>Try Again</Text>
            </Button>

            <Button variant="outline" size="full" onPress={() => console.log('Contact HOA')} style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact HOA</Text>
            </Button>

            <TouchableOpacity onPress={onBack} style={styles.backLink}>
              <Text style={styles.backLinkText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsRGB.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorsRGB.border,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colorsRGB.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  balanceCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  balanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 157, 126, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    marginBottom: 4,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  balanceAmount: {
    marginBottom: 16,
  },
  balanceValue: {
    fontSize: 48,
    fontWeight: '400',
    color: colorsRGB.foreground,
    letterSpacing: -1,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  dueDateText: {
    fontSize: 18,
    color: colorsRGB.mutedForeground,
  },
  payButton: {
    marginBottom: 12,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  statementButton: {
    marginTop: 0,
  },
  statementButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(245, 243, 239, 0.5)',
    borderRadius: 12,
    padding: 16,
  },
  securityText: {
    flex: 1,
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    lineHeight: 22,
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 243, 239, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  providerText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.mutedForeground,
  },
  redirectMessage: {
    alignItems: 'center',
    marginBottom: 32,
  },
  redirectIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 157, 126, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  redirectTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  redirectSubtitle: {
    fontSize: 18,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: colorsRGB.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colorsRGB.mutedForeground,
    letterSpacing: 1,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(213, 217, 224, 0.5)',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colorsRGB.foreground,
  },
  detailValueSmall: {
    fontSize: 16,
    fontWeight: '500',
    color: colorsRGB.foreground,
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  cancelButton: {
    marginTop: 0,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
  helperText: {
    fontSize: 14,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
    marginBottom: 16,
  },
  trustBullets: {
    gap: 8,
  },
  trustBullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  trustText: {
    flex: 1,
    fontSize: 14,
    color: colorsRGB.mutedForeground,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  processingIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 157, 126, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  processingTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: colorsRGB.foreground,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  processingText: {
    fontSize: 18,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(74, 157, 126, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '400',
    color: colorsRGB.foreground,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  successText: {
    fontSize: 18,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
    marginBottom: 8,
  },
  successAmount: {
    fontWeight: '600',
    color: colorsRGB.foreground,
  },
  successNote: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
    marginBottom: 32,
  },
  successActions: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  successButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  receiptButton: {
    marginTop: 0,
  },
  receiptButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
  failedIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  failedTitle: {
    fontSize: 32,
    fontWeight: '400',
    color: colorsRGB.foreground,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  failedText: {
    fontSize: 18,
    color: colorsRGB.mutedForeground,
    textAlign: 'center',
    marginBottom: 32,
  },
  failedActions: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  failedButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  contactButton: {
    marginTop: 0,
  },
  contactButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colorsRGB.primary,
  },
  backLink: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backLinkText: {
    fontSize: 16,
    color: colorsRGB.mutedForeground,
  },
});
