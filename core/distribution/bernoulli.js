/**
 * Bernoulli Distribution
 * @param p: number (0 <= p <= 1) - Probability of success
 * @param count: number - Count of values in returned array
 * @returns an array contains Bernoulli Distributed 0 or 1 based on p parameter
 * Created by Alexey S. Kiselev
 */

// @flow

let bernoulliNumber: (p: number) => 0 | 1 = require('../random/bernoulli');

function bernoulli(p: number, count: number): Array<number> {
    if(count < 1)
        throw new Error('Array is too small. Try to use ".random.bernoulli(' + p + ')" method');
    if(count > 10000)
        throw new Error('Array is too big. Try to use ".generate.bernoulli(' + p + ', ' + count + ')" method');

    let bernoulliArray: Array<number> = [];
    for(let i: number = 0; i < count; i += 1){
        bernoulliArray[i] = bernoulliNumber(p);
    }
    return bernoulliArray;
}

module.exports = bernoulli;
