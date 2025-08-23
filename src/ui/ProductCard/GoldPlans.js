import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextDefault } from '../../components';
import { alignment, colors, scale } from '../../utils';

function GoldPlan(props) {
  const { schemeId, schemeName, description = 'No description available'  } = props; // Destructure schemeId and schemeName from props
  const navigation = useNavigation();



  

  return (
    <TouchableOpacity
      
      style={[styles.cardContainer, props.styles]}
    >
      <View style={styles.gradientBackground}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.rightTop}>
            <TextDefault style={styles.text} bold>
              {schemeName}
            </TextDefault>
          </View>
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          <TextDefault style={styles.description}>
          {description} 
          </TextDefault>
          {/* Display Scheme ID and Scheme Name */}
          {/* <TextDefault style={styles.schemeText}> {schemeId}</TextDefault> */}
          {/* <TextDefault style={styles.schemeText}>Scheme Name: {schemeName}</TextDefault> */}
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => navigation.navigate('KnowMore', { schemeId: schemeId } )}
          >
            <TextDefault style={styles.payButtonText}>Know More</TextDefault>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.payButton}
            onPress={() => navigation.navigate('AddNewMember', { schemeId: schemeId })} // Pass schemeId as route parameter
          >
            <TextDefault style={styles.payButtonText}>Join Scheme</TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
   
    borderRadius: scale(15),
    overflow: 'hidden',
  },
  gradientBackground: {
    backgroundColor: colors.lightmaroon,
    padding: scale(5),
    borderRadius: scale(15),
    overflow: 'hidden',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(20),
    ...alignment.Psmall,
  },
  rightTop: {
    alignItems: 'flex-end',
  },
  centerSection: {
    marginBottom: scale(5),
    ...alignment.Psmall,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(10),
  },
  payButton: {
    backgroundColor: colors.white,
    paddingVertical: scale(5),
    paddingHorizontal: scale(10),
    borderRadius: scale(5),
  },
  text: {
    color: colors.greenColor,
    fontSize: scale(12),
  },
  payButtonText: {
    color: colors.black,
    fontSize: 13,
    fontWeight: 'bold',
  },
  description: {
    color: colors.greenColor,
    fontSize: 14,
    marginBottom: 20,
  },
  schemeText: {
    color: colors.greenColor,
    fontSize: 14,
    marginTop: 5,
  },
});

export default GoldPlan;
