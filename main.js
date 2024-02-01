let clouds = [];
let maxClouds = 5;
let cloudSpawnRate = 10;
let frameCounter = 0;
var time;
const d = new Date();
let m = d.getSeconds();

function setup() {
  createCanvas(windowWidth, windowHeight);
  time = ceil(noise(m) * 24);
  //frameRate(30);
}

function draw() {
  const skyA = color(220, 231, 234);
  const skyB = color(223, 220, 234);
  var sky;
  if (time < 12) {
    sky = lerpColor(skyA, skyB, time / 12);
  } else {
    sky = lerpColor(skyB, skyA, time / 12);
  }
  time += 0.05;
  if (time > 24) {
    time = 0;
  }
  background(sky);
  if (frameCounter % cloudSpawnRate === 0 && clouds.length < maxClouds) {
    clouds.push(createCloud());
  }
  if (clouds.length >= maxClouds) {
    console.log("too many clouds");
    clouds.pop();
  }
  for (let cloud of clouds) {
    drawCloud(cloud);
    updateCloud(cloud);
  }
  frameCounter++;
}

function createCloud() {
  return {
    x: random((width * 1) / 11, (width * 10) / 11),
    y: random((height * 1) / 11, (height * 10) / 11),
    size: random(50, 150),
    density: random(0.1, 0.5),
    wetness: random(0.5, 1),
  };
}

function drawCloud(cloud) {
  frameRate(1);
  drawLumpyCloud(cloud);
}

function updateCloud(cloud) {
  let speed = map(cloud.wetness, 0.5, 1, 2, 1);
  cloud.x -= speed;
  if (cloud.x < 0) {
    console.log("cloud overflow");
    clouds.shift();
  }
}

function drawLumpyCloud(cloud) {
  prevXOff = 0;
  prevYOff = 0;

  let lumps = int(cloud.size * 1.5);
  for (let i = 0; i < lumps; i++) {
    let xOff = randomGaussian(
      -cloud.size / (3 + 1.5 * noise(prevXOff, prevYOff)),
      cloud.size / (3 - noise(prevXOff, prevYOff)),
    );
    let yOff = randomGaussian(
      -cloud.size / (4 - noise(prevYOff, prevXOff)),
      cloud.size / (6 + 1.5 * noise(prevYOff, prevXOff)),
    );
    let lumpSize = randomGaussian(random(cloud.size / 8, cloud.size / 7) * 3);
    let lumpAlpha = noise(xOff, yOff) + (cloud.density * 255) / 4;
    fill(255, lumpAlpha);
    noStroke();
    ellipse(cloud.x + xOff, cloud.y + yOff, lumpSize, lumpSize);
    prevXOff = xOff;
    prevYOff = yOff;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
