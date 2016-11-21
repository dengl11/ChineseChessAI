import { Piece } from '../../Objects/Piece';
import { Rule } from '../../ChineseChess/Rule/Rule'
import { InitGame } from '../../ChineseChess/InitGame/init';


export class Agent {
    team: number;
    legalMoves: {}; // name->[positions]
    pastMoves = [];
    myPieces: Piece[];
    oppoPieces: Piece[];
    // myPiecesDic: {}; // {name -> pos}
    boardState: {}; // {posStr->[name, isMyPiece]}


    constructor(team: number) {
        this.team = team;
        this.myPieces = (team == 1 ? InitGame.getRedPieces() : InitGame.getBlackPieces());
    }
    setOppoPieces(pieces) {
        this.oppoPieces = pieces;
        this.updateState();
    }
    updateState() {
        this.updateBoardState();
        var endState = Rule.getGameEndState(this);
        if (endState != 0) return endState;
        this.computeLegalMoves();
        return endState;
    }

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

    movePieceTo(piece: Piece, pos, isCapture) {
        piece.moveTo(pos);
        this.addMove(piece.name);
        // having oppo piece in target pos
        if (isCapture) this.captureOppoPiece(pos);
    }

    captureOppoPiece(pos) {
        for (var i = 0; i < this.oppoPieces.length; i++) {
            if (this.oppoPieces[i].position + '' == pos + '') {
                this.oppoPieces.splice(i, 1); // remove piece from pieces
                return;
            }
        }
    }

    addMove(pieceName) {
        this.pastMoves.push(pieceName);
    }

    // agent take action
    nextMove() {
        var computeResult = this.comptuteNextMove();
        var piece = computeResult[0];
        var toPos = computeResult[1];
        var isCapture = this.oppoPieces.filter(x => x.position + '' == toPos + '').length > 0;
        this.movePieceTo(piece, toPos, isCapture)
    };
    // private method of computing next move
    // return: [piece, toPos]
    comptuteNextMove() {
    }
}
