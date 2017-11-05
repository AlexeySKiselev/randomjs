// @flow
/**
 * Chi Distribution
 * @param n: number - n > 0, n must be integer
 * @returns Chi Square Distributed value
 * Created by Alexey S. Kiselev
 */

let chiSquare: (n: number) => number = require('./chisquare');

function chi(n: number): number {
    if(n <= 0){
        throw new Error('Chi Square Distribution: parameter "n" must be a positive integer');
    }

    return Math.sqrt(chiSquare(n) / n);
}

module.exports = chi;
