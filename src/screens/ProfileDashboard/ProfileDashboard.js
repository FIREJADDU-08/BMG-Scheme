import React, { useContext } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import styles from './ProfileContainer/styles';
import ProfileContainer from './ProfileContainer/ProfileContainer';
import { BottomTab, TextDefault } from '../../components';
// import CardContainer from './CardContainer/CardContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils';

function ProfileDashboard(props) {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <ScrollView 
        
        showsVerticalScrollIndicator={false} 
      >
        <ProfileContainer />
        
      </ScrollView>
    
    </SafeAreaView>
  );
}

export default ProfileDashboard;
