let stars = [];
let shootingStars = [];
let planets = [];
let sun;
let cameraZ; // simulated var for camera depth 
let time = 0; // time var for sine wave oscillation

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  cameraZ = 0;

  // Create stars with depth for parallax effect
  let starCount = Math.floor((windowWidth * windowHeight) / 500);
  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }

  // creating Sun
  sun = new Sun(width / 2, height / 2, 150);

  // creating planets (Name, Base Distance, Size, Color, Orbit Speed)
  planets.push(new Planet("Mercury", 100, 10, '#b0b0b0', 0.04));
  planets.push(new Planet("Venus", 150, 20, '#e6c200', 0.03));
  planets.push(new Planet("Earth", 200, 25, '#3a9ad9', 0.02));
  planets.push(new Planet("Mars", 250, 15, '#d14f36', 0.017));
  planets.push(new Planet("Jupiter", 350, 50, '#d8a17c', 0.008));
  planets.push(new Planet("Saturn", 450, 40, '#e3bf90', 0.006, true));
  planets.push(new Planet("Uranus", 550, 30, '#96d7d9', 0.004));
  planets.push(new Planet("Neptune", 650, 30, '#4365cc', 0.003));


}
function draw() {
  background(0, 80); // Space background

  // Oscillate cameraZ back and forth
  cameraZ = sin(time) * 100; // Adjust amplitude (100) for stronger/weaker movement
  time += 0.02; // Controls speed of oscillation

  // Stars
  for (let star of stars) {
    star.update(cameraZ);
    star.show();
  }

  // Shooting Stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    shootingStars[i].update();
    shootingStars[i].show();
    if (shootingStars[i].x > width || shootingStars[i].y > height) {
      shootingStars.splice(i, 1);
    }
  }

  // Sun
  sun.show();

  // Planets
  for (let planet of planets) {
    planet.updateDistance(); // Oscillate distance for "in and out" effect
    planet.orbit();
    planet.show();
    if (planet.hasRings) planet.showRings();
  }
}
// Redimensionare canvas când fereastra se schimbă
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
// Mouse click creates a shooting star
function mousePressed() {
  // Calculate direction based on mouse position
  let dx = (mouseX - pmouseX) * 0.5 || random(-5, 5); // Default random direction if no movement
  let dy = (mouseY - pmouseY) * 0.5 || random(-5, 5);

  // Add a new shooting star to the array
  shootingStars.push(new ShootingStar(mouseX, mouseY, dx, dy));
}

// Star Class
class Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(0, width);
    this.size = random(3, 6);
    this.speed = 0.05;
  }

  update(cameraZ) {
    this.z -= this.speed * (cameraZ * 0.01);
    if (this.z < 1) {
      this.z = random(width);
      this.x = random(-width, width);
      this.y = random(-height, height);
    }
    if (this.z > width) {
      this.z = random(1, width / 2);
    }
  }

  show() {
    fill(255, 245, 200); // Soft white-gold for beauty
    noStroke();
    let sx = map(this.x / this.z, -1, 1, 0, width);
    let sy = map(this.y / this.z, -1, 1, 0, height);
    let r = map(this.z, 0, width, this.size, 0);
    ellipse(sx, sy, r, r);
  }
}
// ShootingStar Class
class ShootingStar {
  constructor(x, y, dx, dy) {
    this.x = x; // Starting position
    this.y = y;
    this.dx = dx; // Direction of movement
    this.dy = dy;
    this.trail = []; // Store trail points
    this.maxTrailLength = 40; // Maximum length of the trail
    this.colors = [
      color(255, 245, 190),
      color(255, 235, 160),
      color(255, 250, 210),
      color(255, 240, 180),
      color(255, 255, 230)
    ]; // Shooting star palette
    this.color = random(this.colors); // Choosing random color
  }

  update() {
    // Update position
    this.x += this.dx;
    this.y += this.dy;
  
    // Reset position if the shooting star goes out of bounds
    if (this.y > height || this.x > width) {
      this.x = Math.random() * width; // Random x within bounds
      this.y = Math.random() * -50;  // Random y above the visible area
    }
  
    // Add current position to the trail
    this.trail.push({ x: this.x, y: this.y, alpha: 255 });
  
    // Remove excess trail points
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  
    // Gradually fade trail points
    for (let point of this.trail) {
      point.alpha -= 8; // Reduce alpha for fade effect
    }
  }
  
  show() {
    // Draw trail
    for (let i = 0; i < this.trail.length; i++) {
      let point = this.trail[i];
      fill(red(this.color), green(this.color), blue(this.color), point.alpha);
      noStroke();
      ellipse(point.x, point.y, 8 - i * 0.2, 8 - i * 0.2); // Trail points shrink
    }

    // Draw main shooting star
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, 10, 10); // Glowing core of the shooting star
  }
}
// Planet Class
class Planet {
  constructor(name, baseDistance, size, color, orbitSpeed, hasRings = false) {
    this.name = name;
    this.baseDistance = baseDistance;
    this.size = size;
    this.color = color;
    this.orbitSpeed = orbitSpeed;
    this.angle = random(TWO_PI);
    this.oscillation = random(10, 30); // Distance oscillation amplitude
    this.hasRings = hasRings;
  }

  updateDistance() {
    // Oscillate distance to simulate "moving in and out"
    this.distance = this.baseDistance + sin(frameCount * 0.01) * this.oscillation;
  }

  orbit() {
    this.angle += this.orbitSpeed;
  }

  show() {
    let x = width / 2 + cos(this.angle) * this.distance;
    let y = height / 2 + sin(this.angle) * this.distance;

    // Planet Body
    fill(this.color);
    noStroke();
    ellipse(x, y, this.size, this.size);
  }

  showRings() {
    let x = width / 2 + cos(this.angle) * this.distance;
    let y = height / 2 + sin(this.angle) * this.distance;

    noFill();
    stroke(200, 150, 100, 150);
    strokeWeight(2);
    ellipse(x, y, this.size * 2, this.size);
  }
}
// Sun Class
class Sun {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  show() {
    // Enhanced glow
    for (let r = this.size * 1.5; r > this.size; r -= 5) {
      fill(255, 204, 0, map(r, this.size, this.size * 1.5, 150, 0));
      noStroke();
      ellipse(this.x, this.y, r, r);
    }
    fill(255, 204, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }
}
