/**
 * Binomial Distribution
 * @param n: number - Number of Independent Bernoulli trials
 * @param p: number (0 <= p <= 1) - Probability of success
 * @returns Binomial Distributed number
 * Created by Alexey S. Kiselev
 */

// @flow

function binomial(n: number, p: number): number {
    let res: number = 0;
    for(let i: number = 0; i < n; i += 1){
        if(Math.random() < p) {
            res += 1;
        }
    }
    return res;
}

module.exports = binomial;
