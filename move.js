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