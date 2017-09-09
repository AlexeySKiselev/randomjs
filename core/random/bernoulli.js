/**
 * Bernoulli Distribution
 * @param p: number (0 <= p <= 1) - Probability of success
 * @returns 0 or 1
 * Created by Alexey S. Kiselev
 */

// @flow

function bernoulli(p: number): 0 | 1 {
    if(p < 0 || p > 1) {
        throw new Error('Parameter p must be 0 to 1 inclusive');
    }
    if(Math.random() <= p) {
        return 1;
    } else {
        return 0;
    }
}

module.exports = bernoulli;
