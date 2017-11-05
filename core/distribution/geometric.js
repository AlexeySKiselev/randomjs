// @flow
/**
 * Geometric Distribution
 * @param p: number (0 <= p <= 1) - Probability of success
 * @param count: number - Number of values in result array
 * @returns an Array with Geometric Distributed Values
 * Created by Alexey S. Kiselev
 */

let geometricNumber: (p: number) => number = require('../random/geometric');

function geometric(p: number, count: number): Array<number> {
    if(count < 1)
        throw new Error('Array is too small. Try to use ".random.geometric(' + p + ')" method');
    if(count > 10000)
        throw new Error('Array is too big. Try to use ".generate.geometric(' + p + ', ' + count + ')" method');

    let geometricArray: Array<number> = [];
    for(let i: number = 0; i < count; i += 1){
        geometricArray[i] = geometricNumber(p);
    }
    return geometricArray;
}

module.exports = geometric;
