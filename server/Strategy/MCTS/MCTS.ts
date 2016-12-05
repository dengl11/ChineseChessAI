
import { Agent } from '../Agent/Agent'
import { State } from '../State/State'
import { StateFeatureExtractor } from '../State/StateFeatureExtractor'
import { TDLearner } from '../TDLearner/TDLearner'
import { MCTS_State } from './MCTS_State'

export class MCTS extends TDLearner {

    K_BEST = 12;
    strategy = 5;

    static copyFromDict(dict) {
        return new MCTS(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH, dict.weights);
    }

    // var endState = state.getEndState();
    // if (endState != 0) {
    //     // return game score for red agent
    //     return [state.playingTeam * endState * Infinity, null];
    // }
    // if (depth == 0) return [this.getValueOfState(state), null];


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
        if (depth == 0) {
            var sim = this.simulate(state);
            return [sim, null];
        }

        playingAgent.updatePieceDict();
        playingAgent.oppoAgent.updatePieceDict();
        playingAgent.computeLegalMoves();

        // console.log("before get_typed_moves");
        var typed_moves = this.get_typed_moves(playingAgent);
        // console.log("after get_typed_moves:", typed_moves);
        var checkmates = typed_moves.filter(x => x[1] == 3).map(x => x[0]);
        if (checkmates.length > 0) return [playingAgent.team * Infinity, checkmates[0]];
        var captures = typed_moves.filter(x => x[1] == 1).map(x => x[0]);; // [[pieceName, move, oppo_piece_name]]

        var next_states = captures.map(x => state.next_state(x[0], x[1]));

        var empty_moves = typed_moves.filter(x => x[1] == 0).map(x => x[0]);;
        var k_best_empty_moves = this.pick_k_best_next_states(state, empty_moves, this.K_BEST);
        next_states = next_states.concat(k_best_empty_moves.map(x => x[0]));
        var selected_moves = captures.concat(k_best_empty_moves.map(x => x[1]));

        var next_evals = []; // list of [score, [movePieceName, toPos]]
        for (var i in selected_moves) { //legalMoves: {name: []}
            var nextState = next_states[i];
            // console.log("nextState:", nextState)
            var move = selected_moves[i];
            var eval_result = [this.recurseEvaluation(nextState, depth - 1, alpha, beta)[0], move];
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


    simulate(state: State) {
        var agent = state.get_playing_agent();
        agent.updateState();
        var move = agent.random_move();
        var next_state = state.next_state(move[0].name, move[1]);
        // console.log('simulate')
        return (this.getValueOfState(state) + this.getValueOfState(next_state)) / 2;
    }

    // return [[next_state, move]]
    pick_k_best_next_states(state: State, moves, k) {
        // console.log("pick_k_best_next_states: moves:", moves)
        var next_states = moves.map(move => state.next_state(move[0], move[1]));
        // console.log("pick_k_best_next_states: next_states:", next_states.length)
        var values = next_states.map(x => this.getValueOfState(x));
        // console.log("values:", values)
        var evals = [];
        var comparator;
        if (state.playingTeam == 1) comparator = (x, y) => (y[2] - x[2]);
        else comparator = (x, y) => (x[2] - y[2]);
        for (var i = 0; i < values.length; i++) evals.push([next_states[i], moves[i], values[i]]);
        var k_best = evals.sort(comparator);
        return k_best.slice(0, k).map(x => x.slice(0, 2));
    }

    getValueOfState(state: State) {
        return this.getValueOfAgent(state.redAgent, state) - this.getValueOfAgent(state.blackAgent, state);
    }

}
