// @flow
/**
 * Cauchy Distribution
 * @param a: number - positive number
 * @param b: number - positive number
 * @returns a Cauchy Distributed array of numbers
 * Created by Alexey S. Kiselev
 */

let cauchyNumber: (a: number, b: number) => number = require('../random/cauchy');

function cauchy(a: number, b: number, count: number): Array<number> {
    if(a < 0 || b < 0) throw new Error('Both arguments must be a positive numbers');

    let cauchyArray: Array<number> = [];
    for(let i: number = 0; i < count; i += 1) {
        cauchyArray[i] = cauchyNumber(a, b);
    }
    return cauchyArray;
}

module.exports = cauchy;
