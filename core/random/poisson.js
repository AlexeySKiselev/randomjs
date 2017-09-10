/**
 * Poisson Distribution (Knuth algorithm)
 * @parap lambda: number (lambda > 0)
 * @returns Poisson Distributed integer number
 * Created by Alexey S. Kiselev
 */

// @flow

function poisson(lambda: number): number {
    if(parseInt(lambda) <= 0) {
        throw new Error('lambda must an integer number and lambda > 0');
    }
    let res: number = 0,
        p: number = 1,
        L: number = Math.exp(-lambda);
    do {
        p *= Math.random();
        res += 1;
    } while(p >= L);
    return res - 1;
}

module.exports = poisson;
