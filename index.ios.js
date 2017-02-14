/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { PropTypes, Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import Drawer from './Drawer';

const {width, height} = Dimensions.get('window');

export default class drawer extends Component {
  render() {
    var drawerContent = (<View style={styles.drawerContent}>
      <View style={styles.leftTop}>
      </View>
      <View style={styles.leftBottom}>
        <View><Text>Item1</Text></View>
        <View><Text>Item2</Text></View>
        <View><Text>Item3</Text></View>
      </View>
    </View>);
    return (
      <Drawer
        style={styles.container}
        drawerWidth={width}
        drawerContent={drawerContent}
      >
        <View style={styles.content}>
          <View style={styles.head}></View>
          <Text>{width}</Text>
          <Text>{height}</Text>
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawer: {
    position: 'absolute'
  },
  main: {
    position: 'absolute',
    backgroundColor: '#2ba'
  },
  head: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#6a0d45'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#e3b8cb'
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftTop: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: '#8ad8dd'
  },
  leftBottom: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: '#f0f0f0'
  }
});

AppRegistry.registerComponent('drawer', () => drawer);
