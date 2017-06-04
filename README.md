## react-native-drawer-menu [![Build Status](https://travis-ci.org/Tinysymphony/react-native-drawer-menu.svg?branch=master)](https://travis-ci.org/Tinysymphony/react-native-drawer-menu) [![Coverage Status](https://coveralls.io/repos/github/Tinysymphony/react-native-drawer-menu/badge.svg?branch=master)](https://coveralls.io/github/Tinysymphony/react-native-drawer-menu?branch=master)

A drawer component for React Native Application (ios / android)

Similar to drawer menu component of QQ mobile.

### Examples

#### iOS Platform

<a href="#ios-left" id="ios-left"><img src="./GIF/ios-left-default.gif"  align="left" width="200"></a>

<a href="#ios-right" id="ios-right"><img src="./GIF/ios-right-overlay.gif" width="200"/></a>

#### Android Platform

<a href="#android-left" id="android-left"><img src="./GIF/android-left-default.gif"  align="left" width="200"></a>

<a href="#android-right" id="android-right"><img src="./GIF/android-right-overlay.gif"  width="200"></a>

### Usage

> **SUGGESTION** In iOS, the drawer menu component should only be used in the top level route, because the action that swipes from left side of the screen to right is designed to pop route from navigate stack. You are supposed to avoid the conflict of the UI interactions. At least, don't use the `Left` drawer menu to wrap sub routes, use `Right` drawer menu if it's needed.

**install from npm**

``` shell
npm install --save react-native-drawer-menu
```

**import in project**

``` js
import Drawer from 'react-native-drawer-menu';
import {Easing} from 'react-native'; // Customize easing function (Optional)
```

```js
// in render function
render() {
  // prepare your drawer content
  var drawerContent = (<View style={styles.drawerContent}>
    <View style={styles.leftTop}/>
    <View style={styles.leftBottom}>
      <View><Text>Drawer Content</Text></View>
    </View>
  </View>);
  // customize drawer's style (Optional)
  var customStyles = {
    drawer: {
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 10
    },
    mask: {}, // style of mask if it is enabled
    main: {} // style of main board
  };
  return (
    <Drawer
      style={styles.container}
      drawerWidth={300}
      drawerContent={drawerContent}
      type={Drawer.types.Overlay}
      customStyles={{drawer: styles.drawer}}
      drawerPosition={Drawer.positions.Right}
      onDrawerOpen={() => {console.log('Drawer is opened');}}
      onDrawerClose={() => {console.log('Drawer is closed')}}
      easingFunc={Easing.ease}
    >
      <View style={styles.content}>
        <Text>{Object.values(Drawer.positions).join(' ')}</Text>
        <Text>{Object.values(Drawer.types).join(' ')}</Text>
      </View>
    </Drawer>
  );
}
```

> Notice: The reference of the drawer is passed to drawer content element, you could use `this.props.drawer` to invoke Drawer's instance methods like `this.props.drawer.closeDrawer()`

## Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| disabled | Bool | false | Disable the component or not. |
| leftDisabled | Bool | false | Disable left drawer or not. |
| rightDisabled | Bool | false | Disable right drawer or not. |
| type | String | ‘default' | Type of the drawer. `default` / `overlay` You can also use static value `Drawer.types.Default` / `Drawer.types.Overlay`. |
| drawerPosition | String | ‘left' | Determine where does the drawer come out. `left` / `right` / `both` You can also use static value `Drawer.positions.Left` / `Drawer.positions.Right` / `Drawer.positions.Both`. |
| drawerWidth | Number | 200 | The width of drawer, it’s disabled when use `replace` type. |
| drawerContent | React Component | null | The content of the drawer menu, default is left content. |
| leftDrawerContent | React Component | null | The content of the left drawer menu. |
| rightDrawerContent | React Component | null | The content of the right drawer menu. |
| duration | Number | 160 | The duration of animation to open or close drawer. |
| maskAlpha | Number | 0.4 | Maximum value is 0.5, the opactiy value of the mask over the main board when drawer is open. Mask can be disabled with `showMask` property. |
| showMask | Bool | true | Whether show the mask when drawer is open. |
| customStyles | Object | {} | Customize drawer styles. You can customize `main` / `mask` / `drawer` / `leftDrawer` / `rightDrawer`. |
| onDrawerOpen | function | null | Triggers when drawer is totally opened. |
| onLeftDrawerOpen | function | null | Triggers when the left drawer is totally opened. |
| onRightDrawerOpen | function | null | Triggers when the right drawer is totally opened. |
| onDrawerClose | function | null | Triggers when drawer is totally closed. |
| onLeftDrawerClose | function | null | Triggers when the left drawer is totally closed. |
| onRightDrawerClose | function | null | Triggers when the right drawer is totally closed. |
| startCapture | Bool | false | Whether to capture touch events while clicking on screen. |
| moveCapture | Bool | false | Whether to capture touch events while swiping over the screen. |
| easingFunc | function | null | Easing function of drawer animation, default is `Easing.linear`. You can pass function like `Easing.ease`/`Easing.bezier(x1, y1, x2, y2)`/`Easing.sin`/`Easing.elastic(times)`/`Easing.bounce` etc.  |
| responderNegotiate | function | null | Customize conditions to set pan responder, `evt` & `gestureState` will be passed as arguments. Default condition is left 20% area on screen in `left` Drawer, or right 20% area on screen in `right` Drawer. |


### Instance methods

Use ref to invoke instance methods.

| Method | Description |
| --- | --- |
| openDrawer | Open drawer manually |
| openLeftDrawer | Open left drawer manually |
| openRightDrawer | Open right drawer manually |
| closeDrawer | Close drawer manually. The drawerContent has a ref of drawer instance, you can also trigger with it. |
| closeLeftDrawer | Close left drawer manually |
| closeRightDrawer | Close right drawer manually |
