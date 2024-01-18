class Walker {
    constructor(x,y,m) {
      this.pos = createVector(x,y);
      this.vel = createVector(0,0);
      this.acc = createVector(0,0);
      this.mass = m;
      this.r = sqrt(m) * 10
    }
    
    applyForce(force) {
      //force.div(this.mass);
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
      
      if (this.pos.y <= this.r) {
        this.pos.y = this.r;
        this.vel.y *= -1;
      }
      
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
  
  function setup() {
    createCanvas(400, 400);
    walker1 = new Walker(200,200,2);
    walker2 = new Walker(100,200,4);
    background(0);
  }
  
  function draw() {
    v = p5.Vector.random2D();
    let gravity = createVector(0,1);
    let buoyantForce = createVector(0,-2.1);
    let weightA = p5.Vector.mult(gravity, walker1.mass);
    let weightB = p5.Vector.mult(gravity, walker2.mass);
    walker1.applyForce(weightA);
    walker1.applyForce(buoyantForce);
    walker2.applyForce(weightB);
    walker2.applyForce(buoyantForce);
  
    let wind = createVector(noise(frameCount, frameCount));
    wind.sub(0.5);
    walker1.applyForce(wind);
    walker2.applyForce(wind);
    
    if (mouseIsPressed) { // fan effect
      let mouse = createVector(mouseX, mouseY);
      let dir = p5.Vector.sub(walker1.pos, mouse);
      dir.setMag(1);
      walker1.applyForce(dir);
      walker2.applyForce(dir);
    }
    
    walker1.friction();
    walker2.friction();
    background(0)
    walker1.update();
    walker1.edges();
    walker1.show();
    
    walker2.update();
    walker2.edges();
    walker2.show();
  }