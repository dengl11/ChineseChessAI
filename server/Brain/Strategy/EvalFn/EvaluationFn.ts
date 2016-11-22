
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { Evaluation } from '../_Param/Evaluation'

export class EvalFnAgent extends Agent {

    DEPTH = 2;
    // private method of computing next move
    // return [piece, toPos];
    comptuteNextMove() {
        if (this.team == 1) var curr_state = new State(this, this.oppoAgent);
        else var curr_state = new State(this.oppoAgent, this);
        // console.log("curr_state:", curr_state)
        var evalResult = this.recurseEvaluation(curr_state, this.DEPTH, this.team);
        // console.log("evalResult", evalResult)
        var movePiece = this.getPieceByName(evalResult[1][0]);
        // console.log("movePiece", movePiece)
        return [movePiece, evalResult[1][1]];
    }

    // return [score, [movePieceName, toPos]
    recurseEvaluation(state: State, depth, team) {
        // console.log(state, depth, team)
        var endState = state.getEndState(state.redAgent.team);
        if (endState != 0) return [endState * Infinity, null];
        if (depth == 0) return [this.getValueOfState(state), null];
        var playingAgent = team == 1 ? state.redAgent : state.blackAgent;
        var next_evals = []; // list of [score, [movePieceName, toPos]]
        for (var movePieceName in playingAgent.legalMoves) {
            // if (depth == 2) {
            //     console.log(movePieceName)
            //     console.log("======================", depth, "======================");
            // }
            var toPosList = playingAgent.legalMoves[movePieceName];
            for (var i in toPosList) {
                var nextState = state.next_state(movePieceName, toPosList[i], team);
                // if (depth == 2) console.log("--->", toPosList[i])
                var x = [this.recurseEvaluation(nextState, depth - 1, -team)[0], [movePieceName, toPosList[i]]];
                // console.log(toPosList[i], x[0]);
                next_evals.push(x);
            }
        }
        // console.log("next_evals", next_evals)
        var scores = next_evals.map(x => x[0]);
        if (team == state.redAgent.team) var index = scores.indexOf(Math.max.apply(null, scores));
        else var index = scores.indexOf(Math.min.apply(null, scores));
        // if (depth == 2) console.log("======================", next_evals[index], "======================");
        return next_evals[index];
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

}
