
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { Evaluation } from '../_Param/Evaluation'

export class ABPruning extends Agent {

    DEPTH = 2;
    strategy = 1;

    // private method of computing next move
    // return [piece, toPos]; null if fail
    comptuteNextMove(curr_state: State) {
        var evalResult = this.recurseEvaluation(curr_state, this.DEPTH, -Infinity, Infinity);
        if (evalResult[0] * this.team == -Infinity) {
            console.log("FAIL!!!!")
            return null;
        }
        var movePiece = this.getPieceByName(evalResult[1][0]);
        return [movePiece, evalResult[1][1]];
    }


    constructor(team: number, myPieces, depth) {
        super(team, myPieces);
        this.DEPTH = depth;
    }

    // return [score, [movePieceName, toPos]
    recurseEvaluation(state: State, depth, alpha, beta) {
        var isMax = state.playingTeam == state.redAgent.team;
        var playingAgent: Agent = state.get_playing_agent();
        playingAgent.updateBoardState();
        var endState = state.getEndState();
        if (endState != 0) {
            // return game score for red agent
            return [state.playingTeam * endState * Infinity, null];
        }
        if (depth == 0) return [this.getValueOfState(state), null];
        playingAgent.computeLegalMoves();
        var moves = this.get_ordered_moves(playingAgent); // [[pieceName, move]]
        var next_evals = []; // list of [score, [movePieceName, toPos]]
        for (var i in moves) { //legalMoves: {name: []}
            var movePieceName = moves[i][0];
            var move = moves[i][1];
            var nextState = state.next_state(movePieceName, move);
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
        return next_evals[index];
    }

    // return a list of reordered moves: checkmates->captures->empty_moves
    // [[pieceName, move]]

    get_ordered_moves(agent: Agent) { return agent.get_moves_arr(); }



    // copy() { return new EvalFnAgent(this.team, this.myPieces.map(x => x.copy()), this.DEPTH); }

    static copyFromDict(dict) {
        return new ABPruning(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH);
    }

}
