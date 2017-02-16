/* eslint-disable */

import {
  View,
  Text,
  Dimensions
} from 'react-native';
import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import Drawer from '../Drawer';

var {width, height, scale} = Dimensions.get('window');

var drawerContent = (
  <View style={{flex: 1}}>
    <Text>test</Text>
  </View>
);

var isOpen;
let treeA = shallow(
  <Drawer
    drawerContent={drawerContent}
    duration={200}
    drawerPosition={Drawer.positions.Left}
    drawerWidth={240}
    type={Drawer.types.Default}
    onDrawerOpen={() => {isOpen = true;}}
    onDrawerClose={() => {isOpen = false;}}
  >
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Hello World</Text>
    </View>
  </Drawer>
);

it('Drawer Test [Type: default, Position: left]', () => {
  let instance = treeA.instance();
  let tree = treeA;
  expect(instance.isLeft).toEqual(true);
  expect(tree.state('showMask')).toEqual(false);
  instance.openDrawer();
  setTimeout(function () {
    expect(tree.state('showMask')).toEqual(true);
    expect(isOpen).toEqual(true);
    expect(instance._onMoveShouldSetPanResponder(null, {
      dx: -10,
      dy: 0,
      moveX: 650
    })).toEqual(true);
  })
  instance.closeDrawer();
  setTimeout(function () {
    expect(tree.state('showMask')).toEqual(false);
    expect(isOpen).toEqual(false);
  }, 0);
  expect(instance._onStartShouldSetPanResponder()).toEqual(false);
  expect(instance._onMoveShouldSetPanResponder(null, {
    dx: 10,
    dy: 0,
    moveX: 10
  })).toEqual(true);
  expect(instance._onMoveShouldSetPanResponder(null, {
    dx: 10,
    dy: 0,
    moveX: 400
  })).toEqual(false);
  instance._handlePanResponderMove(null, {
    dx: 200,
  });
  expect(instance.styles.main.style.left).toEqual(200);
  instance._handlePanResponderEnd();
  setTimeout(function () {
    expect(instance.isOpen).toEqual(true);
    expect(instance.styles.main.style.left).toEqual(240);
  }, 0);
  instance.closeDrawer();
  instance._handlePanResponderMove(null, {
    dx: 100,
  });
  setTimeout(function () {
    expect(instance.isOpen).toEqual(false);
    expect(instance.styles.main.style.left).toEqual(0);
  }, 0);
});
