/**
 * Normal Gaussian Distribution
 * Created by Alexey S. Kiselev
 */

// @flow
let uniform: (min: number, max: number) => number = require('./uniform');

function normal(mu: number, sigma: number): number {
    let U1: number,
        U2: number,
        W: number,
        mult: number;
    do {
        U1 = uniform(-1, 1);
        U2 = uniform(-1, 1);
        W = Math.pow(U1, 2) + Math.pow(U2, 2);
    } while(W >= 1 || W === 0);
    mult = Math.sqrt((-2*Math.log(W))/W);

    return mu + sigma * U1 * mult;
}

module.exports = normal;
