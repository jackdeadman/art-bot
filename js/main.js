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
	this.__drawing = true;
}

DrawingPanel.prototype.setDrawing = function(drawing) {
	if ((this.__drawing !== drawing) && !drawing) {
		this.points.push(null);
	}
	this.__drawing = drawing;
};

DrawingPanel.prototype.addPoint = function(point) {
	if (this.__drawing) {
		this.points.push(point);
	}
};

DrawingPanel.prototype.drawPoints = function(points, colour) {
  if (points.length === 0) return;

  var context = this.context;
  var previousPoint = points[0];

  for (var i=0; i<points.length; ++i) {
    var point = points[i];

    context.beginPath();

		if (previousPoint !== null) {
			context.moveTo(previousPoint.x, previousPoint.y);
		}

		if (point !== null) {
			context.lineTo(point.x, point.y);
		}

		context.strokeStyle = colour || '#000000';
		context.stroke();
		context.closePath();
    previousPoint = point;
  }
};

DrawingPanel.prototype.draw = function() {
	this.drawPoints(this.points);
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

ArtBot.prototype.preUpdate = function(position, angle, speed) {
	if (speed !== 0) {
		angle = angle + this.turningSpeed;
	}
  return {
		position: {
			x: position.x + speed * Math.cos(angle),
			y: position.y + speed * Math.sin(angle),
		},
		angle: angle
  };
};

ArtBot.prototype.peek = function(distance) {
	var positions = [];
	var attrs = {
		position: { x: this.position.x, y: this.position.y },
		angle: this.angle
	};

	for (var i = 0; i < distance; i++) {
		attrs = this.preUpdate(attrs.position, attrs.angle, 0.5);
		positions.push(attrs.position);
	}
	return positions;
};


ArtBot.prototype.update = function() {
	var updated = this.preUpdate(this.position, this.angle, this.speed);
	this.position = updated.position;
	this.angle = updated.angle;
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

	function removeClasses() {
		document.querySelectorAll('.curve-setter').forEach(function(changer) {
			changer.classList.remove('active');
		});
	};

	function pulse(node) {
		node.classList.add('active');
		setTimeout(function() {
			node.classList.remove('active')
		}, 500);
	}

  document.querySelectorAll('.angle-changer').forEach(function(changer) {
    changer.addEventListener('mouseover', function() {
      robot.angle += parseFloat(degrees2radians(changer.dataset.amount));
			robot.turningSpeed = 0;
			removeClasses();
			pulse(changer)
    });
  });

  document.querySelectorAll('.angle-setter').forEach(function(changer) {
    changer.addEventListener('mouseover', function() {
      robot.angle = parseFloat(degrees2radians(changer.dataset.amount));
			pulse(changer)
			robot.turningSpeed = 0;
			removeClasses();
    });
  });

	document.querySelectorAll('.curve-setter').forEach(function(changer) {
    changer.addEventListener('mouseover', function() {
			removeClasses();
			changer.classList.add('active');
      robot.turningSpeed = (parseFloat(degrees2radians(changer.dataset.amount)) / 10);
    });
  });

  document.querySelectorAll('.menu-button').forEach(function(menuButton) {
    menuButton.addEventListener('mouseover', function() {
      menu.classList.remove('hidden');
    });
  });

	var robotMoving = true;
	document.querySelectorAll('.stop-button').forEach(function(button) {
		button.addEventListener('mouseover', function() {
			pulse(this);
			document.querySelectorAll('.stop-button').forEach(function(button) {
				robotMoving = !robotMoving;
				button.innerText = robotMoving ? 'stop' : 'start';
			});
		});
	});

	var robotDrawing = true;
	document.querySelectorAll('.pen-button').forEach(function(button) {
		button.addEventListener('mouseover', function() {
			robotDrawing = !robotDrawing;
			pulse(this);
			document.querySelectorAll('.pen-button').forEach(function(button) {
				button.innerText = robotDrawing ? 'penup' : 'pendown';
			});
		});
	});

  var overlays = [].slice.call(document.querySelectorAll('.overlay'));
  document.querySelectorAll('.menu-changer').forEach(function(menuChanger) {
    menuChanger.addEventListener('mouseover', function() {
			pulse(this);
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

	var toggle = true;
	var robotStartSpeed = 0.5;

  setInterval(function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
		robot.speed = robotMoving ? robotStartSpeed : 0;
		panel.setDrawing(robotDrawing);

    robot.update();
    panel.addPoint(robot.position);

    panel.draw();
		panel.drawPoints(robot.peek(200), '#AAAAAA');

    robot.draw();

    angleDisplays.forEach(function(angleDisplay) {
      angleDisplay.style.transform = 'rotate('+ robot.angle +'rad)';
    });

    angleTexts.forEach(function(angleText) {
      angleText.innerText = (Math.round(radians2degrees(robot.angle)) % 360);
    });
  }, 1000/30);


})();
