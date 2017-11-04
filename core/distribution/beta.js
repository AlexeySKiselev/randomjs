// @flow
/**
 * Beta Distribution
 * @param a: number - a > 0, a must be integer
 * @param b: number - b > 0, b must be integer
 * @param count: number - count of values in resulting array
 * @returns and Array of Beta Distributed values
 * Created by Alexey S. Kiselev
 */

let gamma: (a: number, b: number) => number = require('../random/gamma');

function beta(a: number, b: number, count: number): Array<number> {
    if(count < 1) {
        throw new Error('Array is too small. Try to use ".random.beta(' + a + ', ' + b + ')" method');
    }

    if(count > 10000){
        throw new Error('Array is too big. Try to use ".generate.beta(' + a + ', ' + b + ', ' + count + ')" method');
    }

    if(Math.floor(b) !== b){
        b = Math.floor(b);
        console.log('Beta distribution: Parameter "b" rounded to minimum integer value');
    }

    if(Math.floor(a) !== a){
        a = Math.floor(a);
        console.log('Beta distribution: Parameter "a" rounded to minimum integer value');
    }

    if(a <= 0 || b <= 0){
        throw new Error('Parameters "a" and "b" must be positive');
    }

    let betaArray: Array<number> = [],
        gammaA: number,
        gammaB: number;
    for(let i: number = 0; i < count; i += 1){
        gammaA = gamma(a, 1);
        gammaB = gamma(b, 1);
        betaArray[i] = gammaA / (gammaA + gammaB);
    }
    return betaArray;
}

module.exports = beta;
