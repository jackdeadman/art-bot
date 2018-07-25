var KeyCode = {
  ENTER: 13,
  SPACE: 32,
  '6': 54,
  '7': 55,
  '8': 56,
  '5': 53,
  '4': 52,
  '3': 51,
  '2': 50
};

document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('output');
  canvas.height = window.innerHeight;
  var canvasHeight = canvas.height;
  var context = canvas.getContext("2d");
  var angle = 0;
  var moving = false;
  var penDown = true;

  var circlePos = { x: 400, y: canvasHeight/2 };

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function lineToAngle(ctx, x1, y1, length, angle) {
    angle *= Math.PI / 180;

    var x2 = x1 + length * Math.cos(angle),
        y2 = y1 + length * Math.sin(angle);

    return {x: x2, y: y2};
  }

  context.rotate(10*Math.PI/180);

  function draw() {
    context.fillStyle = "#000000";
    context.beginPath();
    context.arc(circlePos.x, circlePos.y, 2, 0, 2 * Math.PI);
    context.fill();
  }
  var speed = 1;
  var angleChange = 0;

  function update() {
    if (moving) {
      angle += angleChange;
      circlePos.x += speed * Math.cos(angle);
      circlePos.y -= speed * Math.sin(angle);
    }
  }

  function bindControls() {
    window.addEventListener('keydown', function(e) {
      if (e.keyCode === KeyCode.ENTER) {
        reset();
      } else if(e.keyCode === KeyCode.SPACE) {
        moving = !moving;
      } else {
        var amount = parseInt(e.keyCode) - 54;
        if ([-3, -2, -1, 0, 1, 2, 3].indexOf(amount) !== -1) {
          angleChange = amount * Math.PI/200;
        }
      }

    });
  }

  function reset() {
    angleChange = 0;
    angle = 0;
    circlePos = { x: 400, y: canvasHeight/2 };
    clearCanvas();
  }

  bindControls();


  setInterval(function() {
    // clearCanvas();
    draw();
    update();
  }, 1000/60);
});
