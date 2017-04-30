/* eslint-disable */

import {
  View,
  Text,
  Easing,
  Dimensions
} from 'react-native';
import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import Drawer from '../Drawer';
import Animation from '../Drawer/Animation';

let {width, height, scale} = Dimensions.get('window');

let leftDrawerContent = (
  <View style={{flex: 1}}>
    <Text>left</Text>
  </View>
);

let rightDrawerContent = (
  <View style={{flex: 1}}>
    <Text>right</Text>
  </View>
);

let duration = 100;
let isOpen;
let treeA = shallow(
  <Drawer
    leftDrawerContent={leftDrawerContent}
    rightDrawerContent={rightDrawerContent}
    duration={duration}
    drawerPosition={Drawer.positions.Both}
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

let treeB = shallow(
  <Drawer
    leftDrawerContent={leftDrawerContent}
    moveCapture={false}
    startCapture={true}
    disabled={true}
  >
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Hello World</Text>
    </View>
  </Drawer>
);

test('Drawer Test [Type: default, Position: Both]', (done) => {
  let instance = treeA.instance();
  let tree = treeA;
  instance.componentDidMount();
  expect(instance.isLeft).toEqual(true);
  expect(instance.isRight).toEqual(true);
  expect(instance.isLeftActive).toEqual(false);
  expect(instance.isRightActive).toEqual(false);
  expect(instance.isLeftOpen).toEqual(false);
  expect(instance.isRightOpen).toEqual(false);
  expect(tree.state('showMask')).toEqual(false);
  expect(instance._onStartShouldSetPanResponder()).toEqual(false);
  expect(instance._shouldBlockNativeResponder()).toEqual(true);
  expect(instance._handleTerminationRequest()).toEqual(true);
  expect(instance._touchPositionCheck({
    moveX: 12,
    dx: 3,
    dy: 0
  })).toEqual(true);
  expect(instance._touchPositionCheck({
    moveX: 660,
    dx: -10,
    dy: 3
  })).toEqual(true);
  expect(instance._touchPositionCheck({
    moveX: 360,
    dx: 10,
    dy: 30
  })).toEqual(false);
  instance.isRightOpen = true;
  expect(instance._touchPositionCheck({
    moveX: 10,
    dx: 10,
  })).toEqual(true);
  instance.isRightOpen = false;
  expect(instance._onMoveShouldSetPanResponder(null, {
    dx: 10,
    dy: 0,
    moveX: 400
  })).toEqual(false);
  expect(tree.state('showMask')).toEqual(false);
  expect(instance._onMoveShouldSetPanResponder(null, {
    dx: 10,
    dy: 0,
    moveX: 10
  })).toEqual(true);
  expect(instance.MAX_DX).toEqual(240);
  instance._handlePanResponderMove(null, {
    dx: 240,
  });
  instance._handlePanResponderMove(null, {
    dx: 220,
  });
  expect(instance.styles.leftDrawer.style.left).toEqual(-20);
  instance.isRightOpen = true;
  instance._handlePanResponderMove(null, {
    dx: 100,
  });
  instance.isRightOpen = false;
  instance._handlePanResponderMove(null, {
    dx: -100,
  });
  instance.isLeftOpen = true;
  instance._handlePanResponderMove(null, {
    dx: -120,
  });
  instance.isLeftOpen = false;

  instance.openLeftDrawer();
  expect(instance.inAnimation).toEqual(true);
  expect(instance.isLeftActive).toEqual(true);
  instance._handlePanResponderGrant();
  instance.closeLeftDrawer();
  instance.openLeftDrawer();
  instance.openRightDrawer();
  instance.closeRightDrawer();
  instance.openDrawer();
  instance._handleMainBoardPress();
  instance.closeDrawer();
  instance._drawerDidOpen();
  expect(instance.inAnimation).toEqual(false);
  expect(isOpen).toEqual(true);
  instance._drawerDidClose();
  instance.openRightDrawer();
  instance._drawerDidClose();
  instance.isRightActive = false;
  instance.isLeftActive = false;
  instance.openDrawer();
  instance._handlePanResponderEnd();
  instance._handlePanResponderMove(null, {
    dx: -220,
  });
  instance._handlePanResponderEnd();
  instance._handlePanResponderMove(null, {
    dx: 240,
  });
  instance._handlePanResponderEnd();
  instance.isLeftOpen = true;
  instance._handlePanResponderEnd(null, {
    dx: 0
  });
  instance.isLeftOpen = false;
  instance.inAnimation = false;
  instance.isLeftActive = false;
  instance.isRightActive = false;
  instance.isLeft = false;
  instance.openDrawer();
  instance.isLeft = true;
  instance.isLeftOpen = true;
  instance.closeLeftDrawer();
  instance.isLeftOpen = false;
  instance.isRightOpen = true;
  instance.closeRightDrawer();
  instance.isRightOpen = false;
  instance._mainRefBind('main');
  expect(instance._main).toEqual('main');
  instance._maskRefBind('mask');
  expect(instance._mask).toEqual('mask');
  instance._leftDrawerRefBind('left');
  expect(instance._leftDrawer).toEqual('left');
  instance._rightDrawerRefBind('right');
  expect(instance._rightDrawer).toEqual('right');
  instance.isLeftActive = false;
  instance._drawerDidOpen();
  done();
});

test('Disabled Drawer Test [Type: default, Position: default]', (done) => {
  let instance = treeB.instance();
  expect(instance._onMoveShouldSetPanResponder()).toEqual(false);
  expect(instance._onMoveShouldCapture()).toEqual(false);
  expect(instance._onStartShouldCapture()).toEqual(true);
  done();
});

test('Animation works', (done) => {
  var animate = new Animation({
    start: 200,
    end: 10,
    onAnimationFrame: () => {
      expect(Animation.prototype.defaultEasing(3)).toEqual(3);
    },
    onAnimationEnd: done,
    duration: 200
  }).start(12313100000000);
});
