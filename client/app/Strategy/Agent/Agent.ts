import { Piece } from '../../Objects/Piece';
import { Rule } from '../../ChineseChess/Rule/Rule'
import { InitGame } from '../../ChineseChess/InitGame/init';

export class Agent {
    team: number;
    strategy: number = 0;
    legalMoves: {}; // name->[positions]
    pastMoves = [];
    myPieces: Piece[];
    oppoPieces: Piece[];
    oppoAgent: Agent;
    // myPiecesDic: {}; // {name -> pos}
    boardState: {}; // {posStr->[name, isMyPiece]}
    // moved: EventEmitter<number> = new EventEmitter();
    //

    DEPTH = 0;


    constructor(team: number, myPieces = null, pastMoves = [], strategy = 0) {
        this.team = team;
        if (myPieces == null)
            this.myPieces = (team == 1 ? InitGame.getRedPieces() : InitGame.getBlackPieces());
        else {
            this.myPieces = myPieces;
        }
        this.pastMoves = pastMoves;
        this.strategy = strategy;
        // console.log("Agent")
    }
    setOppoAgent(oppoAgent) {
        this.oppoAgent = oppoAgent;
        this.oppoPieces = oppoAgent.myPieces;
        this.updateState();
    }
    // return | 1:win | -1:lose | 0:continue
    updateState() {
        this.updateBoardState();
        this.computeLegalMoves();
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

    movePieceTo(piece: Piece, pos, isCapture = undefined) {
        piece.moveTo(pos);
        this.addMove(piece.name, pos);
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

    // add move to pastMoves
    addMove(pieceName, pos) {
        this.pastMoves.push({ "name": pieceName, "position": pos });
    }

    // agent take action
    nextMove() {
        var computeResult = this.comptuteNextMove();
        var piece = computeResult[0];
        var toPos = computeResult[1];
        this.movePieceTo(piece, toPos);
    };

    // TO BE IMPLEMENTED BY CHILD CLASS
    // return: [piece, toPos]
    comptuteNextMove() { alert("YOU SHOULD NOT CALL THIS!") }

    getPieceByName(name) {
        return this.myPieces.filter(x => x.name == name)[0];
    }

    // TO BE OVERIDE BY TDLeaner
    update_weights(nSimulations, result) { return []; }
    // TO BE OVERIDE BY TDLeaner
    save_state(feature_vec) { }
    copy() {
        return new Agent(this.team, this.myPieces.map(x => x.copy()), this.copyMoves());
    }

    copyMoves() {
        return this.pastMoves.slice();
    }
}
