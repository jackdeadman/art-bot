var noOp = function() {};

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

  this.speed = 1;
  this.turningSpeed = Math.PI / 100;
  this.angle = 0;
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
  context.fillStyle = "red";
  context.beginPath();
  context.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
};


(function() {

  var canvas = document.getElementById('display');
  var context = canvas.getContext('2d');

  canvas.setAttribute('width', canvas.offsetWidth);
  canvas.setAttribute('height', canvas.offsetHeight);

  var panel = new DrawingPanel(context);
  var robot = new ArtBot({x: 100, y: 100}, context);

  var objects = [ panel, robot ];

  setInterval(function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    robot.update();
    panel.addPoint(robot.position);

    panel.draw();
    robot.draw();
  }, 1000/60);


})();
