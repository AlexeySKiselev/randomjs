/**
 * Uniform Distribution
 * @param min: number - Minimal value of Uniform Distribution
 * @param max: number - Maximum value of Uniform Distribution
 * @returns Uniform Distributed value based on parameters
 * Created by Alexey S. Kiselev
 */
// @flow

function uniform(min: number = 0, max: number = 1){
    return min + Math.random()*(max - min);
}

module.exports = uniform;
