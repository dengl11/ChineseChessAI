
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Evaluation } from '../_Param/Evaluation'

export class TDLeaner extends EvalFnAgent {

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
        var playingAgent: Agent = isMax ? state.redAgent : state.blackAgent;
        var moves = this.reordered_moves(playingAgent); // [[pieceName, move]]
        // console.log("Reorderd: ", moves)
        var next_evals = []; // list of [score, [movePieceName, toPos]]
        for (var i in moves) { //legalMoves: {name: []}
            var movePieceName = moves[i][0];
            var move = moves[i][1];
            // console.log(movePieceName, move)
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

    // return a list of reordered moves: checkmates->captures->empty_moves
    // [[pieceName, move]]
    reordered_moves(agent: Agent) {
        var checkmates = [];
        var captures = []; // [[pieceName, move, oppo_piece_name]]
        var empty_moves = [];
        var oppo_king_pos = agent.oppoAgent.myPiecesDic['k'].toString();
        for (var movePieceName in agent.legalMoves) { //legalMoves: {name: []}
            var toPosList = agent.legalMoves[movePieceName];
            for (var i in toPosList) {
                var move = toPosList[i];
                var mostStr = move + '';
                // checkmates
                if (mostStr == oppo_king_pos) {
                    checkmates.push([movePieceName, move]);
                    continue;
                }
                // capture
                var oppo_piece = agent.boardState[mostStr]; // [name, isMyPiece] or null
                if (oppo_piece && !oppo_piece[1]) {
                    captures.push([movePieceName, move, oppo_piece[0]]);
                    continue;
                }
                empty_moves.push([movePieceName, move]);
            }
        }
        // sort by capturing piece value
        if (captures != []) {
            captures.sort((x, y) => Evaluation.pieceValue(y[2]) - Evaluation.pieceValue(x[2]));
            captures = captures.map(x => x.slice(0, 2))
        }
        // console.log("agent.oppoAgent.myPiecesDic:", agent.oppoAgent.myPiecesDic);
        return checkmates.concat(captures).concat(empty_moves);
    }

    getValueOfAgent(agent: Agent) {
        // console.log("======================");
        var score = super.getValueOfAgent(agent);
        // var num_center_cannon = StateFeatureExtractor.num_center_cannon(agent);
        // var num_bottom_cannon = StateFeatureExtractor.num_bottom_cannon(agent);
        // console.log("num_center_cannon:", num_center_cannon);
        // console.log("num_bottom_cannon:", num_bottom_cannon);
        return score;
    }


    static copyFromDict(dict) {
        return new TDLeaner(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH);
    }
}
