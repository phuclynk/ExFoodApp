import axios from 'axios'
import ServerIP from './ServerIP'

const API_URL = `http://${ServerIP}:8080/graphql`

const getOrdersOfUser = (userId, responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
      query OrdersOfUser($userId: ID!){
        ordersOfUser(userId: $userId)
        {
          _id 
          restaurant{
            name
            location{
              address
            }
          }
          payment_method
          status
          delivery_address
          createdAt
          items{
            _id
            food{
              _id
              name
              price
            }
            qty
          }
          distance
          shipping_fee
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

const createOrder = (data, responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
      mutation CreateOrder($orderInput : OrderInput!){
        createOrder(orderInput: $orderInput)
        {
          delivery_address
          restaurant{
            name
            location{
              address
            }
          }
          items{
            food{
              name
            }
            qty
          }
          status
          payment_method
          createdAt
        }
      }
      `,
      variables: {
        orderInput: data
      }
    },
  })
    .then(responseCb)
    .catch(errorCb)
}

const changeOrderStatus = (orderId, status , responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
        mutation ChangeStatus($orderId: ID!, $status: String! ){
          updateOrder(orderId: $orderId , status : $status)
          {
            _id
            status
          }
        }
      `,
      variables: {
        orderId,
        status
      }
    },
  })
    .then(responseCb)
    .catch(errorCb)
}

const orderById = (orderId , responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
        query OrderById($orderId: ID!){
          orderById(orderId: $orderId) {
            _id
            items{
              _id
              food{
                name
                _id
                price
              }
              qty
            }
            shipping_fee
            status
            restaurant{
              name
              location{
                address
                lat
                long
              }
            }
            distance
            delivery_address
            payment_method
            createdAt
          }
        }
      `,
      variables: {
        orderId
      }
    },
  })
    .then(responseCb)
    .catch(errorCb)
}

export const OrderService = {
  getOrdersOfUser, createOrder, changeOrderStatus, orderById
}