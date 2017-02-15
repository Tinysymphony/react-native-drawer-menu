/* eslint-disable */

import {
  View,
  Text
} from 'react-native';
import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import Drawer from '../Drawer';

var drawerContent = (
  <View style={{flex: 1}}>
    <Text>test</Text>
  </View>
);

it('test', () => {
  let tree = shallow(
    <Drawer
      drawerContent={drawerContent}
      duration={200}
      drawerPosition="left"
      drawerWidth={240}
    >
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hello World</Text>
      </View>
    </Drawer>
  );
  let instance = tree.instance();
  expect(tree.state('showMask')).toEqual(false);
  instance.openDrawer();
  expect(tree.state('showMask')).toEqual(true);
  instance.closeDrawer();
  expect(tree.state('showMask')).toEqual(false);
  
});
