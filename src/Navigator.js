import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import theme from './styles/theme'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import HomeScreen from './screens/home/HomeScreen'
import OrderHisToryScreen from './screens/orderhistory/OrderHisToryScreen'
import NotificationScreen from './screens/notification/NotificationScreen'
import AccountScreen from './screens/account/AccountScreen'
import OrderDetailsScreen from './screens/orderhistory/OrderDetailsScreen'
import SpecialtyScreen from './screens/specialty/SpecialtyScreen'
import LoginScreen from './screens/auth/LoginScreen'
import ListStoreScreen from './screens/stores/StoreScreen'
import StoreScreen from './screens/store/StoreScreen'
import PaymentScreen from './screens/store/PaymentScreen'
import CheckoutScreen from './screens/store/CheckoutScreen'
import LocaltionPickerScreen from './screens/location/LocaltionPickerScreen'
import AsyncStorage from '@react-native-community/async-storage'
import AuthLoadingScreen from './screens/auth/AuthLoadingScreen'
import { View } from 'react-native'
import { Icon, Badge } from 'react-native-elements'
import NearbyStoreOnMapScreen from './screens/home/NearbyStoreOnMap'

const StoresNavigation = createStackNavigator({
  Stores: ListStoreScreen
}, {
  headerMode: 'none',
  initialRouteName: 'Stores'
})

const OrderNavigator = createStackNavigator({
  Store: StoreScreen,
  Checkout: CheckoutScreen,
  ReviewOrder: PaymentScreen
}, {
  headerMode: 'none',
  initialRouteName: 'Store'
})

OrderNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  }
}

const SpecialtyNavigator = createStackNavigator(
  {
    Specialty: SpecialtyScreen,
  },
  {
    headerMode: 'none',
  },
)

const HomeNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Map: NearbyStoreOnMapScreen
  },
  {
    headerMode: 'none',
  },
)

HomeNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  }
}

const OrderHisToryNavigator = createStackNavigator(
  {
    OrderHisTory: OrderHisToryScreen,
    OrderDetail: OrderDetailsScreen
  },
  {
    headerMode: 'none',
  },
)

OrderHisToryNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  }
}

const NotificationNavigator = createStackNavigator(
  {
    Notification: NotificationScreen
  },
  {
    headerMode: 'none',
  },
)

const AccountNavigator = createStackNavigator(
  {
    Account: AccountScreen,
    LocationPicker: {
      screen: LocaltionPickerScreen,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Account'
  }
)

AccountNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  }
}

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarLabel: 'Browser',
        tabBarIcon: ({ focused }) => (
          <Icon
            type='material-community'
            name='home'
            size={30}
            color={focused ? theme.colors.primary : theme.colors.gray}
          />
        ),
      },
    },
    Notification: {
      screen: NotificationNavigator,
      navigationOptions: ({ screenProps, navigation }) => ({
        tabBarLabel: 'Notifications',
        tabBarIcon: ({ focused }) => (
          <View>
            <Icon
              type='material-community'
              name='bell'
              size={30}
              color={focused ? theme.colors.primary : theme.colors.gray}
            />
            {screenProps.notificationCount > 0 && (
              <Badge
                value={screenProps.notificationCount}
                status="error"
                containerStyle={{ position: 'absolute', top: 2, right: -7 }}
              />
            )}
          </View>
        ),
      }),
    },
    Appointment: {
      screen: OrderHisToryNavigator,
      navigationOptions: {
        tabBarLabel: 'History',
        tabBarIcon: ({ focused }) => (
          <Icon
            type='material-community'
            name='history'
            size={30}
            color={focused ? theme.colors.primary : theme.colors.gray}
          />
        ),
      },
    },

    Account: {
      screen: AccountNavigator,
      navigationOptions: {
        tabBarLabel: 'Account',
        tabBarIcon: ({ focused }) => (
          <Icon
            type='material-community'
            name='account'
            size={30}
            color={focused ? theme.colors.primary : theme.colors.gray}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: theme.colors.primary,
      inactiveTintColor: theme.colors.gray
    },
    initialRouteName: 'Home'
  }
)

TabNavigator.navigationOptions = async ({ screenProps, navigation }) => {
  const { setNotificationCount, notificationCount } = screenProps;

  if (navigation.state.index === 1) {
    setNotificationCount(0);
    await AsyncStorage.setItem('@notification_count', 0 + '');
  } else {
    await AsyncStorage.setItem('@notification_count', notificationCount + '');
  }

  return {
    tabBarVisible: true
  };
};

const AppNavigator = createStackNavigator(
  {
    Tab: TabNavigator,
    Specialty: SpecialtyNavigator,
    Order: OrderNavigator,
    Stores: StoresNavigation
  },
  {
    headerMode: 'none',
    initialRouteName: 'Tab'
  }
)


const AppSwitch = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Login: LoginScreen,
    App: AppNavigator,
  },
  {
    initialRouteName: 'AuthLoading'
  }
)

export default Navigator = createAppContainer(AppSwitch);
