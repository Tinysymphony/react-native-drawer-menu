/**
 * Created by TinySymphony on 2017-02-14.
 */

export default function Animation(option) {
  this.animate = this.animate.bind(this);
  this.start = this.start.bind(this);
  this.option = option;
}

Animation.prototype.animate = function (now) {
  const {
    start,
    end,
    duration,
    onAnimationFrame,
    onAnimationEnd,
    easingFunc = t => t
  } = this.option;
  var currentDuration = now - this.startTime;
  if (currentDuration >= duration) {
    onAnimationFrame(end);
    onAnimationEnd();
    return;
  }
  let value;
  if (start > end) {
    value = start - (start - end) * easingFunc(currentDuration / duration);
  } else {
    value = (end - start) * easingFunc(currentDuration / duration) + start;
  }
  onAnimationFrame(value);
  requestAnimationFrame(this.animate);
};

Animation.prototype.start = function () {
  this.startTime = new Date();
  this.animate(this.startTime);
};
