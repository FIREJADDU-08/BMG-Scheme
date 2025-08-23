import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Alert, 
  BackHandler,
  SafeAreaView,
  Dimensions,
  Platform,
  ToastAndroid
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { alignment, colors } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { showToast } from '../../utils/toast';

const { width } = Dimensions.get('window');

// Constants
const API_BASE_URL = 'https://akj.brightechsoftware.com';
const POLLING_INTERVAL = 5000; // 5 seconds
const POLLING_TIMEOUT = 300000; // 5 minutes

function Buy() {
  // State variables
  const [amount, setAmount] = useState('');
  const [weight, setWeight] = useState('');
  const [goldRate, setGoldRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [orderId, setOrderId] = useState('');
  const [goldRateError, setGoldRateError] = useState(false);

  // Refs for cleanup
  const verifyIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const navigation = useNavigation();
  const route = useRoute();
  
  // Route params
  const passedGoldRate = route.params?.goldRate;
  const isDreamGoldPlan = route.params?.isDreamGoldPlan;
  const accountDetails = route.params?.accountDetails;
  const productData = route.params?.productData;

  // Handle back button when WebView is open
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showWebView) {
          Alert.alert(
            'Cancel Payment',
            'Are you sure you want to cancel the payment?',
            [
              { text: 'No', style: 'cancel' },
              { 
                text: 'Yes', 
                onPress: () => {
                  clearPaymentPolling();
                  setShowWebView(false);
                }
              },
            ]
          );
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [showWebView])
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearPaymentPolling();
    };
  }, []);

  // Get user details from AsyncStorage
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const [storedPhoneNumber, storedUserName] = await Promise.all([
          AsyncStorage.getItem('userPhoneNumber'),
          AsyncStorage.getItem('userName')
        ]);
        
        if (isMountedRef.current) {
          if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
          if (storedUserName) setUserName(storedUserName);
        }
      } catch (error) {
        console.error('Error getting user details:', error);
        if (isMountedRef.current) {
          Alert.alert('Error', 'Failed to load user details. Please login again.');
        }
      }
    };
    getUserDetails();
  }, []);

  // Set initial amount for dream gold plan
  useEffect(() => {
    if (isDreamGoldPlan && accountDetails?.amount) {
      const initialAmount = accountDetails.amount.toString();
      setAmount(initialAmount);
      convertAmountToWeight(initialAmount);
    }
  }, [isDreamGoldPlan, accountDetails, goldRate]);

  // Fetch gold rate from API
  const fetchGoldRate = async () => {
    try {
      setGoldRateError(false);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/v1/api/account/todayrate`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch gold rate`);
      }

      const data = await response.json();
      
      if (!data.Rate || isNaN(data.Rate)) {
        throw new Error('Invalid gold rate received from server');
      }

      if (isMountedRef.current) {
        setGoldRate(data.Rate);
      }
    } catch (error) {
      console.error('Error fetching gold rate:', error);
      if (isMountedRef.current) {
        setGoldRateError(true);
        setGoldRate(null);
        
        if (error.name !== 'AbortError') {
          Alert.alert(
            'Error',
            'Failed to fetch current gold rate. Please check your internet connection and try again.',
            [
              { text: 'Retry', onPress: fetchGoldRate },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Initialize gold rate
  useEffect(() => {
    if (passedGoldRate && !isNaN(passedGoldRate)) {
      setGoldRate(passedGoldRate);
      setLoading(false);
    } else {
      fetchGoldRate();
    }
  }, [passedGoldRate]);

  // Convert amount to weight
  const convertAmountToWeight = useCallback((amount) => {
    if (goldRate && amount && !isNaN(amount) && amount > 0) {
      const weightInGrams = (parseFloat(amount) / goldRate).toFixed(3);
      setWeight(weightInGrams);
    } else {
      setWeight('');
    }
  }, [goldRate]);

  // Handle amount input change
  const handleAmountChange = (text) => {
    // Only allow numbers and decimal point
    const sanitizedText = text.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = sanitizedText.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setAmount(sanitizedText);
    convertAmountToWeight(sanitizedText);
  };

  // Clear payment polling intervals
  const clearPaymentPolling = () => {
    if (verifyIntervalRef.current) {
      clearInterval(verifyIntervalRef.current);
      verifyIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Validate payment inputs
  const validatePaymentInputs = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount greater than 0');
      return false;
    }

    if (parseFloat(amount) < 1) {
      showToast('Minimum payment amount is ₹1');
      return false;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      showToast('Valid phone number not found. Please login again.');
      return false;
    }

    if (!userName || userName.trim().length === 0) {
      showToast('User name not found. Please login again.');
      return false;
    }

    if (!productData || !productData.regno || !productData.groupcode) {
      showToast('Product details are missing. Please try again.');
      return false;
    }

    if (!goldRate) {
      showToast('Gold rate not available. Please refresh and try again.');
      return false;
    }

    return true;
  };

  // Create payment link
  const createPaymentLink = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/create-payment-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          customer: {
            name: userName.trim(),
            contact: phoneNumber,
            REGNO: productData.regno,
            GROUPCODE: productData.groupcode,
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to generate payment link'}`);
      }

      const responseText = await response.text();
      console.log('Payment Response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response format from server');
      }

      if (!data || !data.payment_link || !data.order_id) {
        console.error('Invalid response data:', data);
        throw new Error('Payment link or order ID not received from server');
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  // Start payment verification polling
  const startPaymentVerification = (orderId) => {
    clearPaymentPolling(); // Clear any existing intervals

    verifyIntervalRef.current = setInterval(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const verifyResponse = await fetch(
          `${API_BASE_URL}/api/payment/verify?orderId=${orderId}`,
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        clearTimeout(timeoutId);

        if (!verifyResponse.ok) {
          console.warn('Verification request failed:', verifyResponse.status);
          return;
        }

        const verifyData = await verifyResponse.json();
        console.log('Verification response:', verifyData);
        
        if (verifyData.razorpay_status === 'paid' && verifyData.success) {
          clearPaymentPolling();
          
          if (isMountedRef.current) {
            setShowWebView(false);
            Alert.alert(
              'Payment Successful! 🎉',
              `Payment of ₹${amount} completed successfully. Your gold purchase has been processed.`,
              [
                {
                  text: 'Continue',
                  onPress: () => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'MainLanding' }],
                    });
                  },
                },
              ]
            );
          }
        } else if (verifyData.razorpay_status === 'failed' || verifyData.razorpay_status === 'cancelled') {
          clearPaymentPolling();
          
          if (isMountedRef.current) {
            setShowWebView(false);
            Alert.alert('Payment Failed', 'Your payment was not successful. Please try again.');
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
        // Continue polling on error, don't stop
      }
    }, POLLING_INTERVAL);

    // Set timeout to stop polling after 5 minutes
    timeoutRef.current = setTimeout(() => {
      clearPaymentPolling();
      if (isMountedRef.current && showWebView) {
        Alert.alert(
          'Payment Timeout',
          'Payment verification timed out. Please check your payment status manually or contact support.',
          [
            {
              text: 'OK',
              onPress: () => setShowWebView(false),
            },
          ]
        );
      }
    }, POLLING_TIMEOUT);
  };

  // Handle payment process
  const handlePay = async () => {
    if (!validatePaymentInputs()) {
      return;
    }

    try {
      setPaymentLoading(true);
      
      const paymentData = await createPaymentLink();
      
      if (isMountedRef.current) {
        setOrderId(paymentData.order_id);
        setPaymentUrl(paymentData.payment_link);
        setShowWebView(true);
        
        // Start payment verification
        startPaymentVerification(paymentData.order_id);
      }

    } catch (error) {
      console.error('Payment error:', error);
      if (isMountedRef.current) {
        Alert.alert(
          'Payment Error',
          error.message || 'Failed to process payment. Please try again.',
          [
            { text: 'OK' }
          ]
        );
      }
    } finally {
      if (isMountedRef.current) {
        setPaymentLoading(false);
      }
    }
  };

  // Handle WebView navigation changes
  const handleWebViewNavigationStateChange = (navState) => {
    console.log('WebView navigation:', navState.url);
    
    const url = navState.url.toLowerCase();
    if (url.includes('success') || url.includes('payment-success') || url.includes('completed')) {
      console.log('Success URL detected, waiting for verification...');
    } else if (url.includes('failure') || url.includes('payment-failed') || url.includes('cancelled')) {
      clearPaymentPolling();
      setShowWebView(false);
      showToast('Payment was not successful. Please try again.');
    }
  };

  // Handle WebView errors
  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    
    showToast('Failed to load payment page. Please check your internet connection and try again.');
  };

  // WebView component
  if (showWebView) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <View style={styles.webViewHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              Alert.alert(
                'Cancel Payment',
                'Are you sure you want to cancel the payment?',
                [
                  { text: 'No', style: 'cancel' },
                  { 
                    text: 'Yes', 
                    onPress: () => {
                      clearPaymentPolling();
                      setShowWebView(false);
                    }
                  },
                ]
              );
            }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.webViewTitle}>Complete Payment</Text>
          <View style={styles.closeButton} />
        </View>
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          onError={handleWebViewError}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.webViewLoading}>
              <ActivityIndicator size="large" color={colors.greenColor} />
              <Text style={styles.loadingText}>Loading payment page...</Text>
            </View>
          )}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Gold Rate Card */}
      {!isDreamGoldPlan && (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Buying Rate</Text>
        <Text style={styles.cardSubtitle}>Value added and GST will be applicable</Text>
        <View style={styles.innerCard}>
          <View style={styles.rateSection}>
            <Image source={require('../../assets/gold.png')} style={styles.goldImage} />
            <View>
              <Text style={styles.goldText}>Gold 22K (916)</Text>
              {loading ? (
                <ActivityIndicator size="small" color={colors.greenColor} />
              ) : goldRateError ? (
                <TouchableOpacity onPress={fetchGoldRate}>
                  <Text style={styles.errorText}>Tap to retry</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.rateText}>{`₹${goldRate} / gm`}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
      )}
      {/* DREAM GOLD PLAN UI */}
      {isDreamGoldPlan ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>DREAM GOLD PLAN</Text>
          <View style={{ marginBottom: 20 }}>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Group Code</Text><Text style={styles.detailValue}>{productData?.groupcode || '-'}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Membership No</Text><Text style={styles.detailValue}>{productData?.regno || '-'}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Scheme Amount</Text><Text style={styles.detailValue}>{productData?.amountWeight?.Amount || '-'}</Text></View>
          </View>
          <Text style={[styles.label, { marginBottom: 10 }]}>Payment Options</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20 }}>
            <Image source={require('../../assets/images/gpay.jpeg')} style={{ width: 40, height: 40, marginRight: 10 }} />
          </View>
          <TouchableOpacity 
            style={styles.payButton}
            onPress={handlePay}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.payButtonText}>PROCEED TO PAY</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        // Quick Pay Card (current buying container) only for DigiGold
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Pay</Text>
          <View style={[styles.quickPaySection, isDreamGoldPlan && styles.centeredSection]}>
            <View style={[styles.inputContainer, isDreamGoldPlan && styles.fullWidthInput]}>
              <Text style={styles.label}>Amount (₹)</Text>
              <TextInput
                style={[styles.input, isDreamGoldPlan && styles.disabledInput]}
                keyboardType="decimal-pad"
                value={amount}           
                editable={!isDreamGoldPlan && !paymentLoading}
                onChangeText={handleAmountChange}
                placeholder="Enter amount"
                placeholderTextColor={colors.fontThirdColor}
                maxLength={10}
              />
            </View>
            {/* Only show weight conversion for DigiGold plans */}
            {!isDreamGoldPlan && (
              <>
                <Text style={styles.swapIcon}>⇄</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Weight (grams)</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={weight}
                    editable={false}
                    placeholder="Auto calculated"
                    placeholderTextColor={colors.fontThirdColor}
                  />
                </View>
              </>
            )}
          </View>
          {/* Payment Button */}
          <TouchableOpacity 
            style={[
              styles.payButton, 
              (paymentLoading || loading || !goldRate || !amount || parseFloat(amount) <= 0) && styles.disabledButton
            ]} 
            onPress={handlePay}
            disabled={paymentLoading || loading || !goldRate || !amount || parseFloat(amount) <= 0}
          >
            {paymentLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.payButtonText}>
                {amount && goldRate ? `Pay ₹${amount}` : 'Proceed to pay'}
              </Text>
            )}
          </TouchableOpacity>
          {/* Info Text */}
          {amount && goldRate && (
            <Text style={styles.infoText}>
              {isDreamGoldPlan 
                ? `You will pay ₹${amount} for your Dream Gold plan`
                : `You will purchase ${weight}g of 22K gold`
              }
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor || '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  innerCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 20,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'center',
    width: '100%',
    minHeight: 80,
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.fontMainColor || '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.fontThirdColor || '#666',
    marginBottom: 8,
  },
  rateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldImage: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
  goldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.fontMainColor || '#333',
    marginBottom: 4,
  },
  rateText: {
    fontSize: 16,
    color: colors.greenTextColor || '#4CAF50',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#ff6b6b',
    textDecorationLine: 'underline',
  },
  quickPaySection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  centeredSection: {
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  fullWidthInput: {
    flex: 1,
    marginHorizontal: 0,
  },
  label: {
    fontSize: 16,
    color: colors.fontMainColor || '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.graycolor || '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: colors.black || '#000',
    fontSize: 16,
    backgroundColor: colors.white,
  },
  disabledInput: {
    backgroundColor: '#f8f8f8',
    color: '#666',
  },
  swapIcon: {
    fontSize: 24,
    color: colors.fontThirdColor || '#666',
    marginBottom: 12,
    marginHorizontal: 8,
  },
  payButton: {
    backgroundColor: colors.greenColor || '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  payButtonText: {
    color: colors.white || '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 12,
    color: colors.fontThirdColor || '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  webViewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.fontMainColor || '#333',
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.fontThirdColor || '#666',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.fontMainColor || '#333',
  },
  detailValue: {
    fontSize: 16,
    color: colors.fontThirdColor || '#666',
  },
});

export default Buy;