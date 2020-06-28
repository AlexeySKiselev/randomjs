// @flow
/**
 * Fatigue life Distribution, also known as Birnbaum–Saunders distribution
 * Continuous distribution
 * https://en.wikipedia.org/wiki/Birnbaum-Saunders_distribution
 * @param alpha: number - shape parameter, alpha > 0
 * @param beta: number - scale parameter, beta > 0
 * @returns Fatigue Distributed value
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
import type { IDistribution } from '../interfaces';

const Normal = require('./normal');

class Fatigue implements IDistribution {
    alpha: number;
    beta: number;
    normal: Normal;

    constructor(alpha: number, beta: number): void {
        this.alpha = Number(alpha);
        this.beta = Number(beta);
        this.normal = new Normal(0, 1);
    }

    _random(norm: number): number {
        return this.beta * Math.pow(this.alpha * norm + Math.sqrt(Math.pow(this.alpha * norm, 2) + 4), 2) / 4;
    }

    /**
     * Generates a random number
     * @returns {number} a Fatigue distributed number
     */
    random(): number {
        return this._random(this.normal.random());
    }

    /**
     * Generates next seeded random number
     * @returns {number} a Fatigue distributed number
     */
    next(): number {
        return this._random(this.normal.next());
    }

    /**
     * Generates Fatigue distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Fatigue distributed numbers
     */
    distribution(n: number): RandomArray {
        let fatigueArray: RandomArray = [],
            random: RandomArray = this.normal.distribution(n);
        for (let i: number = 0; i < n; i += 1){
            fatigueArray[i] = this._random(random[i]);
        }
        return fatigueArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if (!this.alpha || !this.beta) {
            return {error: 'Fatigue distribution: you should point parameters "alpha" and "beta" as numerical values'};
        }
        if (this.alpha <= 0 || this.beta <= 0) {
            return {error: 'Fatigue distribution: parameters "alpha" and "beta" must be a positive numbers'};
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
            'Fatigue Distribution',
            `Usage: unirand.fatigue(${this.alpha}, ${this.beta}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.beta * (Math.pow(this.alpha, 2) + 2) /2;
    }

    /**
     * Median value
     * Information only
     * For calculating real mean value use analyzer
     */
    get median(): number {
        return this.beta;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return Math.pow(this.alpha * this.beta, 2) * (5 * Math.pow(this.alpha, 2) + 4) / 4;
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return 4 * this.alpha * (11 * Math.pow(this.alpha, 2) + 6) / Math.pow(5 * this.alpha * this.alpha + 4, 1.5);
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): number {
        return 3 + Math.pow(this.alpha, 2) * (558 * this.alpha * this.alpha + 240) / Math.pow(5 * this.alpha * this.alpha + 4, 2);
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            median: this.median,
            variance: this.variance,
            skewness: this.skewness,
            kurtosis: this.kurtosis
        };
    }
}

module.exports = Fatigue;
