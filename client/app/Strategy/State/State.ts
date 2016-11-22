import { Agent } from '../Agent/Agent'
import { Rule } from '../../ChineseChess/Rule/Rule'

export class State {
    redAgent: Agent;
    blackAgent: Agent;
    playingTeam: number;

    constructor(redAgent: Agent, blacAgent: Agent, playingTeam = 1) {
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
        this.playingTeam = playingTeam;
    }

    // return | 1:win | -1:lose | 0:continue for playing team
    getEndState() {
        var playing = this.playingTeam == 1 ? this.redAgent : this.blackAgent;
        var endState = Rule.getGameEndState(playing);
        return endState;
    }
    // return a copy of state
    copy() {
        var newState = new State(this.redAgent.copy(), this.blackAgent.copy(), this.playingTeam);
        newState.redAgent.setOppoAgent(newState.blackAgent);
        newState.blackAgent.setOppoAgent(newState.redAgent);
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

}
