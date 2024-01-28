let len = 300;
let len2 = 100;
let angle; // 90 degress
let angleV = 0;
let angleA = 0;

let angle2 = 0;
let angle2V = 0;
let angle2A = 0;
let r = 20;
let G = 1;
let pos;
let pos2;
function setup() {
  createCanvas(600, 600);
  angle = PI/4;
  angle2 = PI/2;
  let x = len * sin(angle) + width/2
  let y = len * cos(angle)
  pos = createVector(x,y)
  
  let x2 = len2 * sin(angle2);
  let y2 = len2 * cos(angle2);
  pos2 = p5.Vector.add(pos, createVector(x2, y2));
  
}

function draw() {
  background(0)
  angleA = -1 * G * sin(angle) / len;
  angleV += angleA;
  angle += angleV;
  
  angle2A = -1 * G * sin(angle2) / len2;
  angle2V += angle2A;
  angle2 += angle2V;
  
  pos.x = len * sin(angle) + width/2;
  pos.y = len * cos(angle)
  
  pos2.x = len2 * sin(angle2) + pos.x;
  pos2.y = len2 * cos(angle2) + pos.y;
  
  stroke(255);
  strokeWeight(1);
  line(width/2, 0, pos.x, pos.y);
  line(pos.x, pos.y, pos2.x, pos2.y);
  
  background(0, 10)
  ellipse(pos.x, pos.y, r)
  ellipse(pos2.x, pos2.y, r)
}