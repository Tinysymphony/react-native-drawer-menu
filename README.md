## react-native-drawer-menu [![Build Status](https://travis-ci.org/Tinysymphony/react-native-drawer-menu.svg?branch=master)](https://travis-ci.org/Tinysymphony/react-native-drawer-menu)

A drawer component for React Native Application (ios / android)

### Usage

**install from npm**

``` shell
npm install --save react-native-drawer-menu
```

**import in project**

``` js
import Drawer from 'react-native-drawer-menu';

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


