function getRandomMove(gs) {
    let validMoves = gs.getValidMoves();
    let randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
}