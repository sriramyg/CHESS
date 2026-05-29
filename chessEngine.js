/*

WHAT THIS FILE DOES (till now)??
    - stores the current GameState
    - defines the Move class, GameState class, remember whether it's white's turn or black's turn, stores the move log, and has functions to make and undo moves

*/

class GameState{
    constructor(){
        this.board = [ 
            ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"], 
            ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
            ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
        ];


            // the initial configutation of pieces
            // the pieces are represented as a string with two letters
            // first letter tells the colour of the piece
            // second letter tells what kind of piece is that
            // 'w' = white
            // 'b' = black
            // 'K' = King
            // 'Q' = Queen
            // 'R' = Rook
            // 'B' = Bishop
            // 'N' = Knight
            // 'P' = Pawn
            // '--' represents an empty space

        this.whosTurn = 'w'; //to know who's move
        this.moveLog = []; //storing every move will help us later for 'undo'-ing the move
        this.whiteKingMoved = false;
        this.whiteLeftRookMoved = false;
        this.whiteRightRookMoved = false;
        this.blackKingMoved = false;
        this.blackLeftRookMoved = false;
        this.blackRightRookMoved = false;
    }

    swapTurns(){ // to swap the turns after every move or undo
        if(this.whosTurn === 'w'){
            this.whosTurn = 'b';
        }else{
            this.whosTurn = 'w';
        }
    }

    makeMove(move){ // to make the move on the board as per the user input, push the move to move log and swap turns


        move.prevWhiteKingMoved = this.whiteKingMoved; // if we undo a move, we should be able to restore the castling rights as well
        move.prevWhiteLeftRookMoved = this.whiteLeftRookMoved;
        move.prevWhiteRightRookMoved = this.whiteRightRookMoved;
        move.prevBlackKingMoved = this.blackKingMoved;
        move.prevBlackLeftRookMoved = this.blackLeftRookMoved;
        move.prevBlackRightRookMoved = this.blackRightRookMoved;

        this.board[move.startRow][move.startCol] = "--";
        this.board[move.endRow][move.endCol] = move.pieceMoved;
        this.moveLog.push(move);
        this.swapTurns();

        // pawn promotion
        if(move.pieceMoved === 'wK') {
            this.whiteKingMoved = true;
        } else if(move.pieceMoved === 'bK') {
            this.blackKingMoved = true;
        }

        if(move.startRow === 7 && move.startCol === 0) {
            this.whiteLeftRookMoved = true;
        } else if(move.startRow === 7 && move.startCol === 7) {
            this.whiteRightRookMoved = true;
        } else if(move.startRow === 0 && move.startCol === 0) {
            this.blackLeftRookMoved = true;
        } else if(move.startRow === 0 && move.startCol === 7) {
            this.blackRightRookMoved = true;
        }

        if(move.pieceMoved === 'wP' && move.endRow === 0) {
            this.board[move.endRow][move.endCol] = 'wQ'; // auto promote to queen
        }else if(move.pieceMoved === 'bP' && move.endRow === 7) {
            this.board[move.endRow][move.endCol] = 'bQ';
        }


        // when the user selects the king castling move, corresponding rook should be moved
        if(move.pieceMoved === 'wK' && move.startCol === 4 && move.endCol === 6){
            this.board[7][5] = 'wR';
            this.board[7][7] = '--';
        }else if(move.pieceMoved === 'wK' && move.startCol === 4 && move.endCol === 2){
            this.board[7][3] = 'wR';
            this.board[7][0] = '--';
        }else if(move.pieceMoved === 'bK' && move.startCol === 4 && move.endCol === 6){
            this.board[0][5] = 'bR';
            this.board[0][7] = '--';
        }else if(move.pieceMoved === 'bK' && move.startCol === 4 && move.endCol === 2){
            this.board[0][3] = 'bR';
            this.board[0][0] = '--';
        }
    }

    undoMove(){ // to undo the last move, pop the move from move log and swap turns
        if(this.moveLog.length !== 0){
            let move = this.moveLog.pop();
            this.board[move.endRow][move.endCol] = move.pieceCaptured;
            this.board[move.startRow][move.startCol] = move.pieceMoved;
            this.swapTurns();

            this.whiteKingMoved = move.prevWhiteKingMoved; // to restore castling rights
            this.whiteLeftRookMoved = move.prevWhiteLeftRookMoved;
            this.whiteRightRookMoved = move.prevWhiteRightRookMoved;
            this.blackKingMoved = move.prevBlackKingMoved;
            this.blackLeftRookMoved = move.prevBlackLeftRookMoved;
            this.blackRightRookMoved = move.prevBlackRightRookMoved;

            // undo rook movement when castling
            if(move.pieceMoved === 'wK' && move.startCol === 4 && move.endCol === 6){
                this.board[7][7] = 'wR';
                this.board[7][5] = '--';
            } else if(move.pieceMoved === 'wK' && move.startCol === 4 && move.endCol === 2){
                this.board[7][0] = 'wR';
                this.board[7][3] = '--';
            } else if(move.pieceMoved === 'bK' && move.startCol === 4 && move.endCol === 6){
                this.board[0][7] = 'bR';
                this.board[0][5] = '--';
            } else if(move.pieceMoved === 'bK' && move.startCol === 4 && move.endCol === 2){
                this.board[0][0] = 'bR';
                this.board[0][3] = '--';
            }
        }
    }

    getValidMoves() {
        let moves = [];
        this.getAllPossibleMoves(moves);
        for(let i = moves.length - 1; i >= 0; i--){
            this.makeMove(moves[i]);
            let checked = this.isKingCheckedAtThisState();
            if(checked){
                moves.splice(i, 1);
            }
            this.undoMove();
        }
        return moves;
    }


    getAllPossibleMoves(moves) {
        for(let r=0; r<8; r++){
            for(let c=0; c<8; c++){
                if(this.board[r][c][0] === this.whosTurn){
                    let piece = this.board[r][c][1];

                    if(piece === 'N'){
                        this.getKnightMoves(r, c, moves);
                    }

                    if(piece === 'R'){
                        this.getRookMoves(r, c, moves);
                    }

                    if(piece === 'B'){
                        this.getBishopMoves(r, c, moves);
                    }

                    if(piece === 'Q'){
                        this.getQueenMoves(r, c, moves);
                    }
                    
                    if(piece === 'K'){
                        this.getKingMoves(r, c, moves);
                    }

                    if(piece === 'P') {
                        this.getPawnMoves(r, c, moves);
                    }                   
                }
            }
        }
    }
    
    getKnightMoves(R, C, moves) {

        let knightOffset = [[-1,-2], [-1,2], [1,-2], [1,2], [-2,-1], [-2,1], [2,-1], [2,1]];
        let newR = 0;
        let newC = 0;

        for(let offset of knightOffset){
            newR = R + offset[0];
            newC = C + offset[1];
            if( ( newR >= 0 && newR < 8 )  &&  ( newC >= 0 && newC < 8 ) ){
                let pieceInEndSqare = this.board[newR][newC]
                if(pieceInEndSqare[0] !== this.whosTurn){
                    let move = new Move([R,C], [newR,newC],this.board);
                    moves.push(move);
                }
            }
        }
    }

    getRookMoves(R,C,moves){

        let direction = [[-1,0], [0,-1], [1,0], [0,1]];

        for(let ele of direction){
            let newR = R+ele[0];
            let newC = C+ele[1];
            
            while( ( newR >= 0 && newR < 8 )  &&  ( newC >= 0 && newC < 8 ) ){
                if( this.board[newR][newC][0]==='-' ){
                    let move = new Move([R,C], [newR,newC], this.board);
                    moves.push(move);
                }else if( this.board[newR][newC][0] !== this.whosTurn ){
                    let move = new Move([R,C], [newR,newC], this.board);
                    moves.push(move);
                    break;
                }else if( this.board[newR][newC][0] === this.whosTurn ){
                    break;
                }
                newR += ele[0];
                newC += ele[1];
            }
        }        
    }

    getBishopMoves(R,C,moves){
        let direction = [[1,1] ,[1,-1], [-1,1], [-1,-1]];
        for(let dir of direction){
            let newR = R + dir[0];
            let newC = C + dir[1];

            while( ( newR >= 0 && newR < 8 )  &&  ( newC >= 0 && newC < 8 ) ){
                if( this.board[newR][newC][0] === '-' ){
                    let move = new Move([R,C], [newR,newC], this.board);
                    moves.push(move);
                } else if( this.board[newR][newC][0] !== this.whosTurn ){
                    let move = new Move([R,C], [newR,newC], this.board);
                    moves.push(move);
                    break;
                } else if( this.board[newR][newC][0] === this.whosTurn ){
                    break;
                }

                newR += dir[0];
                newC += dir[1];
            }
        }
    }

    getQueenMoves(R,C,moves){
        this.getBishopMoves(R,C,moves);
        this.getRookMoves(R,C,moves);
    }

    getKingMoves(R,C,moves){
        let kingOffset = [[0,1], [1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1]];
        let newR = 0;
        let newC = 0;
        for(let offset of kingOffset){
            newR = R + offset[0];
            newC = C + offset[1];
            if( ( newR >= 0 && newR < 8 )  &&  ( newC >= 0 && newC < 8 ) ){
                if(this.board[newR][newC][0] !== this.whosTurn){
                    let move = new Move([R,C], [newR,newC], this.board);
                    moves.push(move);
                }
            }
        }


        //white right
        if(this.whosTurn == 'w' && !this.whiteKingMoved && !this.whiteRightRookMoved){
            if(this.board[7][5] === '--' && this.board[7][6] === '--'){ // if there are no pieces between white king and white right rook.

                this.board[7][5] = 'wK';
                this.board[7][4] = '--';
                let isKingPassingThroughCheck = this.isKingCheckedAtThisState();

                this.board[7][5] = '--'; //latest
                this.board[7][6] = 'wK';
                let isKingCheckedAfterCastling = this.isKingCheckedAtThisState();

                this.board[7][6] = '--'; //latest
                this.board[7][4] = 'wK'; //latest

                if(!isKingCheckedAfterCastling && !isKingPassingThroughCheck){
                    let kingmove = new Move([7,4], [7,6], this.board);
                    // let rookmove = new Move([7,7], [7,5], this.board); ---> this is not needed, moving king and moving rook are not two separate moves, we can't push into moves as if they are separate.
                    moves.push(kingmove); // we will handle it in makeMove function, that when king is jumped by two/three squares we have to change the rook's positon as well

                }
                
            }
        }

        //white left
        if(this.whosTurn === 'w' && !this.whiteKingMoved && !this.whiteLeftRookMoved){
            if(this.board[7][1] === '--' && this.board[7][2] === '--' && this.board[7][3] === '--'){
                this.board[7][3] = 'wK';
                this.board[7][4] = '--';
                let isKingPassingThroughCheck = this.isKingCheckedAtThisState();
                this.board[7][3] = '--';
                this.board[7][2] = 'wK';
                let isKingCheckedAfterCastling = this.isKingCheckedAtThisState();
                this.board[7][2] = '--';
                this.board[7][4] = 'wK';
                if(!isKingCheckedAfterCastling && !isKingPassingThroughCheck){
                    moves.push(new Move([7,4], [7,2], this.board));
                }
            }
        }

        //black right
        if(this.whosTurn === 'b' && !this.blackKingMoved && !this.blackRightRookMoved){
            if(this.board[0][5] === '--' && this.board[0][6] === '--'){
                this.board[0][5] = 'bK';
                this.board[0][4] = '--';
                let isKingPassingThroughCheck = this.isKingCheckedAtThisState();
                this.board[0][5] = '--';
                this.board[0][6] = 'bK';
                let isKingCheckedAfterCastling = this.isKingCheckedAtThisState();
                this.board[0][6] = '--';
                this.board[0][4] = 'bK';
                if(!isKingCheckedAfterCastling && !isKingPassingThroughCheck){
                    moves.push(new Move([0,4], [0,6], this.board));
                }
            }
        }

        //black left
        if(this.whosTurn === 'b' && !this.blackKingMoved && !this.blackLeftRookMoved){
            if(this.board[0][1] === '--' && this.board[0][2] === '--' && this.board[0][3] === '--'){
                this.board[0][3] = 'bK';
                this.board[0][4] = '--';
                let isKingPassingThroughCheck = this.isKingCheckedAtThisState();
                this.board[0][3] = '--';
                this.board[0][2] = 'bK';
                let isKingCheckedAfterCastling = this.isKingCheckedAtThisState();
                this.board[0][2] = '--';
                this.board[0][4] = 'bK';
                if(!isKingCheckedAfterCastling && !isKingPassingThroughCheck){
                    moves.push(new Move([0,4], [0,2], this.board));
                }
            }
        }

    }

    getPawnMoves(R,C,moves){
        let moveDirection = (this.whosTurn === 'w') ? -1 : 1;
        let startRow = (this.whosTurn === 'w') ? 6 : 1;

        let enemy = (this.whosTurn === 'w') ? 'b' : 'w';

        if( this.board[ R + moveDirection ][C][0] === '-' ){

            let move1 = new Move([R,C], [R + moveDirection,C], this.board);
            moves.push(move1);

            if( R === startRow && this.board[ R + moveDirection + moveDirection ][C][0] === '-' ){
                let move2 = new Move([R,C], [R + moveDirection + moveDirection,C], this.board);
                moves.push(move2);
            }

        }

        if( C+1 < 8 && this.board[ R + moveDirection ][C+1][0] === enemy ){
            let move = new Move([R,C], [ R + moveDirection, C+1], this.board);
            moves.push(move);
        }

        if( C-1 >= 0 && this.board[ R + moveDirection ][C-1][0] === enemy ){
            let move = new Move([R,C], [ R + moveDirection, C-1], this.board);
            moves.push(move);
        }
    }


    getPlayerKingSquare(whichKing){
        for(let r=0; r<8; r++){
            for(let c=0; c<8; c++){
                if(this.board[r][c] === whichKing + 'K'){
                    return [r,c];
                }
            }
        }
    }

    isKingCheckedAtThisState(){

        this.swapTurns();
        let whichKing = this.whosTurn;
        this.swapTurns();

        let counterMoveList = [];
        this.getAllPossibleMoves(counterMoveList);

        let currentKingSqare = this.getPlayerKingSquare(whichKing);

        for(let move of counterMoveList){
            if((move.endRow === currentKingSqare[0]) && (move.endCol === currentKingSqare[1])){
                return true;
            }
        }
        return false;
    }



}



class Move{
    constructor(startSq,endSq,board){

        //in the standard chess notation, there would be more information, but here, for our simplicity we use the row and column instead of rank and file

        this.ranksToRows = {"1": 7, "2": 6, "3": 5, "4": 4, "5": 3, "6": 2, "7": 1, "8": 0};
        this.rowsToRanks = {"7": "1", "6": "2", "5": "3", "4": "4", "3": "5", "2": "6", "1": "7", "0": "8"};
        this.filesToCols = {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7};
        this.colsToFiles = {"0": "a", "1": "b", "2": "c", "3": "d", "4": "e", "5": "f", "6": "g", "7": "h"};

        //for every move, we need to know the starting square and the ending square, piece moved and the piece captured
        //so, here, we will store all these information in the move class
        this.startRow = startSq[0];
        this.startCol = startSq[1];
        this.endRow = endSq[0];
        this.endCol = endSq[1];
        this.pieceMoved = board[this.startRow][this.startCol];
        this.pieceCaptured = board[this.endRow][this.endCol];

    }

    getChessNotation(){ // update this later to proper chess notation, it just returns the start and end square in rank and file notation
        return this.getRankFile(this.startCol,this.startRow) + this.getRankFile(this.endCol,this.endRow);
    }

    getRankFile(Col,Row){ // (0,0) to 'a8'
        return this.colsToFiles[Col] + this.rowsToRanks[Row];
    }

    equals(other){
    return (this.startRow === other.startRow) && (this.startCol === other.startCol) && (this.endRow === other.endRow) && (this.endCol === other.endCol);
    }

}