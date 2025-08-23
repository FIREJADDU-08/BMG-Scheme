import { StyleSheet } from 'react-native';
import { verticalScale, scale } from '../../../utils/scaling';

import { colors } from '../../../utils';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: scale(20),
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(10),
    left: scale(15),
    zIndex: 1,
    padding: scale(10),
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
    marginTop: verticalScale(60),
  },
  profileIconContainer: {
    marginBottom: verticalScale(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    color: colors.greenColor,
    marginBottom: verticalScale(5),
    fontWeight: 'bold',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(5),
  },
  phoneIcon: {
    marginRight: scale(8),
  },
  phoneNumber: {
    color: colors.greenColor,
    fontSize: verticalScale(16),
  },
  settingsSection: {
    borderRadius: verticalScale(10),
    padding: verticalScale(15),
    marginHorizontal: scale(15),
    marginBottom: verticalScale(20),
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLinesColor,
  },
  settingsItemIcon: {
    marginRight: scale(15),
  },
  settingsItemText: {
    flex: 1,
    color: colors.greenColor,
    fontSize: verticalScale(16),
  },
});

export default styles;
