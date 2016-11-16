import { Piece } from '../../Objects/Piece';
import { Rule } from '../../ChineseChess/Rule/Rule'

export class Agent{
  // return a legal move given board state
  // state: {
  //        myPieces: {name: (row, col)}
  //        oppoPieces: {name: (row, col)}
  // }
  legalMoves:{}; // name->[positions]
  myPieces:Piece[];
  oppoPieces:Piece[];
  team:number;


  constructor(team: number) {
    this.team = team;
  }

  // [fromPos, toPos]
  nextMove(){
    var pieceName = Object.keys(this.legalMoves)[0];
    var toPos = this.legalMoves[pieceName][0];
    var fromPos:number[] = this.myPieces.filter(x=>x.name == pieceName)[0].position;

    // console.log("init move:", [fromPos, toPos]);
    if(this.team != 1) {
      toPos = this.revertPosition(toPos);
      fromPos = this.revertPosition(fromPos);
    }
    // console.log("after move:", [fromPos, toPos]);
    if (this.team != 1) this.revertGameDirection();
    return [fromPos, toPos];
  };

  isLose(){
    return this.myPieces.filter(x=>x.name=='k').length == 0;
  }

  // update agent state
  updateState(redPieces, blackPieces){
    // console.log("updateState:", this.team)
    this.myPieces = (this.team == 1 ? redPieces : blackPieces);
    if( this.isLose()) return false;
    // console.log("myPieces:", this.myPieces)
    this.oppoPieces = (this.team == 1 ? blackPieces : redPieces);
    // console.log("oppo:", this.oppoPieces)
    if (this.team != 1) this.revertGameDirection();
    var boardState = this.getBoardState();
    this.computeLegalMoves(boardState);
    return true;
  }

  // pos: [row, col]
  revertPosition(pos){
    return [11-pos[0], 10-pos[1]];
  }

  // pos: [row, col]
  revertPosition4Pieces(pieces){
    for (var i in pieces){
      var pos = pieces[i].position;
      pieces[i].position = this.revertPosition(pos);
    }
  }
  // pos: [row, col]
  addPieces2State(pieces, boardState){
    for (var i in pieces){
      var pos = pieces[i].position;
      boardState[pos[0]+'-'+pos[1]] = pieces[i];
    }
  }

  // reverse game direction for black part
  // to keep the consisttance of Agent
  revertGameDirection(){
    this.revertPosition4Pieces(this.myPieces);
    this.revertPosition4Pieces(this.oppoPieces);
  }

  getBoardState(){
    var new_state = {};
    this.addPieces2State(this.myPieces, new_state);
    this.addPieces2State(this.oppoPieces, new_state);
    return new_state;
  }




  computeLegalMoves(boardState){
    this.legalMoves = Rule.allPossibleMoves(this.myPieces, boardState);
  }

}
