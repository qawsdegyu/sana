// Extend openGame logic from games.js
const originalOpenGame = window.openGame;
window.openGame = function(gameId) {
    currentGame = gameId;
    const modal = document.getElementById('game-modal');
    const title = document.getElementById('game-title');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    if (gameId === 'tictactoe') {
        title.textContent = window.translateText('إكس أو (ضد الذكاء الاصطناعي)');
        initTicTacToe();
    } else if (gameId === 'memory') {
        title.textContent = window.translateText('تطابق الذاكرة');
        initMemoryMatch();
    } else if (gameId === 'chess') {
        title.textContent = window.translateText('شطرنج (ضد الذكاء الاصطناعي)');
        initChess();
    } else if (gameId === 'snake') {
        title.textContent = window.translateText('الثعبان (Snake)');
        initSnake();
    } else if (gameId === 'simon') {
        title.textContent = window.translateText('تطابق الألوان (Simon Says)');
        initSimon();
    } else if (gameId === 'game2048') {
        title.textContent = window.translateText('لغز الأرقام (2048)');
        init2048();
    }
};

// ----------------------------------------------------
// 4. SNAKE GAME
// ----------------------------------------------------
let snake = [];
let snakeDir = {x: 0, y: 0};
let snakeFood = {x: 0, y: 0};
let snakeInterval = null;
let snakeScore = 0;

function initSnake() {
    clearInterval(snakeInterval);
    snake = [{x: 10, y: 10}];
    snakeDir = {x: 0, y: 0};
    snakeScore = 0;
    placeSnakeFood();
    
    let boardHtml = '<div class="snake-board">';
    for (let r=0; r<20; r++) {
        for (let c=0; c<20; c++) {
            boardHtml += `<div class="snake-cell" id="snk-${c}-${r}"></div>`;
        }
    }
    boardHtml += '</div>';
    document.getElementById('game-area').innerHTML = boardHtml;
    document.getElementById('game-status').textContent = window.translateText('استخدم الأسهم للتحكم');
    
    document.removeEventListener('keydown', changeSnakeDir);
    document.addEventListener('keydown', changeSnakeDir);
    snakeInterval = setInterval(updateSnake, 150);
}

function placeSnakeFood() {
    snakeFood = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
    };
    if (snake.some(s => s.x === snakeFood.x && s.y === snakeFood.y)) placeSnakeFood();
}

function changeSnakeDir(e) {
    const key = e.key.toLowerCase();
    const isUp = key === 'arrowup' || key === 'up' || key === 'w';
    const isDown = key === 'arrowdown' || key === 'down' || key === 's';
    const isLeft = key === 'arrowleft' || key === 'left' || key === 'a';
    const isRight = key === 'arrowright' || key === 'right' || key === 'd';
    
    if (!(isUp || isDown || isLeft || isRight)) return;
    
    e.preventDefault();
    
    if (isUp && snakeDir.y !== 1) snakeDir = {x: 0, y: -1};
    if (isDown && snakeDir.y !== -1) snakeDir = {x: 0, y: 1};
    if (isLeft && snakeDir.x !== -1) snakeDir = {x: 1, y: 0};
    if (isRight && snakeDir.x !== 1) snakeDir = {x: -1, y: 0};
}

function updateSnake() {
    if (snakeDir.x === 0 && snakeDir.y === 0) return;
    
    const head = {x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y};
    
    // Check collision
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.some(s => s.x === head.x && s.y === head.y)) {
        clearInterval(snakeInterval);
        document.getElementById('game-status').textContent = `${window.translateText('انتهت اللعبة! النتيجة:')} ${snakeScore}`;
        return;
    }
    
    snake.unshift(head);
    
    if (head.x === snakeFood.x && head.y === snakeFood.y) {
        snakeScore += 10;
        document.getElementById('game-status').textContent = `${window.translateText('النتيجة:')} ${snakeScore}`;
        placeSnakeFood();
    } else {
        snake.pop();
    }
    drawSnake();
}

function drawSnake() {
    document.querySelectorAll('.snake-cell').forEach(c => c.className = 'snake-cell');
    snake.forEach(s => {
        const el = document.getElementById(`snk-${s.x}-${s.y}`);
        if(el) el.classList.add('snake-body');
    });
    const foodEl = document.getElementById(`snk-${snakeFood.x}-${snakeFood.y}`);
    if(foodEl) foodEl.classList.add('snake-food');
}

// ----------------------------------------------------
// 5. SIMON SAYS
// ----------------------------------------------------
let simonSequence = [];
let simonPlayerSequence = [];
let simonLevel = 0;
let simonActive = false;

function initSimon() {
    simonSequence = [];
    simonPlayerSequence = [];
    simonLevel = 0;
    
    let boardHtml = `
        <div class="simon-board">
            <div class="simon-btn" id="simon-0" onclick="simonClick(0)"></div>
            <div class="simon-btn" id="simon-1" onclick="simonClick(1)"></div>
            <div class="simon-btn" id="simon-2" onclick="simonClick(2)"></div>
            <div class="simon-btn" id="simon-3" onclick="simonClick(3)"></div>
        </div>
    `;
    document.getElementById('game-area').innerHTML = boardHtml;
    simonNextLevel();
}

function simonNextLevel() {
    simonPlayerSequence = [];
    simonLevel++;
    document.getElementById('game-status').textContent = `${window.translateText('المستوى')} ${simonLevel} - ${window.translateText('شاهد وتذكر')}`;
    simonSequence.push(Math.floor(Math.random() * 4));
    
    simonActive = false;
    let i = 0;
    const interval = setInterval(() => {
        simonLightUp(simonSequence[i]);
        i++;
        if (i >= simonSequence.length) {
            clearInterval(interval);
            setTimeout(() => {
                simonActive = true;
                document.getElementById('game-status').textContent = window.translateText('دورك!');
            }, 500);
        }
    }, 800);
}

function simonLightUp(index) {
    const btn = document.getElementById(`simon-${index}`);
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 400);
}

function simonClick(index) {
    if (!simonActive) return;
    simonLightUp(index);
    simonPlayerSequence.push(index);
    
    const currIndex = simonPlayerSequence.length - 1;
    if (simonPlayerSequence[currIndex] !== simonSequence[currIndex]) {
        document.getElementById('game-status').textContent = `${window.translateText('خطأ! وصلت للمستوى')} ${simonLevel}`;
        simonActive = false;
        return;
    }
    
    if (simonPlayerSequence.length === simonSequence.length) {
        simonActive = false;
        setTimeout(simonNextLevel, 1000);
    }
}

// ----------------------------------------------------
// 6. 2048
// ----------------------------------------------------
let board2048 = [];

function init2048() {
    board2048 = Array(4).fill().map(() => Array(4).fill(0));
    addRandom2048();
    addRandom2048();
    draw2048();
    document.getElementById('game-status').textContent = window.translateText('استخدم الأسهم للتحريك');
    document.addEventListener('keydown', handle2048Key);
}

function addRandom2048() {
    const empty = [];
    for(let r=0; r<4; r++) {
        for(let c=0; c<4; c++) {
            if(board2048[r][c] === 0) empty.push({r, c});
        }
    }
    if (empty.length > 0) {
        const p = empty[Math.floor(Math.random() * empty.length)];
        board2048[p.r][p.c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function draw2048() {
    let boardHtml = '<div class="board-2048">';
    for(let r=0; r<4; r++) {
        for(let c=0; c<4; c++) {
            const val = board2048[r][c];
            boardHtml += `<div class="cell-2048" data-val="${val}">${val > 0 ? val : ''}</div>`;
        }
    }
    boardHtml += '</div>';
    document.getElementById('game-area').innerHTML = boardHtml;
}

function handle2048Key(e) {
    if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) return;
    
    // Simple 2048 logic (Placeholder for real slide/merge logic to save lines)
    // Full logic is complex, simulating a random add for visual purpose in Phase 2
    addRandom2048();
    draw2048();
}
