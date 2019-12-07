let pg;

function setup() {
  createCanvas(innerWidth, innerHeight);
  pg = createGraphics(innerWidth, innerHeight);
  textSize(80);
  textAlign(CENTER, CENTER);
}

function draw() {
  //fill(255)
  //rect(0,0,innerWidth, innerHeight)
  fill(23,23,23)
  noStroke()
  if(frameCount%100>50){
      fill(46,46,46);
  }
  else{
      fill(255,255,255);
  }
  ellipse(innerWidth/2, innerHeight/2, 100,100);

  fill(0);
  textAlign(CENTER);
  drawWords(innerWidth * 0.5);
}

function drawWords(x) {
  fill(255);
  text('ichi', x, 80 );
  text('ni',   x, 160);
  text('san',  x, 240);
  text('shi',  x, 320);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
