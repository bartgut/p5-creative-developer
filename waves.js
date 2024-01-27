let r = [];
let vertices_count = 32;
let circles_count = 10;
let angle = 0;
let wave = 0;
let r_min = 0;
let r_max = 400;
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
  wave = new Wave(10, 100, 0);
  for (let i=0; i<circles_count; i++) {
    r[i] = map(i, 0, circles_count, r_min, r_max);
  }
}


function draw() {
  translate(400, 400);
  background(0, 255)
  //noLoop();
  noFill();
  for (let i=0; i<circles_count; i++) {
    beginShape();
    stroke(255, 255, 255, map(r[i], r_min, r_max, 255, 0))
    for (let pos = 0; pos <= vertices_count; pos++) {
      let vector = p5.Vector.fromAngle(angle).setMag(r[i])
      let y = wave.calculate(vector.x);
      vector.setMag(r[i] + y);
      vertex(vector.x, vector.y);
      angle += TWO_PI/vertices_count
    }
    
    if (r[i] <= r_min) r[i] = r_max
    else r[i] -= 1;
    endShape(CLOSE);
  }
  
  beginShape(LINES);
  for (let i=0; i<circles_count-1; i++) {
    stroke(255, 255, 255, map(r[i], r_min, r_max, 255, 0));
    for (let pos=0; pos<vertices_count; pos++) {
      let vector = p5.Vector.fromAngle(angle).setMag(r[i]);
      let vector1 = p5.Vector.fromAngle(angle + TWO_PI/vertices_count*8).setMag(r[i+1])
      let y1 = wave.calculate(vector.x);
      let y2 = wave.calculate(vector1.x)
      vector.setMag(r[i] + y1)
      vertex(vector.x, vector.y);
      vector1.setMag(r[i+1] + y2)
      vertex(vector1.x, vector1.y);
      angle += TWO_PI/vertices_count;
    }
  }
  endShape();
}