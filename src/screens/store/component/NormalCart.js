import React, { useState, useEffect } from 'react'
import { 
  View, 
  SafeAreaView, 
  StyleSheet,
  FlatList, 
  Picker,
  ToastAndroid, 
} from 'react-native'
import { Icon, Button, Divider } from 'react-native-elements'
import CostDetail from './CostDetail'
import CartItem from './CartItem'
import theme from '../../../styles/theme'
import Header from '../../../components/core/Header'
import { AuthService } from '../../../services/AuthService'
import WithContext from '../../../components/core/WithContext'
import AutoComplete from './AutoComplete'
import DistanceHelper from '../../../helper/DistanceHelper'

function NormalCart(props) {
  const { navigation, cart, storeId, context, storeLocation } = props
  const { user } = context

  const [subTotal, setSubtotal] = useState(0)
  const [delivery, setDelivery] = useState(0)
  const [total, setTotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [deliveryAddress, setDeliveryAddress] = useState({})
  const [addresses, setAddresses] = useState([])
  const [openAutoComplete, setOpenAutoComplete] = useState()
  const [distance, setDistance] = useState(0)
  const addLabel = 'Or choose a new location'

  useEffect(() => {
    getAddresses()
    getPrice()
  },[])

  useEffect(() => {
    getShippingFee()
    getPrice()
  }, [deliveryAddress])

  const getAddresses = () => {
    AuthService.getLocations(
      user.userId,
      res => {
        setDeliveryAddress(res.data.data.user.location[0])
        setAddresses([...res.data.data.user.location, {address: addLabel} ])
      },
      err => {
        alert(err)
      }
    )
  }

  const getShippingFee = () => {
    let shipDistance = DistanceHelper.getDistanceFromLatLonInKm(
      storeLocation.lat, 
      storeLocation.long, 
      deliveryAddress.lat, 
      deliveryAddress.long
    )
    let distance = parseFloat(shipDistance) 
    distance = Math.round(distance * 100)/100
    let shippingFee = distance * 5000
    setDelivery(shippingFee)
  }

  const getPrice = () => {
    let sub = 0

    cart && cart.map(item => {
      sub += item.quantity * item.price
    })

    let shipDistance = DistanceHelper.getDistanceFromLatLonInKm(
      storeLocation.lat, 
      storeLocation.long, 
      deliveryAddress.lat, 
      deliveryAddress.long
    )
    let _distance = parseFloat(shipDistance) 
    _distance = Math.round(_distance * 100)/100
    let shippingFee = _distance * 5000
    if(shippingFee < 10000) shippingFee = 10000

    setDistance(_distance)
    setDelivery(shippingFee)
    setSubtotal(sub)
    setTotal(sub + shippingFee)
  }

  const handleChangeValue = val => {
    if(val.address === addLabel) {
      setOpenAutoComplete(true)
    } else {
      setDeliveryAddress(val)
    }
  }

  const getData = data => {
    setDeliveryAddress(data)
    ToastAndroid.show('New address have been choosen: ' + data.address, ToastAndroid.LONG)
  }

  const closeAutoComplete = () => {
    setOpenAutoComplete(false)
  }

  return (
    <View>
      <Header navigation={navigation} title='Checkout Cart' />
      <View style={styles.shadow}>
        <View style={styles.contentContainer}>
          {openAutoComplete && <AutoComplete sendData={getData} closeAutoComplete={closeAutoComplete}/>}
          <Picker
            itemStyle={styles.pickerItem}
            style={styles.locationPicker}
            selectedValue={deliveryAddress}
            onValueChange={(itemValue) => handleChangeValue(itemValue)}
          > 
            {addresses.map((item, index) => {
                return(
                  <Picker.Item  label={item.address} value={item} key={index.toString()}/>
                )
            })}
            
          </Picker>
          <FlatList
            data={cart}
            renderItem={({ item }) => <CartItem item={item} />}
            keyExtractor={item => `item${item._id}`}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
      <SafeAreaView style={styles.total}>
        <CostDetail title="SubTotal" price={subTotal + ' d'} />
        <CostDetail title="Delivery" price={delivery + ' d'} />
        <Divider style={{ backgroundColor: theme.colors.gray }} />
        <CostDetail
          title="Total"
          price={total + ' d'}
          style={{
            fontSize: 20,
          }}
        />
        <Button
          title="Continue"
          titleStyle={{ fontSize: 22 }}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            marginTop: 16,
          }}
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate(
              'ReviewOrder', 
              { 
                cart: cart, 
                storeId: storeId, 
                deliveryAddress: deliveryAddress,
                shippingFee: delivery,
                distance: distance
              }
            )
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  storeName: {
    fontSize: 24,
  },
  storeInfo: {
  },
  contentContainer: {
    height: 400,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  addressInfo: {
    fontSize: 18,
    color: theme.colors.gray,
  },
  list: { 
    paddingHorizontal: 20,
    marginTop: 10
  },
  total: {
    marginTop: 100,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderColor: theme.colors.lightGray,
    backgroundColor: '#fff',
    height: '100%',
  },
  locationPicker: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  pickerItem: {
    
  }
})

export default WithContext(NormalCart)
