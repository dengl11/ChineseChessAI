
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { Evaluation } from '../_Param/Evaluation'

export class EvalFnAgent extends Agent {

    DEPTH = 2;
    strategy = 2;
    // private method of computing next move
    // return [piece, toPos]; null if fail
    comptuteNextMove(updateDict = false) {
        if (this.team == 1) var curr_state = new State(this, this.oppoAgent);
        else curr_state = new State(this.oppoAgent, this, this.team, updateDict);
        // console.log("curr_state:", curr_state)
        var evalResult = this.recurseEvaluation(curr_state, this.DEPTH, -Infinity, Infinity);
        // console.log("evalResult", evalResult)
        var movePiece = this.getPieceByName(evalResult[1][0]);
        // console.log("movePiece", movePiece)
        if (evalResult[0] * this.team == -Infinity) {
            console.log("FAIL!!!!")
            return null;
        }
        return [movePiece, evalResult[1][1]];
    }


    constructor(team: number, myPieces, depth) {
        super(team, myPieces);
        this.DEPTH = depth;

    }

    // // return [score, [movePieceName, toPos]
    // recurseEvaluation(state: State, depth, alpha, beta) {
    //     var isMax = state.playingTeam == state.redAgent.team;
    //     var endState = state.getEndState();
    //     if (endState != 0) {
    //         // console.log("end:", state)
    //         // return game score for red agent
    //         return [state.playingTeam * endState * Infinity, null];
    //     }
    //     if (depth == 0) return [this.getValueOfState(state), null];
    //     var playingAgent = isMax ? state.redAgent : state.blackAgent;
    //     var next_evals = []; // list of [score, [movePieceName, toPos]]
    //     for (var movePieceName in playingAgent.legalMoves) {
    //         var toPosList = playingAgent.legalMoves[movePieceName];
    //         for (var i in toPosList) {
    //             var nextState = state.next_state(movePieceName, toPosList[i]);
    //             // eval: [score, [movePieceName, toPos]]
    //             var eval_result = [this.recurseEvaluation(nextState, depth - 1, alpha, beta)[0], [movePieceName, toPosList[i]]];
    //             next_evals.push(eval_result);
    //
    //             if (isMax) {// max node -> increase lower bound
    //                 alpha = Math.max(alpha, eval_result[0]);
    //                 // if lower bound of this max node is higher than upper bound of its descendant min nodes, then return
    //                 if (beta <= alpha) return eval_result; // beta cutoff
    //             } else { // min node -> decrease upper bound
    //                 beta = Math.min(beta, eval_result[0]);
    //                 // if upper bound of this min node is lower than upper bound of its descendant max nodes, then return
    //                 if (beta <= alpha) return eval_result; // alpha cutoff
    //             }
    //
    //         }
    //     }
    //     // console.log("next_evals", next_evals)
    //     var scores = next_evals.map(x => x[0]);
    //     // console.log(scores)
    //     // console.log(next_evals)
    //     var index = scores.indexOf(Math.max.apply(null, scores));
    //     if (isMax) var index = scores.indexOf(Math.max.apply(null, scores));
    //
    //     else var index = scores.indexOf(Math.min.apply(null, scores));
    //     console.log("======================\n", next_evals, "\nChoose: ", next_evals[index], "======================");
    //     return next_evals[index];
    // }
    //


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
        var moves = this.get_moves(playingAgent); // [[pieceName, move]]
        // console.log("Reorderd: ", moves)
        var next_evals = []; // list of [score, [movePieceName, toPos]]
        for (var i in moves) { //legalMoves: {name: []}
            var movePieceName = moves[i][0];
            var move = moves[i][1];
            // console.log(movePieceName, move)
            var nextState = state.next_state(movePieceName, move);
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
    get_moves(agent: Agent) {
        var moves = [];
        for (var movePieceName in agent.legalMoves) { //legalMoves: {name: []}
            var toPosList = agent.legalMoves[movePieceName];
            for (var i in toPosList) {
                var move = toPosList[i];
                moves.push([movePieceName, move]);
            }
        }
        return moves;
    }

    // return value of state for redAgent
    getValueOfState(state: State) {
        return this.getValueOfAgent(state.redAgent) - this.getValueOfAgent(state.blackAgent);
    }

    getValueOfAgent(agent: Agent) {
        // console.log("======================");
        var score = 0;
        for (var i in agent.myPieces) {
            score += this.getValOfPiece(agent.myPieces[i], agent.team);
        }
        return score;
    }

    getValOfPiece(piece, team) {
        return Evaluation.posValue(piece.name, piece.position, team) + Evaluation.pieceValue(piece.name);
    }
    copy() {
        var copy_mypieces = [];
        for (var i in this.myPieces) {
            copy_mypieces.push(this.myPieces[i].copy());
        }
        return new EvalFnAgent(this.team, copy_mypieces, this.DEPTH);
    }

    static copyFromDict(dict) {
        return new EvalFnAgent(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH);
    }

}
