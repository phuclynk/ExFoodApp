import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import theme from '../../../styles/theme'
import Carousel from 'react-native-snap-carousel'

const { width: screenWidth } = Dimensions.get('window')

const Reminder = props => {
  const { item } = props;

  const [data, setData] = useState([
    { name: 'phuc', title: 'sss', img:'https://res.cloudinary.com/de5qf4lzo/image/upload/v1576662959/brooke-lark-HlNcigvUi4Q-unsplash_ufxonu.jpg'},
    { name: 'phuc', title: 'sss', img:'https://res.cloudinary.com/de5qf4lzo/image/upload/v1576662957/robin-stickel-tzl1UCXg5Es-unsplash_ql8vti.jpg'},
    { name: 'phuc', title: 'sss', img:'https://res.cloudinary.com/de5qf4lzo/image/upload/v1576662958/melissa-walker-horn-wcDru6t-aCg-unsplash_mawigh.jpg'},
    { name: 'phuc', title: 'sss', img:'https://res.cloudinary.com/de5qf4lzo/image/upload/v1576662961/thomas-tucker-MNtag_eXMKw-unsplash_ie5jxu.jpg'}
  ])

  const _renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <Image source={{uri: item.img+'' }} style={{width: '100%' , height: '100%', borderRadius: 10}}/>
        {/* <Text style={styles.text}>SO TASTY</Text> */}
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <Carousel
        // ref={carouselRef}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 60}
        data={data}
        renderItem={_renderItem}
        hasParallaxImages
        slideStyle={{
          backgroundColor: theme.colors.primary,
          borderRadius: 10
        }}
        containerCustomStyle={{
          width: '100%',
          flex: 1
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    height: 200,
    borderRadius: 12,
  },
  slide: {
    position: 'relative'
  },
  text: {
    position: 'absolute', 
    fontWeight: 'bold', 
    fontSize: 20, 
    bottom: 20, 
    left: 30,
    color: theme.colors.white
  }
});

export default Reminder;