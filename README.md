## react-native-drawer-menu [![Build Status](https://travis-ci.org/Tinysymphony/react-native-drawer-menu.svg?branch=master)](https://travis-ci.org/Tinysymphony/react-native-drawer-menu)

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
| type | String | ‘default' | Type of the drawer. `default` / `overlay` You can also use static value `Drawer.type.Default` / `Drawer.type.Overlay`. |
| drawerPosition | String | ‘left' | Determine where does the drawer come out. `left` or `right` You can also use static value `Drawer.position.Left` / `Drawer.position.Right`. |
| drawerWidth | Number | 200 | The width of drawer, it’s disabled when use `replace` type. |
| duration | Number | 160 | The duration of animation to open or close drawer. |
| maskAlpha | Number | 0.4 | Maximum value is 0.5, the opactiy value of the mask over the main board when drawer is open. Mask can be disabled with `showMask` property. |
| showMask | Bool | true | Whether show the mask when drawer is open. |
| customStyles | Object | {} | Customize drawer styles. You can customize main / mask / drawer. |
| onDrawerOpen | function | null | Triggers when drawer is totally opened. |
| onDrawerClose | function | null | Triggers when drawer is totally closed. |
| startCapture | Bool | false | Whether to capture touch events while clicking on screen. |
| moveCapture | Bool | false | Whether to capture touch events while swiping over the screen. |
| easingFunc | function | null | Easing function of drawer animation, default is `Easing.linear`. You can pass function like `Easing.ease`/`Easing.bezier(x1, y1, x2, y2)`/`Easing.sin`/`Easing.elastic(times)`/`Easing.bounce` etc.  |
| responderNegotiate | function | null | Customize conditions to set pan responder, `evt` & `gestureState` will be passed as arguments. Default condition is left 20% area on screen in `left` Drawer, or right 20% area on screen in `right` Drawer. |


### Instance methods

Use ref to invoke instance methods.

| Method | Description |
| --- | --- |
| openDrawer | OpenDrawer manually |
| closeDrawer | CloseDrawer manually. The drawerContent has a ref of drawer instance, you can also trigger with it. |
