let randomNum = parseInt(Math.random() * 100 + 1);
let prevGuess = [];
let numGuess = 1;
let playGame = true;

const form = document.getElementById("guess-form");
const guessField = document.getElementById("guessField");
const attempts = document.getElementById("attempts");
const guesses = document.getElementById("guesses");
const lowOrHi = document.getElementById("lowOrHi");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (playGame) {
        const guess = parseInt(guessField.value);
        validateGuess(guess);
    }
});

function validateGuess(guess) {
    if (isNaN(guess) || guess < 1 || guess > 100) {
        lowOrHi.innerHTML = "Please enter a number between 1 and 100.";
        return;
    }
    checkGuess(guess);
}

function checkGuess(guess) {
    if (guess === randomNum) {
        lowOrHi.innerHTML = "🎉 Congratulations! You guessed it right.";
        endGame();
    } else if (guess < randomNum) {
        lowOrHi.innerHTML = "Too low! Try a bigger number.";
        displayGuess(guess);
    } else {
        lowOrHi.innerHTML = "Too high! Try a smaller number.";
        displayGuess(guess);
    }
}

function displayGuess(guess) {
    guessField.value = "";
    prevGuess.push(guess);
    guesses.innerHTML = "Previous guesses: " + prevGuess.join(", ");
    numGuess++;
    attempts.innerHTML = "Attempts left: " + (11 - numGuess);

    if (numGuess > 10) {
        endGame();
    }
}

function endGame() {
    guessField.setAttribute("disabled", "");
    result.innerHTML = "The number was <strong>" + randomNum + "</strong>.";
    lowOrHi.innerHTML = "Game over!";
    playGame = false;

    const newGameBtn = document.createElement("button");
    newGameBtn.className = "new-game-btn";
    newGameBtn.innerHTML = "Start New Game";
    result.appendChild(newGameBtn);

    newGameBtn.addEventListener("click", newGame);
}

function newGame() {
    randomNum = parseInt(Math.random() * 100 + 1);
    prevGuess = [];
    numGuess = 1;
    playGame = true;

    guesses.innerHTML = "Previous guesses: none";
    attempts.innerHTML = "Attempts left: 10";
    lowOrHi.innerHTML = "";
    result.innerHTML = "";

    guessField.removeAttribute("disabled");
    guessField.value = "";
}
