let r = [];
let vertices_count = 10;
let circles_count = 15;
let angle = 0;
let wave = 0;
let r_min = 0;
let r_max = 600;
let red = 0;
let blue = 0;

class Wave {
  constructor(amp, period, phase) {
    this.amplitude = amp;
    this.period = period;
    this.phase = phase;
  }
  
  calculate(x) {
    return sin(this.phase + TWO_PI*x/this.period) * this.amplitude;
  }
}

function setup() {
  createCanvas(800, 800);
  red = color(255, 0, 0);
  blue = color(0, 0, 255);
  wave = new Wave(5, 50, 0);
  for (let i=0; i<circles_count; i++) {
    r[i] = map(i, 0, circles_count, r_min, r_max);
  }
}


function draw() {
  translate(400, 400);
  background(0, 5)
  //noLoop();
  noFill();
  for (let i=0; i<circles_count; i++) {
    beginShape();
    let mapping = map(r[i], r_min, r_max, 0, 1)
    stroke(lerpColor(red, blue, mapping))
    for (let pos = 0; pos <= vertices_count; pos++) {
      let vector = p5.Vector.fromAngle(angle).setMag(r[i])
      let y = wave.calculate(vector.x);
      vector.setMag(r[i] + y);
      vertex(vector.x, vector.y);
      //r[i] += 0.01;
      angle += TWO_PI/vertices_count
    }
    
    if (r[i] >= r_max) r[i] = r_min
    else r[i] += 1;
    endShape(CLOSE);
  }
}