import * as fs from "node:fs/promises";

const prepareInput = async () => {
    /* 
    * As we receive a input data list in a format "XXXX   XXXX",
    * we want to split each line and after that split each value. 
    */
    const firstColumn = [],
        secondColumn = [];
    const inputRaw = await fs.readFile("./input");
    inputRaw
        .toString()
        .split("\n")
        .forEach((line) => {
            if (line.length > 0) {
                const lineSplitted = line.split("   ");
                firstColumn.push(parseInt(lineSplitted[0]));
                secondColumn.push(parseInt(lineSplitted[1]));
            }
        });
    return [firstColumn, secondColumn];
}

const partOne = async () => {
    /* 
    * First step: Preparing data
    */
    let [firstColumn, secondColumn] = await prepareInput();
    
    /* 
    * Second step : sorting
    * As we have now our numbers and we need to check the distance
    * always between the smallest on each side, we first sort it 
    * from smallest to biggest
    */
    firstColumn.sort((a, b) => a - b);
    secondColumn.sort((a, b) => a - b);

    /*
    * Third step : calculate the distance
    * Now we just to loop into our arrays and check
    * the difference between the values and add them all together
    */
    let totalDistance = 0;
    firstColumn.forEach((firstColumnValue, index) => {
        const distance = Math.abs(firstColumnValue - secondColumn[index]);
        totalDistance += distance;
    })
    
    console.log("The total distance for part one is : ", totalDistance);
};

const partTwo = async () => {
    /* 
    * First step: Preparing data
    */
    let [firstColumn, secondColumn] = await prepareInput();

    /* 
    * Second step: Counting
    * We do not need to sort now, but just to know how many 
    * times a value appears in the other array, so we will
    * loop on the first array and filter the second one based
    * on the current first array value to see how many times it appears.
    * After that, we multiply the repeat count with the value and add it
    * to the similarity score.
    */
   let similarityScore = 0;
   firstColumn.forEach((firstColumnValue) => {
        const secondValueAppearsCount = secondColumn.filter((secondColumnValue) => firstColumnValue === secondColumnValue).length;
        similarityScore += firstColumnValue * secondValueAppearsCount;
   });

   console.log("The similarity score for part two is : ", similarityScore);
}

partOne();
partTwo();