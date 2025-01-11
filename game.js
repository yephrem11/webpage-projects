const boardState = Array(8).fill(null).map(() => Array(8).fill(null)); 
let currentPlayer = "black"; 

const boardElement = document.getElementById("board");
const turnDisplay = document.getElementById("turn-display"); 

function start_game() { //sets up the board before play. there is a uniform set up for othello
    boardState[3][3] = "white"; //index starts at 0
    boardState[3][4] = "black";
    boardState[4][3] = "black";
    boardState[4][4] = "white";
    generate_board();
}

function generate_board() { 
    boardElement.innerHTML = ""; //
    for (let row = 0; row < 8; row++) { //nested loops to create 64 cells
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell"); //makes a cell 
            if (boardState[row][col] === "black") { //if selected by black
                cell.classList.add("black"); // color the cell
            } else if (boardState[row][col] === "white") { //if selected by white
                cell.classList.add("white"); //color the cell
            } else { //not yet selected
                cell.addEventListener("click", () => handleMove(row, col)); //add a check for the click
                if (check_move(row, col, currentPlayer)) {  //if the move can be used by white or black
                    cell.classList.add("green"); //color it as green to mark its available
                }
            }

            boardElement.appendChild(cell);//
        }
    }
}

function check_move(row, col, player) {
    if (boardState[row][col]) return false; //cant select a already colored square

    const opponent = player === "black" ? "white" : "black"; //determines who the opponent is
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ]; //8 different directions for moves in othello

    let check = false;

    for (let [dx, dy] of directions) { //loop through the x and y of the directions
        let x = row + dx; // you move in the direction based on the current row num and col num
        let y = col + dy;
        let hasOpponentBetween = false; 

        while (x >= 0 && x < 8 && y >= 0 && y < 8 && boardState[x][y] === opponent) { //checks the piece
            hasOpponentBetween = true; //checks there is a opponent piece being sandwiched
            x += dx; //continues in the direction more
            y += dy;
        }

        if (hasOpponentBetween && x >= 0 && x < 8 && y >= 0 && y < 8 && boardState[x][y] === player) {
            check = true; //make the move true
            break;
        }
    }

    return check;
}

function handleMove(row, col) {
    if (!check_move(row, col, currentPlayer)) //check if the move is not good
        return;

    boardState[row][col] = currentPlayer; //sets the current to the piece it just selected
    replace_discs(row, col); //replaces the sandwiched discs

    currentPlayer = currentPlayer === "black" ? "white" : "black"; //switches the current player
    turnDisplay.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;//changes the turn text

    generate_board(); //redraws the updated board

    if (board_full()) { //if no available pieces end the game
        call_winner(); 
    }
}

function replace_discs(row, col) {
    const opponent = currentPlayer === "black" ? "white" : "black"; //set opponent color
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ]; //move directions

    for (let [dx, dy] of directions) { //loop through the directions 
        let x = row + dx; //add them to the current row/col positions
        let y = col + dy;
        let flipPositions = []; //empty list to begin for flipped

        while (x >= 0 && x < 8 && y >= 0 && y < 8 && boardState[x][y] === opponent) {
            flipPositions.push([x, y]); //any opponent position in the direction is added to the list
            x += dx; //move further in the same direction for x and y until not an opponent color
            y += dy;
        }

        if (x >= 0 && x < 8 && y >= 0 && y < 8 && boardState[x][y] === currentPlayer) { //if you have pieces surrounding...
            for (let [flipX, flipY] of flipPositions) { //for each piece of in the flipped position
                boardState[flipX][flipY] = currentPlayer; //make them the current players piece
            }
        }
    }
}

function board_full() {
    return !boardState.some(row => row.some(cell => cell === null)); //checks if the board is fully colored
}

function call_winner() {
    const blackCount = boardState.flat().filter(cell => cell === "black").length; //counts total pieces
    const whiteCount = boardState.flat().filter(cell => cell === "white").length;
    //compares the amounts of pieces
    if (blackCount > whiteCount) {
        turnDisplay.textContent = "The Winner is Black";
    } else if (whiteCount > blackCount) {
        turnDisplay.textContent = "The winner is White";
    } else {
        turnDisplay.textContent = "You Tied";
    }
}

start_game();




