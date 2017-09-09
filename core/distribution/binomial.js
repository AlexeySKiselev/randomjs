/**
 * Binomial Distribution
 * @param n: number - Number of Independent Bernoulli trials
 * @param p: number (0 <= p <= 1) - Probability of success
 * @param count: number - Count of values in returned array
 * @returns an array of Binomial Distributed numbers
 * Created by Alexey S. Kiselev
 */

// @flow

let binomialNumber: (n: number, p: number) => number = require('../random/binomial');

function binomial(n: number, p: number, count: number): Array<number> {
    if(count < 1)
        throw new Error('Array is too small. Try to use ".random.binomial(' + n + ', ' + p + ')" method');
    if(count > 10000)
        throw new Error('Array is too big. Try to use ".generate.binomial(' + n + ', ' + p + ', ' + count + ')" method');

    let binomialArray: Array<number> = [];
    for(let i: number = 0; i < count; i += 1){
        binomialArray[i] = binomialNumber(n, p);
    }
    return binomialArray;
}

module.exports = binomial;
