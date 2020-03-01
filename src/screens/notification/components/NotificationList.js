import React, { useState, useContext, useEffect } from 'react'
import { View, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity, ToastAndroid } from 'react-native'
import NotificationItem from './NotificationItem'
import { NotificationContext } from '../../../components/core/NotificationsContext'
import WithContext from '../../../components/core/WithContext'
import { NotificationService } from '../../../services/NotificationService'
import theme from '../../../styles/theme'
import Swipeout from 'react-native-swipeout'
import { Icon } from 'react-native-elements'

const NotificationList = props => {
  const { context } = props
  const { user } = context
  const notificationContext = useContext(NotificationContext)
  const { notifications, reloadNotification } = notificationContext

  const [_notifications, setNotifications] = useState(notifications.get)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setNotifications(notifications.get)
  }, [notifications.get])

  useEffect(() => {
    getNotifications()
  }, [reloadNotification.get])

  const getNotifications = () => {
    setLoading(true)

    NotificationService.getNotifications(
      user.userId,
      res => {
        setLoading(false)
        setNotifications(res.data.data.notificationByUser)
      },
      err => {
        setLoading(false)
        alert(err)
      }
    )
  }

  const reloadFromDelete = () => {
    getNotifications()
    ToastAndroid.show('Delete notification successfully !', ToastAndroid.SHORT )
  }
  
  const renderEmpty = () => 
    <View style={{ justifyContent: "center", alignSelf: 'center', marginTop: '60%' }}>
      <Text style={{
        fontSize: 30,
        color: theme.colors.lightGray,
        fontWeight: 'bold',
        textAlign: "center"
      }}>No Notification</Text>
      {/* <Text style={{
        fontSize: 30,
        color: theme.colors.lightGray,
        fontWeight: 'bold',
        textAlign: "center"
      }}>Create new</Text> */}
    </View>
  
  

  return (
    <View style={styles.container}>
      {loading && notifications && <ActivityIndicator size={50} style={{marginTop: '70%'}}/>}
      {( _notifications.length <=0 )&& renderEmpty()}
      <FlatList
        style={styles.list}
        data={_notifications}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <NotificationItem reload={reloadFromDelete} item={item} navigation={props.navigation} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  list: {
    marginTop: 5
  }
});

export default WithContext(NotificationList)