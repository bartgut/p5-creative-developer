
class Body {
  constructor(x, y) {
    this.position = createVector(x,y)
    this.velocity = createVector(0,0);
    this.acceleration = createVector(0,0);
    this.r = 1;
  }
  
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration = createVector(0,0)
  }
  
  edges() {
    if (this.position.y >= height - this.r) {
      this.position.y = height - this.r;
      this.velocity.y *= -1;
    }

    if (this.position.y <= this.r) {
      this.position.y = this.r;
      this.velocity.y *= -1;
    }

    if (this.position.x >= width - this.r) {
      this.position.x = width-this.r;
      this.velocity.x *= -1;
    }

    if (this.position.x <= this.r) {
      this.position.x = this.r;
      this.velocity.x *= -1;
    }
  }
  
  applyForce(force) {
    this.acceleration.add(force)
  }
  
  draw() {
      stroke(255,100);
      strokeWeight(2);
      fill(255, 100);
      ellipse(this.position.x, this.position.y, this.r);
  }
}

let bodies_count = 700;
let bodies = []
let mag_threshold = 60;

function setup() {
  createCanvas(800, 800);
  for (let i = 0; i<bodies_count; i++) {
    bodies[i] = new Body(random(width), random(height))
    let x = map(random(2), 0, 2, -2, 2)
    let y = map(random(2), 0, 2, -2, 2)
    bodies[i].velocity = createVector(x, y);
  }
}

function draw() {
  background(0)
  for (let i = 0; i<bodies_count; i++) {
    bodies[i].update();
    bodies[i].edges();
    bodies[i].draw()
  }
  
  for (let body of bodies) {
    for (let otherBody of bodies) {
      if (body != otherBody) {
        let direction = p5.Vector.sub(otherBody.position, body.position);
        if (direction.mag() < mag_threshold) {
          let color_pow = map(direction.mag(), 0, mag_threshold, 0, 1)
          let color_alpha = map(direction.mag(), 0, mag_threshold, 256, 0)
          let calculated_color = lerpColor(color('red'), color('blue'), color_pow)
          calculated_color.setAlpha(color_alpha);
          stroke(calculated_color)
          line(body.position.x, body.position.y, otherBody.position.x, otherBody.position.y)
        }
      }
    }
  }
}