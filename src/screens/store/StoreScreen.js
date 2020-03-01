import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  FlatList, 
  StyleSheet, 
  Animated, 
  TouchableWithoutFeedback 
} from 'react-native'
import CartHeader from './component/Header'
import theme from '../../styles/theme'
import Banner from './component/Banner'
import { ListItem, Icon } from 'react-native-elements'
import Cart from './component/Cart'
import StoreService from '../../services/StoreService'

function StoreScreen(props) {
  const { navigation } = props
  const { storeId } = navigation.state.params ? navigation.state.params : ''
  const [scrollY, setScrollY] = useState(new Animated.Value(0))
  const [cart, setCart] = useState([])
  const [store, setStore] = useState()
  const [isCloseCart, setCloseCart] = useState(true)
  const [menu, setMenu] = useState([])

  useEffect(() => {
    getStore()
  }, [])

  const getStore = () => {
    StoreService.getStore(
      storeId,
      res => {
        setStore(res.data.data.restaurantById)
        let resData = res.data.data.restaurantById.menu_info
        setMenu(resData)
      },
      err => {
        console.log(err)
        alert(err)
      }
    )
  }

  const goToOrder = () => {
    navigation.navigate('Checkout', { cart: cart, storeId: storeId, storeLocation: store.location })
  }

  const handleItem = async (item, value) => {
    let newCart = [...cart]
    let newItem = { ...item, quantity: 1 }
    if (cart.length > 0) {
      for (let i = 0; i < newCart.length; i++) {
        if (item._id === newCart[i]._id) {
          newCart[i].quantity += value
          if (newCart[i].quantity === 0) {
            newCart.splice(i, 1)
          }
          setCart(newCart)
          return
        }
      }
    }
    newCart.unshift(newItem)
    setCart(newCart)
  }

  const headerStyle = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: ['rgba(0,0,0,0)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,1)'],
    extrapolate: 'clamp'
  })
  const borderStyle = scrollY.interpolate({
    inputRange: [0, 180, 200],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  })
  const backBtnStyle = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: ['#fff', '#fff', theme.colors.primary],
    extrapolate: 'clamp'
  })

  const renderRightEle = item => {
    let inputItem = { ...item }

    if (cart.length > 0) {
      cart.map(cartItem => {
        if (cartItem._id === inputItem._id) {
          inputItem = { ...cartItem }
        }
      })
    }
    return (
      <View style={cart ? styles.inCartContainer : styles.handleQuantityContainer}>
        {(inputItem.quantity && inputItem.quantity) > 0 && (
          <>
            <Icon
              type='font-awesome'
              name='minus-circle'
              iconStyle={styles.icon}
              onPress={() => handleItem(inputItem, -1)}
            />
            <Text style={styles.quantity}>
              {inputItem.quantity}
            </Text>
          </>
        )}

        {(inputItem.quantity && inputItem.quantity) ? <Icon
          type='font-awesome'
          name='plus-circle'
          iconStyle={styles.icon}
          onPress={() => handleItem(inputItem, 1)}
        />
          : <Icon
            type='material-community'
            name='plus-circle-outline'
            iconStyle={styles.icon}
            onPress={() => handleItem(inputItem, 1)}
          />}
      </View>
    )
  }

  const handleCloseCart = () => {
    setCloseCart(!isCloseCart)
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <FlatList
        data={menu}
        style={styles.menuType}
        keyExtractor={item => item.name}
        renderItem={({ item }) =>
          <View key={item.name}>
            <ListItem
              key={item.name}
              title={item.name}
              titleStyle={styles.dishTypeTitle}
              containerStyle={styles.dishTypeContainer}
              subtitleStyle={styles.subtitle}
            />
            <FlatList
              data={item.foods}
              keyExtractor={item => item._id}
              renderItem={({ item }) =>
                <>
                {item.is_available && 
                  <ListItem
                  key={item._id}
                  title={item.name}
                  subtitle={item.price.toString()}
                  titleStyle={styles.title}
                  containerStyle={styles.itemContainer}
                  subtitleStyle={styles.subtitle}
                  rightElement={
                    renderRightEle(item)
                  }
                  bottomDivider={item.isHeader ? false : true}
                  ListHeaderComponent={<ListItem
                    title={item.name}
                    titleStyle={styles.dishTypeTitle}
                    containerStyle={styles.dishTypeContainer}
                    subtitleStyle={styles.subtitle}
                  />}
                />
                }
                </>
              }
            />
          </View>
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }]
        )}
        ListHeaderComponent={store &&
          <TouchableWithoutFeedback onPress={handleCloseCart}>
            <Banner storeName={store.name} address={store.location.address} img={store.img}/>
          </TouchableWithoutFeedback>
        }
      />
      <CartHeader styleHeader={{ headerStyle, borderStyle, backBtnStyle }} />
      {cart.length > 0 && <Cart closeCart={isCloseCart} cart={cart} goToOrder={goToOrder} handleItem={handleItem} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  subtitle: {
    // marginBottom: 50
  },
  title: {
    color: theme.colors.primary
  },
  image: {
    width: 100,
    height: 100
  },
  bottomBar: {
    backgroundColor: 'red',
    width: '100%',
    height: 50,
  },
  dishTypeTitle: {
    color: theme.colors.darkGray,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  dishTypeContainer: {
    backgroundColor: theme.colors.lightGray,
    height: 45,
    marginHorizontal: 15,
    marginTop: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  itemContainer: {
    backgroundColor: theme.colors.favorite.backgroundGray,
    marginHorizontal: 15,

  },
  quantity: {
    paddingHorizontal: 10,
    fontSize: 20
  },
  icon: {
    color: theme.colors.primary,
  },
  handleQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuType: {
    flex: 1,
  }
})

export default StoreScreen