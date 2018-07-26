var TURN_CHANGE = Math.PI / 1000;

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

function Circle(colour, x, y, r) {
  this.x = x;
  this.y = y;
  this.colour = colour;
  this.radius = r;
}

Circle.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.fillStyle = this.colour;
  ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
  ctx.fill();
  ctx.closePath();
};

Circle.prototype.inside = function(x, y) {
  return Math.sqrt((this.x-x)*(this.x-x) + (this.y-y)*(this.y-y)) < this.radius;
}

function Input() {
  this.canvas = document.getElementById('input');
  this.canvas.height = window.innerHeight;
  this.mousePos = {x: 0, y: 0};
  this.ctx = this.canvas.getContext('2d');

  var centre = { x: this.canvas.width/2, y: this.canvas.height/2 };

  this.circles = [
    new Circle('#aaa', centre.x, centre.y, 375),
    new Circle('#bbb', centre.x, centre.y, 375-65),
    new Circle('#ccc', centre.x, centre.y, 375-(65*2)),
    new Circle('#ddd', centre.x, centre.y, 375-(65*3)),
    new Circle('#eee', centre.x, centre.y, 375-(65*4)),
    new Circle('#fff', centre.x, centre.y, 375-(65*5))
  ];
}


Input.prototype.draw = function() {
  var ctx = this.ctx;
  this.circles.forEach(function(circle) {
    circle.draw(ctx);
  });
};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

Input.prototype.getAngleChange = function(x, y) {
  for (var i=this.circles.length-1; i >= 0; i--) {
    var circle = this.circles[i];
    if (circle.inside(x, y)) {
      return i-3;
    }
  }
};

function fitToContainer(canvas){
  // Make it visually fill the positioned parent
  canvas.style.width ='100%';
  canvas.style.height='100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  // console.log(canvas.offsetHeight - 350)
  canvas.height = canvas.offsetHeight - 350;
}

document.addEventListener('DOMContentLoaded', function() {
  // var input = new Input();
  var canvas = document.getElementById('output');

  // fitToContainer(canvas);


  // canvas.height = window.innerHeight;
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

  // context.rotate(10*Math.PI/180);

  function draw() {
    context.fillStyle = "#000000";
    context.beginPath();
    context.arc(circlePos.x, circlePos.y, 2, 0, 2 * Math.PI);
    context.fill();
  }
  var speed = 0.5;
  var angleChange = 0;

  function update() {
    if (moving) {
      angle += angleChange;
      circlePos.x += speed * Math.cos(angle);
      circlePos.y -= speed * Math.sin(angle);
    }
  }

  function bindControls() {

    // window.addEventListener('mousemove', function(e) {
    //   var mousePos = getMousePos(canvas, e);
    //   angleChange = input.getAngleChange(mousePos.x, mousePos.y);
    //   console.log(angleChange);
    // });

    var buttons = document.querySelectorAll('[class^=button-]');
    buttons.forEach(function(button) {
      button.addEventListener('mouseover', function() {
        var amount = parseInt(this.dataset.amount);
        angleChange = -(amount * TURN_CHANGE);
        buttons.forEach(function(button) {
          button.classList.remove('active');
        });
        this.classList.add('active');
      });
    });

    document.querySelector('.top-bar').addEventListener('mouseover', function() {
      moving = true;
    });

    document.querySelector('.bottom-bar').addEventListener('mouseover', function() {
      moving = false;
    });

    document.querySelector('.reset').addEventListener('click', function() {
      console.log('clicked');
      reset();
    });

    window.addEventListener('keydown', function(e) {
      if (e.keyCode === KeyCode.ENTER) {
        reset();
      } else if(e.keyCode === KeyCode.SPACE) {
        moving = !moving;
      } else {
        var amount = parseInt(e.keyCode) - 54;
        if ([-3, -2, -1, 0, 1, 2, 3].indexOf(amount) !== -1) {
          angleChange = -(amount * Math.PI/200);
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
    // input.draw();
    draw();
    update();
  }, 1000/60);
});
