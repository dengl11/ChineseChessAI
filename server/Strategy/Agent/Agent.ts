import { Piece } from '../../Objects/Piece';
import { Rule } from '../../ChineseChess/Rule/Rule'
import { InitGame } from '../../ChineseChess/InitGame/init';
import { GreedyAgent } from '../Greedy/GreedyAgent'
import { ABPruning } from '../ABPruning/ABPruning'
import { Evaluation } from '../_Param/Evaluation'
import { State } from '../State/State'


export class Agent {
    team: number;
    legalMoves: {}; // name->[positions]
    myPieces: Piece[];
    oppoPieces: Piece[];
    oppoAgent: Agent;
    myPiecesDic: {}; // {name -> pos}
    boardState; // {posStr->[name, isMyPiece]}
    // moved: EventEmitter<number> = new EventEmitter();

    strategy = 0;
    constructor(team: number, myPieces = undefined) {
        this.team = team;
        if (myPieces == undefined)
            this.myPieces = (team == 1 ? InitGame.getRedPieces() : InitGame.getBlackPieces());
        else {
            this.myPieces = myPieces;
        }
    }
    setOppoAgent(oppoAgent) {
        // setOppoAgent(oppoAgent, calMoves = true, updateDict = false) {
        this.oppoAgent = oppoAgent;
        this.oppoPieces = oppoAgent.myPieces;
        // this.updateState(updateDict);
        // this.updateState(calMoves, updateDict);
    }

    updateState() {
        this.updateBoardState();
        this.updatePieceDict();
        this.computeLegalMoves();
        return this;
    }

    // compute legals moves for my pieces after state updated
    computeLegalMoves() {
        this.legalMoves = Rule.allPossibleMoves(this.myPieces, this.boardState, this.team);
    }

    // update board state by pieces
    updateBoardState() {
        var state = {};
        for (var i in this.myPieces) state[this.myPieces[i].position.toString()] = [this.myPieces[i].name, true];
        for (var i in this.oppoPieces) state[this.oppoPieces[i].position.toString()] = [this.oppoPieces[i].name, false];
        this.boardState = state;
    }

    // update dictionary of pieces
    updatePieceDict() {
        this.myPiecesDic = {};
        for (var i in this.myPieces) {
            this.myPiecesDic[this.myPieces[i].name] = this.myPieces[i].position;
        }
    }

    movePieceTo(piece: Piece, pos, isCapture = undefined) {
        piece.moveTo(pos);
        if (isCapture == undefined) isCapture = this.oppoPieces.filter(x => x.position + '' == pos + '').length > 0;
        // having oppo piece in target pos
        if (isCapture) this.captureOppoPiece(pos);
    }

    // capture piece of opponent
    // pos: position of piece to be captured
    captureOppoPiece(pos) {
        for (var i = 0; i < this.oppoPieces.length; i++) {
            if (this.oppoPieces[i].position + '' == pos + '') {
                this.oppoPieces.splice(i, 1); // remove piece from pieces
                return;
            }
        }
    }


    // TO BE IMPLEMENTED BY CHILD CLASS
    // return [piece:Piece, toPos];
    comptuteNextMove(state) {
        console.log("BUG comptuteNextMove CALLED ")
        return null;
    }



    getPieceByName(name) {
        return this.myPieces.filter(x => x.name == name)[0];
    }
    // check existance of my king
    check_king_exist() {
        return this.getPieceByName('k') != undefined;
    }

    random_move() {
        // console.log("this.legalMoves:", this.legalMoves)
        var movablePieces = Object.keys(this.legalMoves);
        if (movablePieces.length == 0) return [];
        var name = movablePieces[Math.floor(movablePieces.length * Math.random())];
        var moves = this.legalMoves[name];
        while (moves.length == 0) {
            name = movablePieces[Math.floor(movablePieces.length * Math.random())];
            moves = this.legalMoves[name];
        }
        // console.log("moves:", moves)
        var move = moves[Math.floor(moves.length * Math.random())];
        return [this.getPieceByName(name), move];
    }


    getValueOfGreedyMove(pieceName, toPos) {
        var piece = this.boardState[toPos.toString()];
        if (piece) return Evaluation.pieceValue(piece[0]);
        return 0;
    }

    // get greedy move
    greedy_move() {
        var moves = this.get_moves_arr(); //[[movePieceName, move]]
        // console.log(moves)
        var values = moves.map(x => this.getValueOfGreedyMove(x[0], x[1]));
        var max = -Infinity;
        var pos = -1;
        for (var i = 0; i < values.length; i++) {
            if (values[i] > max) {
                pos = i;
                max = values[i];
            }
        }
        if (max > 0) return [this.getPieceByName(moves[pos][0]), moves[pos][1]]; // can capture opponent piece
        // take random move
        return this.random_move();
    }





    copy() { return new Agent(this.team, this.myPieces.map(x => x.copy())); }

    static piecesFromDict(dict_list) {
        return dict_list.map(x => Piece.copyFromDict(x));
    }

    static copyFromDict(dict) {
        return new Agent(dict.team, this.piecesFromDict(dict.myPieces));
    }

    // get array of legalMoves: [[movePieceName, move]]
    get_moves_arr() {
        var moves = [];
        for (var movePieceName in this.legalMoves) { //legalMoves: {name: []}
            var toPosList = this.legalMoves[movePieceName];
            for (var i in toPosList) {
                var move = toPosList[i];
                moves.push([movePieceName, move]);
            }
        }
        return moves;
    }

    // return value of state for redAgent
    getValueOfState(state: State) {
        return this.getValueOfAgent(state.redAgent, state) - this.getValueOfAgent(state.blackAgent, state);
    }

    getValueOfAgent(agent: Agent, state = null) {
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
