let car;
let traffic = [];
let lanes = [];
let currentLane = 1;
let imgRoad, imgPlayer, imgEnemy;
let carWidth = 80;
let carHeight = 150;

let soundCrash, soundBg;

let score = 0;
let gameOver = false;

let stars = [];

class Car {
  constructor() {
    this.x = lanes[currentLane];
    this.y = 500;
  }

  show() {
    image(imgPlayer, this.x, this.y, carWidth, carHeight);
  }

  moveLeft() {
    if (currentLane > 0) {
      currentLane--;
      this.x = lanes[currentLane];
    }
  }

  moveRight() {
    if (currentLane < lanes.length - 1) {
      currentLane++;
      this.x = lanes[currentLane];
    }
  }

  forward() {
    if (this.y > 100) this.y -= 10;
  }

  backward() {
    if (this.y < 530) this.y += 10;
  }
}


class TrafficCar {
  constructor(x) {
    this.x = x;
    this.y = -carHeight;
    this.speed = 3 + Math.random() * 3;
  }

  show() {
    image(imgEnemy, this.x, this.y, carWidth, carHeight);
  }

  update() {
    this.y += this.speed;
  }

  hit(player) {
    return (
      player.x < this.x + carWidth &&
      player.x + carWidth > this.x &&
      player.y < this.y + carHeight &&
      player.y + carHeight > this.y
    );
  }
}

function setup() {
  createCanvas(480, 680);

  let roadWidth = 280;
  let roadX = (width - roadWidth) / 2;
  let laneWidth = roadWidth / 3;

  for (let i = 0; i < 3; i++) {
    lanes[i] = roadX + laneWidth * i + (laneWidth - carWidth) / 2;
  }

  car = new Car();

  userStartAudio().then(() => {
    if (soundBg) {
      soundBg.setLoop(true);
      soundBg.play();
    }
  });

  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(2, 5),
      speed: random(0.5, 2),
    });
  }
}

function draw() {
  if (gameOver) {
    drawCrashScreen();
    return;
  }

  background(imgRoad);
  car.show();

  for (let i = traffic.length - 1; i >= 0; i--) {
    traffic[i].show();
    traffic[i].update();

    if (traffic[i].hit(car)) {
      if (soundBg && soundBg.isPlaying()) {
        soundBg.stop();
      }
      if (soundCrash) {
        soundCrash.stop();
        soundCrash.play();
      }

      gameOver = true; 
    }

    if (traffic[i].y > height + 200) {
      traffic.splice(i, 1);
      score++;
    }
  }

  if (frameCount % 70 === 0) {
    let lane = random(lanes);
    let canSpawn = true;
    for (let t of traffic) {
      if (t.x === lane && t.y < 200) {
        canSpawn = false;
        break;
      }
    }
    if (canSpawn) {
      traffic.push(new TrafficCar(lane));
    }
  }

  textSize(30);
  fill(255);
  text("Puntos: " + score, 20, 40);
}

function drawCrashScreen() {
  background(0);

  for (let s of stars) {
    fill(255, 255, 0, random(150, 255));
    noStroke();
    ellipse(s.x, s.y, s.size);

    s.y += s.speed;
    if (s.y > height) {
      s.y = 0;
      s.x = random(width);
    }
  }

  textSize(60);
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  text("¡CHOCASTE!", width / 2, height / 2);
}

function preload() {
  imgRoad = loadImage("road.png");
  imgPlayer = loadImage("merc.png");
  imgEnemy = loadImage("car.png");

  soundCrash = loadSound("crash.mp3");
  soundBg = loadSound("background.mp3");
}

function keyPressed() {
  if (!gameOver) {
    if (keyCode === RIGHT_ARROW) car.moveRight();
    else if (keyCode === LEFT_ARROW) car.moveLeft();
    else if (keyCode === UP_ARROW) car.forward();
    else if (keyCode === DOWN_ARROW) car.backward();
  }
}
