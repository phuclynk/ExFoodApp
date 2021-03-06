import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';

const AppContext = React.createContext();
class AppProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    const getPersistedUser = async () => {
      try {
        let persistedUser = await AsyncStorage.getItem('user')
        const result = JSON.parse(persistedUser)
        return result
      } catch (error) {
        alert(error)
      }
    }
    this.state = {
      user: getPersistedUser().then(value => this.setState({
        user: {...value}
      })),
      temptLocation: this.getCurrentLocation(),
      carts: AsyncStorage.getItem('carts'),
      reloadOrderList: false,
      notifications: [],
      notificationsCount: [],
      fcmToken: '',
      deviceId: '',
      isAuthenticated: async () => {
        const token = await AsyncStorage.getItem('@access_token')
        let isNotMerchant = true
        getPersistedUser().then(value => {
          if(value) {
            isNotMerchant = !value.isMerchant
          }
        })
        return token !== null && isNotMerchant;
      },
      login: async user => {
        try {
          this.getCurrentLocation()
          await AsyncStorage.setItem('@access_token', JSON.stringify(user.authToken))
          await AsyncStorage.setItem('user', JSON.stringify(user))
          this.setState({
            user: user
          })
        } catch (error) {
          console.log(error)
          alert(error)
        }
      },
      logout: async () => {
        await AsyncStorage.removeItem('@access_token')
        await AsyncStorage.removeItem('user')
      },
      signUp: async (user) => {
        await AsyncStorage.setItem('@access_token', JSON.stringify(user.authToken))
        await AsyncStorage.setItem('user', JSON.stringify(user))
      },
      changeTemptLocation: temptLocation => {
        this.setState({
          temptLocation: {...temptLocation, address: 'Current Location (Default)'}
        })
      },
      storeCart: async cart => {
        let _carts = {...cart}
        _carts.push(cart)
        this.setState({
          carts: _carts
        })
        await AsyncStorage.setItem('carts', JSON.stringify(_carts))
      },
      loadOrderList: () => {
        this.setState({
          reloadOrderList: !this.state.reloadOrderList
        })
      },
      setTempLocation: location => {
        this.setState({
          temptLocation: {...location}
        })
      },
      setDeviceId: deviceId => {
        this.setState({
          deviceId
        })
      },
      setFcmToken: fcmToken => {
        this.setState({
          fcmToken
        })
      }
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('@notification_count').then(count => {
      this.setState({
        notificationsCount: +count || 0
      })
    });
  }  

  getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          temptLocation: {
            lat: position.coords.latitude,
            long: position.coords.longitude,
            address: 'TEMP'
          }
        })
      },
      (error) => setError(error.message),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export { AppContext, AppProvider as default }