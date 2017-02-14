import React, { PropTypes, Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Dimensions
} from 'react-native';

const {heigt, width} = Dimensions.get('window');

import Animation from './Animation';

export default class Drawer extends Component {
  componentWillMount() {
    this.MAX_DX = this.props.drawerWidth;
    this.styles = {
      drawer: {
        style: {
          top: 0,
          bottom: 0,
          left: -this.MAX_DX,
          right: width
        }
      },
      main: {
        style: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      }
    };
    this.inAnimation = false;
    this.isOpen = false;
    this._pan = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: this._handlePanResponderGrant.bind(this),
      onPanResponderMove: this._handlePanResponderMove.bind(this),
      onPanResponderRelease: this._handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }
  componentDidMount() {
    this._updateNativeStyles();
  }
  _handlePanResponderGrant(evt, gestureState) {

  }
  _handlePanResponderMove (evt, gestureState) {
    this._updateNativeStyles(gestureState.dx);
  }
  _handlePanResponderEnd (evt, gestureState) {
    var left = this.styles.main.style.left;
    if (left === this.props.drawerWidth) {
      this.isOpen = true;
      return;
    }
    if (left === 0) {
      this.isOpen = false;
      return;
    }
    if (left > this.MAX_DX / 2) {
      this.openDrawer();
    } else {
      this.closeDrawer();
    }
  }
  closeDrawer() {
    this.inAnimation = true;
    const {duration, drawerWidth} = this.props;
    var left = this.styles.main.style.left;
    new Animation({
      start: left,
      end: 0,
      duration: duration,
      onAnimationFrame: (left) => {
        this._updateNativeStyles(left);
      },
      onAnimationEnd: () => {
        this.inAnimation = false;
        this.isOpen = false;
      }
    });
  }
  openDrawer() {
    this.inAnimation = true;
    const {duration, drawerWidth} = this.props;
    var left = this.styles.main.style.left;
    new Animation({
      start: left,
      end: drawerWidth,
      duration: duration,
      onAnimationFrame: (left) => {
        this._updateNativeStyles(left);
      },
      onAnimationEnd: () => {
        this.inAnimation = false;
        this.isOpen = true;
      }
    });
  }
  _updateNativeStyles (dx) {
    dx = Number(dx);
    if (dx >= 0 && dx < this.MAX_DX) {
      this.styles.drawer.style.left = -this.MAX_DX + dx;
      this.styles.drawer.style.right = width - dx;
      this.styles.main.style.left = dx;
      this.styles.main.style.right = -dx;
    }
    this._drawer && this._drawer.setNativeProps(this.styles.drawer);
    this._main && this._main.setNativeProps(this.styles.main);
  }
  render() {
    return (
      <View style={styles.container}>
        <View ref={(main) => {this._main = main;}} style={styles.main} {...this._pan.panHandlers}>
          {this.props.children}
        </View>
        <View ref={(drawer) => {this._drawer = drawer;}} style={styles.drawer}>
          {this.props.drawerContent}
        </View>
      </View>
    );
  }
}

Drawer.defaultProps = {
  drawerWidth: 200,
  duration: 300
};

Drawer.propTypes = {
  drawerContent: PropTypes.object,
  width: PropTypes.number,
  duration: PropTypes.number
};

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
