// @flow
/**
 * Negative Binomial Distribution
 * @param r: number - integer number, r > 0
 * @param p: number - float number, 0 <= p <= 1
 * @returns a Negative Binomial Distributed number
 * Created by Alexey S. Kiselev
 */

let gamma: (a: number, b: number) => number = require('./gamma'),
    poisson: (lambda: number) => number = require('./poisson');

function negativeBinomial(r: number, p: number): number {
    if(p < 0 || p > 1){
        throw new Error('Negative Binomial distribution: parameter "p" must be in range [0, 1]');
    }

    if(Math.floor(r) !== r){
        r = Math.floor(r);
        console.log('Negative Binomial distribution: parameter "p" rounded to minimum integer value');
    }

    if(r <= 0){
        throw new Error('Negative Binomial distribution: parameter "r" must be a positive integer');
    }

    let temp: number = gamma(r, p / (1 - p));
    return poisson(temp);
}

module.exports = negativeBinomial;
