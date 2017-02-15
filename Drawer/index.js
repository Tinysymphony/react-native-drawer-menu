/**
 * Created by wangyi27 on 2017-02-14.
 */

import React, {PropTypes, Component} from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  Dimensions
} from 'react-native';

const {width} = Dimensions.get('window');

import Animation from './Animation';

/* eslint-disable curly, no-new, no-warning-comments */

export default class Drawer extends Component {
  componentWillMount() {
    const {drawerWidth} = this.props;
    this.MAX_DX = drawerWidth > 0.8 * width ? 0.8 * width : drawerWidth;
    this.MAX_ALPHA = 0.3;
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
      },
      mask: {
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0)'
        }
      }
    };
    this.inAnimation = false;
    this.isOpen = false;
    this._pan = PanResponder.create({
      onStartShouldSetPanResponder: this._onStartShouldSetPanResponder.bind(this),
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: this._handlePanResponderGrant.bind(this),
      onPanResponderMove: this._handlePanResponderMove.bind(this),
      onPanResponderRelease: this._handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
    this.state = {
      showMask: false
    };
    this._handleMainBoardPress = this._handleMainBoardPress.bind(this);
    this._drawerDidClose = this._drawerDidClose.bind(this);
    this._drawerDidOpen = this._drawerDidOpen.bind(this);
  }
  componentDidMount() {
    this._updateNativeStyles(0);
  }
  _onStartShouldSetPanResponder (evt, gestureState) {
    // set responder for tapping when the drawer is open
    if (this.isOpen && !this.inAnimation) return true;
    return false;
  }
  _onMoveShouldSetPanResponder (evt, gestureState) {
    if (this._touchPositionCheck(gestureState)) {
      !this.state.showMask && this.setState({showMask: true});
      return true;
    }
    return false;
  }
  _handlePanResponderGrant(evt, gestureState) {
  }
  _handlePanResponderMove (evt, gestureState) {
    var {dx} = gestureState;
    if (dx > 0 && dx <= this.MAX_DX && !this.isOpen) {
      this._updateNativeStyles(gestureState.dx);
    } else if (dx < 0 && dx >= -this.MAX_DX && this.isOpen) {
      this._updateNativeStyles(this.MAX_DX + dx);
    }
    // dx === 0 triggers tap event when drawer is opened.
  }
  _handlePanResponderEnd (evt, gestureState) {
    var left = this.styles.main.style.left;
    if (this.isOpen && gestureState.dx === 0) return this._handleMainBoardPress();
    if (left === this.MAX_DX) return this._drawerDidOpen();
    if (left === 0) return this._drawerDidClose();
    if (left > this.MAX_DX / 2) {
      this.openDrawer();
    } else {
      this.closeDrawer();
    }
  }
  _touchPositionCheck(gestureState) {
    const {moveX, dx, dy} = gestureState;
    let x0 = moveX; // in move set panresponder state, moveX is the original point's coordinates
    if (Math.abs(dx) < Math.abs(dy)) return false;
    if (x0 <= width * 0.2 && !this.isOpen && dx > 0) {
      return true;
    }
    if ((x0 >= (width - this.MAX_DX)) && this.isOpen && dx < 0) {
      return true;
    }
    return false;
  }
  closeDrawer() {
    if (this.inAnimation) return;
    this.inAnimation = true;
    const {duration} = this.props;
    let left = this.styles.main.style.left;
    new Animation({
      start: left,
      end: 0,
      duration,
      onAnimationFrame: (val) => {
        this._updateNativeStyles(val);
      },
      onAnimationEnd: this._drawerDidClose
    }).start();
  }
  openDrawer() {
    if (this.inAnimation) return;
    this.inAnimation = true;
    const {duration} = this.props;
    let left = this.styles.main.style.left;
    !this.state.showMask && this.setState({showMask: true});
    new Animation({
      start: left,
      end: this.MAX_DX,
      duration,
      onAnimationFrame: (val) => {
        this._updateNativeStyles(val);
      },
      onAnimationEnd: this._drawerDidOpen
    }).start();
  }
  _drawerDidOpen () {
    this.inAnimation = false;
    this.isOpen = true;
    this.props.onDrawerOpen && this.props.onDrawerOpen();
  }
  _drawerDidClose () {
    this.inAnimation = false;
    this.isOpen = false;
    this.state.showMask && this.setState({showMask: false}, () => {
      this.props.onDrawerClose && this.props.onDrawerClose();
    });
  }
  _updateNativeStyles (dx) {
    this.styles.drawer.style.left = -this.MAX_DX + dx;
    this.styles.drawer.style.right = width - dx;
    this.styles.main.style.left = dx;
    this.styles.main.style.right = -dx;
    this.styles.mask.style.backgroundColor = `rgba(0, 0, 0, ${(dx / this.MAX_DX * this.MAX_ALPHA).toFixed(2)})`;
    this._drawer && this._drawer.setNativeProps(this.styles.drawer);
    this._main && this._main.setNativeProps(this.styles.main);
    this._mask && this._mask.setNativeProps(this.styles.mask);
  }
  _handleMainBoardPress () {
    if (this.inAnimation) return;
    this.closeDrawer();
  }
  render() {
    let drawerContent;
    if (this.props.drawerContent) {
      drawerContent = React.cloneElement(this.props.drawerContent, {
        drawer: this
      });
    }
    return (
      <View style={styles.container}>
        <View
          ref={(main) => {this._main = main;}}
          style={styles.absolute}
          {...this._pan.panHandlers}
        >
          {this.props.children}
          {this.state.showMask && <View
            ref={(mask) => {this._mask = mask;}}
            style={[styles.mask, styles.absolute]}/>}
        </View>
        <View ref={(drawer) => {this._drawer = drawer;}} style={styles.absolute}>
          {drawerContent}
        </View>
      </View>
    );
  }
}

Drawer.positions = {
  Left: 'left',
  Right: 'right'
};

Drawer.types = {
  Overlay: 'overlay',
  Default: 'default',
  Replace: 'replace'
};

Drawer.defaultProps = {
  drawerWidth: 200,
  duration: 160,
  drawerPosition: Drawer.positions.Left,
  type: Drawer.types.Default
};

Drawer.propTypes = {
  drawerContent: PropTypes.object,
  width: PropTypes.number,
  duration: PropTypes.number,
  drawerPosition: PropTypes.oneOf(Object.values(Drawer.positions)),
  type: PropTypes.oneOf(Object.values(Drawer.types))
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  absolute: {
    position: 'absolute'
  },
  mask: {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  }
});
