
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Evaluation } from '../_Param/Evaluation'
import { Reorder } from '../Reorder/Reorder'

export class TDLeaner extends Reorder {
    strategy = 3;
    static copyFromDict(dict) {
        return new TDLeaner(dict.team, this.piecesFromDict(dict.myPieces), 1);
        // return new TDLeaner(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH);
    }

    getValueOfAgent(agent: Agent, state) {
        // console.log("getValueOfAgent: ", agent.team, " has ", agent.myPieces.length)
        var score = super.getValueOfAgent(agent);
        var fea_vec = this.extract_state_feature(agent, state);
        // console.log("Playing: ", agent.team, " - ", fea_vec)
        // console.log(agent.myPiecesDic)
        return score;
    }

    // extract feature vector of current state for agent
    extract_state_feature(agent, state) {
        /*1*/
        var num_threat = this.get_num_threatening(agent, state);
        /*2*/
        var num_capture = this.get_num_captures(agent, state);
        /*3*/
        var num_center_cannon = StateFeatureExtractor.num_center_cannon(agent)
        /*4*/
        var num_bottom_cannon = StateFeatureExtractor.num_bottom_cannon(agent);
        /*5*/
        var rook_mob = this.num_piece_moves(agent, 'j1') + this.num_piece_moves(agent, 'j2');
        /*6*/
        var horse_mob = this.num_piece_moves(agent, 'm1') + this.num_piece_moves(agent, 'm2');
        /*7*/
        var elephant_mob = this.num_piece_moves(agent, 'x1') + this.num_piece_moves(agent, 'x2');
        var feature_vec = [num_threat, num_capture, num_center_cannon, num_bottom_cannon, rook_mob, horse_mob, elephant_mob];
        // var feature_vec = [num_threaten, num_center_cannon, num_bottom_cannon, rook_mob, horse_mob, elephant_mob];
        // console.log(feature_vec);
        // console.log("num_center_cannon:", num_center_cannon);
        // console.log("num_bottom_cannon:", num_bottom_cannon);
        return feature_vec;
    }

    // get number of possible moves by piece name
    num_piece_moves(agent, piece_name) {
        var moves = agent.myPiecesDic[piece_name];
        if (!moves) return 0;
        return moves.length;
    }
    // return number of pieces that are threatening the oppo king
    get_num_threatening(agent: Agent, state: State) {
        var n = 0;
        var oppoKing = agent.oppoAgent.myPiecesDic['k'].toString();
        for (var pieceName in agent.legalMoves) {
            for (var i in agent.legalMoves[pieceName]) {
                var move = agent.legalMoves[pieceName][i].toString();
                if (move == oppoKing) {
                    n++;
                    break;
                }
            }
        }
        return n;
    }




    // return number of pieces that can capture the oppo piece
    get_num_captures(agent: Agent, state: State) {
        var n = 0;
        for (var pieceName in agent.legalMoves) {
            for (var i in agent.legalMoves[pieceName]) {
                var move: string = agent.legalMoves[pieceName][i].toString();
                if (this.is_capture_move(agent, pieceName, move)) n++;
            }
        }
        return n;
    }


}
