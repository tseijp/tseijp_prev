from django.urls import reverse_lazy
grids = [
    {
        'head'   :'Applications',
        'word'   :'development',
        'text'   : '',
        'link'   : '',
        'back'   : 'https://res.cloudinary.com/dpimrj9cp/image/upload/v1555328347/IMG_0840.jpg'
    },
    {
        'head'   :'design',
        'word'   :'krita',
        'text'   : '',
        'link'   : '',
        'back'   : 'http://www.publicdomainpictures.net/pictures/160000/velka/night-forest-1457192053NrD.jpg'
    },
    {
        'head'   :'Sci-Tech',
        'word'   :'radio',
        'text'   : '',
        'link'   : '',
        'back'   : 'https://res.cloudinary.com/dpimrj9cp/image/upload/v1555328175/IMG_E0749.jpg'
    },
    {
        'head'   :'another',
        'word'   :'freerun',
        'text'   : '',
        'link'   : '',
        'back'   : 'https://res.cloudinary.com/dpimrj9cp/image/upload/v1555328364/IMG_0550.jpg'
    },
]
works= [
    {
        'head'   : 'OpenCW',
        'word'   : 'Open Course Ware platform.',
        'text'   : 'OpenCW is a mobile learning platform. Everyone can be a caller right away.',
        'link'   : '',
        'link'   : reverse_lazy('home'),
        'back'   : 'https://images.pexels.com/photos/1471748/pexels-photo-1471748.jpeg?cs=srgb&dl=black-background-blue-bright-1471748.jpg&fm=jpg',
    },
    {
        'head'   : 'my-pytorch-ssd',
        'word'   : 'RaspberryPi communicates using Object Detection and Emotion Recognition.',
        'text'   : 'Two combinations of object detection using PyTorch and YOLO and distance estimation based on stereo matching with a two-lens camera.',
        'link'   : '',
        'link'   : 'https://github.com/YouseiTakei/my-pytorch-ssd',
        'back'   : 'https://images.pexels.com/photos/1270954/pexels-photo-1270954.jpeg?cs=srgb&dl=4k-wallpaper-art-artistic-1270954.jpg&fm=jpg',
    },
    {
        'head'   : 'my-pytorch-tutorial',
        'word'   : 'Text Checker Using Natural Language Processing',
        'text'   : 'The notebook of learned Deep learning such as GAN, CNN, LSTM.',
        'link'   : 'https://github.com/YouseiTakei/pytorch_yanai',
        'back'   : 'https://images.pexels.com/photos/1471748/pexels-photo-1471748.jpeg?cs=srgb&dl=black-background-blue-bright-1471748.jpg&fm=jpg',
    },
    {
        'head'   : 'my-keyhac-config',
        'word'   : 'Key customization tool',
        'text'   : '',
        'link'   : 'https://github.com/YouseiTakei/KeyHac',
        'back'   : 'https://images.pexels.com/photos/990826/pexels-photo-990826.jpeg?cs=srgb&dl=art-artistic-background-990826.jpg&fm=jpg',
    },
    {
        'head'   : 'Habook',
        'word'   : 'My House Account Book using OCR(Optical Character Recognition).',
        'text'   : '',
        'link'   : 'https://habook.herokuapp.com/account/?year=2019&month=3',
        'back'   : 'https://images.pexels.com/photos/1328891/pexels-photo-1328891.jpeg?cs=srgb&dl=art-artistic-background-1328891.jpg&fm=jpg',
    },
    {
        'head'   : 'Expy',
        'word'   : 'Coming soon',
        'text'   : '',
        'link'   : 'https://github.com/YouseiTakei/expy',
        'back'   : 'https://images.pexels.com/photos/1020315/pexels-photo-1020315.jpeg?cs=srgb&dl=art-artistic-background-1020315.jpg&fm=jpg',
    },
]

















### ----------------------------------------------------------------------------
###
###              p5
###
### ----------------------------------------------------------------------------
p5s = [
{'text': """
const count = 17;
let flakes = [];
let bgCol;

function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke(255);
    strokeWeight(1);
    bgCol = color(20, 0, 10, 255);

    for (let i = 0; i < count; i++) {
        flakes[i] = {};
        flakes[i].n = 12;
        initFlake(i);
        flakes[i].pos.x = random(width);
        flakes[i].pos.y = random(height);
    }
}

function draw() {
    background(bgCol);
    for (let i = 0; i < flakes.length; i++) {
        push();
        translate(flakes[i].pos.x, flakes[i].pos.y);
        rotate(frameCount / flakes[i].rotspeed);
        for (let j = 0; j < 100 + 100 * (flakes[i].r / 2 - 5); j++) {
            let next = random(flakes[i].points);
            if (flakes[i].allowPp == true || next !== flakes[i].previous) {
                flakes[i].current.x = lerp(flakes[i].current.x, next.x, flakes[i].percent);
                flakes[i].current.y = lerp(flakes[i].current.y, next.y, flakes[i].percent);
                point(flakes[i].current.x, flakes[i].current.y);
            }
            flakes[i].previous = next;
        }
        pop();
        flakes[i].pos.y += flakes[i].speed;
        flakes[i].pos.x += noise(flakes[i].noiseSd) * 3 - 1.4;
        flakes[i].noiseSd += 0.005;
        if (flakes[i].pos.y > height + flakes[i].r * flakes[i].multVal) {
            initFlake(i);
        }
    }
}

function initFlake(i) {
    flakes[i].r = random(10, 25);
    flakes[i].percent = random(0.68, 0.84);
    flakes[i].multVal = random(1.1, 2.2);
    flakes[i].points = initPoints(flakes[i].n, flakes[i].r, flakes[i].multVal);;
    flakes[i].pos = createVector(random(width / 3, width / 3 * 2), -flakes[i].r * flakes[i].multVal);
    flakes[i].current = createVector();
    flakes[i].previous = createVector();
    flakes[i].allowPp = getBool(.5);
    flakes[i].speed = random(.5, 1.5);
    flakes[i].rotspeed = random(20, 150);
    flakes[i].noiseSd = random(1, 1000);
    flakes[i].points = initPoints(flakes[i].n, flakes[i].r, flakes[i].multVal);
    if (getBool(.5)) {
        flakes[i].rotspeed = -(flakes[i].rotspeed);
    }
    if (getBool(.5)) {
        flakes[i].percent = 2 - (flakes[i].percent);
    }
}

function initPoints(n, r, m) {
    let tmpArr = [];
    for (let i = 0; i < n; i++) {
        let angle = i * TWO_PI / n;
        let v = p5.Vector.fromAngle(angle);
        if (i % 2 !== 0) {
            v.mult(r);
        } else {
            v.mult(r * m);
        }
        tmpArr.push(v);
    }
    return tmpArr;
}

function getBool(p) {
    if (random() < p) {
        return true;
    } else {
        return false;
    }
}
"""},
{'text': """
var w = innerWidth;
var h = innerHeight;
var triSize = 20;
var miniTriSize = triSize / 2;
var span = triSize * 2;
function setup() {
  createCanvas(w, h);
  background(255);//white
}

function draw() {
  noLoop();
  background(255);
  for(x = 0; x < w; x += span){
    for(y = 0; y < h; y += span){
      push();
      translate(x, y);
      drawTidori();
      pop();
    }
  }
}

function drawTidori(){
  fill(0);
  noStroke();
  triangle(0, triSize, triSize, 0, triSize, triSize);
  rect(triSize, 0, triSize, triSize);
  triangle(triSize, triSize, triSize * 2, triSize, triSize, triSize * 2);
  triangle(triSize * 2, 0, triSize * 2 - miniTriSize, 0, triSize * 2, -miniTriSize);
  triangle(triSize * 2, 0, triSize * 2 + miniTriSize, 0, triSize * 2, miniTriSize);
  fill(255);
  triangle(triSize, triSize, triSize - miniTriSize, triSize, triSize, triSize - miniTriSize);
  triangle(triSize, triSize, triSize + miniTriSize, triSize, triSize, triSize + miniTriSize);
}
"""},
{'text': """
var w = 400;
var h = 400;
var point1 = new Array(2);
var point2 = new Array(2);
var d;
var r = 200;
var seed1;
var seed2;
function setup() {
  createCanvas(w, h);
  background(255);//white
  d = TWO_PI / 360;
  seed1 = random();
  seed2 = random();
}

function draw() {
  push();
  translate(w / 2, h / 2);
  var n1 = noise(seed1 + 0.02 * frameCount) * r;
  var n2 = noise(seed2 + 0.02 * frameCount) * r;
  point1[0] = cos(d * frameCount) * n1;
  point1[1] = sin(d * frameCount) * n1;
  point2[0] = cos(d * frameCount + HALF_PI) * n2;
  point2[1] = sin(d * frameCount + HALF_PI) * n2;
  stroke(frameCount / 5);
  if(frameCount > 1250){
    noLoop();
  }
  line(point1[0],point1[1],point2[0],point2[1]);
  pop()
}
"""},
{'text': """
var w = 450;
var h = 400;
var lines = [[w/2, 0, w/2,h]];
var fixedLines = [];
var fixedRate = 3;
var theta;
var newLines = [];
function setup() {
  createCanvas(w, h);
  background(255);//white
  frameRate(2);
  strokeWeight(1);
  theta = TWO_PI / 20;
}

function draw() {
  background(255);
  for(k=0;k < fixedLines.length;k++){
    line(fixedLines[k][0],fixedLines[k][1],fixedLines[k][2],fixedLines[k][3]);
  }
  for(i = 0; i < lines.length; i++){
    line(lines[i][0],lines[i][1],lines[i][2],lines[i][3]);
    lineParts = createLines(lines[i]);
    for(j = 0; j< lineParts.length; j++){
      newLines.push(lineParts[j]);
    }
  }
  lines = newLines;
  newLines = [];
  if(frameCount === 15){
    noLoop();
  }
}

function createLines(l){
  var branchPoint = [(l[0] + l[2] * fixedRate) / (1 + fixedRate), (l[1] + l[3] * fixedRate) / (1 + fixedRate)];

  var fixedLine = [l[2], l[3], branchPoint[0], branchPoint[1]];

  var v1 = l[0] - branchPoint[0];
  var v2 = l[1] - branchPoint[1];

  var u1 = v1 * cos(-theta) - v2 * sin(-theta) + branchPoint[0];
  var u2 = v1 * sin(-theta) + v2 * cos(-theta) + branchPoint[1];
  var l1 = [u1, u2, branchPoint[0], branchPoint[1]];

  var w1 = v1 * cos(theta) - v2 * sin(theta) + branchPoint[0];
  var w2 = v1 * sin(theta) + v2 * cos(theta) + branchPoint[1];
  var l2 = [w1, w2, branchPoint[0], branchPoint[1]];

  fixedLines.push(fixedLine);
  return [l1, l2];
}
"""},
{'text': """
var w = innerWidth;
var h = innerHeight/2;
var lines = [[0,h - 10, w, h - 10]];
var newLines = [];
function setup() {
  createCanvas(w, h);
  background(255);//white
  frameRate(1);
  strokeWeight(0.5);
}

function draw() {
  background(255);
  console.log(lines.length);
  for(i = 0; i < lines.length; i++){
    line(lines[i][0],lines[i][1],lines[i][2],lines[i][3]);
    lineParts = createLines(lines[i]);
    for(j = 0; j< lineParts.length; j++){
      newLines.push(lineParts[j]);
    }
  }
  lines = newLines;
  newLines = [];
  if(frameCount === 8){
    noLoop();
  }
}

function createLines(l){
  var a = l[0];
  var b = l[1];
  var c = l[2];
  var d = l[3];
  var v1 = (c - a) / 3;
  var v2 = (d - b) / 3;
  var u1 =  v1 * cos(-PI / 3) - v2 * sin(-PI / 3);
  var u2 =  v1 * sin(-PI / 3) + v2 * cos(-PI / 3);
  var l1 = [a, b, a + v1, b + v2];
  var l2 = [a + v1,  b + v2, a + v1 + u1, b + v2 + u2];
  var l3 = [a + v1 + u1, b + v2 + u2, a + v1 * 2, b + v2 * 2];
  var l4 = [a + v1 * 2, b + v2 * 2, c, d];
  return [l1, l2, l3, l4];
}

function mousePressed(){
  lines = [[0,h - 10, w, h - 10]];
  newLines = [];
  loop();
}
"""},

{'text': """
var branch = [];
var offset = -90.0;
var count;
var s_color;
var s_weight;
function setup () {
	pixelDensity (displayDensity ());
	createCanvas (windowWidth, windowHeight);
	background (255);
	colorMode (RGB, 255, 255, 255, 100);
	branch.push (new CreateBranch (width / 2, height, width / 2, height - 80.0, 80.0, 0.0));
	count = 0;
	s_color = 0;
	s_weight = 0;
}
function draw () {
	for (var i = 0; i < branch.length; i++) {
		branch[i].render ();
		branch[i].update ();
	}
}
function CreateBranch (sx, sy, ex, ey, sl, sd) {
	var startx = sx;
	var starty = sy;
	var endx = ex;
	var endy = ey;
	var length = sl;
	var degree = sd;;
	var nextx = startx;
	var nexty = starty;
	var prevx = startx;
	var prevy = starty;
	var next_flag = true;
	var draw_flag = true;
	this.update = function () {
		nextx += (endx - nextx) * 0.4;
		nexty += (endy - nexty) * 0.4;
		s_color = int (count / 10.0);
		s_weight = 3.0 / (count / 100 + 1);
		if (abs (nextx - endx) < 1.0 && abs (nexty - endy) < 1.0 && next_flag == true) {
			next_flag = false;
			draw_flag = false;
			nextx = endx;
			nexty = endy;
			var num = int (random (2, 4));
			for (var i = 0; i < num; i++) {
				var sx = endx;
				var sy = endy;
				var sl = random (random (10.0, 20.0), length * 0.99);
				var sd = random (-24.0, 24.0);
				var ex = sx + sl * cos (radians (sd + degree + offset));
				var ey = sy + sl * sin (radians (sd + degree + offset));
				branch.push (new CreateBranch (sx, sy, ex, ey, sl, sd + degree));
			}
			count += 1;
		}
		if (branch.length > 6000) {
			count = 0;
			s_color = 0;
			s_weight = 0;
			var sx = random (width);
			var sl = random (0.0, 180.0);
			branch = [];
			branch.push (new CreateBranch (sx, height, sx, height - sl, sl, 0.0));
		}
	}
	this.render = function () {
		if (draw_flag == true) {
			stroke (s_color);
			strokeWeight (s_weight);
			line (prevx, prevy, nextx, nexty);
		}
		prevx = nextx;
		prevy = nexty;
	}
}
"""}
]
