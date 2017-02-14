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
  View
} from 'react-native';

import Drawer from './Drawer';

export default class drawer extends Component {
  render() {
    var drawerContent = (<View style={styles.content}>
      <Text>234</Text>
    </View>);
    return (
      <Drawer
        style={styles.container}
        width={200}
        drawerContent={drawerContent}
      >
        <View style={styles.drawerContent}>
          <Text>Hesfsdf</Text>
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
    position: 'absolute',
    backgroundColor: '#f90'
  },
  main: {
    position: 'absolute',
    backgroundColor: '#2ba'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('drawer', () => drawer);
