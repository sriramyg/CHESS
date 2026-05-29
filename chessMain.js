/*

WHAT THIS FILE DOES??
    - handles user inpput
    - displays the current GameState
    - this is the main driver file

*/

const canvas = document.getElementById("chessboard");
const ctx = canvas.getContext("2d");

//initializing the constants

const WIDTH = 512; 
const HEIGHT = 512;
const DIMENSION = 8;
const SQUARE_SIZE = HEIGHT / DIMENSION;
const IMAGES = {};

const gs = new GameState(); // this will store the current GameState, update it for every move
let sqSelected = null; // the latest sqaure coordinates selected
let userClicks = [];// to store the first and second click of the user
                    // [[6,4], [4,4]] = e2 to e4 

function loadImages() { // to load the images to the dictionary 'IMAGES'
    const pieces = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP', 'bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
    for (let piece of pieces) {
        let img = new Image();
        img.src = "images/" + piece + ".png";
        IMAGES[piece] = img;
    }
}

function drawGameState() {
    drawBoard(); 
    drawHighlights();
    drawPieces(gs.board);
}

function drawBoard() {
    const colors = ["#f0d9b5", "#b58863"];
    for (let r = 0; r < DIMENSION; r++) {
        for (let c = 0; c < DIMENSION; c++) {
            let color = colors[(r + c) % 2];
            ctx.fillStyle = color;
            ctx.fillRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        }
    }

    // draw numbers (1-8) on left side
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";

    for(let r = 0; r < 8; r++) {
        ctx.fillText(8 - r, 2, r * SQUARE_SIZE + 14);
    }

    // draw letters (a-h) on bottom
    let files = ['a','b','c','d','e','f','g','h'];

    for(let c = 0; c < 8; c++) {
        ctx.fillText(files[c], c * SQUARE_SIZE + 56, HEIGHT - 2);
    }
}

function drawPieces(board) {
    for (let r = 0; r < DIMENSION; r++) {
        for (let c = 0; c < DIMENSION; c++) {
            let piece = board[r][c];
            if (piece !== "--") {
                ctx.drawImage(IMAGES[piece], c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
}

function drawHighlights(){// highlights the first square selected
    if (sqSelected !== null) {
        ctx.fillStyle = "rgba(255, 255, 0, 0.4)";
        ctx.fillRect(sqSelected[1] * SQUARE_SIZE, sqSelected[0] * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }   
}

canvas.addEventListener("click", function(e) {
    let col = Math.floor(e.offsetX / SQUARE_SIZE);
    let row = Math.floor(e.offsetY / SQUARE_SIZE);

    if (sqSelected && sqSelected[0] === row && sqSelected[1] === col) { // if the user clicks same sqaure twice
        sqSelected = null; 
        userClicks = []; // deselection
    } else { // else update the selected one
        sqSelected = [row, col];
        userClicks.push(sqSelected);
    }

    if (userClicks.length === 2) { // reset after second click + move
        let move = new Move(userClicks[0], userClicks[1], gs.board);
        let validMoves = gs.getValidMoves();
        if(validMoves.length === 0){
            gs.swapTurns();
            if(gs.isKingCheckedAtThisState()){
                window.alert("CHECKMATE :|");
                console.log('CHECKMATE :|');
            }else{
                window.alert("STALEMATE :(");
                console.log('STALEMATE :(')
            }
            gs.swapTurns();
            
        }

        for(let i of validMoves){
            if(move.equals(i)){ // when you do 'move.equals(i)' there 'move' becomes 'this', and 'i' becomes 'other'
                console.log(move.getChessNotation());
                gs.makeMove(move);
                break;
            }
        }
    
        sqSelected = null;
        userClicks = [];


        
    }

    drawGameState();
});

document.addEventListener("keydown", function(e) { // undo move for 'z'
    if (e.key === "z") {
        gs.undoMove();
        drawGameState();
    }
});

loadImages();
drawGameState();