// @flow
/**
 * Geometric Distribution
 * @param p: number (0 <= p <= 1) - Probability of success
 * @returns Geometric Distributed Value
 * Created by Alexey S. Kiselev
 */

function geometric(p: number): number {
    let res: number = 1;
    while(Math.random() >= p){
        res += 1;
    }
    return res;
}

module.exports = geometric;
