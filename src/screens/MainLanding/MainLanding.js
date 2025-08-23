import React, { useEffect, useState, useRef } from 'react';
import { Animated, Image, View, FlatList, Text, ScrollView, TouchableOpacity, ImageBackground, Alert, ToastAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTab, TextDefault, Slider } from '../../components';
import GoldPlan from '../../ui/ProductCard/GoldPlans';
import ProductCard from '../../ui/ProductCard/ProductCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { verticalScale, scale, colors } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCardSkeleton from '../../components/SkeletonLoader/ProductCardSkeleton';
import GoldPlansSkeleton from '../../components/SkeletonLoader/GoldPlansSkeleton';

// Toast function for iOS
const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // For iOS, you can use a third-party toast library or implement a custom toast
    // For now, we'll use Alert as fallback
    Alert.alert('', message);
  }
};

function MainLanding() {
  const navigation = useNavigation();
  const [goldRate, setGoldRate] = useState(null);
  const [silverRate, setSilverRate] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [rateUpdated, setRateUpdated] = useState(null);

  const [phoneSearchData, setPhoneSearchData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(true);

  const [error, setError] = useState(null);
  const [animationsRunning, setAnimationsRunning] = useState(false);

  // Animation values
  const goldAnimation = useRef(new Animated.Value(0)).current;
  const silverAnimation = useRef(new Animated.Value(0)).current;

  // Create animated styles for coins
  const createAnimatedStyle = (animatedValue) => {
    const rotateY = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['0deg', '180deg', '360deg'],
    });

    const scale = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.6, 1],
    });

    const opacity = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.3, 1],
    });

    return {
      transform: [
        { perspective: 1000 },
        { rotateY },
        { scale }
      ],
      opacity,
    };
  };

  useEffect(() => {

    const fetchPhoneSearchData = async () => {
      const storedPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');
      console.log(storedPhoneNumber)
      try {
        // Fetch phone search data
        const phoneResponse = await fetch(`https://akj.brightechsoftware.com/v1/api/account/phonesearch?phoneNo=${storedPhoneNumber}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // Check if response is successful
        if (!phoneResponse.ok) {
          throw new Error(`Phone Search HTTP error! status: ${phoneResponse.status}`);
        }

        const phoneJson = await phoneResponse.json();

        if (phoneJson && phoneJson.length > 0) {
          setPhoneSearchData(phoneJson);

          // Fetch amount and weight for each item
          const productPromises = phoneJson.map(async (item) => {
            try {
              // Fetch account details for each item
              const accountResponse = await fetch(`https://akj.brightechsoftware.com/v1/api/account?regno=${item.regno}&groupcode=${item.groupcode}`, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              });

              if (!accountResponse.ok) {
                throw new Error(`Account details HTTP error! status: ${accountResponse.status}`);
              }

              const accountData = await accountResponse.json();
              console.log(accountData,'accountData')

              const amountWeightResponse = await fetch(
                `https://akj.brightechsoftware.com/v1/api/getAmountWeight?REGNO=${item.regno}&GROUPCODE=${item.groupcode}`,
                {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              // Check if response is successful
              if (!amountWeightResponse.ok) {
                throw new Error(`Amount Weight HTTP error! status: ${amountWeightResponse.status}`);
              }

              const amountWeightJson = await amountWeightResponse.json();
              
              // Check if the scheme is active based on maturity date and join date
              const currentDate = new Date();
              const maturityDate = new Date(item.maturitydate);
              const joinDate = new Date(item.joindate);
              
              // Determine if the scheme is active
              const isActive =  maturityDate !== null;
              const itemStatus = isActive ? 'Active' : 'Deactive';
              
              // If deactivated, ensure weight is 0
              const amountWeight = isActive ? (amountWeightJson[0] || { Weight: 0, Amount: 0 }) : { Weight: 0, Amount: 0 };
              
              setStatus(itemStatus);
              return {
                ...item,
                amountWeight: amountWeight,
                status: itemStatus,
                accountDetails: accountData
              };
            } catch (amountError) {
              console.error('Error fetching data:', amountError);
              return {
                ...item,
                amountWeight: null,
                status: 'Deactive',
                accountDetails: null
              };
            }
          });

          const resolvedProductData = await Promise.all(productPromises);

          // Filter out items with null amountWeight
          const validProductData = resolvedProductData.filter(item => item.amountWeight !== null);

          setProductData(validProductData);
          console.log(validProductData)
          if (validProductData.length === 0) {
            setError('No valid product data found');
          }
        } else {
          setError('No phone search data available');
        }
      } catch (err) {
        console.error('Detailed fetch error:', err);
        setError(`Failed fetch data: ${err.message}`);

        // Replace Alert with Toast
        showToast(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneSearchData();
  }, []);

  // Start animations
  useEffect(() => {
    console.log('Starting continuous left-right coin flip animations...');
    
    const animateGold = Animated.loop(
      Animated.timing(goldAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      { iterations: -1 }
    );

    const animateSilver = Animated.loop(
      Animated.timing(silverAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      { iterations: -1 }
    );

    // Start animations with error handling
    try {
      animateGold.start((finished) => {
        if (finished) {
          console.log('Gold animation finished, restarting...');
          animateGold.start();
        }
      });
      
      // Start silver animation with a delay for alternating effect
      setTimeout(() => {
        animateSilver.start((finished) => {
          if (finished) {
            console.log('Silver animation finished, restarting...');
            animateSilver.start();
          }
        });
      }, 500);
      
      setAnimationsRunning(true);
      console.log('Continuous left-right coin flip animations started successfully');
    } catch (error) {
      console.error('Error starting animations:', error);
      setError('Animation failed to start');
    }

    return () => {
      console.log('Component unmounting - stopping animations...');
      setAnimationsRunning(false);
      animateGold.stop();
      animateSilver.stop();
    };
  }, []);

  // Monitor animations and restart if needed
  useEffect(() => {
    if (!animationsRunning) {
      console.log('Animations not running, attempting to restart...');
      // Force restart animations
      goldAnimation.setValue(0);
      silverAnimation.setValue(0);
    }
  }, [animationsRunning]);

  // Fetch rates
  const fetchRates = async () => {
    try {
      const response = await fetch('https://akj.brightechsoftware.com/v1/api/account/todayrate');
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      if (data) {
        setGoldRate(data.Rate);
        setSilverRate(data.SILVERRATE);
        setRateUpdated(formatDate(new Date()));
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  // Fetch schemes
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch('https://akj.brightechsoftware.com/v1/api/member/scheme');
        const data = await response.json();
        setSchemes(
          data.map((s) => ({
            schemeId: s.SchemeId,
            schemeName: s.schemeName,
            description: s.SchemeSName,
          }))
        );
        //console.log(data)
      } catch (error) {
        console.error('Error fetching schemes:', error);
      }
    };
    fetchSchemes();
  }, []);

  useEffect(() => {
    fetchRates();
  }, []);

  const formatDate = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedTime = `${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? '0' + minutes : minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
    const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;

    return `Rate updated on ${formattedTime} ${formattedDate}`;
  };

  function renderHeader() {
    return (
      <>
        <View style={styles.headerContainer}>
          <View style={styles.locationWrapper}>
            <View style={styles.locationContainer}>
              <Image source={require('../../assets/logo.jpg')} style={styles.locationImage} />
              <TextDefault style={styles.title} H4 bold>
                AKJ Gold
              </TextDefault>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>Gold & Silver Rate</Text>
          {rateUpdated && <Text style={styles.rateUpdatedText}>{rateUpdated}</Text>}

          <View style={styles.trendingContainer}>
            <View style={styles.card}>
              <Animated.View style={[styles.animatedContainer, createAnimatedStyle(goldAnimation)]}>
                <Image source={require('../../assets/gold.png')} style={styles.logo} resizeMode="contain" />
              </Animated.View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.titlecard}>Gold</Text>
                <Text style={[styles.subtitle, { alignSelf: 'flex-start' }]}>
                  {goldRate ? `₹${goldRate}` : 'Loading...'}
                </Text>
                <Text style={styles.subtitle1}>22K Per gram</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Animated.View style={[styles.animatedContainer, createAnimatedStyle(silverAnimation)]}>
                <Image source={require('../../assets/silver.png')} style={styles.logo} resizeMode="contain" />
              </Animated.View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.titlecard}>Silver</Text>
                <Text style={[styles.subtitle, { alignSelf: 'flex-start' }]}>
                  {silverRate ? `₹${silverRate}` : 'Loading...'}
                </Text>
                <Text style={styles.subtitle1}>Per gram</Text>
              </View>
            </View>
          </View>
        </View>

        <Slider />

        <View style={styles.contentWrapper}>
          <Text style={styles.contentText}>
            Welcome to the Digital home of AKJ Jewellers:
          </Text>
          <Text style={styles.contentText1}>The ideal place to join a savings scheme and save up to buy your dream jewels. AKJ DIGIGOLD empowers you to save and buy jewels conveniently in the plan of your hand. Start saving in gold from today.</Text>
        </View>

        <View style={styles.titleSpacer}>
          <TextDefault textColor={colors.greenColor} H5 bold>
            {'Your Schemes'}
          </TextDefault>
          <View style={styles.seeAllTextContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('MyScheme')}>
              <TextDefault textColor={colors.greenColor} H5 style={styles.seeAllText}>View All</TextDefault>
            </TouchableOpacity>
          </View>

          {/* Horizontal ScrollView for product cards with skeleton loader */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.productScrollContainer}
          >
            {loading ? (
              // Show skeleton loaders while loading
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : productData && productData.length > 0 ? (
              productData.map((item, index) => (
                <ProductCard
                  key={index}
                  productData={item}
                  loading={loading}
                  status={status}
                  error={error}
                  navigation={navigation}
                  accountDetails={item.accountDetails}
                />
              ))
            ) : (
              <TextDefault textColor={colors.redColor}>No Schemes available.</TextDefault>
            )}
          </ScrollView>
        </View>

        <View style={styles.contentWrapper}>
          <Text style={styles.contentText}>
            Customized Gold Plans for You:
          </Text>
          <Text style={styles.contentText1}>Choose from a range of Gold Plans with unique benefits to suit your needs and convenience.</Text>
        </View>

        <View style={styles.titleSpacer}>
          <TextDefault textColor={colors.greenColor} H5 bold>
            {'Gold Plans'}
          </TextDefault>
          <View style={styles.seeAllTextContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('GoldPlanScreen')}>
              <TextDefault textColor={colors.greenColor} H5 style={styles.seeAllText}>View All</TextDefault>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {loading ? (
              // Show skeleton loaders while loading
              <>
                <GoldPlansSkeleton />
                <GoldPlansSkeleton />
              </>
            ) : schemes && schemes.length > 0 ? (
              schemes.map((scheme, index) => (
                <GoldPlan
                  key={index}
                  schemeId={scheme.schemeId}
                  schemeName={scheme.schemeName}
                  description={scheme.description}
                  styles={styles.itemCardContainer}
                />
              ))
            ) : (
              <TextDefault textColor={colors.redColor}>No Gold Plans available.</TextDefault>
            )}
          </ScrollView>
        </View>
      </>
    );
  }

  const renderProductCards = () => {
    if (loading) {
      return (
        <View>
          {[1, 2, 3].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </View>
      );
    }

    return (
      <FlatList
        data={productData}
        keyExtractor={(item) => item.regno.toString()}
        renderItem={({ item }) => (
          <ProductCard
            schemeName={item.schemename}
            groupCode={item.groupcode}
            regNo={item.regno}
            amount={item.amountWeight?.Amount || 0}
            weight={item.amountWeight?.Weight || 0}
            status={item.status}
            maturityDate={item.maturitydate}
            joinDate={item.joindate}
          />
        )}
      />
    );
  };

  const renderGoldPlans = () => {
    if (loading) {
      return <GoldPlansSkeleton />;
    }

    return <GoldPlan />;
  };

  return (
    <SafeAreaView style={[styles.flex, styles.safeAreaStyle]}>
      <ImageBackground
        source={require('../../assets/bg.jpg')}
        style={styles.mainBackground}
        imageStyle={styles.backgroundImageStyle}
      >
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          ListHeaderComponent={renderHeader}
        />
        <BottomTab screen="HOME" />
      </ImageBackground>
    </SafeAreaView>
  );
}

export default MainLanding;
