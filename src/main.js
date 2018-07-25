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

function Input() {
  this.canvas = document.getElementById('input');
  this.canvas.height = window.innerHeight;
  this.ctx = this.canvas.getContext('2d');
}

Input.prototype.drawCircle = function(color, size) {
  this.ctx.beginPath();
  this.ctx.fillStyle = color;
  this.ctx.arc(this.canvas.width/2, this.canvas.height/2, size, 0, 2*Math.PI);
  this.ctx.fill();
  this.ctx.closePath();
};

Input.prototype.draw = function() {
  this.drawCircle('#aaa', 375);
  this.drawCircle('#bbb', 375-65);
  this.drawCircle('#ccc', 375-(65*2));
  this.drawCircle('#ddd', 375-(65*3));
  this.drawCircle('#eee', 375-(65*4));
  this.drawCircle('#fff', 375-(65*5));

  this.ctx.beginPath();
};



document.addEventListener('DOMContentLoaded', function() {
  var input = new Input();
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
    input.draw();
    draw();
    update();
  }, 1000/60);
});
