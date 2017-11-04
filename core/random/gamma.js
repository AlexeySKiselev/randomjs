// @flow
/**
 * Gamma Distribution
 * @param a: number - a > 0, a can be double
 * @param b: number - b > 0, b must be integer
 * @returns Gamma Distributed value
 * Created by Alexey S. Kiselev
 */

function gamma(a: number, b: number): number {
    if(Math.floor(b) !== b){
        b = Math.floor(b);
        console.log('Gamma distribution: Parameter "b" rounded to minimum integer value');
    }
    if(a <= 0 || b <= 0){
        throw new Error('Parameters "a" and "b" must be positive');
    }
    let temp: number = 0;
    for(let i: number = 0; i < b; i += 1){
        temp -= Math.log(Math.random()) / a;
    }
    return temp;
}

module.exports = gamma;
