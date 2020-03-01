import axios from 'axios'
import ServerIP from './ServerIP'

const API_URL = `http://${ServerIP}:8080/graphql`

const getRestaurants = (responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
        query{
            restaurants
            {
              _id
              img
              location{
                address
                lat
                long
              }
              name
            }
          }
      `
    }
  })
    .then(responseCb)
    .catch(errorCb)
}

const getMenu = (storeId, responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
      query Menu($storeId: ID!) {
        menuByRestaurant(restaurantId: $storeId){
          _id
          name
          img
          foods{
            _id
            name
            price
            is_available
          }
        }
      }
      `,
      variables: {
        storeId
      }
    }
  }).then(responseCb)
    .catch(errorCb)
}

const getStore = (storeId, responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
        query Menu($storeId: ID!) {
          restaurantById(restaurantId: $storeId){
            _id
            name
            img
            location {
              address
              lat
              long
            }
            menu_info{
              name
              foods{
                name
                price
                _id
                is_available
              }
            }
          }
        }
      `,
      variables: {
        storeId
      }
    }
  }).then(responseCb)
    .catch(errorCb)
}

const getStoreInCategory = (query, lat, long, responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
      query GetCategory($query: String!, $lat: Float!, $long: Float!){
        searchRestaurant(query: $query, lat: $lat, long: $long)
        {
          _id
          cuisines
          name
          img
          location{
            address
            lat
            long
          }
          menu_info{
            foods{
              name
            }
          }
          distance
        }
      }
      `,
      variables: {
        query,
        lat,
        long
      }
    }
  }).then(responseCb)
    .catch(errorCb)
}

const getStoreNearby = (lat, long, responseCb, errorCb) => {
  axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
        query RestaurantNearBy($lat: Float!, $long:Float!){
          restaurantNearby(lat: $lat, long: $long){
            _id
            cuisines
            name
            img
            location{
              address
              lat
              long
            }
            distance
          }
        }
      `,
      variables: {
        lat,
        long
      }
    }
  }).then(responseCb)
    .catch(errorCb)
}

const StoreService = {
  getRestaurants, getMenu, getStore, getStoreInCategory, getStoreNearby
}

export default StoreService
