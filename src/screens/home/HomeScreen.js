import React, { useState, Fragment, useEffect, useContext } from 'react'
import WithContext from '../../components/core/WithContext'
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native'
import Reminder from './components/Reminder'
import Category from './components/Category'
import { ScrollView } from 'react-native-gesture-handler'
import HomeHeader from './components/HomeHeader'
import Toolbar from './components/Toolbar'
import StoreList from '../stores/components/StoreList'
import StoreService from '../../services/StoreService'
import theme from '../../styles/theme'
import { NotificationContext } from '../../components/core/NotificationsContext'
import { NotificationService } from '../../services/NotificationService'

const HomeScreen = props => {
  const { navigation, context } = props
  const { temptLocation, user } = context
  const notificationContext = useContext(NotificationContext)

  const [categories, setCategories] = useState([
    { id: 1, icon: require('../../../assets/icons/rice-bowl.png'), key: 'com rice', name: 'Rice' },
    { id: 2, icon: require('../../../assets/icons/coffee-cup.png'), key: 'tra sua milktea milk tea', name: 'Milk tea' },
    { id: 3, icon: require('../../../assets/icons/coffee-cup2.png'), key: 'coffee cafe', name: 'Coffee' },
    { id: 4, icon: require('../../../assets/icons/ice-cream.png'), key: 'kem ice cream', name: 'Ice cream' },
    { id: 6, icon: require('../../../assets/icons/hot-pot.png'), key: 'lau hot pot', name: 'Hot pot' },
    { id: 7, icon: require('../../../assets/icons/grill.png'), key: 'nuong bbq', name: 'BBQ' },
  ]);
  const [restaurant, setRestaurant] = useState([]);

  useEffect(() => {
    if(temptLocation){
      getRestaurantsNearby()
    }
  }, [temptLocation])

  useEffect(() => {
    if(user.userId) {
      getNotifications()
    }
  }, [user])

  const getNotifications = () => {
    NotificationService.getNotifications(
      user.userId,
      res => {
        notificationContext.notifications.set(res.data.data.notificationByUser)
      },
      err => {
        alert(err)
      }
    )
  }

  const getRestaurantsNearby = () => {
    StoreService.getStoreNearby(
      temptLocation.lat,
      temptLocation.long,
      res => {
        setRestaurant(res.data.data.restaurantNearby)
      },
      err => {
        alert(err)
      }
    )
  }

  return (
    <Fragment>
      <HomeHeader navigation={navigation}/>
      <ScrollView nestedScrollEnabled={true}>
        <Reminder />
        <View style={styles.container}>
          <Category items={categories} navigation={navigation} />
          <Toolbar navigation={navigation} restaurant={restaurant}/>
          <Text style={{color: theme.colors.gray}}>Nearby Stores</Text>
          {restaurant.length <= 0 && (
            <ActivityIndicator
              color={theme.colors.primary}
              size='large'
              style={{ marginTop: 50 }} />
          )}
          <StoreList items={restaurant} navigation={navigation} />
        </View>
      </ScrollView>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
})

export default WithContext(HomeScreen);
