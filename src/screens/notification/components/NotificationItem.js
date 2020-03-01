import React, { useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import theme from '../../../styles/theme'
import { NotificationService } from '../../../services/NotificationService'
import { withNavigation } from 'react-navigation'
import WithContext from '../../../components/core/WithContext'
import { NotificationContext } from '../../../components/core/NotificationsContext'
import FormatTime from '../../../helper/FormatTime'
import Swipeout from 'react-native-swipeout'

const NotificationItem = props => {
  const { item, navigation, context, reload } = props
  const { user } = context
  const notificationContext = useContext(NotificationContext)

  const backgroundColor = item.isRead ? 'white' : theme.colors.lightGray

  const handlePressNotification = () => {
    markIsRead()
  }

  const markIsRead = () => {
    NotificationService.markIsRead(
      item._id,
      res => {
        getNotifications()
        navigation.navigate('OrderDetail', { order: { _id: item.order._id } })
      },
      err => {
        alert(err)
      }
    )
  }

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

  const deleteBtn = [
    {
      text: 'Delete',
      component: (<TouchableOpacity 
                    onPress={() => deleteNotice()} 
                    style={{ 
                      flex: 1, 
                      backgroundColor: theme.colors.primary, 
                      justifyContent: 'center',
                      marginVertical: 5,
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                      marginRight: 20
                    }}
                  >
        <Icon
          type='material-community'
          name='delete'
          style={{
            marginTop: 20,
          }}
          color={theme.colors.white} />
      </TouchableOpacity>),
      onPress: deleteNotice,
      backgroundColor: theme.colors.white
    }
  ]

  const deleteNotice = () => {
    NotificationService.deleteNotification(
      item._id,
      () => {
        reload()
      },
      err => {
        alert(err)
      }
    )
  }

  return (
    <Swipeout right={deleteBtn} backgroundColor={theme.colors.white}>
      <TouchableOpacity style={[styles.container, { backgroundColor }]} activeOpacity={0.7} onPress={handlePressNotification}>
        
        <View style={styles.content}>
          <Text style={styles.text} numberOfLines={2}>{item.title}</Text>
          <View style={styles.timeFromNow}>
            <Text style={styles.timeFromNowText}>{item.message}</Text>
          </View>
          <View style={styles.timeFromNow}>
            <Icon iconStyle={styles.timeFromNowText} size={15} name="clock" type="material-community" />
            <Text style={styles.timeFromNowText}>{FormatTime.FormatTimeFromMili(+item.createdAt)}</Text>
          </View>
        </View>
        
      </TouchableOpacity>
      </Swipeout>
    
  );
};

const styles = StyleSheet.create({
  container: {
    height: 110,
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10
  },
  content: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Text-Regular',
    lineHeight: 22,
    marginHorizontal: 10,
  },
  timeFromNow: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  timeFromNowText: {
    color: theme.colors.gray,
    lineHeight: 18,
    marginRight: 5
  }
});

export default WithContext(withNavigation(NotificationItem))
