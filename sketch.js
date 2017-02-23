var totalPoints = 10;
const k = 10;
var particalSystem = [];
var hiddentParticals = [];
var outsiderParticals = [];

var maxNearbyParticals = 0;
var minNearbyParticals = 0;

var myImage;
var testImage;
function preload() {
  myImage = loadImage("New_Leaf.png");
  testImage = loadImage("test.jpg")
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

	// making random dots inside the leaf

	for(var i = 0; i < 350; i++) {
		var golden_angle = PI * (sqrt(2));
		var theta = i * golden_angle;
		var radias = (sqrt(i) / sqrt(100)) * 380
		var hiddenX = radias * cos(theta) + width / 2
		var hiddenY = radias * sin(theta) + height / 2

		var iX = floor(map(hiddenX, width / 2 - height / 2, width / 2 + height / 2, 0, myImage.width));
		var iY = floor(map(hiddenY, 0, height, 0, myImage.height));
		var r = myImage.pixels[(iX + iY * myImage.width) * 4];
		// 	var g = myImage.pixels[(iX + iY) * myImage.width * 4 + 1];
		// var b = myImage.pixels[(iX + iY) * myImage.width * 4 + 2];
		if (r != 0) {
			hiddentParticals.push(particalMaker(hiddenX , hiddenY))
		}
	}

	// make 6 outsider dots for line
	var outsiderPartical1X = floor((width / 2 - height / 2) / 2);
	var outsiderPartical1Y = floor((height * 3 / 4) / 3);
	outsiderParticals.push(particalMaker(outsiderPartical1X, outsiderPartical1Y));

	var outsiderPartical2X = floor((width / 2 - height / 2) / 2);
	var outsiderPartical2Y = floor((height * 3 / 4) * 2 / 3);
	outsiderParticals.push(particalMaker(outsiderPartical2X, outsiderPartical2Y));

	var outsiderPartical3X = floor((width / 2 - height / 2) / 2);
	var outsiderPartical3Y = floor((height * 3 / 4));
	outsiderParticals.push(particalMaker(outsiderPartical3X, outsiderPartical3Y));

	var outsiderPartical4X = floor((width * 3 / 4 + height / 4));
	var outsiderPartical4Y = floor((height * 3 / 4) / 3);
	outsiderParticals.push(particalMaker(outsiderPartical4X, outsiderPartical4Y));

	var outsiderPartical5X = floor((width * 3 / 4 + height / 4));
	var outsiderPartical5Y = floor((height * 3 / 4) * 2 / 3);
	outsiderParticals.push(particalMaker(outsiderPartical5X, outsiderPartical5Y));

	var outsiderPartical6X = floor((width * 3 / 4 + height / 4));
	var outsiderPartical6Y = floor((height * 3 / 4));
	outsiderParticals.push(particalMaker(outsiderPartical6X, outsiderPartical6Y));

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
	if (d < 100) {
		//force = min(0.5, 1 / (sigma * sqrt(2 * PI)) * exp(-(d - mu)^2/(2 * sigma^2)))
		var k = 150
		force = min(15, k / d)
		var fX = dx/d * force;
		var fY = dy/d * force;

		p.vx = p.vx + fX;
		p.vy = p.vy + fY;
	}
	
	particalGoingBack(p);
	var rx = random(-0.2, 0.2);
	var ry = random(-0.2, 0.2);
	p.vx = p.vx + rx;
	p.vy = p.vy + ry;

	p.x = p.x + p.vx;
	p.y = p.y + p.vy;

	var air = 0.8
	p.vx = p.vx * air
	p.vy = p.vy * air

}


function particalGoingBack(p) {
	var dx = p.x - p.targetX;
	var dy = p.y - p.targetY;
	var d = max(1, sqrt(dx * dx + dy * dy));

	var force = -d * 0.1;
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

		var redColour = map(p.nearByParticalNum, minNearbyParticals, maxNearbyParticals, 120, 230) + random(-50, 30);

		// two options here, leave at edge more darker, the other is more random
		
		fill(random(120, 240),0,0)

		if (p.nearByParticalNum < 8) {
			fill(redColour,0,0);
		}


		var triSize = 10;
		var angle = random(2*PI);

		var variance = 0.3
		var randomX = random(1 - variance, 1 + 2.5)
		var randomY = random(1 - variance, 1 + 2.5)

		if (p.nearByParticalNum < 8) {
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

		//plot all hidden particals
	for(var i = 0; i < hiddentParticals.length; i++) {
		var dx = hiddentParticals[i].targetX - mouseX;
		var dy = hiddentParticals[i].targetY - mouseY;
		var d = sqrt(dx * dx + dy * dy);
		if (d < 30) {
			noStroke()
			fill(0,0,0)
			ellipse(hiddentParticals[i].x, hiddentParticals[i].y, 8);


			var minimunDistanceOutsiderPartical = outsiderParticals[0];
			var tempDistanceX = outsiderParticals[0].x - hiddentParticals[i].x
			var tempDistanceY = outsiderParticals[0].y - hiddentParticals[i].y
			var minimunDistance = sqrt(tempDistanceX * tempDistanceX + tempDistanceY * tempDistanceY)

			for(var j = 0; j < outsiderParticals.length; j++) {
				var distanceX = outsiderParticals[j].x - hiddentParticals[i].x
				var distanceY = outsiderParticals[j].y - hiddentParticals[i].y
				var distance = sqrt(distanceX * distanceX + distanceY * distanceY)
				if(distance < minimunDistance) {
					minimunDistance = distance
					minimunDistanceOutsiderPartical = outsiderParticals[j]
				}
			}
			stroke(0)
			ellipse(minimunDistanceOutsiderPartical.x, minimunDistanceOutsiderPartical.y, 8);
			line(minimunDistanceOutsiderPartical.x, minimunDistanceOutsiderPartical.y, 
				hiddentParticals[i].x, hiddentParticals[i].y)

			var s = "#standforcanada#cibc#standfortribalscale. #standforcanada#cibc#standfortribalscale. #standforcanada#cibc#standfortribalscale."

			fill(200, 200, 200, 100)
			rect(minimunDistanceOutsiderPartical.x, minimunDistanceOutsiderPartical.y,
				800, 150);

			textSize(30)
			fill(0,0,0)
			text(s,minimunDistanceOutsiderPartical.x, minimunDistanceOutsiderPartical.y,
				800, 150)

			var imageX = minimunDistanceOutsiderPartical.x
			var imageY = minimunDistanceOutsiderPartical.y + 150
			image(testImage, imageX, imageY, testImage.width, testImage.height)

			break
		}
	}


}