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
let score2048 = 0;
let bestScore2048 = parseInt(localStorage.getItem('sana_2048_best') || '0');
let hasWon2048 = false;
let is2048GameOver = false;
let touchStartX = 0;
let touchStartY = 0;

function init2048() {
    board2048 = Array(4).fill().map(() => Array(4).fill(0));
    score2048 = 0;
    hasWon2048 = false;
    is2048GameOver = false;
    bestScore2048 = parseInt(localStorage.getItem('sana_2048_best') || '0');
    addRandom2048();
    addRandom2048();
    draw2048();
    document.getElementById('game-status').textContent = window.translateText('اسحب أو استخدم الأسهم للتحريك');
    
    document.removeEventListener('keydown', handle2048Key);
    document.addEventListener('keydown', handle2048Key);

    // Attach touch listeners for mobile swipe
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
        gameArea.removeEventListener('touchstart', handle2048TouchStart);
        gameArea.removeEventListener('touchend', handle2048TouchEnd);
        gameArea.addEventListener('touchstart', handle2048TouchStart, {passive: true});
        gameArea.addEventListener('touchend', handle2048TouchEnd, {passive: true});
    }
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
    if (score2048 > bestScore2048) {
        bestScore2048 = score2048;
        localStorage.setItem('sana_2048_best', bestScore2048.toString());
    }

    let html = `
        <div style="display:flex; justify-content:space-around; align-items:center; max-width:380px; margin:0 auto 15px auto; background:rgba(255,255,255,0.05); padding:8px 15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="color:var(--primary-color); font-weight:bold; font-size:1.1rem;">${window.translateText('النقاط:')} <span style="color:#fff;">${score2048}</span></div>
            <div style="color:#7effdb; font-weight:bold; font-size:1.1rem;">${window.translateText('أعلى نتيجة:')} <span style="color:#fff;">${bestScore2048}</span></div>
        </div>
        <div class="board-2048" style="${is2048GameOver ? 'pointer-events: none; opacity: 0.8;' : ''}">
    `;

    for(let r=0; r<4; r++) {
        for(let c=0; c<4; c++) {
            const val = board2048[r][c];
            html += `<div class="cell-2048" data-val="${val}">${val > 0 ? val : ''}</div>`;
        }
    }
    html += '</div>';

    // Add D-pad touch buttons for mobile users
    if (!is2048GameOver) {
        html += `
            <div style="margin-top: 15px; display: flex; flex-direction: column; align-items: center; gap: 6px;">
                <button onclick="move2048Direction('ArrowUp')" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 50px; height: 40px; border-radius: 8px; font-size: 1.2rem; cursor: pointer;">⬆️</button>
                <div style="display: flex; gap: 20px;">
                    <button onclick="move2048Direction('ArrowRight')" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 50px; height: 40px; border-radius: 8px; font-size: 1.2rem; cursor: pointer;">➡️</button>
                    <button onclick="move2048Direction('ArrowDown')" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 50px; height: 40px; border-radius: 8px; font-size: 1.2rem; cursor: pointer;">⬇️</button>
                    <button onclick="move2048Direction('ArrowLeft')" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 50px; height: 40px; border-radius: 8px; font-size: 1.2rem; cursor: pointer;">⬅️</button>
                </div>
            </div>
        `;
    }

    document.getElementById('game-area').innerHTML = html;
}

function handle2048TouchStart(e) {
    if (is2048GameOver) return;
    if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
}

function handle2048TouchEnd(e) {
    if (is2048GameOver) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) move2048Direction('ArrowLeft'); // RTL layout direction
            else move2048Direction('ArrowRight');
        } else {
            if (dy > 0) move2048Direction('ArrowDown');
            else move2048Direction('ArrowUp');
        }
    }
}

function handle2048Key(e) {
    if (is2048GameOver) return;
    if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    move2048Direction(e.key);
}

function move2048Direction(dir) {
    if (is2048GameOver) return;
    const oldBoard = JSON.stringify(board2048);

    const slide = (row) => {
        let arr = row.filter(val => val);
        for(let i = 0; i < arr.length - 1; i++){
            if(arr[i] === arr[i+1]){
                arr[i] *= 2;
                score2048 += arr[i];
                arr.splice(i+1, 1);
            }
        }
        while(arr.length < 4) arr.push(0);
        return arr;
    };

    if(dir === 'ArrowLeft') {
        for(let r=0; r<4; r++){
            board2048[r] = slide(board2048[r]);
        }
    } else if(dir === 'ArrowRight') {
        for(let r=0; r<4; r++){
            board2048[r] = slide(board2048[r].reverse()).reverse();
        }
    } else if(dir === 'ArrowUp') {
        for(let c=0; c<4; c++){
            let col = [board2048[0][c], board2048[1][c], board2048[2][c], board2048[3][c]];
            col = slide(col);
            for(let r=0; r<4; r++) board2048[r][c] = col[r];
        }
    } else if(dir === 'ArrowDown') {
        for(let c=0; c<4; c++){
            let col = [board2048[0][c], board2048[1][c], board2048[2][c], board2048[3][c]];
            col = slide(col.reverse()).reverse();
            for(let r=0; r<4; r++) board2048[r][c] = col[r];
        }
    }

    if (oldBoard !== JSON.stringify(board2048)) {
        addRandom2048();
        draw2048();
        check2048WinOrOver();
    }
}

function check2048WinOrOver() {
    // Check 2048 tile reached
    if (!hasWon2048) {
        for(let r=0; r<4; r++){
            for(let c=0; c<4; c++){
                if (board2048[r][c] === 2048) {
                    hasWon2048 = true;
                    document.getElementById('game-status').innerHTML = `<span style="color:#7effdb;">🎉 ${window.translateText('مبروك! وصلت إلى 2048!')}</span>`;
                    return;
                }
            }
        }
    }

    // Check Game Over
    let over = true;
    for(let r=0; r<4; r++){
        for(let c=0; c<4; c++){
            if(board2048[r][c] === 0) over = false;
            if(r < 3 && board2048[r][c] === board2048[r+1][c]) over = false;
            if(c < 3 && board2048[r][c] === board2048[r][c+1]) over = false;
        }
    }
    if(over) {
        is2048GameOver = true;
        draw2048();
        document.getElementById('game-status').innerHTML = `<span style="color:#ff6b6b;">${window.translateText('انتهت اللعبة! لا توجد حركات إضافية.')}</span>`;
    }
}
