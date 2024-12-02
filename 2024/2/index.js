import * as fs from "node:fs/promises";

const prepareInput = async () => {
    /**
     * As we receive a input data list in a format "X X X X X X",
     * we want to split each line and after that split each value.
     */
    const inputRaw = await fs.readFile("./input");
    const data = inputRaw
        .toString()
        .split("\n")
        .map((line) => {
            if (line.length > 0) {
                return line.split(" ").map((str) => parseInt(str));
            }
            return undefined;
        });
    // We filter out the empty lines (normally, only the last one)
    return data.filter((el) => el !== undefined);
};

const analyzeLevelLine = (levelLine) => {
    /**
     * We define first a enum element for the gradual direction
     * and we compare first and last element for defining the direction
     */
    const GradualDirection = {
        INCREASE: "INCREASE",
        DECREASE: "DECREASE",
    };
    let direction = levelLine[0] < levelLine[levelLine.length - 1] ? GradualDirection.INCREASE : GradualDirection.DECREASE;
    
    let isSafe = true;
    let indexFailed = -1;

    for (let levelIndex = 1; levelIndex <= levelLine.length - 1; levelIndex++) {
        // We start comparison with the 2nd element to compare with previous one
        const diff = levelLine[levelIndex - 1] - levelLine[levelIndex];
        // Test case for any two adjacent levels differs between 1 or 3
        if (!(Math.abs(diff) >= 1 && Math.abs(diff) <= 3)) {
            isSafe = false;
            indexFailed = levelIndex;
            return [isSafe, indexFailed];
        }
        // Test case to check if we are following the gradual increase or decrease
        if (
            (diff > 0 && direction !== GradualDirection.DECREASE) ||
            (diff < 0 && direction !== GradualDirection.INCREASE)
        ) {
            isSafe = false;
            indexFailed = levelIndex;
            return [isSafe, indexFailed];
        }
    }
    return [isSafe, indexFailed];
}

const partOne = async () => {
    /**
     * First step: Preparing data
     */
    let data = await prepareInput();

    /**
     * Second step: determine if a line is safe
     */
    let countSafe = 0;
    data.forEach((levelLine) => {
        let [isSafe] = analyzeLevelLine(levelLine);
        if (isSafe) {
            countSafe++;
        }
    });

    console.log("The number of safe levels for part one is ", countSafe);
};

const partTwo = async () => {
    /**
     * First step: Preparing data
     */
    let data = await prepareInput();

    /**
     * Second step: determine if a line is safe
     */
    let countSafe = 0;
    data.forEach((levelLine) => {
        let [isSafe, indexFailed] = analyzeLevelLine(levelLine);
        if (isSafe) {
            countSafe++;
        } else {
            /**
             * Special case scenario for Part two
             * 
             * In the case the level is not safe, we know which level have failed
             * So, we filter it out of the initial level line and we run again the analysis
             */
            let filteredLevelLine = levelLine.filter((_, index) => index !== indexFailed);
            let [isSafeFiltered, _] = analyzeLevelLine(filteredLevelLine);
            if (isSafeFiltered) { 
                countSafe++;
            } else if (indexFailed === 1) { 
                /** 
                 * In case it was the second level that have failed and that 
                 * we have already tried without it, it's still possible that it
                 * could result correctly if we remove the first level, so we try again by 
                 * removing it.
                 */
                filteredLevelLine = levelLine.filter((_, index) => index !== 0);
                let [isSafeFiltered, _] = analyzeLevelLine(filteredLevelLine);
                if (isSafeFiltered) { 
                    countSafe++;
                }
            }
        }
    });

    console.log("The number of safe levels for part two is ", countSafe);
};

partOne();
partTwo();
