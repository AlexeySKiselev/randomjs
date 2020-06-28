// @flow
/**
 * Delaporte Distribution
 * This is discrete distribution
 * https://en.wikipedia.org/wiki/Delaporte_distribution
 * @param alpha: number - alpha > 0
 * @param beta: number - beta > 0
 * @param lambda: number - lambda > 0
 * @returns Delaporte Distributed value
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
import type { IDistribution } from '../interfaces';

const Gamma = require('./gamma');
const Poisson = require('./poisson');

class Delaporte implements IDistribution {
    alpha: number;
    beta: number;
    lambda: number;
    gamma: Gamma;
    poisson: Poisson;

    constructor(alpha: number, beta: number, lambda: number): void {
        this.alpha = Number(alpha);
        this.beta = Number(beta);
        this.lambda = Number(lambda);
        this.gamma = new Gamma(this.alpha, this.beta);
        this.poisson = new Poisson(this.lambda + this.gamma.random());
    }

    /**
     * Generates a random number
     * @returns {number} a Delaporte distributed number
     */
    random(): number {
        this.gamma.refresh(this.alpha, this.beta);
        let tempRandom: number = this.gamma.random();
        this.poisson.refresh(this.lambda + tempRandom);
        return this.poisson.random();
    }

    /**
     * Generates next seeded random number
     * @returns {number} a Delaporte distributed number
     */
    next(): number {
        this.gamma.refresh(this.alpha, this.beta);
        let tempRandom: number = this.gamma.next();
        this.poisson.refresh(this.lambda + tempRandom);
        return this.poisson.next();
    }

    /**
     * Generates Delaporte distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Delaporte distributed numbers
     */
    distribution(n: number): RandomArray {
        this.gamma.refresh(this.alpha, this.beta);
        let delaporteArray: RandomArray = [],
            random: RandomArray = this.gamma.distribution(n);
        for(let i: number = 0; i < n; i += 1){
            this.poisson.refresh(this.lambda + random[i]);
            delaporteArray[i] = this.poisson.next();
        }
        return delaporteArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): MethodError {
        if (!this.alpha || !this.beta || !this.lambda) {
            return {error: 'Delaporte distribution: you should point parameters "alpha", "beta" and "lambda" as numerical values'};
        }
        if (this.alpha <= 0 || this.beta <= 0 || this.lambda <= 0) {
            return {error: 'Delaporte distribution: parameters "alpha", "beta" and "lambda" must be a positive numbers'};
        }

        return { error: false };
    }

    /**
     * Refresh method
     * @param newAlpha: number - new parameter "alpha"
     * @param newBeta: number - new parameter "beta"
     * @param newLambda: number - new parameter "lambda"
     * This method does not return values
     */
    refresh(newAlpha: number, newBeta: number, newLambda: number): void {
        this.alpha = Number(newAlpha);
        this.beta = Number(newBeta);
        this.lambda = Number(newLambda);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Delaporte Distribution',
            `Usage: unirand.delaporte(${this.alpha}, ${this.beta}, ${this.lambda}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.lambda + this.alpha / this.beta;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return this.mean + this.alpha / (this.beta * this.beta);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return (this.lambda + this.alpha * (1 + (3 / this.beta) + 2 / (this.beta * this.beta)) / this.beta) / Math.pow(this.variance, 1.5);
    }

    /**
     * Kurtosis value
     * Information only
     * For calculating real kurtosis value use analyzer
     */
    get kurtosis(): number {
        return (this.lambda + 3 * this.lambda * this.lambda + this.alpha * (
            1 + 6 * this.lambda + 6 * this.lambda / this.beta + 7 / this.beta + 12 / (this.beta * this.beta)
            + 6 / Math.pow(this.beta, 3) + 3 * this.alpha / this.beta
            + 6 * this.alpha / Math.pow(this.beta, 2) + 3 * this.alpha / Math.pow(this.beta, 3)
        ) / this.beta) / Math.pow(this.variance, 2);
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            variance: this.variance,
            skewness: this.skewness,
            kurtosis: this.kurtosis
        };
    }
}

module.exports = Delaporte;
