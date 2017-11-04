// @flow
/**
 * Chi Square Distribution
 * @param n: number - n > 0, n must be integer
 * @param count: number - count of values in resulting array
 * @returns and Array of Beta Prime Distributed values
 * Created by Alexey S. Kiselev
 */

let chiSquare: (n: number) => number = require('../random/chisquare');

function chi(n: number, count: number): Array<number> {
    if(count < 1) {
        throw new Error('Array is too small. Try to use ".random.chi(' + n + ')" method');
    }

    if(count > 10000){
        throw new Error('Array is too big. Try to use ".generate.chi(' + n + ', ' + count + ')" method');
    }

    if(n <= 0){
        throw new Error('Chi Square Distribution: parameter "n" must be a positive integer');
    }

    let chiArray: Array<number> = [];
    for(let i: number = 0; i < count; i += 1){
        chiArray[i] = Math.sqrt(chiSquare(n) / n);
    }
    return chiArray;
}

module.exports = chi;
