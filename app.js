const colors = {
    black: 'black',
    green: 'green',
    red: 'red',
    slategrey: 'slategrey',
};

const color_applications = {
    board_border: colors.black,
    board_background: colors.slategrey,
    snake_color: colors.green,
    snake_border: colors.black,
    apple_color: colors.red,
    apple_border: colors.black,
};

const keys = {
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
}
const gameState = {
    horizontalVelocity: 10,
    verticalVelocity: 0,
    appleX: null,
    appleY: null,
    score: 0,
    snake: [
        {x: 200, y: 200},
        {x: 190, y: 200}
    ]
}

const gameboard = document.getElementById('gameboard');

const gameboard_ctx = gameboard.getContext("2d");

const startButton = document.getElementById('start');

const resetButton = document.getElementById('reset');

const scoreHistory = document.getElementById('score-history');

document.addEventListener('keydown', direction)

function onTick() {
    clearCanvas();
    drawApple();
    move_snake();
    drawSnake();
    runGameplayLoop();
}
function runGameplayLoop() {
    if (gameover()) {
        const li = document.createElement('li');
        
        li.textContent = document.getElementById('score').textContent;

        scoreHistory.appendChild(li);

        document.removeEventListener('keydown', direction);

        return alert(`Snake length = ${gameState.snake.length}`);
    
    }

    setTimeout(onTick, 100);
}


function clearCanvas () {
    gameboard_ctx.fillStyle = color_applications.board_background;
    gameboard_ctx.strokestyle = color_applications.board_border;
    gameboard_ctx.fillRect(0, 0, gameboard.width, gameboard.height);
    gameboard_ctx.strokeRect(0, 0, gameboard.width, gameboard.height);
}

function drawSnakePart (snakePart) {
    gameboard_ctx.fillStyle = color_applications.snake_color
    gameboard_ctx.strokestyle = color_applications.snake_border;
    gameboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    gameboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake () {
    gameState.snake.forEach(drawSnakePart);
}

// Render movement
function move_snake () {
    const head = {
        x: gameState.snake[0].x + gameState.horizontalVelocity, 
        y: gameState.snake[0].y + gameState.verticalVelocity
    };
    gameState.snake.unshift(head);
    const ate_food = gameState.snake[0].x === gameState.appleX && gameState.snake[0].y === gameState.appleY;
    if (ate_food) {
        gameState.score += 1;
        document.getElementById('score').innerHTML = gameState.score;
        generate_apple();
    } else {
    gameState.snake.pop();
    }
} 


function direction(event) {
    const keyPressed = event.keyCode;
    const up = gameState.verticalVelocity === -10;
    const down = gameState.verticalVelocity === 10;
    const right = gameState.horizontalVelocity === 10;
    const left = gameState.horizontalVelocity === -10;

 if (keyPressed === keys.ARROW_LEFT && !right) {
     gameState.horizontalVelocity = -10;
     gameState.verticalVelocity = 0;
 }
 if (keyPressed === keys.ARROW_UP && !down) {
     gameState.horizontalVelocity = 0;
     gameState.verticalVelocity = -10;
 }
 if (keyPressed === keys.ARROW_RIGHT && !left) {
     gameState.horizontalVelocity = 10;
     gameState.verticalVelocity = 0;
 }
 if (keyPressed === keys.ARROW_DOWN && !up) {
     gameState.horizontalVelocity = 0;
     gameState.verticalVelocity = 10;
 }
}

function gameover() {
    for (let i = 2; i < gameState.snake.length; i++) {
        if (gameState.snake[i].x === gameState.snake[0].x && 
            gameState.snake[i].y === gameState.snake[0].y) 
        return true;
    }

    const hitLeft = gameState.snake[0].x < 0;
    const hitRight = gameState.snake[0].x > gameboard.width - 10;
    const hitTop = gameState.snake[0].y < 0;
    const hitBottom = gameState.snake[0].y > gameboard.height - 10;
    return hitLeft || hitRight || hitTop || hitBottom
}

function spawn_apple(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) *10;
}

function generate_apple () {
    gameState.appleX = spawn_apple(0, gameboard.width - 10);
    gameState.appleY = spawn_apple(0, gameboard.height - 10);
    gameState.snake.forEach(function apple_ate(part) {
        const ate = part.x == gameState.appleX && part.y == gameState.appleY; 
            if (ate) return spawn_apple();
    });
}

function drawApple () {
    gameboard_ctx.fillStyle = color_applications.apple_color
    gameboard_ctx.strokestyle = color_applications.apple_border
    gameboard_ctx.fillRect(gameState.appleX, gameState.appleY, 10, 10);
    gameboard_ctx.strokeRect(gameState.appleX, gameState.appleY, 10, 10);
}

function startGame() {
    document.addEventListener("keydown", direction);
    
    generate_apple();
    runGameplayLoop();
}


function initializeGame() {
    startButton.addEventListener('click', startGame);
}

function resetGame() {
    clearCanvas();
    drawApple();
    drawSnake();
    move_snake();
    generate_apple();
    document.addEventListener('keydown', direction)
}

function reset() {
    resetButton.addEventListener('click', resetGame);
}

initializeGame();
reset();