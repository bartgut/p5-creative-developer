let gun;
let bullets = [];

class Bullet {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.lifetime = 200;
  }
  
  update() {
    this.position.add(this.velocity); 
  }
  
  show() {
    stroke(255);
    strokeWeight(2);
    ellipse(this.position.x, this.position.y, 2);
  }
}

class Gun {
  constructor() {
    this.position = createVector(); // where it actually aims
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.line1 = createVector(0,0);
    this.line2 = createVector(0,0);
    this.mag1 = 200;
    this.mag2 = 100;
    this.angle = 0;
  }
  
  applyForce(f) {
    this.acc.add(f)
  }
  
  recoil() {
    let recoil = p5.Vector.sub(this.position, this.line1)
    recoil.setMag(-5);
    this.applyForce(recoil);
  }
  
  steer(pointingTo) {
    let force = p5.Vector.sub(pointingTo, this.position);
    let distance = force.mag();
    
    if (distance < 100) {
      force.setMag(map(distance, 0, 100, 0, 10))
    } else {
      force.setMag(10);
    }
    force.sub(gun.vel);
    force.limit(1);
    this.applyForce(force);
  }
  
  calculateLines() {
    if (this.position.mag() < (this.mag1 + this.mag2)) {
      this.angle = acos((this.position.mag()*this.position.mag() + this.mag1*this.mag1 - this.mag2*this.mag2)/(2*this.position.mag()*this.mag1));
      this.line1 = p5.Vector.fromAngle(this.angle + this.position.heading());
      this.line1.setMag(this.mag1);
      this.line2 = p5.Vector.sub(this.position, this.line1)
      this.line2.setMag(this.mag2)
      this.line2.add(this.line1);
      line(0, 0, this.line1.x, this.line1.y);
      ellipse(this.line1.x, this.line1.y, 2);
      line(this.line1.x, this.line1.y, this.line2.x, this.line2.y);
    }
    else {
      this.line1 = p5.Vector.fromAngle(this.position.heading());
      this.line1.setMag(this.mag1);
      this.line2 = p5.Vector.fromAngle(this.position.heading());
      this.line2.setMag(this.mag2);
      this.line2.add(this.line1);
    }
  }
  
  update() {
    this.vel.add(this.acc);
    this.position.add(this.vel);
    this.acc = createVector(0,0);
  }
  
  show() {
    stroke(255);
    strokeWeight(2);
    line(0, 0, this.line1.x, this.line1.y);
    ellipse(this.line1.x, this.line1.y, 2);
    line(this.line1.x, this.line1.y, this.line2.x, this.line2.y);
    ellipse(this.position.x, this.position.y, 10);
  }
  
}

function setup() {
  createCanvas(800, 400);
  gun = new Gun();
  bullet = new Bullet(createVector(0,0), createVector(0,0));
  
}

function mousePressed() {
  let trajectory = p5.Vector.sub(gun.position, gun.line1);
  trajectory.setMag(5);
  let bullet = new Bullet();
  bullet.position = gun.position.copy();
  bullet.velocity = trajectory;
  bullets.push(bullet);
  gun.recoil();
}

function draw() {
  background(0);
  let pointing_at = createVector(mouseX, mouseY);
  let acc_direction = p5.Vector.sub(pointing_at, gun.position);
  let distance = acc_direction.mag();
  
  gun.steer(pointing_at);
  gun.update();
  gun.calculateLines();
  gun.show();
  
  for (let bullet of bullets) {
      bullet.update();
      bullet.show();
      bullet.lifetime -= 1;
  }
  bullets = bullets.filter(bullet => bullet.lifetime > 0);
}