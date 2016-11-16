export class Piece  {

    name:string;
    team:number; // 1: red | -1: black
    position: [number, number]; // (row, column)

    constructor(team, name , position){
        this.team = team;
        this.name = name;
        this.position = position;
    }


    move(newPos){
        this.position = newPos;
    }


}
