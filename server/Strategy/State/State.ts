import { Agent } from '../Agent/Agent'
import { GreedyAgent } from '../Greedy/GreedyAgent'
import { EvalFnAgent } from '../EvalFn/EvaluationFn'
import { Rule } from '../../ChineseChess/Rule/Rule'

export class State {
    redAgent: Agent;
    blackAgent: Agent;
    playingTeam: number;

    constructor(redAgent: Agent, blacAgent: Agent, playingTeam = 1) {
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
        this.playingTeam = playingTeam;
        this.blackAgent.setOppoAgent(this.redAgent);
        this.redAgent.setOppoAgent(this.blackAgent);
    }

    // return | 1:win | -1:lose | 0:continue for playing team
    getEndState() {
        var playing = this.playingTeam == 1 ? this.redAgent : this.blackAgent;
        var endState = Rule.getGameEndState(playing);
        return endState;
    }
    // return a copy of state
    copy(setOppoo = true) {
        var newState = new State(this.redAgent.copy(), this.blackAgent.copy(), this.playingTeam);
        if (setOppoo) {
            newState.redAgent.setOppoAgent(newState.blackAgent);
            newState.blackAgent.setOppoAgent(newState.redAgent);
        }
        return newState;
    }

    // return next state by action
    next_state(movePieceName, toPos) {
        // make a copy a state
        var nextState = this.copy();
        nextState.switchTurn();
        var agent = this.playingTeam == 1 ? nextState.redAgent : nextState.blackAgent;
        agent.movePieceTo(agent.getPieceByName(movePieceName), toPos);
        agent.updateState();
        agent.oppoAgent.updateState();
        return nextState;
    }

    switchTurn() {
        this.playingTeam = -this.playingTeam;
    }
    // return a evaluation score for this state
    getEvaludation(team) {

    }

    static copyFromDict(dict) {
        if (dict.playingTeam == 1) {
            var agent = dict.redAgent;
            var oppo = dict.blackAgent;
        } else {
            var agent = dict.blackAgent;
            var oppo = dict.redAgent;
        }
        oppo = Agent.copyFromDict(oppo);

        switch (agent.strategy) {
            case 1:
                agent = GreedyAgent.copyFromDict(agent);
                break;
            case 2:
                agent = EvalFnAgent.copyFromDict(agent);
                break;
        }
        if (dict.playingTeam == 1)
            return new State(agent, oppo, dict.playingTeam);
        else
            return new State(oppo, agent, dict.playingTeam);
    }

    nextMove() {
        var agent = this.playingTeam == 1 ? this.redAgent : this.blackAgent;
        return agent.comptuteNextMove();
    }

}
