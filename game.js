// Game State Management
const gameState = {
    isPlaying: false,
    gameStarted: false,
    gameEnded: false,
    currentLetter: null,
    letterStates: {}, // track state of each letter: 'unanswered', 'correct', 'wrong', 'passed'
    elapsedTime: 0,
    questionTimer: null,
    mainTimer: null
};

// DOM Elements
const mainBoard = document.getElementById('mainBoard');
const questionScreen = document.getElementById('questionScreen');
const letterGrid = document.querySelector('.letter-grid');
const stopwatch = document.getElementById('stopwatch');
const flashOverlay = document.getElementById('flashOverlay');

// Initialize the game
function initializeGame() {
    // Create letter boxes A-Z
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    letters.forEach(letter => {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box';
        letterBox.textContent = letter;
        letterBox.dataset.letter = letter;
        letterGrid.appendChild(letterBox);
        
        // Allow selecting letter by mouse click as well
        letterBox.addEventListener('click', () => {
            if (!gameState.gameEnded && gameState.letterStates[letter] === 'unanswered') {
                selectLetter(letter);
            }
        });
        
        // Initialize letter state
        gameState.letterStates[letter] = 'unanswered';
    });
    
    // Add event listeners
    setupEventListeners();
}

// Setup all event listeners
function setupEventListeners() {
    // Keyboard listener for letter selection
    document.addEventListener('keydown', handleKeyPress);
    
    // Stopwatch click to end game
    stopwatch.addEventListener('click', endGame);
}

// Handle keyboard input
function handleKeyPress(event) {
    const key = event.key.toUpperCase();
    
    // Check if on question screen
    if (questionScreen.classList.contains('active')) {
        handleQuestionKeyPress(key);
        return;
    }
    
    // Check if on main board and key is a letter
    if (mainBoard.classList.contains('active') && /^[A-Z]$/.test(key)) {
        // Check if game hasn't ended and letter is unanswered
        if (!gameState.gameEnded && gameState.letterStates[key] === 'unanswered') {
            selectLetter(key);
        }
    }
}

// Handle key presses on question screen
function handleQuestionKeyPress(key) {
    switch(key) {
        case 'C':
            handleAnswer('correct');
            break;
        case 'W':
            handleAnswer('wrong');
            break;
        case 'P':
            handleAnswer('passed');
            break;
    }
}

// Select a letter and show question
function selectLetter(letter) {
    // Start the game timer if this is the first selection
    if (!gameState.gameStarted) {
        startMainTimer();
        gameState.gameStarted = true;
    }
    
    gameState.currentLetter = letter;
    showQuestion(letter);
}

// Display the question screen
function showQuestion(letter) {
    // Transition to question screen
    mainBoard.classList.remove('active');
    questionScreen.classList.add('active');
    
    // Set up question content
    const question = questions[letter];
    document.querySelector('.current-letter').textContent = letter;
    document.querySelector('.question-text').textContent = question.question;
    document.querySelector('.answer-text').textContent = question.answer;
    document.querySelector('.answer-text').classList.remove('visible');
    
    // Start countdown timer
    startQuestionTimer();
}

// Start the 10-second question timer
function startQuestionTimer() {
    let timeLeft = 10;
    const timerDisplay = document.querySelector('.countdown-timer');
    timerDisplay.textContent = timeLeft;
    timerDisplay.classList.remove('warning');
    
    gameState.questionTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        // Add warning class for last 3 seconds
        if (timeLeft <= 3) {
            timerDisplay.classList.add('warning');
        }
        
        // Time's up - treat as pass
        if (timeLeft === 0) {
            clearInterval(gameState.questionTimer);
            handleAnswer('passed');
        }
    }, 1000);
}

// Handle answer judgment
function handleAnswer(result) {
    // Clear the question timer
    if (gameState.questionTimer) {
        clearInterval(gameState.questionTimer);
        gameState.questionTimer = null;
    }
    
    // Update letter state
    gameState.letterStates[gameState.currentLetter] = result;
    
    // Show appropriate feedback
    showFeedback(result);
}

// Show visual feedback for answer
function showFeedback(result) {
    let flashClass = '';
    let delay = 1000; // Default 1 second delay
    
    switch(result) {
        case 'correct':
            flashClass = 'flash-green';
            delay = 1000;
            break;
        case 'wrong':
            flashClass = 'flash-red';
            delay = 1500;
            // Show the answer
            document.querySelector('.answer-text').classList.add('visible');
            break;
        case 'passed':
            flashClass = 'flash-orange';
            delay = 1500;
            break;
    }
    
    // Flash the screen
    flashOverlay.classList.add(flashClass);
    
    setTimeout(() => {
        flashOverlay.classList.remove(flashClass);
        
        // Update letter box first, then return to main board
        setTimeout(() => {
            updateLetterBox(gameState.currentLetter, result);
            returnToMainBoard();
        }, delay);
    }, 300);
}

// Return to main board
function returnToMainBoard() {
    questionScreen.classList.remove('active');
    mainBoard.classList.add('active');
    gameState.currentLetter = null;
}

// Update letter box appearance
function updateLetterBox(letter, state) {
    const letterBox = document.querySelector(`[data-letter="${letter}"]`);
    letterBox.classList.add('answered', state);
    // Explicitly set text color for strong contrast and visibility
    switch (state) {
        case 'correct':
            letterBox.style.color = '#083b1a'; // dark green
            break;
        case 'wrong':
            letterBox.style.color = '#4a0000'; // dark red
            break;
        case 'passed':
            letterBox.style.color = '#4a2a00'; // dark orange/brown
            break;
    }
}

// Start the main game timer
function startMainTimer() {
    stopwatch.classList.add('running');
    
    gameState.mainTimer = setInterval(() => {
        gameState.elapsedTime++;
        updateStopwatchDisplay();
    }, 1000);
}

// Update stopwatch display
function updateStopwatchDisplay() {
    const minutes = Math.floor(gameState.elapsedTime / 60);
    const seconds = gameState.elapsedTime % 60;
    stopwatch.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// End the game
function endGame() {
    if (!gameState.gameStarted || gameState.gameEnded) return;
    
    gameState.gameEnded = true;
    
    // Stop the main timer
    if (gameState.mainTimer) {
        clearInterval(gameState.mainTimer);
        gameState.mainTimer = null;
    }
    
    // Stop any question timer
    if (gameState.questionTimer) {
        clearInterval(gameState.questionTimer);
        gameState.questionTimer = null;
    }
    
    // If on question screen, return to main board
    if (questionScreen.classList.contains('active')) {
        returnToMainBoard();
    }
    
    // Update UI to show game over state
    mainBoard.classList.add('game-over');
    stopwatch.classList.remove('running');
    
    // Disable all unanswered letters
    document.querySelectorAll('.letter-box').forEach(box => {
        if (!box.classList.contains('answered')) {
            box.classList.add('disabled');
        }
    });
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', initializeGame);
