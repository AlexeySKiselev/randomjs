// @flow
/**
 * Beta Distribution
 * @param a: number - a > 0, a must be integer
 * @param b: number - b > 0, b must be integer
 * @returns Beta Distributed value
 * Created by Alexey S. Kiselev
 */

let gamma: (a: number, b: number) => number = require('./gamma');

function beta(a: number, b: number): number {
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

    let gammaA: number = gamma(a, 1),
        gammaB: number = gamma(b, 1);

    return gammaA / (gammaA + gammaB);
}

module.exports = beta;
