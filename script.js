Const canvas = document.getElementById(“game-board”);
Const ctx = canvas.getContext(“2d”);

Const scoreDisplay = document.getElementById(“score”);
Const highScoreDisplay = document.getElementById(“high-score”);
Const message = document.getElementById(“message”);
Const startButton = document.getElementById(“start-button”);
Const pauseButton = document.getElementById(“pause-button”);
Const difficulty = document.getElementById(“difficulty”);

// Game settings
Const TILE_SIZE = 15;

Let columns = 20;
Let rows = 20;

Let snake = [];
Let food = {};

Let dx = 1;
Let dy = 0;

Let score = 0;
Let highScore = Number(localStorage.getItem(“snakeHighScore”)) || 0;

Let gameLoop = null;
Let running = false;
Let paused = false;

// Display saved high score
highScoreDisplay.textContent = highScore;

// ==============================
// RESPONSIVE BOARD
// ==============================

Function resizeBoard() {
Const section = document.querySelector(“.board-section”);

If (!section) return;

Const width = section.clientWidth;
Const height = section.clientHeight;

If (width <= 0 || height <= 0) return;

Const pixelRatio = window.devicePixelRatio || 1;

// Keep the game grid square
Const availableSize = Math.floor(Math.min(width, height));
Const tileCount = Math.max(5, Math.floor(availableSize / TILE_SIZE));

Columns = tileCount;
Rows = tileCount;

Const boardSize = tileCount * TILE_SIZE;

Canvas.width = Math.round(boardSize * pixelRatio);
Canvas.height = Math.round(boardSize * pixelRatio);

Canvas.style.width = `${boardSize}px`;
Canvas.style.height = `${boardSize}px`;

Ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

// Keep the snake inside the resized board
If (snake.length > 0) {
    Snake = snake.map(part => ({
        X: Math.min(part.x, columns – 1),
        Y: Math.min(part.y, rows – 1)
    }));

    If (
        !food ||
        Snake.some(part => part.x === food.x && part.y === food.y)
    ) {
        placeFood();
    }

    drawGame();
}

}

// ==============================
// RESET GAME
// ==============================

Function resetGame() {
Const centerX = Math.floor(columns / 2);
Const centerY = Math.floor(rows / 2);

Snake = [
    { x: centerX, y: centerY },
    { x: centerX – 1, y: centerY },
    { x: centerX – 2, y: centerY }
];

Dx = 1;
Dy = 0;

Score = 0;
scoreDisplay.textContent = score;

placeFood();
drawGame();

}

// ==============================
// PLACE FOOD
// ==============================

Function placeFood() {
Const emptyTiles = [];

For (let y = 0; y < rows; y++) {
    For (let x = 0; x < columns; x++) {
        Const occupied = snake.some(
            Part => part.x === x && part.y === y
        );

        If (!occupied) {
            emptyTiles.push({ x, y });
        }
    }
}

If (emptyTiles.length === 0) {
    endGame(true);
    return;
}

Food = emptyTiles[
    Math.floor(Math.random() * emptyTiles.length)
];

}

// ==============================
// DRAW GAME
// ==============================

Function drawGame() {
Ctx.fillStyle = “#080d19”;
Ctx.fillRect(0, 0, columns * TILE_SIZE, rows * TILE_SIZE);

// Draw food
Ctx.fillStyle = “#ff477e”;
Ctx.shadowColor = “#ff477e”;
Ctx.shadowBlur = 10;

Ctx.fillRect(
    Food.x * TILE_SIZE + 2,
    Food.y * TILE_SIZE + 2,
    TILE_SIZE – 4,
    TILE_SIZE – 4
);

// Draw snake
Snake.forEach((part, index) => {
    Ctx.fillStyle = index === 0 ? “#ffffff” : “#00ffae”;

    Ctx.shadowColor = “#00ffae”;
    Ctx.shadowBlur = index === 0 ? 12 : 6;

    Ctx.fillRect(
        Part.x * TILE_SIZE + 1,
        Part.y * TILE_SIZE + 1,
        TILE_SIZE – 2,
        TILE_SIZE – 2
    );
});

Ctx.shadowBlur = 0;

}

// ==============================
// MOVE SNAKE & CHECK COLLISIONS
// ==============================

Function updateGame() {
Const head = {
X: snake[0].x + dx,
Y: snake[0].y + dy
};

Const ateFood =
    Head.x === food.x &&
    Head.y === food.y;

// Wall collision
Const hitWall =
    Head.x < 0 ||
    Head.x >= columns ||
    Head.y < 0 ||
    Head.y >= rows;

// Body collision
// The tail can move away if the snake isn’t eating.
Const bodyToCheck = ateFood
    ? snake
    : snake.slice(0, -1);

Const hitSelf = bodyToCheck.some(
    Part => part.x === head.x && part.y === head.y
);

If (hitWall || hitSelf) {
    endGame();
    return;
}

// Move snake
Snake.unshift(head);

If (ateFood) {
    Score += 10;
    scoreDisplay.textContent = score;

    // Save high score
    If (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;

        localStorage.setItem(“snakeHighScore”, highScore);
    }

    placeFood();

    if (!running) return;
} else {
    Snake.pop();
}

drawGame();

}

// ==============================
// START / RESTART GAME
// ==============================

Function startGame() {
clearInterval(gameLoop);

resizeBoard();
resetGame();

running = true;
paused = false;

startButton.textContent = “↻ RESTART”;
pauseButton.textContent = “Ⅱ PAUSE”;

message.textContent = “Eat the pink food!”;

gameLoop = setInterval(
    updateGame,
    Number(difficulty.value)
);

}

// ==============================
// END GAME
// ==============================

Function endGame(won = false) {
clearInterval(gameLoop);
gameLoop = null;

running = false;
paused = false;

if (won) {
    message.textContent = `YOU WIN! Score: ${score}`;
} else {
    Message.textContent = `GAME OVER! Score: ${score}`;
}

startButton.textContent = “▶ PLAY AGAIN”;
pauseButton.textContent = “Ⅱ PAUSE”;

}

// ==============================
// PAUSE / RESUME
// ==============================

Function togglePause() {
If (!running) return;

If (!paused) {
    clearInterval(gameLoop);
    gameLoop = null;

    paused = true;

    message.textContent = “GAME PAUSED”;
    pauseButton.textContent = “▶ RESUME”;
} else {
    Paused = false;

    Message.textContent = “Keep going!”;
    pauseButton.textContent = “Ⅱ PAUSE”;

    gameLoop = setInterval(
        updateGame,
        Number(difficulty.value)
    );
}

}

// ==============================
// CHANGE DIRECTION
// ==============================

Function changeDirection(direction) {
If (!running || paused) return;

If (direction === “up” && dy !== 1) {
    Dx = 0;
    Dy = -1;
} else if (direction === “down” && dy !== -1) {
    Dx = 0;
    Dy = 1;
} else if (direction === “left” && dx !== 1) {
    Dx = -1;
    Dy = 0;
} else if (direction === “right” && dx !== -1) {
    Dx = 1;
    Dy = 0;
}

}

// ==============================
// LAPTOP KEYBOARD CONTROLS
// ==============================

Document.addEventListener(“keydown”, event => {
Const key = event.key.toLowerCase();

Const arrowKeys = [
    “arrowup”,
    “arrowdown”,
    “arrowleft”,
    “arrowright”
];

If (arrowKeys.includes(key)) {
    Event.preventDefault();
}

If (key === “p” || key === “escape”) {
    togglePause();
    return;
}

If (key === “arrowup” || key === “w”) {
    changeDirection(“up”);
} else if (key === “arrowdown” || key === “s”) {
    changeDirection(“down”);
} else if (key === “arrowleft” || key === “a”) {
    changeDirection(“left”);
} else if (key === “arrowright” || key === “d”) {
    changeDirection(“right”);
}

});

// ==============================
// PHONE SWIPE CONTROLS
// ==============================

Let touchStartX = 0;
Let touchStartY = 0;

Canvas.addEventListener(“touchstart”, event => {
Const touch = event.changedTouches[0];

touchStartX = touch.clientX;
touchStartY = touch.clientY;

}, { passive: true });

Canvas.addEventListener(“touchend”, event => {
If (!running || paused) return;

Const touch = event.changedTouches[0];

Const differenceX = touch.clientX – touchStartX;
Const differenceY = touch.clientY – touchStartY;

If (
    Math.abs(differenceX) < 15 &&
    Math.abs(differenceY) < 15
) {
    Return;
}

If (Math.abs(differenceX) > Math.abs(differenceY)) {
    changeDirection(differenceX > 0 ? “right” : “left”);
} else {
    changeDirection(differenceY > 0 ? “down” : “up”);
}

}, { passive: true });

// ==============================
// BUTTONS & DIFFICULTY
// ==============================

startButton.addEventListener(“click”, startGame);

pauseButton.addEventListener(“click”, togglePause);

difficulty.addEventListener(“change”, () => {
if (running && !paused) {
clearInterval(gameLoop);

    gameLoop = setInterval(
        updateGame,
        Number(difficulty.value)
    );
}

});

// ==============================
// RESPONSIVE RESIZING
// ==============================

Const boardSection = document.querySelector(“.board-section”);

If (boardSection && “ResizeObserver” in window) {
New ResizeObserver(() => {
resizeBoard();
}).observe(boardSection);
}

Window.addEventListener(“resize”, resizeBoard);

// ==============================
// INITIAL SCREEN
// ==============================

resizeBoard();
resetGame();

message.textContent = “Press PLAY to start”;

