## react-native-drawer-menu [![Build Status](https://travis-ci.org/Tinysymphony/react-native-drawer-menu.svg?branch=master)](https://travis-ci.org/Tinysymphony/react-native-drawer-menu)

A drawer component for React Native Application (ios / android)

### Usage

```shell
npm install --save react-native-drawer-menu
```

``` jsx
import Drawer from 'react-native-drawer-menu';

// in render function
render() {
  var drawerContent = (<View style={styles.drawerContent}>
    <View style={styles.leftTop}/>
    <View style={styles.leftBottom}>
      <View><Text>Drawer Content</Text></View>
    </View>
  </View>);
  return (
    <Drawer
      style={styles.container}
      drawerWidth={300}
      drawerContent={drawerContent}
      type={Drawer.types.Overlay}
      customStyles={{drawer: styles.drawer}}
      drawerPosition={Drawer.positions.Right}
    >
      <View style={styles.content}>
        <Text>{Object.values(Drawer.positions).join(' ')}</Text>
        <Text>{Object.values(Drawer.types).join(' ')}</Text>
      </View>
    </Drawer>
  );
}

```
