/**
 * Created by TinySymphony on 2017-02-14.
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
const positions = {
  Left: 'left',
  Right: 'right'
};

const types = {
  Overlay: 'overlay',
  Default: 'default',
  Replace: 'replace'
};

const MAX = {
  maskAlpha: 0.5
};

export default class Drawer extends Component {
  static positions = positions
  static types = types
  static defaultProps = {
    drawerWidth: 200,
    duration: 160,
    drawerPosition: positions.Left,
    type: types.Default,
    showMask: true,
    maskAlpha: 0.4,
    customStyles: {},
    startCapture: false,
    moveCapture: false
  }
  static propTypes = {
    drawerContent: PropTypes.object,
    width: PropTypes.number,
    duration: PropTypes.number,
    drawerPosition: PropTypes.oneOf(Object.values(positions)),
    type: PropTypes.oneOf(Object.values(types)),
    showMask: PropTypes.bool,
    maskAlpha: PropTypes.number,
    customStyles: PropTypes.object,
    onDrawerClose: PropTypes.func,
    onDrawerOpen: PropTypes.func,
    startCapture: PropTypes.bool,
    moveCapture: PropTypes.bool,
    easingFunc: PropTypes.func,
    responderNegotiate: PropTypes.func
  }
  componentWillMount() {
    const {
      drawerWidth,
      drawerPosition,
      maskAlpha
    } = this.props;
    this.isLeft = drawerPosition === positions.Left;
    this.MAX_DX = drawerWidth > 0.8 * width ? 0.8 * width : drawerWidth;
    this.MAX_ALPHA = maskAlpha > MAX.maskAlpha ? MAX.maskAlpha : maskAlpha;
    this.styles = {
      drawer: {
        style: {
          top: 0,
          bottom: 0,
          left: this.isLeft ? -this.MAX_DX : width,
          right: this.isLeft ? width : -this.MAX_DX
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
      onStartShouldSetPanResponderCapture: (evt, gestureState) => this.props.startCapture,
      onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.props.moveCapture,
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
    // custom pan responder condition function
    if (this.props.responderNegotiate && this.props.responderNegotiate(evt, gestureState) === false) return false;
    if (this._touchPositionCheck(gestureState)) {
      this.props.showMask && !this.state.showMask && this.setState({showMask: true});
      // this.props.onDrawerStartOpen && this.props.onDrawerStartOpen();
      return true;
    }
    return false;
  }
  _handlePanResponderGrant(evt, gestureState) {
  }
  _handlePanResponderMove (evt, gestureState) {
    let dx = gestureState.dx;
    if (dx > 0 && dx <= this.MAX_DX) {
      // swipe right
      if (this.isOpen && !this.isLeft) this._updateNativeStyles(-this.MAX_DX + dx);
      if (!this.isOpen && this.isLeft) this._updateNativeStyles(dx);
    } else if (dx < 0 && dx >= -this.MAX_DX) {
      // swipe left
      if (this.isOpen && this.isLeft) this._updateNativeStyles(this.MAX_DX + dx);
      if (!this.isOpen && !this.isLeft) this._updateNativeStyles(dx);
    }
    // dx === 0 triggers tap event when drawer is opened.
  }
  _handlePanResponderEnd (evt, gestureState) {
    let currentWidth = this._getCurrentDrawerWidth();
    if (!this.isLeft) currentWidth *= -1;
    if (this.isOpen && gestureState.dx === 0) return this._handleMainBoardPress();
    if (currentWidth === this.MAX_DX) return this._drawerDidOpen();
    if (currentWidth === 0) return this._drawerDidClose();
    if (currentWidth > this.MAX_DX / 2) {
      this.openDrawer();
    } else {
      this.closeDrawer();
    }
  }
  _getCurrentDrawerWidth () {
    return this.isLeft ? this.styles.drawer.style.left + this.MAX_DX :
      this.styles.drawer.style.left - width;
  }
  _touchPositionCheck(gestureState) {
    const {moveX, dx, dy} = gestureState;
    let x0 = moveX; // in move set panresponder state, moveX is the original point's coordinates
    let result = false;
    if (Math.abs(dx) < Math.abs(dy)) return result;
    if (this.isOpen && dx !== 0 ||
      this.isLeft && x0 <= width * 0.2 && !this.isOpen && dx > 0 ||
      !this.isLeft && x0 >= width * 0.8 && !this.isOpen && dx < 0) {
      return true;
    }
    return false;
  }
  closeDrawer() {
    if (this.inAnimation) return;
    this.inAnimation = true;
    const {
      duration,
      easingFunc = t => t
    } = this.props;
    let left = this._getCurrentDrawerWidth();
    new Animation({
      start: left,
      end: 0,
      duration,
      easingFunc,
      onAnimationFrame: (val) => {
        this._updateNativeStyles(val);
      },
      onAnimationEnd: this._drawerDidClose
    }).start();
  }
  openDrawer() {
    if (this.inAnimation) return;
    this.inAnimation = true;
    const {
      duration,
      easingFunc = t => t
    } = this.props;
    let left = this._getCurrentDrawerWidth();
    this.props.showMask && !this.state.showMask && this.setState({showMask: true});
    new Animation({
      start: left,
      end: this.isLeft ? this.MAX_DX : -this.MAX_DX,
      duration,
      easingFunc,
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
    this.styles.drawer.style.left = this.isLeft ? -this.MAX_DX + dx : width + dx;
    this.styles.drawer.style.right = this.isLeft ? width - dx : -this.MAX_DX - dx;
    this.styles.mask.style.backgroundColor = `rgba(0, 0, 0,
      ${(Math.abs(dx) / this.MAX_DX * this.MAX_ALPHA).toFixed(2)})`;
    this._drawer && this._drawer.setNativeProps(this.styles.drawer);
    this._mask && this._mask.setNativeProps(this.styles.mask);
    if (this.props.type === types.Default || dx === 0) {
      this.styles.main.style.left = dx;
      this.styles.main.style.right = -dx;
      this._main && this._main.setNativeProps(this.styles.main);
    }
  }
  _handleMainBoardPress () {
    if (this.inAnimation) return;
    this.closeDrawer();
  }
  render() {
    const {customStyles} = this.props;
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
          style={[customStyles.main, styles.absolute]}
          {...this._pan.panHandlers}
        >
          {this.props.children}
          {this.state.showMask && <View
            ref={(mask) => {this._mask = mask;}}
            style={[customStyles.mask, styles.mask, styles.absolute]}/>}
        </View>
        <View ref={(drawer) => {this._drawer = drawer;}} style={[customStyles.drawer, styles.absolute]}>
          {drawerContent}
        </View>
      </View>
    );
  }
}

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
