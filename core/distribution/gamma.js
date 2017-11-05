// @flow
/**
 * Gamma Distribution
 * @param a: number - a > 0 and a can be double
 * @param b: number - b > 0 and b must be integer
 * @param count: number - numbers of values in resulting array
 * @returns an array or random values with Gamma distribution
 * Created by Alexey S. Kiselev
 */

function gamma(a: number, b: number, count: number): Array<number> {
    if(count < 1) {
        throw new Error('Array is too small. Try to use ".random.gamma(' + a + ', ' + b + ')" method');
    }

    if(count > 10000){
        throw new Error('Array is too big. Try to use ".generate.gamma(' + a + ', ' + b + ', ' + count + ')" method');
    }

    if(a <= 0 || b <= 0){
        throw new Error('Parameters "a" and "b" must be positive');
    }

    let gammaArray: Array<number> = [],
        temp: number;
    for(let i: number = 0; i < count; i += 1){
        temp = 0;
        for(let j: number = 0; j < b; j += 1){
            temp -= Math.log(Math.random()) / a;
        }
        gammaArray[i] = temp;
    }
    return gammaArray;
}

module.exports = gamma;
