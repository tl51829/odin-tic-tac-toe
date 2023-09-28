// Player factory function
const Player = (sign) => {
    this.sign = sign; 
    
    return {
        sign
    };
}

/**
 * Gameboard module
 *  */
const gameboard = (function () {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const setField = (index, sign) => {
        gameboard[index] = sign;
    };
    
    const getField = index => {
        return gameboard[index];
    };

    const reset = () => {
        for (let i = 0; i < gameboard.length; i++) {
            gameboard[i] = "";
        }
    }

    return {
        setField,
        getField,
        reset,
        gameboard
    };
})();



// Display controller module
const displayController = (function() {
    const board = gameboard.gameboard;

    const htmlGameboard = document.querySelector(".gameboard");
    const reset = document.querySelector(".reset");
    const message = document.querySelector(".message");
    
    const displayBoard = () => {
        for (let i = 0; i < board.length; i++) {
            const field = document.createElement("div");
            field.classList.add("field");

            field.textContent = board[i];
            htmlGameboard.appendChild(field);
        }
    };
    displayBoard();

    const setMessage = (m) => {
        message.textContent = m;   
    };

    const fields = document.querySelectorAll(".field");

    for (let i = 0; i < board.length; i++) {
        fields[i].addEventListener("click", () => {
            if (gameController.getIsOver()) {
                gameboard.reset();
                fields.forEach(field => {
                    field.textContent = "";
                }); 
                gameController.reset();
            } else {
                fields[i].textContent = gameController.getCurrentPlayer();
                gameboard.setField(i, gameController.getCurrentPlayer());
                gameController.playRound(i);   
            }
        });
    }

    reset.addEventListener("click", () => {
        gameboard.reset();
        fields.forEach(field => {
            field.textContent = "";
        });
        gameController.reset();
    });

    return {
        setMessage
    };
    
})();


/**
 * Game game controller module
 * */
const gameController = (function() {
    const board = gameboard.gameboard;

    const playerX = Player("X");
    const playerO = Player("O");
    let currentPlayer = "X";
    let isOver = false;

    const playRound = (index) => {
        if (checkWinner(index)) {
            displayController.setMessage(currentPlayer + " wins!");
            isOver = true;
            return;
        }

        if (checkTie()) {
            displayController.setMessage("Tie!");
            isOver = true;
            return;
        }

        if (currentPlayer == "X") {
            currentPlayer = "O";
        } else if (currentPlayer == "O") {
            currentPlayer = "X";
        }
        
        displayController.setMessage("Player " + currentPlayer + "'s turn!");
    };

    const getCurrentPlayer = () => {
        return currentPlayer;
    };

    const getIsOver = () => {
        return isOver;
    };

    const checkWinner = (fieldIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winConditions.filter(combination => combination.includes(fieldIndex)).some(possibleCombination => possibleCombination.every(index => gameboard.getField(index) === getCurrentPlayer()));
    };

    const reset = () => {
        displayController.setMessage("Player " + currentPlayer + "'s turn!")
        isOver = false;
    };

    const checkTie = () => {
        const board = gameboard.gameboard;
        for (let i = 0, j = board.length; i < j; i++) {
            if (board[i] == "") {
                return false;
            }
        }
        return true;
    };

    return {
        playRound,
        getCurrentPlayer,
        getIsOver,
        reset
    };
})();
