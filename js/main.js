var noOp = function() {};

function drawArrowhead(context, angle, to, radius) {
	var x_center = to.x;
	var y_center = to.y;

	var x;
	var y;

	context.beginPath();

	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.moveTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.lineTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius *Math.cos(angle) + x_center;
	y = radius *Math.sin(angle) + y_center;

	context.lineTo(x, y);

	context.closePath();

	context.fill();
}

function radians2degrees(radians) {
  radians = parseFloat(radians);
  return radians * (180 / Math.PI);
}

function degrees2radians(degrees){
  degrees = parseFloat(degrees);
  return degrees * (Math.PI/180);
}

function DrawingPanel(context) {
  this.context = context;
  this.points = [];
}

DrawingPanel.prototype.addPoint = function(point) {
  this.points.push(point);
};

DrawingPanel.prototype.draw = function() {
  var points = this.points;
  if (points.length === 0) return;

  var context = this.context;
  var previousPoint = points[0];

  for (var i=0; i<points.length; ++i) {
    var point = points[i];

    context.beginPath();
    context.moveTo(previousPoint.x, previousPoint.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    context.closePath();
    previousPoint = point;
  }
};

DrawingPanel.prototype.update = noOp;

function ArtBot(position, context) {
  this.position = position;
  this.context = context;

  this.speed = 0.5;
  this.turningSpeed = Math.PI / 100;
  this.turningSpeed = 0;
  this.angle = Math.PI;
};



ArtBot.prototype.update = function() {
  this.angle = this.angle + this.turningSpeed;
  this.position = {
    x: this.position.x + this.speed * Math.cos(this.angle),
    y: this.position.y + this.speed * Math.sin(this.angle),
  };
};

ArtBot.prototype.draw = function() {
  var context = this.context;
  context.fillStyle = "rgba(255, 0, 0, 0.5)";
  drawArrowhead(context, this.angle, this.position, 10);
};

(function() {

  var angleDisplay = document.getElementById('angle-display');
  var angleText = document.getElementById('angle-text');
  var menu = document.getElementById('menu');

  var canvas = document.getElementById('display');
  var context = canvas.getContext('2d');

  canvas.setAttribute('width', canvas.offsetWidth);
  canvas.setAttribute('height', canvas.offsetHeight);

  var panel = new DrawingPanel(context);
  var robot = new ArtBot({x: 500, y: 500}, context);

  var objects = [ panel, robot ];

  document.querySelectorAll('.angle-changer').forEach(function(changer) {
    changer.addEventListener('click', function() {
      robot.angle += parseFloat(degrees2radians(changer.dataset.amount));
    });
  });

  document.querySelectorAll('.angle-setter').forEach(function(changer) {
    changer.addEventListener('click', function() {
      robot.angle = parseFloat(degrees2radians(changer.dataset.amount));
    });
  });

  document.querySelectorAll('.menu-button').forEach(function(menuButton) {
    menuButton.addEventListener('click', function() {
      menu.classList.remove('hidden');
    });
  });

  var overlays = [].slice.call(document.querySelectorAll('.overlay'));
  document.querySelectorAll('.menu-changer').forEach(function(menuChanger) {
    menuChanger.addEventListener('click', function() {
      menu.classList.add('hidden');
      var indexChanging = parseInt(menuChanger.dataset.index);
      overlays[indexChanging].classList.add('active');
      overlays.forEach(function(overlay, index) {
        if (index != indexChanging) {
          overlay.classList.remove('active');
        }
      });
    });
  });


  var angleDisplays = document.querySelectorAll('.angle-display');
  var angleTexts = document.querySelectorAll('.angle-text');

  setInterval(function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    robot.update();
    panel.addPoint(robot.position);

    panel.draw();
    robot.draw();

    angleDisplays.forEach(function(angleDisplay) {
      angleDisplay.style.transform = 'rotate('+ robot.angle +'rad)';
    });

    angleTexts.forEach(function(angleText) {
      angleText.innerText = (Math.round(radians2degrees(robot.angle)) % 360);
    });
  }, 1000/30);


})();
