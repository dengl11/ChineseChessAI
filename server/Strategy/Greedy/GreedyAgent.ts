
import { Agent } from '../Agent/Agent'
import { Piece } from '../../Objects/Piece'
import { Evaluation } from '../_Param/Evaluation'

export class GreedyAgent extends Agent {

    strategy = 0;
    DEPTH = 1;

    // private method of computing next move
    comptuteNextMove(state) {
        this.updateState();
        var moves = this.get_moves_arr(); //[[movePieceName, move]]
        var values = moves.map(x => this.getValueOfMove(x[0], x[1]));
        var max = -Infinity;
        var pos = -1;
        for (var i = 0; i < values.length; i++) {
            if (values[i] > max) {
                pos = i;
                max = values[i];
            }
        }
        if (max > 0) return [this.getPieceByName(moves[pos][0]), moves[pos][1]]; // can capture opponent piece
        // take random move
        return this.random_move();
    }


    getValueOfMove(pieceName, toPos) {
        var piece = this.boardState[toPos.toString()];
        if (piece) return Evaluation.pieceValue(piece[0]);
        return 0;
    }

    static copyFromDict(dict) {
        return new GreedyAgent(dict.team, this.piecesFromDict(dict.myPieces));
    }

}
