/**
 * Created by TinySymphony on 2017-02-14.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
  Right: 'right',
  Both: 'both'
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
    disabled: false,
    leftDisabled: false,
    rightDisabled: false,
    drawerWidth: 300,
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
    disabled: PropTypes.bool,
    leftDisabled: PropTypes.bool,
    rightDisabled: PropTypes.bool,
    drawerContent: PropTypes.object,
    drawerWidth: PropTypes.number,
    duration: PropTypes.number,
    drawerPosition: PropTypes.oneOf(Object.values(positions)),
    type: PropTypes.oneOf(Object.values(types)),
    showMask: PropTypes.bool,
    maskAlpha: PropTypes.number,
    customStyles: PropTypes.object,
    onDrawerClose: PropTypes.func,
    onLeftDrawerClose: PropTypes.func,
    onRightDrawerClose: PropTypes.func,
    onDrawerOpen: PropTypes.func,
    onLeftDrawerOpen: PropTypes.func,
    onRightDrawerOpen: PropTypes.func,
    startCapture: PropTypes.bool,
    moveCapture: PropTypes.bool,
    easingFunc: PropTypes.func,
    responderNegotiate: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      showMask: false
    };
  }
  componentWillMount() {
    const {
      drawerWidth,
      drawerPosition,
      maskAlpha
    } = this.props;
    this.isLeft = drawerPosition === positions.Both || drawerPosition === positions.Left;
    this.isRight = drawerPosition === positions.Both || drawerPosition === positions.Right;
    this.MAX_DX = drawerWidth > width ? width : drawerWidth;
    this.MAX_ALPHA = maskAlpha > MAX.maskAlpha ? MAX.maskAlpha : maskAlpha;
    this.styles = {
      leftDrawer: {
        style: {
          top: 0,
          bottom: 0,
          left: -this.MAX_DX,
          right: width
        }
      },
      rightDrawer: {
        style: {
          top: 0,
          bottom: 0,
          left: width,
          right: -this.MAX_DX
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
    this.isLeftOpen = false;
    this.isRightOpen = false;
    this.isLeftActive = false;
    this.isRightActive = false;
    this._pan = PanResponder.create({
      onStartShouldSetPanResponder: this._onStartShouldSetPanResponder.bind(this),
      onStartShouldSetPanResponderCapture: this._onStartShouldCapture.bind(this),
      onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponderCapture: this._onMoveShouldCapture.bind(this),
      onPanResponderTerminationRequest: this._handleTerminationRequest.bind(this),
      onPanResponderGrant: this._handlePanResponderGrant.bind(this),
      onPanResponderMove: this._handlePanResponderMove.bind(this),
      onPanResponderRelease: this._handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
      onShouldBlockNativeResponder: this._shouldBlockNativeResponder.bind(this)
    });
    this._updateNativeStyles = this._updateNativeStyles.bind(this);
    this._handleMainBoardPress = this._handleMainBoardPress.bind(this);
    this._drawerDidClose = this._drawerDidClose.bind(this);
    this._drawerDidOpen = this._drawerDidOpen.bind(this);
    this._bindDrawerRef = this._bindDrawerRef.bind(this);
    this._maskRefBind = this._maskRefBind.bind(this);
    this._mainRefBind = this._mainRefBind.bind(this);
    this._leftDrawerRefBind = this._leftDrawerRefBind.bind(this);
    this._rightDrawerRefBind = this._rightDrawerRefBind.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
  }
  componentDidMount () {
    this._updateNativeStyles(0);
  }
  _onStartShouldCapture (evt, gestureState) {
    return this.props.startCapture;
  }
  _onMoveShouldCapture (evt, gestureState) {
    return this.props.moveCapture;
  }
  _shouldBlockNativeResponder (evt, gestureState) {
    return true;
  }
  _handleTerminationRequest () {
    return true;
  }
  _onStartShouldSetPanResponder (evt, gestureState) {
    // set responder for tapping when the drawer is open
    const {
      disabled,
      leftDisabled,
      rightDisabled
    } = this.props;
    let isOpen = this.isLeftOpen || this.isRightOpen;
    let singleDisabled = (this.isLeftOpen && leftDisabled) || (this.isRightOpen && rightDisabled);
    if (isOpen && !this.inAnimation && !disabled && !singleDisabled) return true;
    return false;
  }
  _onMoveShouldSetPanResponder (evt, gestureState) {
    // custom pan responder condition function
    if (
      this.props.disabled ||
      (this.props.responderNegotiate && this.props.responderNegotiate(evt, gestureState) === false)
    ) return false;
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
      if (this.isRight && this.isRightOpen) return this._updateNativeStyles(-this.MAX_DX + dx);
      if (this.isLeft && !this.isLeftOpen) this._updateNativeStyles(dx);
    } else if (dx < 0 && dx >= -this.MAX_DX) {
      // swipe left
      if (this.isLeft && this.isLeftOpen) return this._updateNativeStyles(this.MAX_DX + dx);
      if (this.isRight && !this.isRightOpen) this._updateNativeStyles(dx);
    }
    // dx === 0 triggers tap event when drawer is opened.
  }
  _handlePanResponderEnd (evt, gestureState) {
    let currentWidth = Math.abs(this._getCurrentDrawerWidth());
    let isOpen = this.isLeftOpen || this.isRightOpen;
    if (isOpen && gestureState.dx === 0) return this._handleMainBoardPress();
    if (currentWidth === this.MAX_DX) return this._drawerDidOpen();
    if (currentWidth === 0) return this._drawerDidClose();
    if (currentWidth > this.MAX_DX / 2) {
      this.openDrawer();
    } else {
      this.closeDrawer();
    }
  }
  _getCurrentDrawerWidth () {
    return this.isLeftActive ? this.styles.leftDrawer.style.left + this.MAX_DX :
      this.styles.rightDrawer.style.left - width;
  }
  _touchPositionCheck(gestureState) {
    const {moveX, dx, dy} = gestureState;
    const {
      leftDisabled,
      rightDisabled
    } = this.props;
    // in move set panresponder state, moveX is the original point's coordinates
    let x0 = moveX;
    let isOpen = this.isLeftOpen || this.isRightOpen;
    if (Math.abs(dx) < Math.abs(dy)) return false;
    // swipe when drawer is fully opened
    if (
      this.isLeftOpen && !leftDisabled && dx < 0 ||
      (this.isRightOpen && !rightDisabled && dx > 0)
    ) {
      return true;
    }
    // swipe right to open left drawer
    if (!leftDisabled && this.isLeft && x0 <= width * 0.2 && !isOpen && dx > 0) {
      this.isLeftActive = true;
      return true;
    }
    // swipe left to open right drawer
    if (!rightDisabled && this.isRight && x0 >= this.MAX_DX && !isOpen && dx < 0) {
      this.isRightActive = true;
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
  closeLeftDrawer () {
    const disabled = this.props.disabled || this.props.leftDisabled;
    if (!this.isLeft || !this.isLeftOpen || disabled) return;
    this.closeDrawer();
  }
  closeRightDrawer () {
    const disabled = this.props.disabled || this.props.rightDisabled;
    if (!this.isRight || !this.isRightOpen || disabled) return;
    this.closeDrawer();
  }
  openDrawer() {
    if (this.inAnimation || this.props.disabled) return;
    this.inAnimation = true;
    const {
      duration,
      leftDisabled,
      rightDisabled,
      easingFunc = t => t
    } = this.props;
    // enable active status when the method is called by instance reference
    if (!this.isLeftActive && !this.isRightActive) {
      if (this.isLeft && !leftDisabled) {
        this.isLeftActive = true;
      } else if (this.isRight && !rightDisabled) {
        this.isRightActive = true;
      }
    }
    let left = this._getCurrentDrawerWidth();
    let maxWidth = this.MAX_DX;
    if (this.isRightActive || !this.isLeft) {
      maxWidth *= -1;
    }
    this.props.showMask && !this.state.showMask && this.setState({showMask: true});
    new Animation({
      start: left,
      end: maxWidth,
      duration,
      easingFunc,
      onAnimationFrame: (val) => {
        this._updateNativeStyles(val);
      },
      onAnimationEnd: this._drawerDidOpen
    }).start();
  }
  openLeftDrawer () {
    let isOpen = this.isLeftOpen || this.isRightOpen;
    const disabled = this.props.disabled || this.props.leftDisabled;
    if (!this.isLeft || isOpen || disabled) return;
    this.isLeftActive = true;
    this.openDrawer();
  }
  openRightDrawer () {
    let isOpen = this.isLeftOpen || this.isRightOpen;
    const disabled = this.props.disabled || this.props.rightDisabled;
    if (!this.isRight || isOpen || disabled) return;
    this.isRightActive = true;
    this.openDrawer();
  }
  _drawerDidOpen () {
    this.inAnimation = false;
    if (this.isLeftActive) {
      this.isLeftOpen = true;
      this.props.onLeftDrawerOpen && this.props.onLeftDrawerOpen();
    } else {
      this.isRightOpen = true;
      this.props.onRightDrawerOpen && this.props.onRightDrawerOpen();
    }
    this.props.onDrawerOpen && this.props.onDrawerOpen();
  }
  _drawerDidClose () {
    this.inAnimation = false;
    this.state.showMask && this.setState({showMask: false}, () => {
      if (this.isLeftActive) {
        this.isLeftOpen = false;
        this.isLeftActive = false;
        this.props.onLeftDrawerClose && this.props.onLeftDrawerClose();
      } else {
        this.isRightOpen = false;
        this.isRightActive = false;
        this.props.onRightDrawerClose && this.props.onRightDrawerClose();
      }
      this.props.onDrawerClose && this.props.onDrawerClose();
    });
  }
  _updateNativeStyles (dx) {
    this.styles.leftDrawer.style.left = -this.MAX_DX + dx;
    this.styles.leftDrawer.style.right = width - dx;
    this.styles.rightDrawer.style.left = width + dx;
    this.styles.rightDrawer.style.right = -this.MAX_DX - dx;
    this.styles.mask.style.backgroundColor = `rgba(0, 0, 0,
      ${(Math.abs(dx) / this.MAX_DX * this.MAX_ALPHA).toFixed(2)})`;
    this._leftDrawer && this._leftDrawer.setNativeProps(this.styles.leftDrawer);
    this._rightDrawer && this._rightDrawer.setNativeProps(this.styles.rightDrawer);
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
  _bindDrawerRef (component) {
    return React.cloneElement(component, {
      drawer: this
    });
  }
  _mainRefBind (main) {
    this._main = main;
  }
  _maskRefBind (mask) {
    this._mask = mask;
  }
  _leftDrawerRefBind (drawer) {
    this._leftDrawer = drawer;
  }
  _rightDrawerRefBind (drawer) {
    this._rightDrawer = drawer;
  }
  render() {
    const {customStyles} = this.props;
    let drawerContent = this.props.drawerContent ? this._bindDrawerRef(this.props.drawerContent) : null;
    let leftDrawerContent = this.props.leftDrawerContent ? this._bindDrawerRef(this.props.leftDrawerContent) : null;
    let rightDrawerContent = this.props.rightDrawerContent ? this._bindDrawerRef(this.props.rightDrawerContent) : null;
    return (
      <View style={styles.container}>
        <View
          ref={this._mainRefBind}
          style={[customStyles.main, styles.absolute]}
          {...this._pan.panHandlers}
        >
          {this.props.children}
          {this.state.showMask && <View
            ref={this._maskRefBind}
            style={[customStyles.mask, styles.mask, styles.absolute]}/>}
        </View>
        {this.isLeft &&
          <View
            ref={this._leftDrawerRefBind}
            style={[this.isLeft ? customStyles.drawer : {}, customStyles.leftDrawer, styles.absolute]}>
            {leftDrawerContent ? leftDrawerContent : drawerContent}
          </View>
        }
        {this.isRight &&
          <View
            ref={this._rightDrawerRefBind}
            style={[this.isRight ? customStyles.drawer : {}, customStyles.rightDrawer, styles.absolute]}>
            {rightDrawerContent ? rightDrawerContent : drawerContent}
          </View>
        }
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
