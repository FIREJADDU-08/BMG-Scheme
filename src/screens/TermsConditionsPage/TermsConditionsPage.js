// TermsConditionsPage.js
import React from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';

const TermsConditionsPage = () => {
  return (
    
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image 
          source={require('../../assets/Terms and Conditionspage.jpg')} // Updated path
          style={styles.image}
        />
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: -1, // Add padding here
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch', // Use 'contain' to avoid cropping and ensure the image fits within the container
  },
  
});

export default TermsConditionsPage;
