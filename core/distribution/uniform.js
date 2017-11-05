// @flow
/**
 * Uniform distribution
 * @param min: number - Minimal value of Uniform Distribution
 * @param max: number - Maximum value of Uniform Distribution
 * @param count: number - Count of values in returned array
 * @returns an array contains N values of Uniform Distributed values based on parameters
 * Created by Alexey S. Kiselev
 */

let uniformNumber: (min: number, max: number) => number = require('../random/uniform');

function uniform(min: number = 0, max: number = 1, count: number = 10): Array<number> {
    if(count < 1)
        throw new Error('Array is too small. Try to use ".random.uniform(' + min + ', ' + max + ')" method');
    if(count > 10000)
        throw new Error('Array is too big. Try to use ".generate.uniform(' + min + ', ' + max + ', ' + count + ')" method');

    let uniformArray: Array<number> = [];
    for(let i: number = 0; i < count; i += 1){
        uniformArray[i] = uniformNumber(min, max);
    }
    return uniformArray;
}

module.exports = uniform;
