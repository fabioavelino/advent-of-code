import * as fs from "node:fs/promises";

const prepareInput = async () => {
    /**
     * Reads the input file and processes its content:
     * 1. Reads the raw file content asynchronously
     * 2. Converts the buffer to a string
     * 3. Splits the content into an array of lines using newline character
     * 4. Filters out any empty lines to ensure clean data
     * Returns an array where each element is a non-empty line from the input file
     */
    const inputRaw = await fs.readFile("./input");
    return inputRaw.toString().split("\n").filter((line) => line.length > 0);
};

const partOne = async () => {
    /**
     * Initial setup: Load and prepare the input data
     * The data represents a 2D grid where we need to search for the word "XMAS"
     */
    let data = await prepareInput();

    /**
     * Configuration for the word search algorithm:
     * 1. Define the target word to find ("XMAS")
     * 2. Calculate grid dimensions (rows and columns) for boundary checking
     * 3. Define direction vectors for all 8 possible directions to search:
     *    - EAST/WEST: Horizontal movement
     *    - NORTH/SOUTH: Vertical movement
     *    - SE/NW/NE/SW: Diagonal movements
     * Each direction is represented as [x, y] coordinates for movement
     */
    const WORD_TO_COMPARE = "XMAS";
    const rowsLength = data.length;
    const columnsLength = data[0].length;
    const lookaheadCoords = {
        EAST: [1, 0], // x y format
        WEST: [-1, 0],
        SOUTH: [0, 1],
        NORTH: [0, -1],
        SE: [1, 1],
        NW: [-1, -1],
        NE: [1, -1],
        SW: [-1, 1]
    }

    let countWord = 0;
    for (let x = 0; x < columnsLength; x++) {
        for (let y = 0; y < rowsLength; y++) {
            const startLetter = data[y][x];
            //If current position matches first letter 'X', check all 8 directions for the complete word
            if (startLetter === WORD_TO_COMPARE[0]) {
                Object.values(lookaheadCoords).forEach(coord => {
                    let numberMatchingLetter = 1;
                    let nextX = x, nextY = y;
                    while (numberMatchingLetter !== -1 && numberMatchingLetter !== 4) {
                        nextX = nextX + coord[0];
                        nextY = nextY + coord[1];
                        if ((nextX >= 0 && nextX < columnsLength) && (nextY >= 0 && nextY < rowsLength)) {
                            const nextLetter = data[nextY][nextX];
                            if (nextLetter === WORD_TO_COMPARE[numberMatchingLetter]) {
                                numberMatchingLetter++;
                            } else {
                                numberMatchingLetter = -1;
                            }
                        } else {
                            numberMatchingLetter = -1;
                        }
                    }
                    if (numberMatchingLetter === 4) {
                        countWord++;
                    }
                })
            }
        }
    }

    console.log(`The total times that the word ${WORD_TO_COMPARE} appears is `, countWord);
};


const partTwo = async () => {
    /**
     * Initial setup: Load and prepare the input data
     * The data represents a 2D grid where we need to find X patterns formed by the word "MAS"
     */
    let data = await prepareInput();

    /**
     * Configuration for finding X patterns:
     * 1. Define base word "MAS" to look for in the X pattern
     * 2. Create scenarios for both forward and reversed word to check both arms of the X
     * 3. Calculate grid dimensions for boundary checking
     * 4. Define only diagonal directions (SE/NW/NE/SW) as X patterns only form diagonally
     * Each direction vector represents movement in [x, y] coordinates
     */
    const WORD_TO_COMPARE = "MAS";
    const WORD_FLIP_SCENARIOS = [WORD_TO_COMPARE, WORD_TO_COMPARE.split("").reverse().join("")];
    const rowsLength = data.length;
    const columnsLength = data[0].length;
    const lookaheadCoords = {
        SE: [1, 1],
        NW: [-1, -1],
        NE: [1, -1],
        SW: [-1, 1]
    }

    let countXWord = 0;
    for (let x = 0; x < columnsLength; x++) {
        for (let y = 0; y < rowsLength; y++) {
            const startLetter = data[y][x];
            //Check if current position is 'A' (middle of potential X pattern)
            if (startLetter === WORD_TO_COMPARE[1]) {
                let firstBarXIsValid = false;
                let secondBarXIsValid = false;
                let lettersToCheck = {};
                Object.entries(lookaheadCoords).forEach(([direction, coord]) => {
                    const nextX = x + coord[0];
                    const nextY = y + coord[1];
                    if ((nextX >= 0 && nextX < columnsLength) && (nextY >= 0 && nextY < rowsLength)) {
                        lettersToCheck[direction] = data[nextY][nextX];
                    } else {
                        lettersToCheck[direction] = undefined;
                    }
                })
                WORD_FLIP_SCENARIOS.forEach((wordFlipScenario) => {
                    if (lettersToCheck.NW === wordFlipScenario[0] && lettersToCheck.SE === wordFlipScenario[2]) {
                        firstBarXIsValid = true;
                    }
                    if (lettersToCheck.NE === wordFlipScenario[0] && lettersToCheck.SW === wordFlipScenario[2]) {
                        secondBarXIsValid = true;
                    }
                })
                if (firstBarXIsValid && secondBarXIsValid) {
                    countXWord++;
                }
            }
        }
    }

    console.log("The total times that the X-Mas appears is ", countXWord);
};

partOne();
partTwo();
