# Quiz Game Show - Interactive Prototype

A high-fidelity interactive quiz game designed for live settings like game shows or classroom activities. The game features 26 questions (one for each letter A-Z) and is controlled by an operator who manages questions and judges player answers.

## How to Run

1. Open `index.html` in a modern web browser
2. The game will start on the Main Game Board showing all 26 letters

## Game Controls

### Main Game Board
- **Select a Question**: Press any letter key (A-Z) on your keyboard to select that letter's question
- **End Game**: Click the stopwatch in the upper-left corner to end the game

### Question Screen (Operator Controls)
- **C key**: Mark answer as Correct (green flash)
- **W key**: Mark answer as Wrong (red flash, shows correct answer)
- **P key**: Pass/Skip question (orange flash)

## Game Flow

1. **Start**: All letters appear in teal boxes. Stopwatch shows 00:00
2. **First Selection**: Press a letter key to start. The stopwatch begins counting
3. **Question Display**: The question appears with a 10-second countdown
4. **Player Response**: The player gives their answer verbally
5. **Operator Judgment**: Press C, W, or P to judge the answer
6. **Feedback**: Screen flashes the appropriate color and returns to main board
7. **Continue**: Select another unanswered letter
8. **End Game**: Click the stopwatch to end. All remaining letters become disabled

## Visual States

- **Teal (#206070)**: Unanswered questions
- **Green (#4CAF50)**: Correct answers
- **Red (#F44336)**: Wrong answers
- **Orange (#FF9800)**: Passed/Skipped questions

## Features

- Responsive design for different screen sizes
- Visual countdown timer with warning state (last 3 seconds)
- Smooth transitions between screens
- Automatic timeout handling (counts as Pass)
- Final scorecard view when game ends

## Technical Details

- Pure HTML, CSS, and JavaScript (no frameworks required)
- Keyboard-driven interface for quick operation
- State management for tracking question progress
- Customizable question database in `questions.js`
