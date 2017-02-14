import React, { PropTypes, Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
  PanResponder,
  Dimensions
} from 'react-native';

const {heigt, width} = Dimensions.get('window');

import Animation from './Animation';

export default class Drawer extends Component {
  componentWillMount() {
    const {drawerWidth} = this.props;
    this.MAX_DX = drawerWidth > 0.8 * width ? 0.8 * width : drawerWidth;
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
    this._handleMainBoardPress = this._handleMainBoardPress.bind(this);
  }
  componentDidMount() {
    this._updateNativeStyles(0);
  }
  _handlePanResponderGrant(evt, gestureState) {

  }
  _handlePanResponderMove (evt, gestureState) {
    var {dx, x0} = gestureState;
    if (!this._touchPositionCheck(gestureState)) return;
    if (dx > 0 && dx <= this.MAX_DX) {
      this._updateNativeStyles(gestureState.dx);
    } else if(dx < 0 && dx >= -this.MAX_DX) {
      this._updateNativeStyles(this.MAX_DX + dx);
    }
    // dx === 0 triggers tap event when drawer is opened.
  }
  _handlePanResponderEnd (evt, gestureState) {
    var left = this.styles.main.style.left;
    if (this.isOpen && gestureState.dx === 0) return this._handleMainBoardPress();
    if (left === this.MAX_DX) {
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
  _touchPositionCheck(gestureState) {
    const {x0, dx} = gestureState;
    if (x0 <= width * 0.2 && !this.isOpen && dx > 0) {
      return true;
    }
    if ((x0 > (width - this.MAX_DX)) && this.isOpen && dx < 0) {
      return true;
    }
    return false;
  }
  closeDrawer() {
    this.inAnimation = true;
    const {duration} = this.props;
    var left = this.styles.main.style.left;
    new Animation({
      start: left,
      end: 0,
      duration,
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
    const {duration} = this.props;
    var left = this.styles.main.style.left;
    new Animation({
      start: left,
      end: this.MAX_DX,
      duration,
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
    this.styles.drawer.style.left = -this.MAX_DX + dx;
    this.styles.drawer.style.right = width - dx;
    this.styles.main.style.left = dx;
    this.styles.main.style.right = -dx;
    this._drawer && this._drawer.setNativeProps(this.styles.drawer);
    this._main && this._main.setNativeProps(this.styles.main);
  }
  _handleMainBoardPress () {
    if (this.inAnimation) return;
    this.closeDrawer();
  }
  render() {
    // TODO mask to prevent touch event on main board
    return (
      <View style={styles.container}>
        <View
          ref={(main) => {this._main = main;}}
          style={styles.main}
          {...this._pan.panHandlers}
        >
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
  duration: 160
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
    position: 'absolute'
  },
  main: {
    position: 'absolute'
  }
});
