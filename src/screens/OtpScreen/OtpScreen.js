import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ToastAndroid
} from 'react-native';
import axios from 'axios';
import { TextDefault } from '../../components';
import { alignment } from '../../utils';
import { colors } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../utils/toast';

function OTP({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpVisible, setIsOtpVisible] = useState(false);

  const inputRefs = useRef([]); // Create refs for each OTP input

  const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

  const handlePhoneChange = (text) => {
    // Remove any non-digit characters
    const cleanedText = text.replace(/\D/g, '');
    
    // Only allow numbers and limit to 10 digits
    if (cleanedText.length <= 10) {
      setPhoneNumber(cleanedText);
      // Validate if the number starts with 6-9 and is exactly 10 digits
      setIsPhoneValid(/^[6-9]\d{9}$/.test(cleanedText) || cleanedText.length === 0);
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
      showToast('Please enter a valid 10-digit Indian mobile number starting with 6-9.');
      return;
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtp(['', '', '', '']); // Reset OTP input fields

    try {
      const apiUrl = `https://sms.krispal.in/api/smsapi`;
      const params = {
        key: 'f22fc7c406cfd9b0f2767d436a1c7c69',
        route: '2',
        sender: 'VIMJEW',
        number: phoneNumber,
        sms: `Dear Customer, This is your OTP: ${otp} for Login. Thank you for Shopping - Vimala Jewellers - Manali`,
        templateid: '1707172725674467368',
      };

      await axios.post(apiUrl, null, { params });
      showToast('OTP sent successfully!');
      try {
        await AsyncStorage.setItem('userPhoneNumber', phoneNumber);
        console.log('Phone number saved in AsyncStorage');
      } catch (storageError) {
        console.error('Failed to save phone number to AsyncStorage:', storageError);
      }
      setIsOtpVisible(true);
    } catch (error) {
      showToast('Failed to send OTP. Please try again.');
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.join('') === generatedOtp) {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');
        
        const response = await fetch(`https://akj.brightechsoftware.com/v1/api/account/phonesearch?phoneNo=${storedPhoneNumber}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            await AsyncStorage.setItem('userName', data[0].pname || 'User');
          }
        }

        await AsyncStorage.setItem('isOtpVerified', 'true');
        await AsyncStorage.removeItem('mpin');
        await AsyncStorage.removeItem('isMpinCreated');
        navigation.navigate('MpinScreen', { step: 3 });
      } catch (error) {
        showToast('Failed to save user details. Please try again.');
        console.error(error);
      }
    } else {
      showToast('Invalid OTP. Please try again.');
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus(); // Move to the next input
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Move to the previous input on backspace
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bg.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/logo.jpg')} // Correct path
          style={styles.logoImage}
        />

        {/* Title */}
        <TextDefault style={styles.title}>Sign In</TextDefault>

        {!isOtpVisible && (
          <>
            <TextDefault style={styles.subtitle1}>Mobile No</TextDefault>
            <View style={[styles.inputWrapper, !isPhoneValid && styles.inputError]}>
              <View style={styles.phoneContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  keyboardType="numeric"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  placeholder="Enter 10-digit Mobile Number"
                  maxLength={10}
                />
              </View>
              {!isPhoneValid && phoneNumber.length > 0 && (
                <Text style={styles.errorText}>Please enter a valid 10-digit mobile number starting with 6-9</Text>
              )}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </>
        )}

        {isOtpVisible && (
          <>
            <TextDefault style={styles.subtitle}>Enter OTP</TextDefault>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Sign Up Text */}
        {/* <Text style={styles.signUpText}>
          Don't have an account?{' '}
          <Text
            style={styles.signUpLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign Up
          </Text>
        </Text> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the entire screen
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    ...alignment.Plarge,
  },
  logoImage: {
    width: 100, // Set width according to your logo size
    height: 100, // Set height according to your logo size
    resizeMode: 'contain', // Ensures logo is scaled correctly
    marginTop: -80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    padding: 60,
  },
  subtitle: {
    alignSelf: 'flex-start',
    ...alignment.PBsmall,
    marginLeft: 45,

  },
  subtitle1: {
    alignSelf: 'flex-start',
    ...alignment.PBsmall,
    marginLeft: 25,
  },

  inputWrapper: {
    width: '90%',
    marginBottom: 20,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.greenColor,
    borderRadius: 15,
    backgroundColor: colors.backgroudGray,
  },
  countryCode: {
    fontSize: 16,
    color: colors.greenColor,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  phoneInput: {
    flex: 1,
    height: 60,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.yellow,
    shadowColor: colors.yellow,
  },
  errorText: {
    color: colors.yellow,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  otpInput: {
    width: 60,
    height: 70,
    borderWidth: 2,
    borderColor: colors.greenColor,
    borderRadius: 15,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
    backgroundColor: colors.grayLinesColor,
    shadowColor: colors.greenColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6
  },
  button: {
    backgroundColor: colors.greenColor,
    width: '90%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    marginTop: 80,
  },
  buttonText: {
    color: colors.fontMainColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 50,
    fontSize: 16,
  },
  signUpLink: {
    textDecorationLine: 'underline',
  },
});

export default OTP;
