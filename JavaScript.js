// Game state variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scores = {
    X: 0,
    O: 0,
    ties: 0
};

// Winning combinations for Tic Tac Toe
const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// DOM elements
let cells, statusDisplay, resetBtn, scoreX, scoreO, scoreTies, winModal, winMessage, playAgainBtn, closeModalBtn;

// Initialize DOM elements
function initializeDOMElements() {
    cells = document.querySelectorAll('.cell');
    statusDisplay = document.getElementById('status');
    resetBtn = document.getElementById('resetBtn');
    scoreX = document.getElementById('scoreX');
    scoreO = document.getElementById('scoreO');
    scoreTies = document.getElementById('scoreTies');
    winModal = document.getElementById('winModal');
    winMessage = document.getElementById('winMessage');
    playAgainBtn = document.getElementById('playAgainBtn');
    closeModalBtn = document.getElementById('closeModalBtn');
}

// Initialize the game
function initializeGame() {
    initializeDOMElements();
    
    // Add event listeners to cells
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });
    
    // Add event listeners to buttons
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            hideModal();
            resetGame();
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideModal);
    }
    
    // Close modal when clicking outside
    if (winModal) {
        winModal.addEventListener('click', (e) => {
            if (e.target === winModal) {
                hideModal();
            }
        });
    }
    
    // Add hover effects
    addCellHoverEffect();
    
    updateDisplay();
    updateScoreDisplay();
    
    console.log('Game initialized successfully');
}

// Handle cell click
function handleCellClick(index) {
    console.log(`Cell ${index} clicked by player ${currentPlayer}`);
    
    // Check if the cell is already occupied or game is not active
    if (gameBoard[index] !== '' || !gameActive) {
        console.log('Invalid move - cell occupied or game not active');
        return;
    }
    
    // Make the move
    makeMove(index);
    
    // Check for win or tie immediately after move
    const winResult = checkWin();
    console.log('Win check result:', winResult);
    
    if (winResult.hasWin) {
        handleWin(winResult);
    } else if (checkTie()) {
        handleTie();
    } else {
        // Switch to next player
        switchPlayer();
        updateDisplay();
    }
}

// Make a move on the board
function makeMove(index) {
    gameBoard[index] = currentPlayer;
    const cell = cells[index];
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.classList.add('occupied');
    
    console.log('Move made:', { index, player: currentPlayer, board: gameBoard });
}

// Switch to the next player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    console.log('Switched to player:', currentPlayer);
}

// Check for a win
function checkWin() {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        
        if (gameBoard[a] !== '' && 
            gameBoard[a] === gameBoard[b] && 
            gameBoard[a] === gameBoard[c]) {
            
            console.log(`Win found: positions ${a},${b},${c} with player ${gameBoard[a]}`);
            
            return {
                hasWin: true,
                winner: gameBoard[a],
                winningCells: [a, b, c]
            };
        }
    }
    return { hasWin: false };
}

// Check for a tie
function checkTie() {
    const isBoardFull = gameBoard.every(cell => cell !== '');
    const hasWin = checkWin().hasWin;
    return isBoardFull && !hasWin;
}

// Handle win condition
function handleWin(winResult) {
    console.log('Handling win:', winResult);
    gameActive = false;
    const { winner, winningCells } = winResult;
    
    // Highlight winning cells
    winningCells.forEach(index => {
        if (cells[index]) {
            cells[index].classList.add('winning');
        }
    });
    
    // Update score
    scores[winner]++;
    updateScoreDisplay();
    
    // Update status
    if (statusDisplay) {
        statusDisplay.textContent = `Player ${winner} wins!`;
        statusDisplay.style.color = winner === 'X' ? 'var(--color-primary)' : 'var(--color-warning)';
    }
    
    // Show win modal after a short delay
    setTimeout(() => {
        showWinModal(`Player ${winner} Wins!`);
    }, 1000);
}

// Handle tie condition
function handleTie() {
    console.log('Handling tie');
    gameActive = false;
    scores.ties++;
    updateScoreDisplay();
    
    if (statusDisplay) {
        statusDisplay.textContent = "It's a tie!";
        statusDisplay.style.color = 'var(--color-text-secondary)';
    }
    
    // Show tie modal after a short delay
    setTimeout(() => {
        showWinModal("It's a Tie!");
    }, 1000);
}

// Update the display
function updateDisplay() {
    if (gameActive && statusDisplay) {
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        statusDisplay.style.color = currentPlayer === 'X' ? 'var(--color-primary)' : 'var(--color-warning)';
    }
}

// Update score display
function updateScoreDisplay() {
    if (scoreX) scoreX.textContent = scores.X;
    if (scoreO) scoreO.textContent = scores.O;
    if (scoreTies) scoreTies.textContent = scores.ties;
    
    console.log('Scores updated:', scores);
}

// Reset the game
function resetGame() {
    console.log('Resetting game');
    
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    // Clear all cells
    if (cells) {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'occupied', 'winning');
        });
    }
    
    updateDisplay();
    console.log('Game reset complete');
}

// Show win modal
function showWinModal(message) {
    console.log('Showing win modal:', message);
    
    if (winMessage) {
        winMessage.textContent = message;
        
        // Add color based on winner
        if (message.includes('X Wins')) {
            winMessage.style.color = 'var(--color-primary)';
        } else if (message.includes('O Wins')) {
            winMessage.style.color = 'var(--color-warning)';
        } else {
            winMessage.style.color = 'var(--color-text)';
        }
    }
    
    if (winModal) {
        winModal.classList.remove('hidden');
    }
}

// Hide win modal
function hideModal() {
    console.log('Hiding modal');
    if (winModal) {
        winModal.classList.add('hidden');
    }
}

// Add hover effects
function addCellHoverEffect() {
    if (!cells) return;
    
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            if (!cell.classList.contains('occupied') && gameActive) {
                cell.style.backgroundColor = 'var(--color-bg-2)';
                cell.textContent = currentPlayer;
                cell.style.opacity = '0.5';
                cell.style.color = currentPlayer === 'X' ? 'var(--color-primary)' : 'var(--color-warning)';
            }
        });
        
        cell.addEventListener('mouseleave', () => {
            if (!cell.classList.contains('occupied')) {
                cell.style.backgroundColor = '';
                cell.textContent = '';
                cell.style.opacity = '';
                cell.style.color = '';
            }
        });
    });
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && winModal && !winModal.classList.contains('hidden')) {
        hideModal();
    }
    
    // Allow number keys 1-9 to make moves
    if (gameActive && e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        handleCellClick(index);
    }
    
    // Reset with 'R' key
    if (e.key.toLowerCase() === 'r') {
        resetGame();
    }
});

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game');
    initializeGame();
});

// Ensure the game is reset on page load
window.addEventListener('load', () => {
    console.log('Page loaded');
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        if (typeof initializeGame === 'function') {
            resetGame();
        }
    }, 100);
});