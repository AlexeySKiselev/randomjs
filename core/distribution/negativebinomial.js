// @flow
/**
 * Negative Binomial Distribution
 * @param r: number - integer number, r > 0
 * @param p: number - float number, 0 <= p <= 1
 * @param count: number - count oif values in resulting array
 * @returns a Negative Binomial Distributed number
 * Created by Alexey S. Kiselev
 */

let gamma: (a: number, b: number) => number = require('../random/gamma'),
    poisson: (lambda: number) => number = require('../random/poisson');

function negativeBinomial(r: number, p: number, count: number): Array<number> {
    if(count < 1) {
        throw new Error('Array is too small. Try to use ".random.negativebinomial(' + r + ', ' + p + ')" method');
    }

    if(count > 10000){
        throw new Error('Array is too big. Try to use ".generate.negativebinomial(' + r + ', ' + p + ',' + count + ')" method');
    }

    if(p < 0 || p > 1){
        throw new Error('Negative Binomial distribution: parameter "p" must be in range [0, 1]');
    }

    if(r <= 0){
        throw new Error('Negative Binomial distribution: parameter "r" must be a positive integer');
    }

    let negativeBinomialArray: Array<number> = [],
        temp: number;
    for(let i: number = 0; i < count; i += 1){
        temp = gamma(r, p / (1 - p));
        negativeBinomialArray[i] = poisson(temp);
    }
    return negativeBinomialArray;
}

module.exports = negativeBinomial;
