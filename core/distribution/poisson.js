/**
 * Poisson Distribution (Knuth algorithm)
 * @parap lambda: number (lambda > 0)
 * @param count: number - number of Poisson Distributed numbers in Array
 * @returns an array of Poisson Distributed integer values
 * Created by Alexey S. Kiselev
 */

// @flow

function poissonNumber(lambda: number): number {
    let res: number = 0,
        p: number = 1,
        L: number = Math.exp(-lambda);
    do {
        p *= Math.random();
        res += 1;
    } while(p >= L);
    return res - 1;
}

function poisson(lambda: number, count: number): Array<number> {
    if(count < 1)
        throw new Error('Array is too small. Try to use ".random.poisson(' + lambda + ')" method');
    if(count > 10000)
        throw new Error('Array is too big. Try to use ".generate.poisson(' + lambda + ', ' + count + ')" method');
    if(parseInt(lambda) <= 0) {
        throw new Error('lambda must an integer number and lambda > 0');
    }
    let poissonArray: Array<number> = [];
    for(let i: number = 0; i < count; i += 1){
        poissonArray[i] = poissonNumber(lambda);
    }
    return poissonArray;
}

module.exports = poisson;
