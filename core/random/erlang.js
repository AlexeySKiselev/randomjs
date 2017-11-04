// @flow
/**
 * Erlang Distribution
 * @param a: number - a > 0, "a" can be double
 * @param m: number - m must be a positive integer
 * @returns Erlang Distributed value
 * Created by Alexey S. Kiselev
 */

function erlang(a: number, m: number): number {
    if(a <= 0){
        throw new Error('Erlang distribution: parameter "a" must be greater then zero');
    }

    if(Math.floor(m) !== m){
        m = Math.floor(m);
        console.log('Erlang distribution: parameter "m" rounded to minimum integer value');
    }

    if(m < 0){
        throw new Error('Erlang distribution: parameter "m" must be a positive integer');
    }

    let p: number = 1;
    for(let i: number = 0; i < m; i += 1){
        p *= Math.random();
    }
    return (-a) * Math.log(p);
}

module.exports = erlang;
