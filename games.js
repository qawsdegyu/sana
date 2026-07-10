// Game Global Variables
let currentGame = '';

function openGame(gameId) {
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
        title.textContent = window.translateText('شطرنج (لعب عشوائي للذكاء الاصطناعي - المرحلة 1)');
        initChess();
    }
}

function closeGame() {
    document.getElementById('game-modal').classList.remove('show');
    document.getElementById('game-area').innerHTML = '';
    document.getElementById('game-status').textContent = '';
    document.body.style.overflow = ''; // Restore background scrolling
    currentGame = '';
}

function resetGame() {
    if (currentGame) openGame(currentGame);
}

// Close modal when clicking outside the game container
window.addEventListener('click', (e) => {
    const modal = document.getElementById('game-modal');
    if (e.target === modal) {
        closeGame();
    }
});

// ----------------------------------------------------
// 1. TIC TAC TOE (with Minimax AI)
// ----------------------------------------------------
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttPlayer = 'X'; // Human
let tttAI = 'O'; // AI
let tttActive = false;

function initTicTacToe() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttActive = true;
    document.getElementById('game-status').textContent = window.translateText('دورك (X)');
    
    const boardHtml = `
        <div class="tictactoe-board">
            ${[0,1,2,3,4,5,6,7,8].map(i => `<div class="tictactoe-cell" onclick="tttMove(${i})" id="ttt-${i}"></div>`).join('')}
        </div>
    `;
    document.getElementById('game-area').innerHTML = boardHtml;
}

function tttMove(index) {
    if (!tttActive || tttBoard[index] !== '') return;
    
    tttBoard[index] = tttPlayer;
    document.getElementById(`ttt-${index}`).textContent = tttPlayer;
    
    if (tttCheckWin(tttBoard, tttPlayer)) {
        tttEndGame(window.translateText('لقد فزت! 🎉'));
        return;
    }
    if (tttCheckTie(tttBoard)) {
        tttEndGame(window.translateText('تعادل!'));
        return;
    }
    
    document.getElementById('game-status').textContent = window.translateText('يفكر الذكاء الاصطناعي...');
    tttActive = false;
    
    setTimeout(() => {
        let bestMove = tttMinimax(tttBoard, tttAI).index;
        tttBoard[bestMove] = tttAI;
        document.getElementById(`ttt-${bestMove}`).textContent = tttAI;
        
        if (tttCheckWin(tttBoard, tttAI)) {
            tttEndGame(window.translateText('فاز الذكاء الاصطناعي! 🤖'));
        } else if (tttCheckTie(tttBoard)) {
            tttEndGame(window.translateText('تعادل!'));
        } else {
            tttActive = true;
            document.getElementById('game-status').textContent = window.translateText('دورك (X)');
        }
    }, 500);
}

function tttCheckWin(board, player) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(comb => comb.every(i => board[i] === player));
}

function tttCheckTie(board) {
    return board.every(cell => cell !== '');
}

function tttEndGame(msg) {
    document.getElementById('game-status').textContent = msg;
    tttActive = false;
}

function tttMinimax(newBoard, player) {
    const availSpots = newBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    
    if (tttCheckWin(newBoard, tttPlayer)) return {score: -10};
    else if (tttCheckWin(newBoard, tttAI)) return {score: 10};
    else if (availSpots.length === 0) return {score: 0};
    
    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = { index: availSpots[i] };
        newBoard[availSpots[i]] = player;
        
        if (player === tttAI) {
            move.score = tttMinimax(newBoard, tttPlayer).score;
        } else {
            move.score = tttMinimax(newBoard, tttAI).score;
        }
        
        newBoard[availSpots[i]] = '';
        moves.push(move);
    }
    
    let bestMove;
    if (player === tttAI) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

// ----------------------------------------------------
// 2. MEMORY MATCH
// ----------------------------------------------------
const emojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
let memoryCards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

function initMemoryMatch() {
    memoryCards = [...emojis, ...emojis].sort(() => 0.5 - Math.random());
    matches = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    document.getElementById('game-status').textContent = window.translateText('ابحث عن الأزواج المتطابقة!');
    
    const boardHtml = `
        <div class="memory-board">
            ${memoryCards.map((emoji, i) => `
                <div class="memory-card" id="mem-${i}" onclick="flipCard(${i})">
                    <span style="visibility:hidden">${emoji}</span>
                </div>
            `).join('')}
        </div>
    `;
    document.getElementById('game-area').innerHTML = boardHtml;
}

function flipCard(index) {
    if (lockBoard) return;
    const card = document.getElementById(`mem-${index}`);
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    card.classList.add('flipped');
    card.querySelector('span').style.visibility = 'visible';
    
    if (!firstCard) {
        firstCard = { index, emoji: memoryCards[index] };
        return;
    }
    
    secondCard = { index, emoji: memoryCards[index] };
    lockBoard = true;
    
    if (firstCard.emoji === secondCard.emoji) {
        document.getElementById(`mem-${firstCard.index}`).classList.add('matched');
        document.getElementById(`mem-${secondCard.index}`).classList.add('matched');
        matches++;
        resetBoard();
        if (matches === emojis.length) {
            document.getElementById('game-status').textContent = window.translateText('تهانينا! لقد وجدت كل الأزواج! 🎉');
        }
    } else {
        setTimeout(() => {
            const c1 = document.getElementById(`mem-${firstCard.index}`);
            const c2 = document.getElementById(`mem-${secondCard.index}`);
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            c1.querySelector('span').style.visibility = 'hidden';
            c2.querySelector('span').style.visibility = 'hidden';
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// ----------------------------------------------------
// 3. CHESS (Basic Implementation)
// ----------------------------------------------------
// This is a highly simplified visual representation with a random-move AI for Phase 1.
const initialChessBoard = [
    ['♜','♞','♝','♚','♛','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♔','♕','♗','♘','♖']
];
let chessBoard = [];
let selectedSquare = null;
let playerColor = 'white'; // White is bottom
let lastAIMove = null;
let currentValidMoves = [];

function getValidMovesForWhite(r, c) {
    const piece = chessBoard[r][c];
    if (!'♙♖♘♗♕♔'.includes(piece)) return [];
    
    const moves = [];
    const addMove = (nr, nc) => {
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = chessBoard[nr][nc];
            if (target === '' || '♟♜♞♝♛♚'.includes(target)) {
                moves.push({r: nr, c: nc});
                return target === '';
            }
        }
        return false;
    };

    const addLine = (dr, dc) => {
        let nr = r + dr;
        let nc = c + dc;
        while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = chessBoard[nr][nc];
            if (target === '') {
                moves.push({r: nr, c: nc});
            } else {
                if ('♟♜♞♝♛♚'.includes(target)) {
                    moves.push({r: nr, c: nc});
                }
                break;
            }
            nr += dr;
            nc += dc;
        }
    };

    if (piece === '♙') {
        if (r - 1 >= 0 && chessBoard[r - 1][c] === '') {
            moves.push({r: r - 1, c: c});
            if (r === 6 && chessBoard[r - 2][c] === '') {
                moves.push({r: r - 2, c: c});
            }
        }
        if (r - 1 >= 0 && c - 1 >= 0 && '♟♜♞♝♛♚'.includes(chessBoard[r - 1][c - 1])) moves.push({r: r - 1, c: c - 1});
        if (r - 1 >= 0 && c + 1 < 8 && '♟♜♞♝♛♚'.includes(chessBoard[r - 1][c + 1])) moves.push({r: r - 1, c: c + 1});
    }
    else if (piece === '♖') { addLine(-1, 0); addLine(1, 0); addLine(0, -1); addLine(0, 1); }
    else if (piece === '♗') { addLine(-1, -1); addLine(-1, 1); addLine(1, -1); addLine(1, 1); }
    else if (piece === '♕') {
        addLine(-1, 0); addLine(1, 0); addLine(0, -1); addLine(0, 1);
        addLine(-1, -1); addLine(-1, 1); addLine(1, -1); addLine(1, 1);
    }
    else if (piece === '♔') {
        const dirs = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
        for(let d of dirs) addMove(r+d[0], c+d[1]);
    }
    else if (piece === '♘') {
        const dirs = [[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]];
        for(let d of dirs) addMove(r+d[0], c+d[1]);
    }
    
    return moves;
}

function getValidMovesForBlack(r, c) {
    const piece = chessBoard[r][c];
    if (!'♟♜♞♝♛♚'.includes(piece)) return [];
    
    const moves = [];
    const addMove = (nr, nc) => {
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = chessBoard[nr][nc];
            if (target === '' || '♙♖♘♗♕♔'.includes(target)) {
                moves.push({r: nr, c: nc});
                return target === '';
            }
        }
        return false;
    };

    const addLine = (dr, dc) => {
        let nr = r + dr;
        let nc = c + dc;
        while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = chessBoard[nr][nc];
            if (target === '') {
                moves.push({r: nr, c: nc});
            } else {
                if ('♙♖♘♗♕♔'.includes(target)) {
                    moves.push({r: nr, c: nc});
                }
                break;
            }
            nr += dr;
            nc += dc;
        }
    };

    if (piece === '♟') {
        if (r + 1 < 8 && chessBoard[r + 1][c] === '') {
            moves.push({r: r + 1, c: c});
            if (r === 1 && chessBoard[r + 2][c] === '') {
                moves.push({r: r + 2, c: c});
            }
        }
        if (r + 1 < 8 && c - 1 >= 0 && '♙♖♘♗♕♔'.includes(chessBoard[r + 1][c - 1])) moves.push({r: r + 1, c: c - 1});
        if (r + 1 < 8 && c + 1 < 8 && '♙♖♘♗♕♔'.includes(chessBoard[r + 1][c + 1])) moves.push({r: r + 1, c: c + 1});
    }
    else if (piece === '♜') { addLine(-1, 0); addLine(1, 0); addLine(0, -1); addLine(0, 1); }
    else if (piece === '♝') { addLine(-1, -1); addLine(-1, 1); addLine(1, -1); addLine(1, 1); }
    else if (piece === '♛') {
        addLine(-1, 0); addLine(1, 0); addLine(0, -1); addLine(0, 1);
        addLine(-1, -1); addLine(-1, 1); addLine(1, -1); addLine(1, 1);
    }
    else if (piece === '♚') {
        const dirs = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
        for(let d of dirs) addMove(r+d[0], c+d[1]);
    }
    else if (piece === '♞') {
        const dirs = [[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]];
        for(let d of dirs) addMove(r+d[0], c+d[1]);
    }
    
    return moves;
}

function initChess() {
    chessBoard = JSON.parse(JSON.stringify(initialChessBoard));
    playerColor = 'white';
    lastAIMove = null;
    currentValidMoves = [];
    selectedSquare = null;
    renderChessBoard();
    document.getElementById('game-status').textContent = window.translateText('دورك (الأبيض)');
}

function renderChessBoard() {
    let boardHtml = '<div class="chess-board">';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const color = (r + c) % 2 === 0 ? 'dark' : 'light';
            const piece = chessBoard[r][c];
            
            let extraClasses = '';
            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) extraClasses += ' selected';
            if (lastAIMove && ((lastAIMove.from.r === r && lastAIMove.from.c === c) || (lastAIMove.to.r === r && lastAIMove.to.c === c))) extraClasses += ' last-move';
            if (currentValidMoves.some(m => m.r === r && m.c === c)) extraClasses += ' valid-move';
            
            boardHtml += `<div class="chess-cell ${color}${extraClasses}" id="chess-${r}-${c}" onclick="chessClick(${r}, ${c})">${piece}</div>`;
        }
    }
    boardHtml += '</div>';
    document.getElementById('game-area').innerHTML = boardHtml;
}

function chessClick(r, c) {
    if (document.getElementById('game-status').textContent === window.translateText('دور الذكاء الاصطناعي...')) return;
    const piece = chessBoard[r][c];
    
    if (selectedSquare) {
        const sr = selectedSquare.r;
        const sc = selectedSquare.c;
        
        if (sr === r && sc === c) {
            selectedSquare = null;
            currentValidMoves = [];
            renderChessBoard();
            return;
        }
        
        if (!currentValidMoves.some(m => m.r === r && m.c === c)) {
            if ('♙♖♘♗♕♔'.includes(piece)) {
                selectedSquare = {r, c};
                currentValidMoves = getValidMovesForWhite(r, c);
                renderChessBoard();
            }
            return;
        }

        chessBoard[r][c] = chessBoard[sr][sc];
        chessBoard[sr][sc] = '';
        selectedSquare = null;
        currentValidMoves = [];
        lastAIMove = null;
        renderChessBoard();
        document.getElementById('game-status').textContent = window.translateText('دور الذكاء الاصطناعي...');
        
        setTimeout(chessAIMove, 1000);
    } else {
        if (piece === '' || !'♙♖♘♗♕♔'.includes(piece)) return;
        selectedSquare = {r, c};
        currentValidMoves = getValidMovesForWhite(r, c);
        renderChessBoard();
    }
}

function chessAIMove() {
    const allPossibleMoves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if ('♟♜♞♝♛♚'.includes(chessBoard[r][c])) {
                const moves = getValidMovesForBlack(r, c);
                for (const m of moves) {
                    allPossibleMoves.push({ from: {r, c}, to: m });
                }
            }
        }
    }
    
    if (allPossibleMoves.length > 0) {
        const move = allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
        chessBoard[move.to.r][move.to.c] = chessBoard[move.from.r][move.from.c];
        chessBoard[move.from.r][move.from.c] = '';
        lastAIMove = move;
    }
    
    renderChessBoard();
    document.getElementById('game-status').textContent = window.translateText('دورك (الأبيض)');
}
