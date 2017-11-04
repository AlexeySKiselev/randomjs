// @flow
/**
 * Chi Square Distribution
 * @param n: number - n > 0, n must be integer
 * @returns Chi Square Distributed value
 * Created by Alexey S. Kiselev
 */

let normal: (mu: number, sigma: number) => number = require('./normal');

function chisquare(n: number): number {
    if(Math.floor(n) !== n) {
        n = Math.floor(n);
        console.log('Chi Square Distribution: parameter "n" rounded to minimum integer value');
    }

    if(n <= 0){
        throw new Error('Chi Square Distribution: parameter "n" must be a positive integer');
    }

    let sum: number = 0;
    for(let i: number = 0; i < n; i += 1){
        sum += Math.pow(normal(0, 1), 2);
    }
    return sum;
}

module.exports = chisquare;
