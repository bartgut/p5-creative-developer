class Body {
    constructor(x,y,m) {
      this.pos = createVector(x,y);
      this.vel = createVector(0,0);
      this.acc = createVector(0,0);
      this.mass = m;
      this.r = sqrt(m) * 2
    }
    
    applyForce(force) {
      let f = p5.Vector.div(force, this.mass);
      this.acc.add(f);
    }
    
    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.set(0,0);
    }
    
    attract(body) {
      let dir = p5.Vector.sub(this.pos, body.pos)
      let distance = constrain(dir.mag(), 5, 25);
      let G = 2;
      let force = G * (this.mass * body.mass) / (distance * distance)
      dir.setMag(force);
      body.applyForce(dir);
    }
    
    show() {
      strokeWeight(2);
      //fill(255, 100);
      ellipse(this.pos.x, this.pos.y, this.r*2);
    }
  }
  
  let bodies = [];
  let sun;
  
  function setup() {
    createCanvas(800, 800);
    pixelDensity(1);
    translate(400, 400);
    for (let i=0; i<100; i++) {
      let dir = p5.Vector.random2D();
      let magnitude = random(300, 350);
      dir.setMag(magnitude);
      bodies[i] = new Body(dir.x, dir.y, 1);
      bodies[i].vel = p5.Vector.rotate(dir, PI/2).setMag(10);
    }
    
    sun = new Body(0, 0, 50);
    background(0);
    strokeWeight(1);
  }
  
  function draw() {
    background(0, 10);
    translate(400, 400);
    
    for (let body of bodies) {
      sun.attract(body);
      let x = noise(body.pos.x, body.pos.y);
      stroke(0, x*255, 0);
      strokeWeight(0.05);
      line(body.pos.x, body.pos.y, sun.pos.x, sun.pos.y);
      body.attract(sun);
      for (let otherBody of bodies) {
        if (body !== otherBody) {
          body.attract(otherBody);

        }
      }
    }
    for (let body of bodies) {
      body.update();
      let x = noise(body.pos.x, body.pos.y)
      let y = noise(body.vel.x, body.vel.y)
      noStroke();
      fill(x*255, y*255, 0);
      body.show();
    }
  
  }