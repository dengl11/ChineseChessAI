export class Piece  {

    name:string;
    position: [number, number]; // (row, column)

    constructor(name , position){
        this.name = name;
        this.position = position;
    }


    moveTo(newPos){
        this.position = newPos;
    }




}
