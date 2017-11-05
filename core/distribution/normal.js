// @flow
/**
 * Normal Distribution
 * @param mu: number - Mu value of Normal Distribution
 * @param sigma: number - Sigma value of Normal Distribution
 * @param count: number - Count of values in returned array
 * @returns an array contains N values of Normal Distributed values based on parameters
 * Created by Alexey S. Kiselev
 */

let uniform: (min: number, max: number) => number = require('../random/uniform');

function normalValues(mu: number, sigma: number): {X1: number, X2: number} {
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

    return {
        X1: mu + sigma * U1 * mult,
        X2: mu + sigma * U2 * mult
    };
}

function normal(mu: number, sigma: number, count: number): Array<number> {
    if(count < 1)
        throw new Error('Array is too small. Try to use ".random.normal(' + mu + ', ' + sigma + ')" method');
    if(count > 10000)
        throw new Error('Array is too big. Try to use ".generate.normal(' + mu + ', ' + sigma + ', ' + count + ')" method');

    let normalArray: Array<number> = [],
        normalNumber: {X1: number, X2: number};
    for(let i: number = 0; i < count - 1; i += 2){
        normalNumber = normalValues(mu, sigma);
        normalArray[i] = normalNumber.X1;
        normalArray[i + 1] = normalNumber.X2;
    }
    return normalArray;
}

module.exports = normal;
