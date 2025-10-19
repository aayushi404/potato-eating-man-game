// Game constants
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const PERSON_SIZE = GRID_SIZE;
const POTATO_SIZE = GRID_SIZE;
const INITIAL_SPEED = 150; // Milliseconds per frame

// Game state
let canvas;
let ctx;
let person;
let potatoes;
let score;
let dx, dy; // Direction of movement
let gameInterval;
let gameRunning = false;

// HTML elements
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const gameOverMessage = document.getElementById('gameOverMessage');

function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    person = [{
        x: Math.floor(CANVAS_SIZE / 2 / GRID_SIZE) * GRID_SIZE,
        y: Math.floor(CANVAS_SIZE / 2 / GRID_SIZE) * GRID_SIZE
    }];
    potatoes = [];
    score = 0;
    dx = GRID_SIZE; // Initial movement to the right
    dy = 0;
    gameRunning = false;
    scoreDisplay.textContent = score;
    gameOverMessage.style.display = 'none';
    startButton.textContent = 'Start Game';

    generatePotato();
    draw();
}

function startGame() {
    if (gameRunning) return;

    initGame(); // Reset game state if starting again
    gameRunning = true;
    startButton.textContent = 'Restart Game';
    gameInterval = setInterval(gameLoop, INITIAL_SPEED);
}

function endGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    gameOverMessage.style.display = 'block';
}

function generatePotato() {
    let potatoX, potatoY;
    let collisionWithPerson;

    do {
        potatoX = Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE;
        potatoY = Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE;
        collisionWithPerson = false;
        for (let i = 0; i < person.length; i++) {
            if (person[i].x === potatoX && person[i].y === potatoY) {
                collisionWithPerson = true;
                break;
            }
        }
    } while (collisionWithPerson);

    potatoes.push({
        x: potatoX,
        y: potatoY
    });
}

function draw() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw person (a square for simplicity)
    ctx.fillStyle = 'lightgreen';
    for (let i = 0; i < person.length; i++) {
        ctx.fillRect(person[i].x, person[i].y, PERSON_SIZE, PERSON_SIZE);
    }

    // Draw potatoes
    ctx.fillStyle = 'brown';
    for (let i = 0; i < potatoes.length; i++) {
        ctx.fillRect(potatoes[i].x, potatoes[i].y, POTATO_SIZE, POTATO_SIZE);
    }
}

function gameLoop() {
    if (!gameRunning) return;

    // Move person
    const head = {
        x: person[0].x + dx,
        y: person[0].y + dy
    };

    // Check for wall collision
    if (head.x < 0 || head.x >= CANVAS_SIZE || head.y < 0 || head.y >= CANVAS_SIZE) {
        endGame();
        return;
    }

    // Check for self-collision (if person grows longer)
    for (let i = 1; i < person.length; i++) {
        if (head.x === person[i].x && head.y === person[i].y) {
            endGame();
            return;
        }
    }

    person.unshift(head); // Add new head

    // Check for potato eating
    let atePotato = false;
    for (let i = 0; i < potatoes.length; i++) {
        if (head.x === potatoes[i].x && head.y === potatoes[i].y) {
            score++;
            scoreDisplay.textContent = score;
            potatoes.splice(i, 1); // Remove eaten potato
            generatePotato(); // Generate new potato
            atePotato = true;
            break;
        }
    }

    if (!atePotato) {
        person.pop(); // Remove tail if no potato was eaten
    }

    draw();
}

function changeDirection(event) {
    if (!gameRunning) return;

    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    const goingUp = dy === -GRID_SIZE;
    const goingDown = dy === GRID_SIZE;
    const goingRight = dx === GRID_SIZE;
    const goingLeft = dx === -GRID_SIZE;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -GRID_SIZE;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -GRID_SIZE;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = GRID_SIZE;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = GRID_SIZE;
    }
}

// Event Listeners
document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);

// Initial game setup
initGame();