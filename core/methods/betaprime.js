// @flow

/**
 * Beta Distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Beta_prime_distribution
 * @param alpha: number - alpha > 0, alpha must be integer
 * @param beta: number - beta > 0, beta must be integer
 * @returns Beta Prime Distributed value
 * Created by Alexey S. Kiselev
 */

import type { MethodError, RandomArray } from '../types';
let Beta = require('./beta');

class BetaPrime {
    alpha: number;
    beta: number;
    betaRandom: Beta;

    constructor(alpha: number, beta: number): void {
        this.alpha = Number(alpha);
        this.beta = Number(beta);
        this.betaRandom = new Beta(this.alpha, this.beta);
    }

    /**
     * Generates a random number
     * Use Beta distribution for calculation
     * Refresh Beta before calculating
     * @returns a Beta Prime distributed number
     */
    random(): number {
        let betaVariance: number;
        this.betaRandom.refresh(this.alpha, this.beta);
        betaVariance = this.betaRandom.random();

        return betaVariance / (1 - betaVariance);
    }

    /**
     * Generates Beta Prime distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Beta Prime distributed numbers
     */
    distribution(n: number): RandomArray {
        let betaPrimeArray: RandomArray = [];

        for(let i: number = 0; i < n; i += 1){
            betaPrimeArray[i] = this.random();
        }
        return betaPrimeArray;
    }

    /**
     * Error handling
     * Parameter "alpha" must be positive
     * Parameter "beta" must be positive
     * @returns {boolean}
     */
    isError(): MethodError {
        if(!this.alpha || !this.beta) {
            return {error: 'Beta Prime distribution: you should point "alpha" and "beta" positive numerical values'};
        }
        if(this.alpha <= 0){
            return {error: 'Beta Prime distribution: Parameter "alpha" must be positive'};
        }
        if(this.beta <= 0){
            return {error: 'Beta Prime distribution: Parameter "beta" must be positive'};
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
            'Beta Prime Distribution',
            `Usage: randomjs.betaprime(${this.alpha}, ${this.beta}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        if(this.beta > 1) {
            return this.alpha / (this.beta - 1);
        }
        return Infinity;
    }

    /**
     * Mode value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mode(): number {
        if(this.alpha >= 1) {
            return (this.alpha - 1) / (this.beta + 1);
        }
        return 0;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): ?number {
        if(this.beta > 2){
            return this.alpha * (this.alpha + this.beta - 1) / ((this.beta - 1) * (this.beta - 1) * (this.beta - 2));
        }
    }

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            mode: this.mode,
            variance: this.variance
        };
    }
}

module.exports = BetaPrime;
