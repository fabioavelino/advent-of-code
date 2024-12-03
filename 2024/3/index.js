import * as fs from "node:fs/promises";

const prepareInput = async () => {
    /**
     * As we receive a input data list with some carriage return,
     * we want to make them in a single line for next process.
     */
    const inputRaw = await fs.readFile("./input");
    return inputRaw.toString().replaceAll("\n", "");
};

const partOne = async () => {
    /**
     * First step: Preparing data
     */
    let data = await prepareInput();
    /**
     * Second step: matching chain of characters
     * best way to do that is of course the regular expressions
     * first one is to get the "mul(xx,xx)" strings and extract
     * the numbers from each instruction in order to multiply them
     */
    const regexMul = /mul\(\d+,\d+\)/gm;
    const mulInstructions = data.match(regexMul);
    let total = 0;
    mulInstructions.forEach(mulInstruction => {
        const numbers = mulInstruction.match(/\d+/gm); // will be 2 entries
        const resultMultiplication = parseInt(numbers[0]) * parseInt(numbers[1]);
        total += resultMultiplication;
    });

    console.log("The result for the total uncorrupted mul instructions is ", total);
};


const partTwo = async () => {
    /**
     * First step: Preparing data
     */
    let data = await prepareInput();

    /**
     * Second step: matching chain of characters
     * Continuing with regex, but this time it's more complex
     * We will first catch all the first instructions until the first "do" or "don't"
     * After that, we catch all the characters between a "do()" and until
     * finding a "don't()". With all of this, we can select after the valid "mul(xx,xx)" inside
     */
    const regexFirstInstructions = /.+?do+?/;
    const regexDo = /do\(\).*?don\'t\(\)/gm;
    const validInstructions = [...data.match(regexFirstInstructions), ...data.match(regexDo)];
    const regexMul = /mul\(\d+,\d+\)/gm;
    let total = 0;
    validInstructions.forEach(validInstruction => {
        const mulInstructions = validInstruction.match(regexMul);
        mulInstructions.forEach(mulInstruction => {
            const numbers = mulInstruction.match(/\d+/gm); // will be 2 entries
            const resultMultiplication = parseInt(numbers[0]) * parseInt(numbers[1]);
            total += resultMultiplication;
        })
    })

    console.log("The result for the total uncorrupted enabled mul instructions is ", total);
};

partOne();
partTwo();
