import React from 'react'
import {StyleSheet, ScrollView, View} from 'react-native'
import UserInfo from './components/UserInfo'
import Option from './components/Option'
import Setting from './components/Setting'
import Address from './components/Address'
import theme from '../../styles/theme'
import WithContext from '../../components/core/WithContext'

const AccountScreen = props => {
  const { navigation } = props
  const { user } = props.context

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <UserInfo user={user}/>
        <View style={styles.content}>
        <Address location={user.location} navigation={navigation}/>
        <Setting navigation={navigation} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white
  },
  content: {
    marginHorizontal: 10
  }
});

export default WithContext(AccountScreen);
