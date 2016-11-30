
import { Agent } from '../Agent/Agent'
import { Evaluation } from '../_Param/Evaluation'

export class GreedyAgent extends Agent {

    strategy = 1;

    // private method of computing next move
    comptuteNextMove() {
        // var pieceNames = Object.keys(this.legalMoves);
        var piece;
        var maxVal = 0;
        var maxVal = -Infinity;
        var fromPos = [];
        var toPos = [];
        for (var i in this.myPieces) {
            var name = this.myPieces[i].name;
            var moves = this.legalMoves[name];
            for (var j in moves) {
                var move = moves[j];
                var value = this.getValueOfMove(name, move);
                fromPos = this.myPieces[i].position;
                if (value > maxVal) {
                    toPos = move;
                    piece = this.myPieces[i];
                    maxVal = value;
                }
            }
        }
        return [piece, toPos];
    }


    getValueOfMove(pieceName, toPos) {
        var piece = this.boardState[toPos.toString()];
        var posVal = Evaluation.posValue(pieceName, toPos);
        if (!piece) return posVal; // empty place
        if (piece[1]) alert("Bug");
        return Evaluation.pieceValue(piece[0]) + posVal;
    }


    // return a copy of an agent
    copy() {
        var copy_mypieces = [];
        for (var i in this.myPieces) {
            copy_mypieces.push(this.myPieces[i].copy());
        }
        return new GreedyAgent(this.team, copy_mypieces, this.copyMoves());
    }
}
