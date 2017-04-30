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
    easingFunc = this.defaultEasing
  } = this.option;

  let currentDuration = now - this.startTime;
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

Animation.prototype.start = function (time) {
  this.startTime = new Date();
  this.animate(time || this.startTime);
};

Animation.prototype.defaultEasing = t => t;
