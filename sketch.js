let stars = []; // Array pentru a stoca „stelele”

function setup() {
  createCanvas(600, 400);
  background(0);
  // Creăm 100 de stele inițiale
  for (let i = 0; i < 100; i++) {
    stars.push(new Star());
  }
}

function draw() {
  background(0, 50); // Fundal negru cu transparență pentru efect de „urmă”

  // Actualizăm și desenăm fiecare stea
  for (let star of stars) {
    star.update();
    star.show();
  }

  // Adăugăm o stea nouă la click-ul mouse-ului
  if (mouseIsPressed) {
    stars.push(new Star(mouseX, mouseY));
  }
}

// Clasa Star pentru a defini comportamentul fiecărei „stele”
class Star {
  constructor(x = random(width), y = random(-50, 0)) {
    this.x = x;
    this.y = y;
    this.size = random(2, 8);
    this.speed = random(1, 4);
    this.color = [random(200, 255), random(200, 255), random(200, 255)]; // Tonuri deschise
  }

  update() {
    this.y += this.speed; // Mișcare în jos
    if (this.y > height) {
      this.y = random(-50, 0); // Resetare sus
      this.x = random(width);
    }
  }

  show() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2]);
    ellipse(this.x, this.y, this.size, this.size);
  }
}
