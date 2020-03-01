import React, { useState, useEffect, } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements'
import theme from '../../../styles/theme'
import WithContext from '../../../components/core/WithContext'
import Swipeout from 'react-native-swipeout'
import { AuthService } from '../../../services/AuthService'

const Address = props => {
  const { navigation, context } = props
  const { user, setTempLocation, temptLocation } = context
  const [addresses, setAddresses] = useState([])
  const [choosenLocation, setChoosenLocation] = useState()

  useEffect(() => {
    getAddresses()
  }, [])

  // useEffect(() => {
  //   if(navigation.state.params){
  //     setAddresses(navigation.state.params.newAddresses)
  //   }
  // }, [navigation.state.params])

  const goToMapScreen = () => {
    navigation.navigate('LocationPicker')
  }

  const getAddresses = () => {
    AuthService.getLocations(
      user.userId,
      res => {
        setAddresses(res.data.data.user.location)
        if (res.data.data.user.location.length > 0) {
          setTempLocation(res.data.data.user.location[0])
        }
      },
      err => {
        alert(err)
      }
    )
  }

  const deleteBtn = [
    {
      text: 'Delete',
      component: (<TouchableOpacity onPress={() => deleteLocation()} style={{ flex: 1, backgroundColor: theme.colors.primary, justifyContent: 'center' }}>
                    <Icon
                      type='material-community'
                      name='delete'
                      style={{
                        marginTop: 20,
                      }}
                      color={theme.colors.white} />
                  </TouchableOpacity>),
      backgroundColor: theme.colors.lightGray,
      onPress: deleteLocation
    }
  ]

  const deleteLocation = () => {
    console.log('delete')
  }

  return (
    <View style={styles.setting}>
      <Text style={styles.headerLabel}>Address</Text>
      <View style={styles.addressList}>
        {
          addresses.length > 0 && addresses.map((item, i) => (
            <Swipeout right={deleteBtn}>
              <View style={styles.addressItem}>
                <ListItem
                  key={i.toString()}
                  title={item.address}
                  titleProps={{
                    numberOfLines: 1
                  }}
                  bottomDivider
                  containerStyle={styles.items}
                // onPress={() => setChoosenLocation(item)}
                />
              </View>
            </Swipeout>
          ))
        }
        <TouchableOpacity onPress={goToMapScreen}>
          <ListItem
            key='add'
            title='Add a new address'
            titleStyle={{
              color: theme.colors.primary,
            }}
            rightIcon={{
              type: 'material',
              name: 'add-circle',
              color: theme.colors.primary,
            }}
            style={{
              height: 45,
            }}
            containerStyle={{
              backgroundColor: theme.colors.favorite.backgroundGray,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerLabel: {
    fontSize: 16,
    paddingLeft: 15,
    fontFamily: theme.colors.black,
    backgroundColor: theme.colors.lightGray,
    color: theme.colors.darkGray,
    lineHeight: 40,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  addressTypeText: {
    paddingLeft: 15,
    fontSize: 13,
    fontFamily: 'SF-Pro-Text-Regular',
    color: theme.colors.darkGray,
    paddingTop: 15,
  },
  setting: {
    marginHorizontal: 10,
    marginTop: 15,
  },
  items: {
    backgroundColor: theme.colors.favorite.backgroundGray
  }
})

export default WithContext(Address)