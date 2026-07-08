function getRandomMove(gs) {
    let validMoves = gs.getValidMoves();
    let randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
}

function evaluationFunction(gs) { // this is a basic eval function which just counts the net material on board
    // this will be improved later
    let score = 0;
    let pieceValues = {
        'Q': 12,
        'R': 6,
        'B': 4.1,
        'N': 4,
        'P': 1,
        'K': 0
    };

    let Wsqaretable = {
        P: [
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [.5, .5, .5, .5, .5, .5, .5, .5],
            [.1, .1, .2, .3, .3, .2, .1, .1],
            [.05,.05,.1, .25,.25,.1, .05,.05],
            [ 0,  0,  0, .2, .2,  0,  0,  0],
            [.05,-.05,-.1,0, 0,-.1,-.05,.05],
            [.05,.1, .1,-.2,-.2,.1, .1, .05],
            [ 0,  0,  0,  0,  0,  0,  0,  0]
        ],
        N: [
            [-.5,-.4,-.3,-.3,-.3,-.3,-.4,-.5],
            [-.4,-.2,  0,  0,  0,  0,-.2,-.4],
            [-.3,  0, .1, .15,.15,.1,  0,-.3],
            [-.3,.05,.15, .2, .2,.15,.05,-.3],
            [-.3,  0, .15,.2, .2,.15,  0,-.3],
            [-.3,.05,.1, .15,.15,.1, .05,-.3],
            [-.4,-.2,  0, .05,.05,  0,-.2,-.4],
            [-.5,-.4,-.3,-.3,-.3,-.3,-.4,-.5]
        ],
        B: [
            [-.2,-.1,-.1,-.1,-.1,-.1,-.1,-.2],
            [-.1,  0,  0,  0,  0,  0,  0,-.1],
            [-.1,  0, .05,.1, .1, .05,  0,-.1],
            [-.1,.05,.05,.1, .1, .05,.05,-.1],
            [-.1,  0, .1, .1, .1, .1,   0,-.1],
            [-.1,.1, .1, .1, .1, .1,  .1,-.1],
            [-.1,.05,  0,  0,  0,  0, .05,-.1],
            [-.2,-.1,-.1,-.1,-.1,-.1,-.1,-.2]
        ],
        R: [
            [  0,  0,  0,  0,  0,  0,  0,  0],
            [.05,.1, .1, .1, .1, .1, .1, .05],
            [-.05, 0,  0,  0,  0,  0,  0,-.05],
            [-.05, 0,  0,  0,  0,  0,  0,-.05],
            [-.05, 0,  0,  0,  0,  0,  0,-.05],
            [-.05, 0,  0,  0,  0,  0,  0,-.05],
            [-.05, 0,  0,  0,  0,  0,  0,-.05],
            [  0,  0,  0, .05,.05,  0,  0,  0]
        ],
        Q: [
            [-.2,-.1,-.1,-.05,-.05,-.1,-.1,-.2],
            [-.1,  0,  0,   0,   0,  0,  0,-.1],
            [-.1,  0, .05, .05, .05,.05,  0,-.1],
            [-.05, 0, .05, .05, .05,.05,  0,-.05],
            [  0,  0, .05, .05, .05,.05,  0,-.05],
            [-.1, .05,.05, .05, .05,.05,  0,-.1],
            [-.1,  0, .05,  0,   0,  0,   0,-.1],
            [-.2,-.1,-.1,-.05,-.05,-.1,-.1,-.2]
        ],
        K: [
            [-.3,-.4,-.4,-.5,-.5,-.4,-.4,-.3],
            [-.3,-.4,-.4,-.5,-.5,-.4,-.4,-.3],
            [-.3,-.4,-.4,-.5,-.5,-.4,-.4,-.3],
            [-.3,-.4,-.4,-.5,-.5,-.4,-.4,-.3],
            [-.2,-.3,-.3,-.4,-.4,-.3,-.3,-.2],
            [-.1,-.2,-.2,-.2,-.2,-.2,-.2,-.1],
            [ .2, .2,  0,   0,  0,   0, .2, .2],
            [ .2, .3, .1,   0,  0,  .1, .3, .2]
        ]
    };

    let Bsqaretable = {
        P: [...Wsqaretable.P].reverse(),
        N: [...Wsqaretable.N].reverse(),
        B: [...Wsqaretable.B].reverse(),
        R: [...Wsqaretable.R].reverse(),
        Q: [...Wsqaretable.Q].reverse(),
        K: [...Wsqaretable.K].reverse()
    };


    for(let r = 0; r < 8; r++) {

        for(let c = 0; c < 8; c++) {

            let piece = gs.board[r][c];

            if(piece !== '--') {
                let pieceType = piece[1];
                let pieceValue = pieceValues[pieceType];
                if(piece[0] === 'w') {
                    score += pieceValue + Wsqaretable[pieceType][r][c]; //add white pieces
                } else {
                    score -= pieceValue + Bsqaretable[pieceType][r][c]; //substract black pieces
                }
            }

        }
    }
    return score;
}

let nodeCount = 0;  //for counting the number of nodes evaluated by the minimax algorithm

function minimax(depth,alpha,beta,enginesEvaluation,gs){
    nodeCount++;
    if(depth == 0) {
        return evaluationFunction(gs);
    }
    
    let allmoves = gs.getValidMoves();

    if(allmoves.length === 0) {
        if(gs.isKingCheckedAtThisState()) {
            return enginesEvaluation ? -Infinity : +Infinity;
        }
        return 0;
    }

    if(enginesEvaluation){
        let enginesBest = -Infinity;

        for(let move of allmoves){
            gs.makeMove(move);
            enginesBest = Math.max(enginesBest,minimax(depth-1,alpha,beta,false,gs))
            gs.undoMove();
            alpha = Math.max(alpha, enginesBest);
            if(beta <= alpha) break;  
        }

        return enginesBest;

    }else{

        let humansBest = +Infinity;

        for(let move of allmoves){
            gs.makeMove(move);
            humansBest = Math.min(humansBest,minimax(depth-1,alpha,beta,true,gs));
            gs.undoMove();
            beta = Math.min(beta, humansBest);
            if(beta <= alpha) break;
        }

        return humansBest;
    }



}


function findMove(gs) {

    let allmoves = gs.getValidMoves();
    let bestmove = null;
    let bestscore = +Infinity;

    let alpha = -Infinity;
    let beta = +Infinity;
    nodeCount = 0;
    
    for(let move of allmoves) {
        gs.makeMove(move);
        let score = minimax(3, alpha, beta, true, gs);
        gs.undoMove();
        if(bestscore > score){
            bestscore = score;
            bestmove = move;
        }
        beta = Math.min(beta, bestscore);
    }
    console.log("Nodes = " + nodeCount);
    return bestmove;
}
