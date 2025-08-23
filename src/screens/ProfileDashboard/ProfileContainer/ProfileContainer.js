import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TextDefault } from '../../../components';
import { colors } from '../../../utils';

function ProfileContainer(props) {
  const navigation = useNavigation();
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem('userPhoneNumber');
        if (phoneNumber) {
          // Format the phone number for display
          const formattedPhone = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
          setUserPhone(formattedPhone);
          
          // Fetch user details using phone number
          const response = await fetch(`https://akj.brightechsoftware.com/v1/api/account/phonesearch?phoneNo=${phoneNumber}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setUserName(data[0].pname || 'User');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Do you surely want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout canceled'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('mpin');
              await AsyncStorage.removeItem('isMpinCreated');
              await AsyncStorage.removeItem('userPhoneNumber');
              navigation.replace('OTP');
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      {/* Profile Icon and Name */}
      <View style={styles.profileSection}>
        <View style={styles.profileIconContainer}>
          <MaterialIcons name="account-circle" size={100} color={colors.greenColor} />
        </View>
        <TextDefault style={styles.profileName} H4>
          {userName}
        </TextDefault>
        <View style={styles.phoneContainer}>
          <MaterialIcons name="phone" size={20} color={colors.greenColor} style={styles.phoneIcon} />
          <TextDefault style={styles.phoneNumber} H5>
            {userPhone}
          </TextDefault>
        </View>
      </View>

      {/* Settings Options */}
      <View style={styles.settingsSection}>
        {[ 
          { label: 'My Scheme', icon: 'list', route: 'MyScheme' },
          { label: 'Help Center', icon: 'help', route: 'HelpCenter' },
          { label: 'Privacy Policy', icon: 'security', route: 'PrivacyPolicy' },
          { label: 'Terms and Condition', icon: 'lock', route: 'TermsandCondition' },
          // { label: 'Delete', icon: 'delete', route: 'DeleteButton' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingsItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.settingsItemIcon}>
              <MaterialIcons name={item.icon} size={24} color={colors.greenColor} />
            </View>
            <TextDefault style={styles.settingsItemText} H5>
              {item.label}
            </TextDefault>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={colors.greenColor}
            />
          </TouchableOpacity>
        ))}

        {/* Logout Option */}
        <TouchableOpacity
          style={styles.settingsItem}
          onPress={handleLogout}
        >
          <View style={styles.settingsItemIcon}>
            <MaterialIcons name="logout" size={24} color={colors.greenColor} />
          </View>
          <TextDefault style={styles.settingsItemText} H5>
            Log Out
          </TextDefault>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={colors.greenColor}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

export default ProfileContainer;
