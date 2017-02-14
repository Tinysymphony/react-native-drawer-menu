export default function Animation(option) {
  this.animate = this.animate.bind(this);
  this.option = option;
  this.startTime = new Date();
  this.animate(this.startTime);
}

Animation.prototype.animate = function (now) {
  const {
    start,
    end,
    duration,
    onAnimationFrame,
    onAnimationEnd
  } = this.option;
  var currentDuration = now - this.startTime;
  if (currentDuration >= duration) {
    onAnimationFrame(end);
    onAnimationEnd();
    return;
  }
  var value;
  // TODO more animation function
  if (start > end) {
    value = start - (start - end) * currentDuration / duration;
  } else {
    value = (end - start) * currentDuration / duration + start;
  }
  onAnimationFrame(value);
  requestAnimationFrame(this.animate);
}
