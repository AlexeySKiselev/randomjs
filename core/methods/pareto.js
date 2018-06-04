// @flow

/**
 * Pareto distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Pareto_distribution
 * @param xm <number> - scale parameter, xm > 0
 * @param alpha <number> - shape parameter, alpha > 0
 * @returns Pareto distributed value
 * Created by Alexey S. Kiselev
 */

import type {MethodError, RandomArray} from '../types';

class Pareto {
    xm: number;
    alpha: number;

    constructor(xm: number, alpha: number): void {
        this.xm = Number(xm);
        this.alpha = Number(alpha);
    }

    /**
     * Generates a random number
     * @returns a Pareto distributed number
     */
    random(): number {
        return this.xm * Math.pow(Math.random(), -1 / this.alpha);
    }

    /**
     * Generates Pareto distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Pareto distributed numbers
     */
    distribution(n: number): RandomArray {
        let paretoArray: RandomArray = [];
        for(let i: number = 0; i < n; i += 1){
            paretoArray[i] = this.random();
        }
        return paretoArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if((!this.xm && this.xm !== 0) || (!this.alpha && this.alpha !== 0)) {
            return {error: 'Pareto distribution: you should point "xm" (scale) and "alpha" (shape) numerical values'};
        }
        if(this.xm <= 0 || this.alpha <= 0) {
            return {error: 'Pareto distribution: parameters "xm" (scale) and "alpha" (shape) must be a positive values'};
        }
        return { error: false };
    }

    /**
     * Refresh method
     * @param newXm: number - new parameter "xm"
     * @param newAlpha: number - new parameter "alpha"
     * This method does not return values
     */
    refresh(newXm: number, newAlpha: number): void {
        this.xm = Number(newXm);
        this.alpha = Number(newAlpha);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Pareto Distribution',
            `Usage: randomjs.pareto(${this.xm}, ${this.alpha}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        if(this.alpha > 1) {
            return this.alpha * this.xm / (this.alpha - 1);
        }
        return Infinity;
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return this.xm * Math.pow(2, 1 / this.alpha);
    }

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return this.xm;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        if(this.alpha > 2) {
            return Math.pow(this.xm, 2) * this.alpha / (Math.pow(this.alpha - 1, 2) * (this.alpha - 2));
        }
        return Infinity;
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): ?number {
        if(this.alpha > 3) {
            return 2 * Math.sqrt((this.alpha - 2) / this.alpha) * (1 + this.alpha) / (this.alpha - 3);
        }
        return undefined;
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): ?number {
        if(this.alpha > 4) {
            return 6 * (Math.pow(this.alpha, 3) + Math.pow(this.alpha, 2) - 6 * this.alpha - 2) / (this.alpha * (this.alpha - 3) * (this.alpha - 4));
        }
        return undefined;
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return Math.log(this.xm * Math.exp(1 + (1 / this.alpha)) / this.alpha);
    }

    /**
     * Fisher information matrix
     * Information only
     */
    get fisher(): Array<Array<number>> {
        return [[(this.alpha / Math.pow(this.xm, 2)), -1 / this.xm], [-1 / this.xm, (1 / Math.pow(this.alpha, 2))]];
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
            kurtosis: this.kurtosis,
            entropy: this.entropy,
            fisher: this.fisher
        };
    }
}

module.exports = Pareto;
