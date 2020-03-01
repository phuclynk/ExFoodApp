import axios from 'axios'
import ServerIP from './ServerIP'

const API_URL = `http://${ServerIP}:8080/graphql`

const markIsRead = (notificationId, responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
        mutation ReadNotification($notificationId: ID!){
          markIsRead(notificationId: $notificationId){
            _id
            user{
              _id
            }
            title
            createdAt
            updatedAt
            order{
              _id
            }
            isRead
            message
          }
        }
      `,
      variables: {
        notificationId
      }
    },
  })
    .then(responseCb)
    .catch(errorCb)
}

const getNotifications = (userId, responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
        query UserNotification($userId: ID!){
          notificationByUser(userId: $userId){
            _id
            user{
              _id
            }
            title
            createdAt
            updatedAt
            order{
              _id
            }
            isRead
            message
          }
        }
      `,
      variables: {
        userId
      }
    },
  })
    .then(responseCb)
    .catch(errorCb)
}

const deleteNotification = (notificationId, responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
        mutation deleteNotification($notificationId : ID!) {
          deleteNotification(notificationId : $notificationId) 
        }
      `,
      variables: {
        notificationId
      }
    },
  })
    .then(responseCb)
    .catch(errorCb)
}

export const NotificationService = {
  markIsRead, getNotifications, deleteNotification
}