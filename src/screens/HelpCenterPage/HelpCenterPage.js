import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing icons
import { colors, scale, verticalScale, alignment } from '../../utils';

function HelpCenterPage() {
  return (
    <ImageBackground
      source={require("../../assets/bg.jpg")} // Path to your logo
      style={styles.backgroundImage}
      resizeMode="cover" // Adjusts how the image is resized to fit the container
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Help Center</Text>

          <View style={styles.infoContainer}>
          <Text style={styles.subtitle}>Main Branch</Text>
          <View style={styles.row}>
          <Icon name="location-on" size={28} color={colors.greenColor} style={styles.loationicon} />
          <View>
            
              
              <Text style={styles.text}>Old # 52, New # 68, Ellis Road,</Text>
            
            
            <Text style={styles.text}>Mount Road, Chennai 600002,</Text>
            <Text style={styles.text}>Tamilnadu, India.</Text>
            </View>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Text style={styles.subtitle}>Contact Us</Text>
            </View>
            <View style={styles.row}>
              <Icon name="email" size={28} color={colors.greenColor} style={styles.icon} />
              <Text style={styles.text}>care@akjminigoldsouk.com</Text>
            </View>
            <View style={styles.row}>
              <Icon name="phone" size={28} color={colors.greenColor} style={styles.icon} />
              <Text style={styles.text}>044 42 157 157</Text>
            </View>
            <View style={styles.row}>
              <Icon name="phone" size={28} color={colors.greenColor} style={styles.icon} />
              <Text style={styles.text}>044 2858 8888</Text>
            </View>
            <View style={styles.row}>
              <Icon name="phone" size={28} color={colors.greenColor} style={styles.icon} />
              <Text style={styles.text}>044 2858 0506</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adds transparency to the content area
  },
  scrollContainer: {
    padding: scale(20),
    alignItems: 'center',
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: colors.greenColor, // Use your app's primary color
    marginBottom: verticalScale(20),
  },
  infoContainer: {
    width: '100%',
    backgroundColor: colors.cardBackground, // Use a card background color
    padding: scale(15),
    borderRadius: scale(10),
    marginBottom: verticalScale(15),
    ...alignment.shadow, // Add shadow for better visuals
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  icon: {
    marginRight: scale(10),
    
  },
  loationicon:{
    marginRight: scale(10),
    marginTop: -50
  },
  subtitle: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: colors.greenColor, // Use your app's secondary color
    ...alignment.MBmedium
  },
  text: {
    fontSize: scale(16),
    color: colors.greenColor, // Use your app's text color
    lineHeight: verticalScale(24),
  },
});

export default HelpCenterPage;
