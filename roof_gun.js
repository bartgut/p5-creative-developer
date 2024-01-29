let gun;
let bullet;

class Bullet {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
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
    recoil.setMag(-40);
    this.applyForce(recoil);
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
    this.vel = createVector(0,0);
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
  bullet.position = gun.position.copy();
  bullet.velocity = trajectory;
  gun.recoil();
}

function draw() {
  background(0);
  let pointing_at = createVector(mouseX, mouseY);
  let acc_direction = p5.Vector.sub(pointing_at, gun.position);
  if (acc_direction.mag() > 10) {
      acc_direction.setMag(5);
      gun.applyForce(acc_direction);
  }

  gun.update();
  gun.calculateLines();
  gun.show();
  
  bullet.update();
  bullet.show();
}