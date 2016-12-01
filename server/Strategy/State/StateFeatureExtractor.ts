import { Agent } from '../Agent/Agent'

export class StateFeatureExtractor {

    // number of Center cannon
    static num_center_cannon(agent: Agent) {
        var n = 0;
        if (agent.myPiecesDic['p1'] && agent.myPiecesDic['p1'][1] == 5) n += 1;
        if (agent.myPiecesDic['p2'] && agent.myPiecesDic['p2'][1] == 5) n += 1;
        return n;
    }
    // number of bottom cannon
    static num_bottom_cannon(agent: Agent) {
        var n = 0;
        if (agent.team == 1) {
            if (agent.myPiecesDic['p1'] && agent.myPiecesDic['p1'][0] == 10) n += 1;
            if (agent.myPiecesDic['p2'] && agent.myPiecesDic['p2'][0] == 10) n += 1;
        } else {
            if (agent.myPiecesDic['p1'] && agent.myPiecesDic['p1'][0] == 1) n += 1;
            if (agent.myPiecesDic['p2'] && agent.myPiecesDic['p2'][0] == 1) n += 1;
        }
        return n;
    }


}
