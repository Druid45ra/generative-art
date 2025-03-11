let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight); // Canvas pe tot ecranul
  background(0);
  // Creăm un număr de stele proporțional cu dimensiunea ecranului
  let starCount = Math.floor((windowWidth * windowHeight) / 5000); // Ajustabil
  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }
}

function draw() {
  background(0, 50); // Fundal cu transparență

  // Actualizăm și desenăm stelele
  for (let star of stars) {
    star.update();
    star.show();
  }

  // Adăugăm stele noi la click
  if (mouseIsPressed) {
    stars.push(new Star(mouseX, mouseY));
  }
}

// Redimensionare canvas când fereastra se schimbă
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Clasa Star
class Star {
  constructor(x = random(width), y = random(-50, 0)) {
    this.x = x;
    this.y = y;
    this.size = random(2, 8);
    this.speed = random(1, 4);
    this.color = [random(200, 255), random(200, 255), random(200, 255)];
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(-50, 0);
      this.x = random(width);
    }
  }

  show() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2]);
    ellipse(this.x, this.y, this.size, this.size);
  }
}
