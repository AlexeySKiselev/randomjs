// @flow

/**
 * Chi Square Distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Chi-squared_distribution
 * @param k: number - degrees of freedom k > 0
 * @returns Chi Square Distributed value
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
import type { IDistribution } from '../interfaces';
const Normal = require('./normal');
const Utils = require('../utils/utils');

class ChiSquare implements IDistribution {
    degrees: number;
    normal: Normal;

    constructor(k: number): void {
        this.degrees = Number(k);
        this.normal = new Normal(0, 1);
    }

    /**
     * Generates a random number
     * @returns a Chi Square distributed number
     */
    random(): number {
        let res: number = 0,
            random: RandomArray = this.normal.distribution(this.degrees);
        for(let i: number = 0; i < this.degrees; i += 1){
            res += Math.pow(random[i], 2);
        }
        return res;
    }

    /**
     * Generates next seeded random number
     * @returns {number}
     */
    next(): number {
        let res: number = 0,
            random: number;
        for(let i: number = 0; i < this.degrees; i += 1){
            random = this.normal.next();
            res += Math.pow(random, 2);
        }
        return res;
    }

    /**
     * Generates Chi Square distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Chi Square distributed numbers
     */
    distribution(n: number): RandomArray {
        let chiSquareArray: RandomArray = [],
            res: number,
            random: RandomArray = this.normal.distribution(n * this.degrees);
        for(let i: number = 0; i < n; i += 1){
            res = 0;
            for(let j: number = 0; j < this.degrees; j += 1){
                res += Math.pow(random[i * this.degrees + j], 2);
            }
            chiSquareArray[i] = res;
        }
        return chiSquareArray;
    }

    /**
     * Error handling
     * Parameter "k" must be positive
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.degrees){
            return {error: 'Chi Square distribution: you should point parameter "k" positive numerical value'};
        }
        if(this.degrees <= 0){
            return {error: 'Chi Square distribution: parameter "k" must be positive integer'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newK: number - new parameter "k"
     * This method does not return values
     */
    refresh(newK: number): void {
        this.degrees = Number(newK);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Chi Square Distribution',
            `Usage: unirand.chisquare(${this.degrees}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.degrees;
    }

    /**
     * Median value (approximate value)
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return this.degrees * Math.pow(1 - 2 / (9 * this.degrees), 3);
    }

    /**
     * Mode value
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return Math.max(this.degrees - 2, 0);
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return 2 * this.degrees;
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return Math.sqrt(8 / this.degrees);
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): number {
        return 12 / this.degrees;
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return 0.5 * this.degrees + Math.log(2 * Utils.gamma(this.degrees / 2)) + (1 - 0.5 * this.degrees) * Utils.digamma(this.degrees / 2);
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            median: this.median,
            mode: this.mode,
            variance: this.variance,
            skewness: this.skewness,
            entropy: this.entropy,
            kurtosis: this.kurtosis
        };
    }
}

module.exports = ChiSquare;
