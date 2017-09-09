/**
 * Normal Gaussian Distribution
 * Created by Alexey S. Kiselev
 */

// @flow
let uniform = require('./uniform');

function normal(mu: number, sigma: number): number {
    let X1, U1, U2, W, mult;
    do {
        U1 = uniform(-1, 1);
        U2 = uniform(-1, 1);
        W = Math.pow(U1, 2) + Math.pow(U2, 2);
    } while(W >= 1 || W === 0);
    mult = Math.sqrt((-2*Math.log(W))/W);
    X1 = U1 * mult;

    return mu + sigma * X1;
}

module.exports = normal;
