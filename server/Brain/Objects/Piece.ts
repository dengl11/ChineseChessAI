export class Piece {

    name: string;
    position: [number, number]; // (row, column)

    constructor(name, position) {
        this.name = name;
        this.position = position;
    }


    moveTo(newPos) {
        this.position = newPos;
    }

    // return a copy of a piece
    copy() {
        return new Piece(this.name, this.position);
    }




}
