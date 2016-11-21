import { Agent } from '../Agent/Agent'
import { Rule } from '../../ChineseChess/Rule/Rule'

export class State {
    redAgent: Agent;
    blackAgent: Agent;

    constructor(redAgent: Agent, blacAgent: Agent) {
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
    }

    // return | 1:win | -1:lose | 0:continue for team
    getEndState(playingTeam) {
        var playing = playingTeam == 1 ? this.redAgent : this.blackAgent;
        var endState = Rule.getGameEndState(playing);
        return endState;
    }
    // return a copy of state
    copy() {
        var newState = new State(this.redAgent.copy(), this.blackAgent.copy());
        newState.redAgent.setOppoAgent(newState.blackAgent);
        newState.blackAgent.setOppoAgent(newState.redAgent);
        return newState;
    }

    // return next state by action
    next_state(movePieceName, toPos, team) {
        // make a copy a state
        var nextState = this.copy();
        var agent = team == 1 ? nextState.redAgent : nextState.blackAgent;
        agent.movePieceTo(agent.getPieceByName(movePieceName), toPos);
        agent.updateState();
        agent.oppoAgent.updateState();
        return nextState;
    }

    // return a evaluation score for this state
    getEvaludation(team) {

    }

}
