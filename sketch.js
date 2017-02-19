var totalPoints = 10;
const k = 10;
var particalSystem = [];
var leafParticals = [];

var maxNearbyParticals = 0;
var minNearbyParticals = 0;

var myImage;
function preload() {
  myImage = loadImage("New_Leaf.png");
}

function findMinInArray(arr) {
	var min = 3000;
	for(var i = 0; i < arr.length; i++) {
		if (arr[i] < min) {
			min = arr[i];
		}
	}
	return min;
}

function findMaxInArray(arr) {
	var max = -1;
	for(var i = 0; i < arr.length; i++) {
		if (arr[i] > max) {
			max = arr[i];
		}
	}
	return max;
}

function setup() {
	randomSeed(0)
	createCanvas(windowWidth, windowHeight);
	myImage.loadPixels()

	for (var i = (width / 2 - height / 2); i < (width / 2 + height / 2); i += random(14, 18)) {
		for(var j = 0; j < height; j += random(14, 18)) {
			var iX = floor(map(i, width / 2 - height / 2, width / 2 + height / 2, 0, myImage.width));
			var iY = floor(map(j, 0, height, 0, myImage.height));
			var r = myImage.pixels[(iX + iY * myImage.width) * 4];
			var g = myImage.pixels[(iX + iY) * myImage.width * 4 + 1];
			var b = myImage.pixels[(iX + iY) * myImage.width * 4 + 2];
			if (r != 0) {
				var deltaX = random(-5, 5)
				var deltaY = random(-3, 3)
				particalSystem.push(particalMaker(i + deltaX, j + deltaY));
			}
		}
	}

	var nearByParticalNumArr = [];

	for(var i = 0; i < particalSystem.length; i++) {
		var counter = 0;
		for(var j = 0; j < particalSystem.length; j++) {
			if (i == j) {
				continue;
			}
			var distanceX = particalSystem[j].x - particalSystem[i].x
			var distanceY = particalSystem[j].y - particalSystem[i].y
			var distance = sqrt(distanceX * distanceX + distanceY * distanceY);
			if (distance < 50) {
				counter += 1
			}
		}
		nearByParticalNumArr.push(counter);
		particalSystem[i].nearByParticalNum = counter
	}

	maxNearbyParticals = findMaxInArray(nearByParticalNumArr)
	minNearbyParticals = findMinInArray(nearByParticalNumArr)
}

function particalMaker(x, y) {
	return {
		x : x,
		y : y,
		vx : 0,
		vy : 0,
		targetX : x,
		targetY : y,
		nearByParticalNum : 0
	}
}

function updatePartical(p) {
	var dx = p.targetX - mouseX;
	var dy = p.targetY - mouseY;
	var d = max(1, sqrt(dx * dx + dy * dy));


	//var force = map(sin(millis()/300), -1, 1, 0, 1) * k * 1/d;
	// var force = k / d;

	var sigma = 100;
	var mu = 50;
	//var force = min(0.5, 1 / (sigma * sqrt(2 * PI)) * exp(-(d - mu)^2/(2 * sigma^2)))

	var force;
	if (d >= 10) {
		//force = min(0.5, 1 / (sigma * sqrt(2 * PI)) * exp(-(d - mu)^2/(2 * sigma^2)))
		var k = 12
		force = k / d
		var fX = dx/d * force;
		var fY = dy/d * force;

		p.vx = p.vx + fX;
		p.vy = p.vy + fY;
	}
	
	particalGoingBack(p);
	var rx = random(-0.1, 0.1);
	var ry = random(-0.1, 0.1);
	p.vx = p.vx + rx;
	p.vy = p.vy + ry;

	p.x = p.x + p.vx;
	p.y = p.y + p.vy;

	p.vx = p.vx * 0.9
	p.vy = p.vy * 0.9

}


function particalGoingBack(p) {
	var dx = p.x - p.targetX;
	var dy = p.y - p.targetY;
	var d = max(1, sqrt(dx * dx + dy * dy));

	var force = -d * 0.01;
	// var force = -4 / d * d;

	var fX = dx/d * force;
	var fY = dy/d * force;
	p.vx = p.vx + fX;
	p.vy = p.vy + fY;
}

function draw() {
	background(255,255);
	//background(myImage);

	randomSeed(frameCount);
	for(var i = 0; i < particalSystem.length; i++) {
		var p = particalSystem[i];
		updatePartical(p)
	}
	randomSeed(0);
	noStroke();
	for(var i = 0; i < particalSystem.length; i++) {
		var p = particalSystem[i];

		var redColour = map(p.nearByParticalNum, minNearbyParticals, maxNearbyParticals, 150, 230);
		fill(redColour,0,0);
		var triSize = 10;
		var angle = random(2*PI);

		var variance = 0.3
		var randomX = random(1 - variance, 1 + 1)
		var randomY = random(1 - variance, 1 + 1)

		if (p.nearByParticalNum < 10) {
			randomX = 1
			randomY = 1
		}

		translate(p.x, p.y)
		scale(randomX, randomY)
		rotate(angle);
		triangle(1 * triSize, 0 * triSize, -1/2 * triSize, sqrt(3)/2 * triSize, -1/2 * triSize, -sqrt(3)/2 * triSize)
		rotate(-angle);
		scale(1/randomX, 1 / randomY)
		translate(-p.x, -p.y)
	}

}