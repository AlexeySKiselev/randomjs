/**
 * Uniform Distribution
 * Created by Alexey S. Kiselev on 09.09.2017.
 */
// @flow

function uniform(min: number = 0, max: number = 1){
    return min + Math.random()*(max - min);
}

module.exports = uniform;
