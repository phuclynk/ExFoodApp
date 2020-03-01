import React, { useState, useEffect, useRef } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapView, { Polyline, Marker, Callout } from 'react-native-maps'
import theme from '../../styles/theme'
import { Icon } from 'react-native-elements'
import { StyleSheet, Dimensions, Image, Text, View, Button, ImageBackground } from "react-native";
import Geolocation from '@react-native-community/geolocation'
import Carousel from 'react-native-snap-carousel'
import WithContext from '../../components/core/WithContext'
import { AuthService } from '../../services/AuthService'
import Header from '../../components/core/Header'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import { BlurView, VibrancyView } from "@react-native-community/blur"

const { width: screenWidth } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  mapContainer: {
    position: 'absolute',
    padding: 10,
    backgroundColor: 'transparent',
    zIndex: 1000,
    width: '100%',
  },
  listView: {
    backgroundColor: theme.colors.white,
    borderRadius: 5
  },
  textInputContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 5,
    marginBottom: 7,
  },
  poweredContainer: {
    display: 'none'
  },
  rightBtn: {
  },
  btnContainer: {
    justifyContent: 'center',
    padding: 10,
    zIndex: 10000000
  },
  myLocation: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
    zIndex: 10000,
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
    borderWidth: 3
  },
  chooseBtn: {
    width: '50%',
    alignSelf: 'center',
    top: '91.5%',
    zIndex: 1000000
  },
  slide: {
    height: 200,
  },
  hideChooseBtn: {
    display: 'none'
  },
  title: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  name: {
    color: theme.colors.white,
  },
  backgroundText: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    backgroundColor: theme.colors.black,
    opacity: 0.5,
    bottom: 0,
    zIndex: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10
  }
});

const NearbyStoreOnMap = props => {
  const { navigation, context } = props
  const { changeTemptLocation, user } = context
  const { restaurant } = navigation.state.params

  const [lat, setLat] = useState(16.0216792)
  const [long, setLong] = useState(108.2257474)

  const [showCarousel, setShowCarousel] = useState(false)
  const [selectedMaker, setSelectedMarker] = useState(0)
  const carouselRef = useRef()
  const mapRef = useRef()

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        changeTemptLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      },
      (error) => setError(error.message),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }, [])

  const goBackMyLocation = () => {
    mapRef.current.animateCamera({
      center: {
        latitude: lat,
        longitude: long
      },
      pitch: 2,
      heading: 20,
      altitude: 200,
      zoom: 17
    }, 1000)
  }

  const goToStore = item => {
    navigation.navigate('Store', { storeId: item._id })
  }

  const roundDistance = distance => {
    let _distance = parseFloat(distance)
    _distance = Math.round(distance * 100) / 100
    return _distance
  }

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => goToStore(item)} style={{ borderRadius: 10 }}>
        <Image
          style={{ ...styles.slide, borderRadius: 10 }}
          source={{ uri: item.img }}
          imageStyle={{ borderRadius: 10, backgroundColor: theme.colors.black }}
        />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', padding: 10, zIndex: 12 }}>

          <Text style={styles.title}>{item.name}</Text>
          <Text numberOfLines={2} style={{...styles.name, height: 32}}>{item.location.address}</Text>
          <Text style={styles.name}>{roundDistance(item.distance)} km</Text>
        </View>
        <Icon containerStyle={{ position: 'absolute', right: 10, top: 10 }} type='material-community' name='subdirectory-arrow-right' />
        <View style={styles.backgroundText}></View>
      </TouchableOpacity>
    )
  }


  const goToLocation = (latt, longg) => {
    mapRef.current.animateCamera({
      center: {
        latitude: latt,
        longitude: longg
      },
      pitch: 2,
      heading: 20,
      altitude: 200,
      zoom: 17
    }, 1000)
  }

  const handleMarkerPress = (item, index) => {

    setSelectedMarker(index)
    setShowCarousel(true)

    goToLocation(item.location.lat, item.location.long)

    setLat(item.location.lat)
    setLong(item.location.long)
  }

  return (
    <>
      <Header />
      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsMyLocationButton={true}
        showsUserLocation={true}
      >
        {restaurant && restaurant.map((item, index) =>
          <Marker
            coordinate={{ "latitude": item.location.lat, "longitude": item.location.long }}
            title={item.name}
            onPress={() => handleMarkerPress(item, index)}
          />
        )}

      </MapView>
      {!showCarousel && <View style={styles.myLocation} >
        <Icon
          type='font-awesome'
          name='location-arrow'
          size={30}
          color={theme.colors.primary}
          onPress={goBackMyLocation}
        />
      </View>}
      {showCarousel && <Carousel
        ref={carouselRef}
        firstItem={selectedMaker}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 100}
        data={restaurant}
        renderItem={_renderItem}
        hasParallaxImages
        containerCustomStyle={{
          zIndex: 1000,
          position: 'absolute',
          bottom: 30,
        }}
        slideStyle={{
          backgroundColor: theme.colors.white,
          borderRadius: 10
        }}
        style={{
          backfaceVisibility: 'visible'
        }}
        sliderHeight={300}

      />}
    </>
  )
}

export default WithContext(NearbyStoreOnMap)