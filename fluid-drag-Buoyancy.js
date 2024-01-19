class Liquid {
    constructor(x, y, w, h, c,d ) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.c = c;
      this.d = d;
    }
    
    show() {
      noStroke();
      fill(255, 100);
      rect(this.x, this.y, this.w, this.h);
    }
    
    contains(mover) {
      let pos = mover.pos;
      
      return (pos.x > this.x && pos.x < this.x + this.w &&
             pos.y > this.y && pos.y < this.y + this.h);
    }
    
    calculateDrag(mover) {
      let drag = p5.Vector.normalize(mover.vel);
      let speed = mover.vel.mag()
      let frontalSurface = PI * mover.r;
      drag.mult(-1 * speed * speed * this.c * frontalSurface).limit(speed);
      return drag
    }
    
    calculateBuoyancy(mover) {
      let g = 1;
      let V = PI * mover.r * mover.r;
      return createVector(0, -1 * this.d*g*V)
    }
    
  }
  
  class Walker {
    constructor(x,y,m) {
      this.pos = createVector(x,y);
      this.vel = createVector(0,0);
      this.acc = createVector(0,0);
      this.mass = m;
      this.r = sqrt(m) * 10
    }
    
    applyForce(force) {
      let f = p5.Vector.div(force, this.mass);
      this.acc.add(f);
    }
    
    friction() {
      let diff = height - (this.pos.y + this.r);
      if (diff < 1) {
        let force = this.vel.copy();
        force.normalize();
        force.mult(-1);
        
        let mu = 0.1;
        let normal = this.mass;
        force.setMag(mu * normal);
        this.applyForce(force);
      }
    }
    
    edges() {
      if (this.pos.y >= height - this.r) {
        this.pos.y = height-this.r;
        this.vel.y *= -1;
      }
      
      //if (this.pos.y <= this.r) {
      //  this.pos.y = this.r;
      //  this.vel.y *= -1;
      //}
      
      if (this.pos.x >= width - this.r) {
        this.pos.x = width-this.r;
        this.vel.x *= -1;
      }
      
      if (this.pos.x <= this.r) {
        this.pos.x = this.r;
        this.vel.x *= -1;
      }
    }
    
    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.set(0,0);
    }
    
    show() {
      stroke(255,100);
      strokeWeight(2);
      fill(255, 100);
      ellipse(this.pos.x, this.pos.y, this.r*2);
    }
  }
  
  let walker1;
  let walker2;
  
  let liquid;
  
  function setup() {
    createCanvas(400, 400);
    walker1 = new Walker(200,-400,2);
    walker2 = new Walker(100, -400,4);
    liquid = new Liquid(0, height/2, width, height/2, 0.05, 0.01);
    background(0);
  }
  
  function draw() {
    v = p5.Vector.random2D();
    let gravity = createVector(0,2);
    let weightA = p5.Vector.mult(gravity, walker1.mass);
    let weightB = p5.Vector.mult(gravity, walker2.mass);
    walker1.applyForce(weightA);
    walker2.applyForce(weightB);
    
    liquid.show();
    
    if (liquid.contains(walker1)) {
      walker1.applyForce(liquid.calculateDrag(walker1));
      walker1.applyForce(liquid.calculateBuoyancy(walker1));
    }
    
    if (liquid.contains(walker2)) {
      walker2.applyForce(liquid.calculateDrag(walker2)); 
      walker2.applyForce(liquid.calculateBuoyancy(walker2));
    }  
    background(0)
    walker1.update();
    walker1.edges();
    walker1.show();
    
    walker2.update();
    walker2.edges();
    walker2.show();
    
    liquid.show();
  }