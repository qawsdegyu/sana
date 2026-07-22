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
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖']
];
let chessBoard = [];
let selectedSquare = null;
let playerColor = 'white'; // White is bottom
let lastAIMove = null;
let currentValidMoves = [];
let isPlayerTurn = true;
let chessGameOver = false;

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

// Filter moves that would leave White King under check
function getLegalMovesForWhite(r, c) {
    const rawMoves = getValidMovesForWhite(r, c);
    const legalMoves = [];
    
    for (const move of rawMoves) {
        const tempPiece = chessBoard[move.r][move.c];
        const origPiece = chessBoard[r][c];
        
        chessBoard[move.r][move.c] = origPiece;
        chessBoard[r][c] = '';
        
        const kPos = findChessKing('♔');
        const inCheck = kPos && isSquareUnderAttack(kPos.r, kPos.c, '♟♜♞♝♛♚');
        
        chessBoard[r][c] = origPiece;
        chessBoard[move.r][move.c] = tempPiece;
        
        if (!inCheck) {
            legalMoves.push(move);
        }
    }
    return legalMoves;
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
    isPlayerTurn = true;
    chessGameOver = false;
    renderChessBoard();
    document.getElementById('game-status').textContent = window.translateText('دورك (الأبيض)');
}

function renderChessBoard() {
    let boardHtml = `<div class="chess-board ${chessGameOver ? 'game-over-board' : ''}" style="${chessGameOver ? 'pointer-events: none; opacity: 0.85;' : ''}">`;
    const whiteKingPos = findChessKing('♔');
    const blackKingPos = findChessKing('♚');
    const whiteInCheck = whiteKingPos && isSquareUnderAttack(whiteKingPos.r, whiteKingPos.c, '♟♜♞♝♛♚');
    const blackInCheck = blackKingPos && isSquareUnderAttack(blackKingPos.r, blackKingPos.c, '♙♖♘♗♕♔');

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const color = (r + c) % 2 === 0 ? 'dark' : 'light';
            const piece = chessBoard[r][c];
            
            let extraClasses = '';
            if ('♟♜♞♝♛♚'.includes(piece)) extraClasses += ' piece-black';
            else if ('♙♖♘♗♕♔'.includes(piece)) extraClasses += ' piece-white';

            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) extraClasses += ' selected';
            if (lastAIMove && ((lastAIMove.from.r === r && lastAIMove.from.c === c) || (lastAIMove.to.r === r && lastAIMove.to.c === c))) extraClasses += ' last-move';
            if (!chessGameOver && currentValidMoves.some(m => m.r === r && m.c === c)) extraClasses += ' valid-move';
            
            // Check indicator on Kings
            if ((whiteInCheck && piece === '♔') || (blackInCheck && piece === '♚')) {
                extraClasses += ' in-check';
            }

            boardHtml += `<div class="chess-cell ${color}${extraClasses}" id="chess-${r}-${c}" onclick="chessClick(${r}, ${c})">${piece}</div>`;
        }
    }
    boardHtml += '</div>';
    document.getElementById('game-area').innerHTML = boardHtml;
}

// Helper to find king coordinates
function findChessKing(kingSymbol) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (chessBoard[r][c] === kingSymbol) return {r, c};
        }
    }
    return null;
}

// Helper to check if a square is under attack by pieces of a given set
function isSquareUnderAttack(targetR, targetC, attackerPieces) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = chessBoard[r][c];
            if (attackerPieces.includes(piece)) {
                const moves = attackerPieces.includes('♟') ? getValidMovesForBlack(r, c) : getValidMovesForWhite(r, c);
                if (moves.some(m => m.r === targetR && m.c === targetC)) return true;
            }
        }
    }
    return false;
}

function chessClick(r, c) {
    if (chessGameOver || !isPlayerTurn) return;
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
                currentValidMoves = getLegalMovesForWhite(r, c);
                renderChessBoard();
            }
            return;
        }

        const capturedPiece = chessBoard[r][c];
        chessBoard[r][c] = chessBoard[sr][sc];
        chessBoard[sr][sc] = '';

        // Pawn promotion (White Pawn reaches top row)
        if (chessBoard[r][c] === '♙' && r === 0) {
            chessBoard[r][c] = '♕';
        }

        selectedSquare = null;
        currentValidMoves = [];
        lastAIMove = { from: {r: sr, c: sc}, to: {r, c} };

        // Check if White captured the Black King
        if (capturedPiece === '♚') {
            chessGameOver = true;
            isPlayerTurn = false;
            renderChessBoard();
            document.getElementById('game-status').innerHTML = `<span style="color:#7effdb;">🎉 ${window.translateText('كش ملك! أطحت بملك الذكاء الاصطناعي وفزت باللعبة!')}</span>`;
            return;
        }

        isPlayerTurn = false;
        renderChessBoard();

        // Check if White put Black King in Check
        const blackKingPos = findChessKing('♚');
        let statusMsg = window.translateText('دور الذكاء الاصطناعي...');
        if (blackKingPos && isSquareUnderAttack(blackKingPos.r, blackKingPos.c, '♙♖♘♗♕♔')) {
            statusMsg = window.translateText('كش ملك! الذكاء الاصطناعي تحت التهديد... ⚡');
        }
        document.getElementById('game-status').textContent = statusMsg;

        setTimeout(chessAIMove, 800);
    } else {
        if (piece === '' || !'♙♖♘♗♕♔'.includes(piece)) return;
        selectedSquare = {r, c};
        currentValidMoves = getLegalMovesForWhite(r, c);
        renderChessBoard();
    }
}

function chessAIMove() {
    if (chessGameOver) return;

    const allPossibleMoves = [];
    const pieceValues = { '♔': 10000, '♕': 900, '♖': 500, '♗': 300, '♘': 300, '♙': 100 };

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if ('♟♜♞♝♛♚'.includes(chessBoard[r][c])) {
                const moves = getValidMovesForBlack(r, c);
                for (const m of moves) {
                    const targetPiece = chessBoard[m.r][m.c];
                    let score = (pieceValues[targetPiece] || 0) + Math.floor(Math.random() * 40);
                    // Center control bonus
                    if (m.r >= 2 && m.r <= 5 && m.c >= 2 && m.c <= 5) score += 15;
                    allPossibleMoves.push({ from: {r, c}, to: m, score });
                }
            }
        }
    }
    
    if (allPossibleMoves.length === 0) {
        chessGameOver = true;
        isPlayerTurn = false;
        renderChessBoard();
        document.getElementById('game-status').innerHTML = `<span style="color:#7effdb;">🎉 ${window.translateText('كش ملك! لا توجد حركات متبقية للذكاء الاصطناعي، أنت الفائز!')}</span>`;
        return;
    }

    // Sort moves by score descending
    allPossibleMoves.sort((a, b) => b.score - a.score);
    const bestMove = allPossibleMoves[0];

    const capturedPiece = chessBoard[bestMove.to.r][bestMove.to.c];
    chessBoard[bestMove.to.r][bestMove.to.c] = chessBoard[bestMove.from.r][bestMove.from.c];
    chessBoard[bestMove.from.r][bestMove.from.c] = '';

    // Pawn promotion (Black Pawn reaches bottom row)
    if (chessBoard[bestMove.to.r][bestMove.to.c] === '♟' && bestMove.to.r === 7) {
        chessBoard[bestMove.to.r][bestMove.to.c] = '♛';
    }

    lastAIMove = bestMove;

    // Check if AI captured White King
    if (capturedPiece === '♔') {
        chessGameOver = true;
        isPlayerTurn = false;
        renderChessBoard();
        document.getElementById('game-status').innerHTML = `<span style="color:#ff6b6b;">🤖 ${window.translateText('كش ملك! أطاح الذكاء الاصطناعي بملكك وفاز باللعبة.')}</span>`;
        return;
    }

    isPlayerTurn = true;
    renderChessBoard();

    // Check if AI put White King in Check
    const whiteKingPos = findChessKing('♔');
    let statusMsg = window.translateText('دورك (الأبيض)');
    if (whiteKingPos && isSquareUnderAttack(whiteKingPos.r, whiteKingPos.c, '♟♜♞♝♛♚')) {
        statusMsg = window.translateText('كش ملك! ملكك تحت التهديد! ⚠️');
    }
    document.getElementById('game-status').textContent = statusMsg;
}
