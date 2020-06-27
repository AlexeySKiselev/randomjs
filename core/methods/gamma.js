// @flow

/**
 * Gamma Distribution
 * Continuous distribution
 * https://en.wikipedia.org/wiki/Gamma_distribution
 * This algorithm is implemented with shape parameter "alpha" and rate parameter "beta"
 * @param alpha: number - alpha > 0, alpha can be double
 * @param beta: number - beta > 0, beta must be integer
 * @returns Gamma Distributed value
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
import type { IDistribution } from '../interfaces';
import prng from '../prng/prngProxy';
const Utils = require('../utils/utils');

class Gamma implements IDistribution {
    alpha: number;
    beta: number;

    constructor(alpha: number, beta: number): void {
        this.alpha = Number(alpha);
        this.beta = Number(beta);
    }

    /**
     * Generates a random number
     * @returns a Gamma distributed number
     */
    random(): number {
        let temp: number = 0,
            random: RandomArray = (prng.random(this.alpha): any);
        for(let i: number = 0; i < this.alpha; i += 1){
            temp -= Math.log(random[i]) / this.beta;
        }
        return temp;
    }

    /**
     * Generates next seeded random number
     * @returns {number}
     */
    next(): number {
        let temp: number = 0;
        for(let i: number = 0; i < this.alpha; i += 1){
            temp -= Math.log(prng.next()) / this.beta;
        }
        return temp;
    }

    /**
     * Generates gamma distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - gamma distributed numbers
     */
    distribution(n: number): RandomArray {
        const gammaArray: RandomArray = [];
        const random: RandomArray = (prng.random(n * this.alpha): any);
        let temp: number;
        for(let i: number = 0; i < n; i += 1) {
            temp = 0;
            for(let j: number = 0; j < this.alpha; j += 1){
                temp -= Math.log(random[i * this.alpha + j]) / this.beta;
            }
            gammaArray[i] = temp;
        }
        return gammaArray;
    }

    /**
     * Error handling
     * Parameter "alpha" must be integer and alpha > 0
     * Parameter "beta" must be positive, beta > 0
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.alpha || !this.beta){
            return {error: 'Gamma distribution: you should point parameters "alpha" and "beta" like a positive numerical values'};
        }

        if(this.alpha <= 0){
            return {error: 'Gamma distribution: parameter "alpha" must be a positive number'};
        }

        if(this.beta <= 0){
            return {error: 'Gamma distribution: parameter "beta" must be a positive integer'};
        }

        return { error: false };
    }

    /**
     * Refresh method
     * @param newAlpha: number - new parameter "alpha"
     * @param newBeta: number - new parameter "beta"
     * This method does not return values
     */
    refresh(newAlpha: number, newBeta: number): void {
        this.alpha = Number(newAlpha);
        this.beta = Number(newBeta);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Gamma Distribution',
            `Usage: unirand.gamma(${this.alpha}, ${this.beta}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.alpha / this.beta;
    }

    /**
     * Median value of Gamma distribution does not have simple closed form
     */

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return (this.alpha - 1) / this.beta;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return this.alpha / Math.pow(this.beta, 2);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return 2 / Math.sqrt(this.alpha);
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real Kurtosis value use analyzer
     */
    get kurtosis(): number {
        return 6 / this.alpha;
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return this.alpha - Math.log(this.beta) + Math.log(Utils.gamma(this.alpha)) + (1 - this.alpha) * Utils.digamma(this.alpha);
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            mode: this.mode,
            variance: this.variance,
            skewness: this.skewness,
            entropy: this.entropy,
            kurtosis: this.kurtosis
        };
    }
}

module.exports = Gamma;
