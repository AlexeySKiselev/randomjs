// @flow
/**
 * Erlang Distribution
 * @param a: number - a > 0, "a" can be double
 * @param m: number - m must be a positive integer
 * @param count: number - count of values in resulting array
 * @returns Erlang Distributed value
 * Created by Alexey S. Kiselev
 */

function erlang(a: number, m: number, count: number): Array<number> {
    if(count < 1) {
        throw new Error('Array is too small. Try to use ".random.erlang(' + a + ', ' + m + ')" method');
    }

    if(count > 10000){
        throw new Error('Array is too big. Try to use ".generate.erlang(' + a + ', ' + m + ',' + count + ')" method');
    }

    if(a <= 0){
        throw new Error('Erlang distribution: parameter "a" must be greater then zero');
    }

    if(m < 0){
        throw new Error('Erlang distribution: parameter "m" must be a positive integer');
    }

    let erlangArray: Array<number> = [],
        p: number;
    for(let i: number = 0; i < count; i += 1){
        p = 1;
        for(let j: number = 0; j < m; j += 1){
            p *= Math.random();
        }
        erlangArray[i] = (-a) * Math.log(p);
    }
    return erlangArray;
}

module.exports = erlang;
