// @flow
/**
 * Beta Prime Distribution
 * @param a: number - a > 0, a must be integer
 * @param b: number - b > 0, b must be integer
 * @param count: number - count of values in resulting array
 * @returns and Array of Beta Prime Distributed values
 * Created by Alexey S. Kiselev
 */

let beta: (a: number, b: number) => number = require('../random/beta');

function betaprime(a: number, b: number, count: number): Array<number> {
    if(count < 1) {
        throw new Error('Array is too small. Try to use ".random.beta(' + a + ', ' + b + ')" method');
    }

    if(count > 10000){
        throw new Error('Array is too big. Try to use ".generate.beta(' + a + ', ' + b + ', ' + count + ')" method');
    }

    if(a <= 0 || b <= 0){
        throw new Error('Parameters "a" and "b" must be positive');
    }

    let betaPrimeArray: Array<number> = [],
        betaPrimeTemp;
    for(let i: number = 0; i < count; i += 1){
        betaPrimeTemp = beta(a, b);
        betaPrimeArray[i] = betaPrimeTemp / (1 - betaPrimeTemp);
    }
    return betaPrimeArray;
}

module.exports = betaprime;
