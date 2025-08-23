import React from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { BackHeader } from '../../components';
import { alignment, colors, scale } from '../../utils';
import Icon from 'react-native-vector-icons/FontAwesome';

const SchemePassbook = ({ navigation, route }) => {
  const { productData, status, accountDetails } = route.params;  // Provide default empty object
  
  //console.log('Received product:', productData, status, accountDetails)

  const isDreamGoldPlan = accountDetails?.schemeSummary?.schemeName?.trim() === 'DREAM GOLD PLAN';
 

  // Define a formatDate function to handle date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
 // console.log(productData,status,accountDetails)
  // Dynamically create transaction history from product
  const transactionHistory = [
    {
      status: status || 'unknown',
      date: productData?.joindate || new Date().toISOString(),
      weight: productData?.amountWeight?.Weight || 0,
      amount: parseFloat(productData?.amountWeight?.Amount) || 0,
    }
  ];

  // Render each transaction item
  const renderTransaction = ({ item }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'active':
          return '#4CAF50'; // Green
        case 'deactivated':
          return '#F44336'; // Red
        case 'pending':
          return '#FFA500'; // Orange
        default:
          return '#9E9E9E'; // Grey
      }
    };

    return (
      <View style={styles.transactionItem}>
        <View style={styles.statusContainer}>
          {item.status?.toLowerCase() === 'active' ? (
            <Icon name="check" size={15} color="#4CAF50" style={styles.statusIcon} />
          ) : (
            <>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusColor(item.status),
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Unknown'}
              </Text>
            </>
          )}
        </View>
        <Text style={styles.transactionText}>{formatDate(item.date)}</Text>
        <Text style={styles.transactionWText}>
          {isDreamGoldPlan ? `₹${item.amount}` : `${item.weight} g`}
        </Text>
        <Text style={styles.transactioninrText}>₹ {item.amount}</Text>
      </View>
    );
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <BackHeader
        title="Scheme Passbook"
        backPressed={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Red Header Box */}
        <View style={styles.redBox} />

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.schemeTitle}>{productData?.pname || 'Scheme Name'}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoColumnLeft}>
              <Text style={styles.infoLabel}>Total Amount Paid</Text>
              <Text style={styles.infoValue}>₹ {productData?.amountWeight?.Amount || '0'}</Text>
            </View>
            <View style={styles.infoColumnRight}>
              <Text style={styles.infoLabel}>Average Rate / g</Text>
              <Text style={styles.infoValue}>
                ₹ {productData?.amountWeight?.Amount || '0'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumnLeft}>
              <Text style={styles.infoLabel}>
                {isDreamGoldPlan ? 'Ins Paid' : 'Weight Saved'}
              </Text>
              <Text style={styles.infoValue}>
                {isDreamGoldPlan 
                  ? `${accountDetails?.schemeSummary?.schemaSummaryTransBalance?.insPaid || 0} / ${accountDetails?.schemeSummary?.instalment || 0}`
                  : `${productData?.amountWeight?.Weight || '0'} g`
                }
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumnLeft}>
              <Text style={styles.infoLabel}>Date of Join</Text>
              <Text style={styles.infoValue}>
                {formatDate(productData?.joindate) || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoColumnRight}>
              <Text style={styles.infoLabel}>Date of Maturity</Text>
              <Text style={styles.infoValue}>
                {formatDate(productData?.maturityDate) || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionContainer}>
          <Text style={styles.transactionHeader}>Transaction History</Text>

          {/* Transaction List Headers */}
          <View style={styles.transactionHeaderRow}>
            <Text style={styles.headerText}>Status</Text>
            <Text style={styles.headerText}>Date</Text>
            <Text style={styles.headerText}>{isDreamGoldPlan ? 'Total Amount' : 'Weight'}</Text>
            <Text style={styles.headerText}>INR</Text>
          </View>

          {/* FlatList for Transaction History */}
          <FlatList
            data={transactionHistory || []}  
            renderItem={renderTransaction}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: scale(12),
  },
  redBox: {
    backgroundColor: '#FF0000', // Bright red
    height: scale(40),
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
  },
  infoContainer: {
    backgroundColor: '#FDF6D3', // Light yellow
    borderBottomLeftRadius: scale(15),
    borderBottomRightRadius: scale(15),
    ...alignment.PLsmall,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(16),
    gap: scale(107),
  },
  schemeTitle: {
    color: colors.lightmaroon,
    fontSize: scale(20),
    fontWeight: 'bold',
    marginBottom: scale(16),
  },
  infoColumnLeft: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: 'flex-start',
    paddingRight: scale(5),
  },
  infoColumnRight: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: 'flex-end',
    paddingRight: scale(5),
  },
  infoLabel: {
    color: colors.fontMainColor,
    fontSize: scale(12),
    opacity: 0.8,
    marginBottom: scale(4),
  },
  infoValue: {
    color: colors.fontSecondColor,
    fontSize: scale(12),
    fontWeight: '600',
  },
  transactionContainer: {
    backgroundColor: colors.white,
    borderRadius: scale(0),
    padding: scale(5),
    flex: 1,
    marginTop: scale(10),
  },
  transactionHeader: {
    fontSize: scale(14),
    fontWeight: '600',
    marginBottom: scale(16),
    color: colors.fontMainColor,
  },
  transactionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLinesColor,
    marginBottom: scale(8),
    paddingHorizontal: scale(10),
  },
  headerText: {
    color: colors.fontMainColor,
    fontSize: scale(12),
    flex: 1,
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLinesColor,
    paddingHorizontal: scale(10),
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statusDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    marginRight: scale(5),
  },
  statusText: {
    fontSize: scale(12),
    color: colors.fontMainColor,
    flex: 1,
    textAlign: 'center',
  },
  statusIcon: {
    marginLeft: scale(5),
  },
  transactionText: {
    fontSize: scale(12),
    color: colors.fontMainColor,
    flex: 1,
    textAlign: 'center',
  },
  transactionWText: {
    fontSize: scale(12),
    color: colors.fontMainColor,
    flex: 1,
    textAlign: 'center',
  },
  transactioninrText: {
    fontSize: scale(12),
    color: colors.fontMainColor,
    flex: 1,
    textAlign: 'center',
  },
});

export default SchemePassbook;
