
import { Agent } from '../Agent/Agent'
import { Piece } from '../../Objects/Piece'
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
        var movablePieces = this.myPieces.filter(x => this.legalMoves[x.name].length > 0);
        for (var i in movablePieces) {
            var name = movablePieces[i].name;
            var moves = this.legalMoves[name];
            for (var j in moves) {
                var move = moves[j];
                var value = this.getValueOfMove(name, move);
                fromPos = movablePieces[i].position;
                if (value > maxVal) {
                    toPos = move;
                    piece = movablePieces[i];
                    maxVal = value;
                }
            }
        }
        if (maxVal > 0) return [piece, toPos]; // can capture opponent piece
        // take random move
        piece = movablePieces[Math.floor(movablePieces.length * Math.random())]
        var moves = this.legalMoves[piece.name];
        toPos = moves[Math.floor(moves.length * Math.random())];
        return [piece, toPos];
    }


    getValueOfMove(pieceName, toPos) {
        var piece = this.boardState[toPos.toString()];
        // var posVal = Evaluation.posValue(pieceName, toPos);
        if (piece) return Evaluation.pieceValue(piece[0]);
        // console.log(pieceName, toPos, posVal)
        // empty place
        return 0;
        // if (piece[1]) alert("Bug");
        // // capture opponent piece
        // return Evaluation.pieceValue(piece[0]) + posVal;
    }


    // return a copy of an agent
    copy() {
        var copy_mypieces = [];
        for (var i in this.myPieces) {
            copy_mypieces.push(this.myPieces[i].copy());
        }
        return new GreedyAgent(this.team, copy_mypieces);
    }

    static copyFromDict(dict) {
        return new GreedyAgent(dict.team, this.piecesFromDict(dict.myPieces));
    }

}
