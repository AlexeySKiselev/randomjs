// @flow

/**
 * Chi Distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Chi_distribution
 * @param k: number - degrees of freedom k > 0
 * @returns Chi Distributed value
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
import type { IDistribution } from '../interfaces';
const ChiSquare = require('./chisquare');
const Utils = require('../utils/utils');

class Chi implements IDistribution {
    degrees: number;
    chiSquare: ChiSquare;

    constructor(k: number): void {
        this.degrees = Number(k);
        this.chiSquare = new ChiSquare(this.degrees);
    }

    /**
     * Generates a random number
     * @returns a Chi distributed number
     */
    random(): number {
        this.chiSquare.refresh(this.degrees);
        return Math.sqrt(this.chiSquare.random());
    }

    /**
     * Generates next seeded random number
     * @returns {number}
     */
    next(): number {
        this.chiSquare.refresh(this.degrees);
        return Math.sqrt(this.chiSquare.next());
    }

    /**
     * Generates Chi distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Chi distributed numbers
     */
    distribution(n: number): RandomArray {
        this.chiSquare.refresh(this.degrees);
        let chiArray: RandomArray = [],
            random: RandomArray = this.chiSquare.distribution(n);
        for(let i:number = 0; i < n; i += 1){
            chiArray[i] = Math.sqrt(random[i]);
        }
        return chiArray;
    }

    /**
     * Error handling
     * Parameter "k" must be positive
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.degrees){
            return {error: 'Chi distribution: you should point parameter "k" positive numerical value'};
        }
        if(this.degrees <= 0){
            return {error: 'Chi distribution: parameter "k" must be positive integer'};
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
            'Chi Distribution',
            `Usage: unirand.chi(${this.degrees}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return Math.sqrt(2) * Utils.gamma((this.degrees + 1) / 2) / Utils.gamma(this.degrees / 2);
    }

    /**
     * Median value (approximate value)
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return Math.sqrt(this.degrees * Math.pow(1 - 2 / (9 * this.degrees), 3));
    }

    /**
     * Mode value
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): any {
        if(this.degrees >= 1){
            return Math.sqrt(this.degrees - 1);
        }
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return this.degrees - Math.pow(this.mean, 2);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return this.mean * (1 - 2 * this.variance) / (this.variance * Math.sqrt(this.variance));
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): number {
        return 2 * (1 - this.mean * Math.sqrt(this.variance) * this.skewness - this.variance) / this.variance;
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return Math.log(Utils.gamma(this.degrees / 2)) + 0.5 * (this.degrees - Math.log(2) - (this.degrees - 1) * Utils.digamma(this.degrees / 2));
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            mode: this.mode,
            median: this.median,
            variance: this.variance,
            skewness: this.skewness,
            entropy: this.entropy,
            kurtosis: this.kurtosis
        };
    }
}

module.exports = Chi;
