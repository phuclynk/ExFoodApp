import React, { Fragment, useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import {
  TabView,
  TabBar,
  SceneMap
} from 'react-native-tab-view'
import theme from '../../styles/theme'
import OrderList from './components/OrderList'
import Header from '../../components/core/Header'
import { OrderService } from '../../services/OrderService'
import WithContext from '../../components/core/WithContext'
import { NotificationContext } from '../../components/core/NotificationsContext'

const StoreManagementScreen = props => {
  const notificationContext = useContext(NotificationContext)
  const { context, navigation } = props
  const { reloadOrderList, choosenRestaurant, user } = context
  const [tabBarConfig, setTabBarConfig] = useState({
    index: 0,
    routes: [
      { key: 'New', title: 'New' },
      { key: 'Confirmed', title: 'Confirmed' },
      { key: 'Rejected', title: 'Rejected' },
    ],
  })
  const [listOrder, setListOrder] = useState([])
  const [comingList, setComingList] = useState([])
  const [confirmedList, setConfirmedList] = useState([])
  const [rejectedList, setRejectedList] = useState([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    getOrders()
  }, [])

  useEffect(() => {
    getOrders()
  }, [reloadOrderList])

  useEffect(() => {
    getOrders()
  }, [notificationContext.reloadOrder.get])
  
  const getOrders = () => {
    setLoading(true)

    if(user && user.userId){
      OrderService.getOrdersOfUser(
        user.userId,
        res => {  
          setListOrder(res.data.data.ordersOfUser)
  
          let _comingList = []
          let _confirmedList = []
          let _rejectedList = []
  
          if (res.data.data.ordersOfUser) {
            _comingList = res.data.data.ordersOfUser.filter(item => item.status === 'waitting')
            _confirmedList = res.data.data.ordersOfUser.filter(item => item.status === 'confirmed')
            _rejectedList = res.data.data.ordersOfUser.filter(item => item.status === 'rejected')
          }
  
          setComingList(_comingList.reverse())
          setConfirmedList(_confirmedList.reverse())
          setRejectedList(_rejectedList.reverse())
  
          setLoading(false)
        },
        err => {
          alert(err)
        }
      )
    }
  }

  const renderEmpty = () => 
    <View style={{ justifyContent: "center", alignSelf: 'center', marginTop: '60%' }}>
      <Text style={{
        fontSize: 30,
        color: theme.colors.lightGray,
        fontWeight: 'bold',
        textAlign: "center"
      }}>Order list is empty</Text>
      {/* <Text style={{
        fontSize: 30,
        color: theme.colors.lightGray,
        fontWeight: 'bold',
        textAlign: "center"
      }}>Create new</Text> */}
    </View>

  const New = () => (
    <>
      {isLoading && <ActivityIndicator size={50} style={{ marginTop: 220 }} />}
      {!isLoading && comingList.length <= 0 && renderEmpty()}
      {!isLoading && <OrderList type="New" reload={getOrders} listOrder={comingList} navigation={props.navigation} />}
    </>
  )

  const Confirmed = () => (
    <>
      {isLoading && <ActivityIndicator size={50} style={{ marginTop: 220 }} />}
      {!isLoading && confirmedList.length <= 0 && renderEmpty()}
      {!isLoading && <OrderList type="New" reload={getOrders} listOrder={confirmedList} navigation={props.navigation} />}
    </>
  )

  const Rejected = () => (
    <>
      {isLoading && <ActivityIndicator size={50} style={{ marginTop: 220 }} />}
      {!isLoading && rejectedList.length <= 0 && renderEmpty()}
      {!isLoading && <OrderList type="New" reload={getOrders} listOrder={rejectedList} navigation={props.navigation} />}
    </>
  )

  return (
    <Fragment>
      <Header hasBackIcon={false} title='Order Management' navigation={navigation}/>
      <View style={styles.container}>
        <TabView
          navigationState={tabBarConfig}
          renderScene={SceneMap({
            New: New,
            Confirmed: Confirmed,
            Rejected: Rejected,
          })}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={{
                backgroundColor: theme.colors.white,
              }}
              labelStyle={{
                color: theme.colors.primary,
                fontWeight: 'bold'
              }}
              indicatorStyle={{
                backgroundColor: theme.colors.primary
              }}
            />
          )}
          onIndexChange={index => setTabBarConfig(prev => {
            return {
              ...prev,
              index
            }
          })}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  header: {
    fontSize: 34,
    fontFamily: 'SF-Pro-Display-Bold'
  },
  tabBarContainer: {
    flexDirection: 'column',
    marginVertical: 10
  },
  tabBar: {
    flexDirection: 'row',
    height: 44
  },
  tabItem: {
    paddingVertical: 5,
    flex: 1,
    alignItems: 'center'
  },
  tabItemText: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Text-Regular'
  },
  highlight: {
    width: '100%',
    marginTop: 10,
    height: 2
  },
  divider: {
    width: '100%',
    height: 1,
    marginTop: -2,
    paddingHorizontal: 5,
    backgroundColor: theme.colors.lightGray
  },
  tabStyle: {
    flex: 1
  }
});

export default WithContext(StoreManagementScreen);
