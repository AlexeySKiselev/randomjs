// @flow
/**
 * Chi Square Distribution
 * @param n: number - n > 0, n must be integer
 * @param count: number - count of values in resulting array
 * @returns and Array of Beta Prime Distributed values
 * Created by Alexey S. Kiselev
 */

let normal: (mu: number, sigma: number) => number = require('../random/normal');

function chisquare(n: number, count: number){
    if(count < 1) {
        throw new Error('Array is too small. Try to use ".random.chisquare(' + n + ')" method');
    }

    if(count > 10000){
        throw new Error('Array is too big. Try to use ".generate.chisquare(' + n + ', ' + count + ')" method');
    }

    if(Math.floor(n) !== n) {
        n = Math.floor(n);
        console.log('Chi Square Distribution: parameter "n" rounded to minimum integer value');
    }

    if(n <= 0){
        throw new Error('Chi Square Distribution: parameter "n" must be a positive integer');
    }

    let chiSquareArray: Array<number> = [],
        sum: number;
    for(let i: number = 0; i < count; i += 1){
        sum = 0;
        for(let j: number = 0; j < n; j += 1){
            sum += Math.pow(normal(0, 1), 2);
        }
        chiSquareArray[i] = sum;
    }
    return chiSquareArray;
}

module.exports = chisquare;
