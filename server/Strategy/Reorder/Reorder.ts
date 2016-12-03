
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Evaluation } from '../_Param/Evaluation'

export class Reorder extends EvalFnAgent {

    strategy = 2;

    comptuteNextMove() {
        if (this.team == 1) var curr_state = new State(this, this.oppoAgent, this.team, true);
        else curr_state = new State(this.oppoAgent, this, this.team, true);
        // console.log("curr_state:", curr_state)
        var evalResult = this.recurseEvaluation(curr_state, this.DEPTH, -Infinity, Infinity);
        // console.log("evalResult", evalResult)
        var movePiece = this.getPieceByName(evalResult[1][0]);
        // console.log("movePiece", movePiece)
        return [movePiece, evalResult[1][1]];
    }

    // return [score, [movePieceName, toPos]
    recurseEvaluation(state: State, depth, alpha, beta) {
        var isMax = state.playingTeam == state.redAgent.team;
        var endState = state.getEndState();
        if (endState != 0) {
            // console.log("end:", state)
            // return game score for red agent
            return [state.playingTeam * endState * Infinity, null];
        }
        if (depth == 0) return [this.getValueOfState(state), null];
        var moves = this.reordered_moves(state); // [[pieceName, move]]
        // console.log("Reorderd: ", moves)
        var next_evals = []; // list of [score, [movePieceName, toPos]]
        for (var i in moves) { //legalMoves: {name: []}
            var movePieceName = moves[i][0];
            var move = moves[i][1];
            console.log(movePieceName, move)
            var nextState = state.next_state(movePieceName, move, true);
            // console.log("=====================", nextState.playingTeam, "=====================");
            // eval: [score, [movePieceName, toPos]]
            var eval_result = [this.recurseEvaluation(nextState, depth - 1, alpha, beta)[0], [movePieceName, move]];
            next_evals.push(eval_result);

            if (isMax) {// max node -> increase lower bound
                alpha = Math.max(alpha, eval_result[0]);
                // if lower bound of this max node is higher than upper bound of its descendant min nodes, then return
                if (beta <= alpha) return eval_result; // beta cutoff
            } else { // min node -> decrease upper bound
                beta = Math.min(beta, eval_result[0]);
                // if upper bound of this min node is lower than upper bound of its descendant max nodes, then return
                if (beta <= alpha) return eval_result; // alpha cutoff
            }
        }
        var scores = next_evals.map(x => x[0]);
        var index = scores.indexOf(Math.max.apply(null, scores));
        if (isMax) var index = scores.indexOf(Math.max.apply(null, scores));
        else var index = scores.indexOf(Math.min.apply(null, scores));
        // if (depth == 2) console.log("======================", next_evals[index], "======================");
        // console.log("======================", next_evals, "====================== Choose: ", next_evals[index]);
        return next_evals[index];
    }

    // return a list of reordered moves of playing agent: checkmates->captures->empty_moves
    // [[pieceName, move]]
    reordered_moves(state) {
        var agent = state.get_playing_agent();

        var typed_moves = this.get_typed_moves(agent, state);
        var checkmates = typed_moves.filter(x => x[1] == 3).map(x => x[0]);
        var threatening = typed_moves.filter(x => x[1] == 2).map(x => x[0]);;
        var captures = typed_moves.filter(x => x[1] == 1).map(x => x[0]);; // [[pieceName, move, oppo_piece_name]]
        var empty_moves = typed_moves.filter(x => x[1] == 0).map(x => x[0]);;
        // sort by capturing piece value
        captures.sort((x, y) => Evaluation.pieceValue(y[0]) - Evaluation.pieceValue(x[0]));
        // console.log("*********************threatening:", threatening)
        // console.log("agent.oppoAgent.myPiecesDic:", agent.oppoAgent.myPiecesDic);
        return checkmates.concat(threatening).concat(captures).concat(empty_moves);
    }



    // return [[[pieceName, move], type]]
    get_typed_moves(agent: Agent, state) {
        var type_dc = this.get_moves_types(state, agent);
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
    get_moves_types(state, agent: Agent) {
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
                if (this.is_threatening_move(state, movePieceName, move)) {
                    this.add_move_type(types, movePieceName, 2);
                    continue;
                }
                if (this.is_capture_move(agent, movePieceName, move, mostStr)) {
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

    // check if a move is threatening the oppo king
    is_threatening_move(state: State, movePieceName, move) {
        var nextState = state.next_state(movePieceName, move, true);
        var agent = nextState.get_playing_agent().oppoAgent;
        var oppo_king_pos = agent.oppoAgent.myPiecesDic['k'].toString();
        for (var piece in agent.legalMoves) {
            var moves = agent.legalMoves[piece];
            for (var i in moves) {
                if (moves[i].toString() == oppo_king_pos) { return true; }
            }
        }
        return false;
    }

    // check if a move is a capture move
    is_capture_move(agent: Agent, movePieceName, move, mostStr) {
        var oppo_piece = agent.boardState[mostStr]; // [name, isMyPiece] or null
        return oppo_piece && !oppo_piece[1];
    }



    static copyFromDict(dict) {
        return new Reorder(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH);
    }
}
