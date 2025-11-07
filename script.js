const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 170, y: 450, width: 60, height: 30, color: "#ff6b6b" };
let fallingItems = [];
let equation = "";
let correctAnswer = 0;
let score = 0;
let speed = 1;
let gameOver = false;

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

function newEquation() {
  let a = Math.floor(Math.random() * 10);
  let b = Math.floor(Math.random() * 10);
  correctAnswer = a + b;
  equation = `${a} + ${b}`;
  document.getElementById("equation").innerText = `Equation: ${equation}`;
}

function generateBox() {
  // Only allow 3 boxes at a time
  if (fallingItems.length >= 3) return;

  const isCorrect = Math.random() < 0.6;
  const value = isCorrect ? correctAnswer : Math.floor(Math.random() * 20);
  fallingItems.push({
    x: Math.random() * (canvas.width - 50),
    y: -30,
    value: value,
    isCorrect: isCorrect,
  });
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBoxes() {
  ctx.fillStyle = "#ffd166";
  ctx.textAlign = "center";
  ctx.font = "18px Arial";

  fallingItems.forEach((box) => {
    ctx.fillRect(box.x, box.y, 50, 30);
    ctx.fillStyle = "#000";
    ctx.fillText(box.value, box.x + 25, box.y + 22);
    ctx.fillStyle = "#ffd166";
  });
}

function moveBoxes() {
  fallingItems.forEach((box) => (box.y += speed));
  fallingItems = fallingItems.filter((box) => box.y < canvas.height);
}

function checkCatch() {
  fallingItems.forEach((box, index) => {
    if (
      box.y + 30 >= player.y &&
      box.x + 50 >= player.x &&
      box.x <= player.x + player.width
    ) {
      if (box.isCorrect) {
        score += 10;
        correctSound.play();
        newEquation();
      } else {
        score -= 5;
        wrongSound.play();
      }
      fallingItems.splice(index, 1);
    }
  });
}

function updateScore() {
  document.getElementById("score").innerText = `Score: ${score}`;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBoxes();
  moveBoxes();
  checkCatch();
  updateScore();

  if (!gameOver) requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= 20;
  if (e.key === "ArrowRight" && player.x + player.width < canvas.width) player.x += 20;
});

setInterval(generateBox, 3000); // new box every 3 seconds
setInterval(() => (speed += 0.1), 10000); // increase difficulty every 10s
newEquation();
gameLoop();
