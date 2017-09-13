// @flow
/**
 * Cauchy Distribution
 * @param a: number - positive number
 * @param b: number - positive number
 * @returns a Cauchy Distributed number
 * Created by Alexey S. Kiselev
 */

function cauchy(a: number, b: number): number {
    if(a < 0 || b < 0) throw new Error('Both arguments must be a positive numbers');
    return a + b * (Math.tan(Math.PI * Math.random() - 0.5));
}

module.exports = cauchy;
