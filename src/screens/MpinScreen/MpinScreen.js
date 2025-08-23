import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Dimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextDefault } from '../../components';
import { alignment, colors } from '../../utils';

const { width, height } = Dimensions.get('window');

// Toast function for iOS
const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('', message);
  }
};

function MpinScreen({ route, navigation }) {
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    checkIfMpinCreated();
  }, []);

  const checkIfMpinCreated = async () => {
    try {
      const isMpinCreated = await AsyncStorage.getItem('isMpinCreated');
      if (isMpinCreated === 'true') {
        navigation.replace('VerifyMpin');
      }
    } catch (error) {
      console.error('Error checking MPIN creation:', error);
    }
  };

  const handleMpinChange = (value, index) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return;
    
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-focus previous input on backspace
    else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !mpin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCreateMpin = async () => {
    const enteredMpin = mpin.join('');

    if (enteredMpin.length !== 4) {
      showToast('Please enter a valid 4-digit MPIN.');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('mpin', enteredMpin);
      await AsyncStorage.setItem('isMpinCreated', 'true');
      showToast('MPIN created successfully!');
      setTimeout(() => {
        navigation.replace('Drawer');
      }, 1000);
    } catch (error) {
      showToast('Failed to save MPIN. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotMpin = async () => {
    Alert.alert(
      'Reset MPIN',
      'Are you sure you want to reset your MPIN? You will need to verify OTP again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('mpin');
              await AsyncStorage.removeItem('isMpinCreated');
              await AsyncStorage.removeItem('isOtpVerified');
              navigation.replace('OTP');
            } catch (error) {
              showToast('Failed to reset MPIN. Please try again.');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCard}>
                <View style={styles.logoRow}>
                  <Image
                    source={require('../../assets/logo.jpg')}
                    style={styles.logoImage}
                  />
                  <TextDefault style={styles.logoText}>AKJ GOLD</TextDefault>
                </View>
                <TextDefault style={styles.subtitleText}>
                  (GOLD | SILVER | DIAMOND)
                </TextDefault>
              </View>
            </View>

            {/* Content Section */}
            <View style={styles.contentContainer}>
              <View style={styles.headerSection}>
                <TextDefault style={styles.title}>Create MPIN</TextDefault>
                <TextDefault style={styles.description}>
                  Set up a secure 4-digit PIN for quick access
                </TextDefault>
              </View>

              <View style={styles.mpinSection}>
                <TextDefault style={styles.mpinLabel}>Enter 4-Digit MPIN</TextDefault>
                
                <View style={styles.mpinContainer}>
                  {mpin.map((digit, index) => (
                    <View key={index} style={styles.mpinInputWrapper}>
                      <TextInput
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={[
                          styles.mpinInput,
                          digit ? styles.mpinInputFilled : {},
                        ]}
                        maxLength={1}
                        keyboardType="numeric"
                        value={digit}
                        onChangeText={(value) => handleMpinChange(value, index)}
                        onKeyPress={(event) => handleKeyPress(event, index)}
                        secureTextEntry={true}
                        textAlign="center"
                        selectTextOnFocus={true}
                      />
                      {digit ? <View style={styles.filledIndicator} /> : null}
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.actionSection}>
                <TouchableOpacity 
                  onPress={handleForgotMpin}
                  style={styles.forgotButton}
                >
                  <TextDefault style={styles.forgotText}>
                    Forgot MPIN?
                  </TextDefault>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.createButton,
                    mpin.join('').length === 4 ? styles.createButtonActive : {},
                    isLoading ? styles.createButtonLoading : {}
                  ]} 
                  onPress={handleCreateMpin}
                  disabled={mpin.join('').length !== 4 || isLoading}
                >
                  <TextDefault style={[
                    styles.createButtonText,
                    mpin.join('').length === 4 ? styles.createButtonTextActive : {}
                  ]}>
                    {isLoading ? 'Creating...' : 'Create MPIN'}
                  </TextDefault>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

function VerifyMpinScreen({ navigation }) {
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRefs = useRef([]);

  const handleMpinChange = (value, index) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return;
    
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-focus previous input on backspace
    else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !mpin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyMpin = async () => {
    const enteredMpin = mpin.join('');

    if (enteredMpin.length !== 4) {
      showToast('Please enter a valid 4-digit MPIN.');
      return;
    }

    setIsLoading(true);
    try {
      const savedMpin = await AsyncStorage.getItem('mpin');
      if (enteredMpin === savedMpin) {
        showToast('MPIN verified successfully!');
        setTimeout(() => {
          navigation.replace('Drawer');
        }, 1000);
      } else {
        setAttempts(prev => prev + 1);
        setMpin(['', '', '', '']);
        inputRefs.current[0]?.focus();
        
        if (attempts >= 2) {
          Alert.alert(
            'Too Many Attempts',
            'You have exceeded the maximum number of attempts. Please reset your MPIN.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset MPIN', onPress: () => navigation.navigate('OTP') }
            ]
          );
        } else {
          showToast(`Incorrect MPIN. ${2 - attempts} attempts remaining.`);
        }
      }
    } catch (error) {
      showToast('Failed to verify MPIN. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCard}>
                <View style={styles.logoRow}>
                  <Image
                    source={require('../../assets/logo.jpg')}
                    style={styles.logoImage}
                  />
                  <TextDefault style={styles.logoText}>AKJ GOLD</TextDefault>
                </View>
                <TextDefault style={styles.subtitleText}>
                  (GOLD | SILVER | DIAMOND)
                </TextDefault>
              </View>
            </View>

            {/* Content Section */}
            <View style={styles.contentContainer}>
              <View style={styles.headerSection}>
                <TextDefault style={styles.title}>Enter Your MPIN</TextDefault>
                <TextDefault style={styles.description}>
                  Enter your 4-digit PIN to continue
                </TextDefault>
              </View>

              <View style={styles.mpinSection}>
                <TextDefault style={styles.mpinLabel}>MPIN</TextDefault>
                
                <View style={styles.mpinContainer}>
                  {mpin.map((digit, index) => (
                    <View key={index} style={styles.mpinInputWrapper}>
                      <TextInput
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={[
                          styles.mpinInput,
                          digit ? styles.mpinInputFilled : {},
                        ]}
                        maxLength={1}
                        keyboardType="numeric"
                        value={digit}
                        onChangeText={(value) => handleMpinChange(value, index)}
                        onKeyPress={(event) => handleKeyPress(event, index)}
                        secureTextEntry={true}
                        textAlign="center"
                        selectTextOnFocus={true}
                      />
                      {digit ? <View style={styles.filledIndicator} /> : null}
                    </View>
                  ))}
                </View>

                {attempts > 0 && (
                  <TextDefault style={styles.attemptsText}>
                    Attempts remaining: {3 - attempts}
                  </TextDefault>
                )}
              </View>

              <View style={styles.actionSection}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('OTP')}
                  style={styles.forgotButton}
                >
                  <TextDefault style={styles.forgotText}>
                    Forgot MPIN?
                  </TextDefault>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.createButton,
                    mpin.join('').length === 4 ? styles.createButtonActive : {},
                    isLoading ? styles.createButtonLoading : {}
                  ]} 
                  onPress={handleVerifyMpin}
                  disabled={mpin.join('').length !== 4 || isLoading}
                >
                  <TextDefault style={[
                    styles.createButtonText,
                    mpin.join('').length === 4 ? styles.createButtonTextActive : {}
                  ]}>
                    {isLoading ? 'Verifying...' : 'Verify MPIN'}
                  </TextDefault>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  
  // Logo Section
  logoContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
  },
  logoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoImage: {
    width: 45,
    height: 35,
    marginRight: 12,
    borderRadius: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.lightmaroon || '#8B4513',
    letterSpacing: 3,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.lightmaroon || '#8B4513',
    letterSpacing: 4,
    opacity: 0.8,
  },

  // Content Section
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.fontMainColor || '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.fontSecondColor || '#666',
    textAlign: 'center',
    opacity: 0.8,
  },

  // MPIN Section
  mpinSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  mpinLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.fontMainColor || '#333',
    marginBottom: 24,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  mpinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mpinInputWrapper: {
    marginHorizontal: 8,
    position: 'relative',
  },
  mpinInput: {
    width: 60,
    height: 70,
    borderWidth: 2,
    borderColor: colors.greenColor || '#4CAF50',
    borderRadius: 16,
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    shadowColor: colors.greenColor || '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    textAlign: 'center',
  },
  mpinInputFilled: {
    borderColor: colors.greenColor || '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    shadowOpacity: 0.3,
  },
  filledIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.greenColor || '#4CAF50',
  },
  attemptsText: {
    fontSize: 14,
    color: '#f44336',
    fontWeight: '500',
    marginTop: 8,
  },

  // Action Section
  actionSection: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  forgotButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 24,
  },
  forgotText: {
    color: colors.textBlueColor || '#2196F3',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  createButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonActive: {
    backgroundColor: colors.greenColor || '#4CAF50',
    shadowColor: colors.greenColor || '#4CAF50',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonLoading: {
    opacity: 0.7,
  },
  createButtonText: {
    color: '#999',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButtonTextActive: {
    color: '#fff',
  },
});

export { MpinScreen, VerifyMpinScreen };