const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
    constructor(width = 5, height = 5, holePercentage = 0.2) {
        this._field = Field.generateField(width, height, holePercentage);
        this._position = [0, 0];
    }
    print() {
        for (const line of this._field) {
            let stringLine = line.join("");
            console.log(stringLine);
        }
    }
    move(x, y) {
        this._position = [this._position[0] - y, this._position[1] + x];
    }
    createPath(x, y) {
        this._field[this._position[0]][this._position[1]] = pathCharacter;
    }
    validPosition() {
        if (
            this._position[0] < 0 ||
            this._position[1] < 0 ||
            this._position[0] > this._field.length ||
            this._position[1] > this._field[0].length
        ) {
            return [false, "Out of bounds, you lose!"];
        }
        return [true, null];
    }
    losingPosition() {
        if (this._field[this._position[0]][this._position[1]] === hole) {
            return [true, "You fell in a hole, you lose!"];
        }

        return [false, null];
    }
    winningPosition() {
        if (this._field[this._position[0]][this._position[1]] === hat) {
            return [true, "You win!"];
        }
        return [false, null];
    }
    static generateField(width = 3, height = 3, percentageHoles = 0.2) {
        if (percentageHoles >= 0.5) {
            throw new Error("That is too many holes");
        }
        if (width === 0 || height === 0) {
            throw new Error("Height and Width cannot be set to zero");
        }
        let fieldArray = new Array(width)
            .fill()
            .map((_) => Array(height).fill(fieldCharacter));

        let numberOfHoles = Math.floor(width * height * percentageHoles);
        let i = 0;

        while (i < numberOfHoles) {
            let row = Math.floor(Math.random() * height);
            let col = Math.floor(Math.random() * width);

            if (
                fieldArray[row][col] === fieldCharacter &&
                row !== 0 &&
                col !== 0
            ) {
                fieldArray[row][col] = hole;
                i++;
            }
        }

        let hatPlaced = false;

        while (!hatPlaced) {
            let row = Math.floor(Math.random() * height);
            let col = Math.floor(Math.random() * width);

            if (fieldArray[row][col] !== hole && row !== 0 && col !== 0) {
                fieldArray[row][col] = hat;
                hatPlaced = true;
            }
        }

        fieldArray[0][0] = pathCharacter;

        return fieldArray;
    }
}

class Game {
    constructor() {
        this._arena = new Field([
            ["*", "░", "O"],
            ["░", "O", "░"],
            ["░", "^", "░"],
        ]);
        this._directions = {
            u: "up",
            d: "down",
            l: "left",
            r: "right",
        };
    }
    printOptions() {
        console.log("Movement:\nl-left, \nu-up, \nd-down, \nr-right");
    }
    printField() {
        this._arena.print();
    }
    move(direction) {
        direction = direction.toLowerCase();
        if (this._directions[direction] === "up") {
            this._arena.move(0, 1);
            return true;
        }
        if (this._directions[direction] === "down") {
            this._arena.move(0, -1);
            return true;
        }
        if (this._directions[direction] === "left") {
            this._arena.move(-1, 0);
            return true;
        }
        if (this._directions[direction] === "right") {
            this._arena.move(1, 0);
            return true;
        }

        return false;
    }
    run() {
        let gameContinues = true;

        while (gameContinues) {
            this.printOptions();
            this._arena.print();
            const direction = prompt("which way?");
            if (!this.move(direction)) {
                console.log("Command not recognized");
                setTimeout(() => {}, 2000);
                continue;
            }

            let [valid, invalidMsg] = this._arena.validPosition();

            if (!valid) {
                console.log(invalidMsg);
                break;
            }

            let [losing, losingMsg] = this._arena.losingPosition();

            if (losing) {
                console.log(losingMsg);
                break;
            }

            let [winning, winningMsg] = this._arena.winningPosition();

            if (winning) {
                console.log(winningMsg);
                break;
            }

            this._arena.createPath();
        }
    }
}

function main() {
    let game = new Game();

    game.run();
}

main();
