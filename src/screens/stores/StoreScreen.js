import React, { useState, Fragment, useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import theme from '../../styles/theme'
import StoreList from './components/StoreList'
import Header from '../../components/core/Header'
import StoreService from '../../services/StoreService'
import WithContext from '../../components/core/WithContext'

const StoreScreen = props => {
  const { navigation, context } = props
  const { category } = navigation.state.params
  const { temptLocation } = context

  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    getStoreInCategory()
  },[])

  const getStoreInCategory = () => {
    StoreService.getStoreInCategory(
      category,
      temptLocation.lat,
      temptLocation.long,
      res => {
        setDoctors(res.data.data.searchRestaurant)
      },
      err => {
        alert(err)
      }
    )
  }

  return (
    <Fragment>
      <Header navigation={navigation} title={'Stores'} />
      <View style={styles.container}>
        <View style={styles.list}>
          <StoreList items={doctors} navigation={navigation} />
        </View>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  list: {
    flex: 1,
    marginTop: 16
  },
});

export default WithContext(StoreScreen);
