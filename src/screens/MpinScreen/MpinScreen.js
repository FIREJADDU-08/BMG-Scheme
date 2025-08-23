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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextDefault } from '../../components';
import { alignment, colors } from '../../utils';

function MpinScreen({ route, navigation }) {
  const [mpin, setMpin] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    checkIfMpinCreated();
  }, []);

  const checkIfMpinCreated = async () => {
    try {
      const isMpinCreated = await AsyncStorage.getItem('isMpinCreated');
      if (isMpinCreated === 'true') {
        navigation.replace('VerifyMpin'); // Redirect to verification screen
      }
    } catch (error) {
      console.error('Error checking MPIN creation:', error);
    }
  };

  const handleMpinChange = (value, index) => {
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    // Move to next box if a digit is entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    // Move to previous box if a digit is erased
    else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCreateMpin = async () => {
    const enteredMpin = mpin.join('');

    if (enteredMpin.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit MPIN.');
      return;
    }

    try {
      await AsyncStorage.setItem('mpin', enteredMpin); // Save the MPIN
      await AsyncStorage.setItem('isMpinCreated', 'true'); // Save MPIN creation flag
      Alert.alert('Success', 'MPIN created successfully!');
      navigation.replace('Drawer'); // Navigate to the main landing page
    } catch (error) {
      Alert.alert('Error', 'Failed to save MPIN. Please try again.');
      console.error(error);
    }
  };

  const handleForgotMpin = async () => {
    try {
      // Clear existing MPIN and flags
      await AsyncStorage.removeItem('mpin');
      await AsyncStorage.removeItem('isMpinCreated');
      await AsyncStorage.removeItem('isOtpVerified');
      
      // Navigate to OTP screen
      navigation.replace('OTP');
    } catch (error) {
      Alert.alert('Error', 'Failed to reset MPIN. Please try again.');
      console.error(error);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
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

        <TextDefault style={styles.title}>Create MPIN*</TextDefault>
        <TextDefault style={styles.subtitle}>MPIN*</TextDefault>

        <View style={styles.mpinContainer}>
          {mpin.map((digit, index) => (
            <View key={index} style={styles.mpinInputContainer}>
              <TextInput
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.mpinInput}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(value) => handleMpinChange(value, index)}
              />
              <View style={styles.underline} />
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={handleForgotMpin}>
          <TextDefault style={styles.forgotText}>Forgot MPIN</TextDefault>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCreateMpin}>
          <TextDefault style={styles.buttonText}>Create MPIN</TextDefault>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

function VerifyMpinScreen({ navigation }) {
  const [mpin, setMpin] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleMpinChange = (value, index) => {
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    // Move to next box if a digit is entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    // Move to previous box if a digit is erased
    else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyMpin = async () => {
    const enteredMpin = mpin.join('');

    try {
      const savedMpin = await AsyncStorage.getItem('mpin');
      if (enteredMpin === savedMpin) {
        Alert.alert('Success', 'MPIN verified successfully!');
        navigation.replace('Drawer'); // Navigate to the main landing page
      } else {
        Alert.alert('Error', 'Incorrect MPIN. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify MPIN. Please try again.');
      console.error(error);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
      <View style={styles.logoContainer}>
          <View style={styles.logoRow}>
            <Image
              source={require('../../assets/logo.jpg')}
              style={styles.logoImage}
            />
            <TextDefault style={styles.logoText}>AKJ MINI GOLD</TextDefault>
          </View>
          <TextDefault style={styles.subtitleText}>
            (GOLD | SILVER | DIAMOND)
          </TextDefault>
        </View>
        <TextDefault style={styles.title}>Enter Your MPIN</TextDefault>
        <TextDefault style={styles.subtitle}>MPIN*</TextDefault>

        <View style={styles.mpinContainer}>
          {mpin.map((digit, index) => (
            <View key={index} style={styles.mpinInputContainer}>
              <TextInput
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.mpinInput}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(value) => handleMpinChange(value, index)}
              />
              <View style={styles.underline} />
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('OTP')}>
          <TextDefault style={styles.forgotText}>Forgot MPIN</TextDefault>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleVerifyMpin}>
          <TextDefault style={styles.buttonText}>Verify MPIN</TextDefault>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    ...alignment.Plarge,
  },
  logoContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 90,
    alignSelf: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 50,
    height: 40,
    ...alignment.MRsmall,
  },
  logoText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: colors.lightmaroon,
    letterSpacing: 4,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.lightmaroon,
    ...alignment.MTxSmall,
    marginLeft: 80,
    letterSpacing: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    ...alignment.MBlarge,
    color: colors.fontMainColor,
    padding: 30,
  },
  subtitle: {
    fontSize: 14,
    color: colors.fontSecondColor,
    alignSelf: 'flex-start',
    marginLeft: 55,
    ...alignment.MBxSmall,
  },
  mpinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...alignment.MBlarge,
  },
  mpinInput: {
    width: 60,
    height: 70,
    borderWidth: 2,
    borderColor: colors.greenColor,
    borderRadius: 15,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 5,
    backgroundColor: colors.grayLinesColor,
    shadowColor: colors.greenColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  mpinInputContainer: {
    alignItems: 'center',
  },
  underline: {
    width: 30,
    height: 2,
    backgroundColor: colors.fontThirdColor,
    marginTop: -15,
  },
  button: {
    width: '100%',
    backgroundColor: colors.greenColor,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: -10,
  },
  forgotText: {
    color: colors.textBlueColor,
    ...alignment.MTmedium,
    fontSize: 14,
    marginBottom: 80,
    ...alignment.Plarge,
    textDecorationLine: 'underline'
  },
  buttonText: {
    color: colors.fontMainColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export { MpinScreen, VerifyMpinScreen};
