let img;
let img2;
let img3;
let y = 0;
let starting_points = 500;
let drawing1 = [];
let drawing2 = [];
let center1 = [];
let center2 = []
let size1 = [];
let size2 = [];
let radius = 5;
let bright = 0.7;
let blackVector;
let whiteVector;
let full_loop = 1;
let perlin_const = 0.005
let _frameW = 10;

function preload() {
  img = loadImage('assets/london_p_t.jpg')
  img2 = loadImage('assets/london_t_t.jpg')
}

function prepare_image(img, distance_max, above_distance_color, below_distance_color, roadColors) {
  img.loadPixels();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let pixel = getDirect(img,x,y)
      let color_change = false;
      for (let roadColor of roadColors) {
        let distance = sqrt(pow(pixel.x-roadColor.x,2) + pow(pixel.y-roadColor.y,2) + pow(pixel.z-roadColor.z,2))
        if (distance < distance_max) {
          color_change = true
        }        
      }
      if (color_change == true) {
        img.set(x, y, below_distance_color);
      } else {
        img.set(x, y, above_distance_color);
      }
    }
  }
  img.updatePixels();
}

function setup() {
  createCanvas(img.width, img.height);
  pixelDensity(1);
  blackVector = createVector(0,0,0)
  whiteVector = createVector(255,255,255)
  let roadColors = [createVector(216, 224, 231)]
  let trafficRoadColorGreen = [createVector(20, 224, 151), createVector(43, 205, 146)]
  let trafficRoadColorYellow = createVector(254, 207, 66)
  prepare_image(img, 30, color("black"), color("white"), roadColors);
  prepare_image(img2, 50, color("black"), color("red"), trafficRoadColorGreen)

  for (let i=0; i<=starting_points; i++) {
    drawing1[i] = false;
    drawing2[i] = false;
  }
  background('black')
  loadPixels();
}

function draw() {
  drawRandomRectangularCenters(img, drawing1, center1, size1);
  if (frameCount > 200) {
    drawRandomRectangularCenters(img2, drawing2, center2, size2);
  }
  frame();
}

function drawRandomRectangularCenters(img, drawing, center, size) {
  for (let i=0; i<starting_points; i++) {
    if (drawing[i] == false) {
      let center_x = round(rescaleNoise(noise(perlin_const*full_loop + 1000*i)) * img.width)
      let center_y = round(rescaleNoise(noise(perlin_const*full_loop + 2000*i)) * img.height)
      center[i] = createVector(center_x,center_y);
      drawing[i] = true;
      size[i] = 0;
    } else {
      for (let y = center[i].y - size[i]; y <= center[i].y + size[i]; y++) {
        let pos_left = center[i].x-size[i]
        let pos_right = center[i].x+size[i]
        let img_col = getDirect(img, pos_left, y, bright)
        let img_col2 = getDirect(img, pos_right, y, bright)
        let current1 = getCurrent(pos_left, y)
        let current2 = getCurrent(pos_right, y)

        if (current1.equals(blackVector) || (current1.equals(whiteVector) && !img_col.equals(blackVector))) {
          setDirect(pos_left,y, img_col)
        } 
        if (current2.equals(blackVector) || (current2.equals(whiteVector) && !img_col2.equals(blackVector))) {
          setDirect(pos_right,y, img_col2)

        }
      }
      for (let x = center[i].x - size[i]; x <= center[i].x + size[i]; x++) {
        let pos_down = center[i].y - size[i]
        let pos_up = center[i].y + size[i]
        let img_col = getDirect(img, x, pos_down, bright)
        let img_col2 = getDirect(img, x, pos_up, bright)
        let current1 = getCurrent(x, pos_down)
        let current2 = getCurrent(x, pos_up)
        
        if (current1.equals(blackVector) || (current1.equals(whiteVector) && !img_col.equals(blackVector))) {
          setDirect(x,pos_down, img_col);
        }
        if (current2.equals(blackVector) || (current2.equals(whiteVector) && !img_col2.equals(blackVector))) {
          setDirect(x,pos_up, img_col2)
        }
      }
      if (size[i] >= radius) {
        drawing[i] = false;
        full_loop += 1;
      }
      size[i] += 1
    }
  }
  bright += 0.003
  updatePixels();
}

function getDirect(img, x, y, bright = 1) {
  let pos = 4*x + 4*y*img.width
  let r = img.pixels[pos] * bright
  let g = img.pixels[pos + 1] * bright
  let b = img.pixels[pos + 2] * bright
  return createVector(r,g,b);
}

function setDirect(x,y, value) {
  let pos = 4*x + 4*y*width;
  pixels[pos] = value.x
  pixels[pos+1] = value.y;
  pixels[pos+2] = value.z;
}

function getCurrent(x,y) {
  let pos = 4*x + 4*y*width
  let r = pixels[pos]
  let g = pixels[pos + 1]
  let b = pixels[pos + 2]
  return createVector(r,g,b)
}

function rescaleNoise(x) {
  return (3 - 2*x) * x * x;
}

function frame() {
  strokeWeight(_frameW);
  stroke(255);
  line(0, _frameW/2, width, _frameW/2);
  line(_frameW/2, 0, _frameW/2, height);
  line(0, height - _frameW/2, width, height - _frameW/2);
  line(width - _frameW/2, 0, width - _frameW/2, height);
}
