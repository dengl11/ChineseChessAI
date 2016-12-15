
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { ABPruning } from '../ABPruning/ABPruning'
import { Evaluation } from '../_Param/Evaluation'

export class Reorder extends ABPruning {

    strategy = 2;

    get_ordered_moves(agent: Agent) { return this.reordered_moves(agent); }

    // return a list ofreorder reordered moves of playing agent: checkmates->captures->empty_moves
    // [[pieceName, move]]
    reordered_moves(agent: Agent) {
        agent.updatePieceDict();
        agent.oppoAgent.updatePieceDict();
        var typed_moves = this.get_typed_moves(agent);
        var checkmates = typed_moves.filter(x => x[1] == 3).map(x => x[0]);
        // if already can checkmake , then just choose the moves
        if (checkmates.length > 0) return checkmates;
        var captures = typed_moves.filter(x => x[1] == 1).map(x => x[0]);; // [[pieceName, move, oppo_piece_name]]
        var empty_moves = typed_moves.filter(x => x[1] == 0).map(x => x[0]);;
        // sort by capturing piece value
        captures.sort((x, y) => Evaluation.pieceValue(y[0]) - Evaluation.pieceValue(x[0]));
        return captures.concat(empty_moves);
    }



    // return [[[pieceName, move], type]]
    get_typed_moves(agent: Agent) {
        var type_dc = this.get_moves_types(agent);
        var r = [];
        for (var movePieceName in agent.legalMoves) { //legalMoves: {name: []}
            var toPosList = agent.legalMoves[movePieceName];
            for (var i in toPosList) {
                r.push([[movePieceName, toPosList[i]], type_dc[movePieceName][i]])
            }
        }
        return r;
    }

    // return {pieceName: [type]} 0:empty | 1:capture | 2:threatening | 3: checkmake
    get_moves_types(agent: Agent) {
        var oppo_king_pos = agent.oppoAgent.myPiecesDic['k'].toString();
        var types = {};
        for (var movePieceName in agent.legalMoves) { //legalMoves: {name: []}
            var toPosList = agent.legalMoves[movePieceName];
            for (var i in toPosList) {
                var move = toPosList[i];
                var mostStr = move + '';
                if (this.is_check_mate_move(move, oppo_king_pos)) {
                    this.add_move_type(types, movePieceName, 3);
                    continue;
                }
                if (this.is_capture_move(agent, movePieceName, mostStr)) {
                    this.add_move_type(types, movePieceName, 1);
                    continue;
                }
                this.add_move_type(types, movePieceName, 0);
            }
        }
        return types;
    }

    add_move_type(dic, movePieceName, type) {
        var ls = dic[movePieceName];
        if (ls) ls.push(type);
        else ls = [type];
        dic[movePieceName] = ls;
    }
    // check if a move is a checkmate
    is_check_mate_move(move, oppo_king_pos) {
        return move.toString() == oppo_king_pos;
    }

    // check if a move is a capture move
    is_capture_move(agent: Agent, movePieceName, moveStr) {
        var oppo_piece = agent.boardState[moveStr]; // [name, isMyPiece] or null
        return oppo_piece && !oppo_piece[1];
    }

    // copy() { return new Reorder(this.team, this.myPieces.map(x => x.copy()), this.DEPTH); }
    static copyFromDict(dict) {
        return new Reorder(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH);
    }

}
