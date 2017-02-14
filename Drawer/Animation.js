export default function Animation(option) {
  this.animate = this.animate.bind(this);
  this.startTime = new Date();
  this.option = option;
  this.animate();
}

Animation.prototype.animate = function () {
  const {
    start,
    end,
    duration,
    onAnimationFrame,
    onAnimationEnd
  } = this.option;
  var now = new Date();
  var currentDuration = now - this.startTime;
  if (currentDuration >= duration) {
    onAnimationFrame(end);
    return onAnimationEnd();
  }
  var value;
  if (start > end) {
    value = start - (start - end) * currentDuration / duration;
  } else {
    value = (end - start) * currentDuration / duration + start;
  }
  onAnimationFrame(value);
  requestAnimationFrame(this.animate);
}
