import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import theme from '../../../styles/theme'
import { Icon } from 'react-native-elements'
import WithContext from '../../../components/core/WithContext'

const StoreItem = props => {
  const { item, navigation, context } = props
  
  const roundDistance = () => {
    let distance = parseFloat(item.distance) 
    distance = Math.round(distance * 100)/100
    return distance
  }

  return (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Store', { storeId: item._id })}>
      
      <View style={styles.content}>
      <Image source={{ uri: item.img }} style={{position: 'absolute', width: '112%', height: '167%', borderRadius: 10, opacity: 0.2}}/>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.row}>
          <Icon
            name="map-marker"
            type="font-awesome"
            size={18}
            color={theme.colors.primary}
            containerStyle={{marginRight: 15, opacity: 0.8}}
          />
          <Text numberOfLines={1} style={styles.text}>{item.location.address}</Text>
        </View>
        <View style={styles.row}>
          <Icon
            name="truck-delivery"
            type="material-community"
            size={20}
            color={theme.colors.primary}
            containerStyle={{marginRight: 5, opacity: 0.8}}
          />
          <Text style={styles.text}>Distance: {roundDistance()} km </Text>
        </View>
        <View style={styles.row}>
          <Icon
            name="cash"
            type="material-community"
            size={20}
            color={theme.colors.primary}
            containerStyle={{marginRight: 5, opacity: 0.8}}
          />
          <Text style={styles.text}>Average: d</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    width: '100%',
    height: 110,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    position: 'relative'
  },
  image: {
    marginRight: 15,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 10,
    marginVertical: 5
  },
  name: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Text-Medium',
    fontWeight: 'bold',
    color: theme.colors.primary,
    opacity: 0.8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  text: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Text-Regular',
    color: theme.colors.black,
    width: '92%'
    // paddingHorizontal: 5,
  },
  rating: {
    height: 10,
  },
  price: {
    fontSize: 13,
    fontFamily: 'SF-Pro-Text-Regular',
    color: theme.colors.black,
    paddingHorizontal: 5,
  },
  likeWrapper: {
    width: 30,
    justifyContent: 'center'
  },
});

export default WithContext(StoreItem)
