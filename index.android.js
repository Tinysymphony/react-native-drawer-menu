/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid
} from 'react-native';

export default class drawer extends Component {
  render() {
    var navigationView = (
      <View style={{
        flex: 1,
        backgroundColor: '#fff'
      }}>
        <Text style={{
          margin: 10,
          fontSize: 15,
          textAlign: 'left'
        }}>I'm in the Drawer!</Text>
      </View>
    );
    return (
      <DrawerLayoutAndroid drawerWidth={300} drawerPosition={DrawerLayoutAndroid.positions.Left} renderNavigationView={() => navigationView}>
        <View style={{
          flex: 1,
          alignItems: 'center'
        }}>
          <Text style={{
            margin: 10,
            fontSize: 15,
            textAlign: 'right'
          }}>Hello</Text>
          <Text style={{
            margin: 10,
            fontSize: 15,
            textAlign: 'right'
          }}>World!</Text>
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

AppRegistry.registerComponent('drawer', () => drawer);
