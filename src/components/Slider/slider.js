import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Assuming your images are in assets/slider_images folder
const LOCAL_IMAGE_PATHS = [
  require('../../assets/slider1.png'),
  require('../../assets/slider2.png'),
  require('../../assets/slider3.png'),
];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex < LOCAL_IMAGE_PATHS.length - 1) {
        setCurrentIndex(currentIndex + 1);
        flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
      } else {
        setCurrentIndex(0);
        flatListRef.current.scrollToIndex({ index: 0, animated: true });
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  const renderItem = ({ item, index }) => (
    <View style={styles.sliderItem}>
      <Image style={styles.sliderImage} source={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={LOCAL_IMAGE_PATHS}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        snapToInterval={width}
        decelerationRate={'fast'}
        onContentSizeChange={() => flatListRef.current.scrollToEnd()}
        onLayout={() => flatListRef.current.scrollToEnd()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderItem: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sliderImage: {
    width: '97%',
    height: 150,
    borderRadius: 15,
  },
});
