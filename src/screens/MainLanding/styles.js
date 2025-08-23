import { Dimensions, StyleSheet } from 'react-native'
import {
  alignment,
  colors,
  scale,
  verticalScale
} from '../../utils'
const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  safeAreaStyle: {
    backgroundColor: 'transparent',
  },
  mainBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  flatListStyle: {
    flex: 1,
    backgroundColor: 'transparent', // Remove white background
  },
  backgroundImageStyle: {
    opacity: 0.9, // Adjust opacity as needed
  },
  leftIconPadding: {
    ...alignment.PLsmall,
    ...alignment.PRlarge
  },
  scrollViewStyle: {
    marginTop: verticalScale(20),
    backgroundColor: colors.themeBackground
  },
  grayBackground: {
    backgroundColor: colors.white
  },
  caroselContainer: {
    width: '100%',
    height: height * 0.3,
    position: 'relative',
    padding: 10,
    borderRadius: scale(70), // Increase borderRadius here
    overflow: 'hidden', // Ensure content respects rounded corners
    marginTop: verticalScale(15),
    marginBottom: verticalScale(-16),
    alignItems: 'center',
    
  },
  caroselStyle: {
    width,
    height: height * 0.3,
    borderRadius: scale(70), // Increase borderRadius here
  },
  headerContainer: {
    flexDirection: 'row', // Keeps the notification button and location at the same horizontal level
    justifyContent: 'space-between', // Ensures proper spacing
    alignItems: 'center', // Aligns items to the top
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    
  },
  locationWrapper: {
    alignItems: 'flex-start', // Ensures everything aligns left
  },
  
  locationContainer: {
    flexDirection: 'row', // Ensures the icon, text, and arrow stay row-wise
    alignItems: 'center', // Vertically aligns items in the row
  },
  notificationIconWrapper: {
    justifyContent: 'flex-end', // Positions the icon on the far right
    alignItems: 'flex-start', // Aligns vertically with the rest of the content
  },
  locationText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#00000',
    marginLeft: scale(5),
    marginRight: scale(5),
  },
  
  notificationIcon: {
    marginLeft: scale(5),
    padding: scale(10)
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#808080',
    marginBottom: verticalScale(5), // Space between "Location" and the container
    padding: scale(7)
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: scale(15),
    marginLeft: scale(0)
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background
    borderRadius: scale(10),
    marginHorizontal: scale(20),
    marginTop: verticalScale(10),
    padding: scale(13),
    // Shadow for iOS
    shadowColor: '#808080', // Gray shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 5, // Adjust elevation for the desired shadow effect
  },  
  
  searchInput: {
    flex: 1,
    marginLeft: scale(10),
    color: '#000',
    fontSize: 18,
  },
  menuDrawerContainer: {
    position: 'absolute',
    top: '10%',
    left: '2%'
  },
  imgResponsive: {
    flex: 1,
    width: undefined,
    height: undefined
  },
  headingText: {

    fontSize: scale(16)
  },
  itemCardContainer: {
    width: scale(290),
    height: scale(220),

    ...alignment.MTsmall,
    ...alignment.MRlarge
  },
  iconContainer: {
    width: scale(60),  // Adjust width as needed
    height: verticalScale(60),  // Adjust height
    marginRight: scale(27),  // Decreased space between containers
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(40),
    overflow: 'hidden',
    backgroundColor: '#E0F8FF',  // Replace this with your desired color code
    marginTop: scale(16)
  },  
  iconImage: {
    width: '100%',  // Image fills the container
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',  // Ensures image covers the circle without distortion
  },
  categoryContainer: {
    marginTop: verticalScale(10),
    paddingHorizontal: scale(10), // Adjust for proper spacing
  },
  titleSpacer: {
    marginLeft: '5%',
    marginTop: scale(10)
  },
  productCard: {
    marginLeft: '5%',
    width: '43%',
    height: scale(200),
    marginTop: scale(10),
    marginBottom: scale(20),
    borderColor: colors.whiteColor,
    borderWidth: scale(8),
  },
  seeAllTextContainer: {
    flex: 1, // Ensures it takes the remaining space and pushes text to the right
    alignItems: 'flex-end', // Aligns text to the right
    marginTop:15
  },
  locationImage: {
    width: 54,  // Adjust width
    height: 54, // Adjust height
    marginRight: 8, // Space between image and text
  },
  locationText: {
    fontSize: 16,  // Adjust text size
    color: 'white',
    marginTop:15
  },
  
  seeAllText: {
    textAlign: 'right', // Align the text itself to the right
    marginRight: '6%',
    marginTop: scale(-35), // Move the "See All" text upwards (negative value to shift it up
  },
  
  spacer: {
    ...alignment.MBsmall
  },
  categoryWrapper: {
    alignItems: 'center', // Center align the icon and text
    marginRight: scale(17), // Add some spacing between categories
    padding: 0,
    marginLeft: scale(-6),
  },
  


  container: {
    padding: 5,
    // backgroundColor:Color.colorWhitesmoke_100,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.greenColor,
    marginLeft: 10
  },
  titlecard:{
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.greenColor,
    marginLeft: '5%',
  },

  trendingContainer: {
    flexDirection: 'row',
    marginTop: 10,
    
  },
  card: {
    flex: 1,
    backgroundColor: colors.lightmaroon, 
    borderRadius: 10,
    padding: 20,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    color: colors.greenColor,
    fontSize: 16, // adjust the font size as needed
    marginLeft: '5%',
  },
  subtitle1: {
    color: colors.greenColor,
    fontSize: 14, // adjust the font size as needed
    marginLeft: '5%',
  },
  logo: {
    width: 30,
    height: 30,
    marginBottom: 10,
    marginRight: 10,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateUpdatedText: {
    fontSize: 16,
    color: colors.greenColor, // Adjust as needed
    marginTop: 8,
    textAlign: 'center',
  },
  contentWrapper: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(10),
    backgroundColor: colors.lightGray, // Light background for emphasis
    borderRadius: scale(10),
  },
  contentText: {
    color: colors.greenColor, // Text color
    fontSize: scale(14),
    fontWeight: 'bold',
    marginVertical: verticalScale(10),
    // marginLeft: 4,
    textAlign: 'left'
  },
  contentText1: {
    color: colors.greenColor, // Text color
    fontSize: scale(12),
    // marginLeft: 4
  },
  animatedContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  }
  
})
export default styles
