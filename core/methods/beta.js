// @flow
/**
 * Beta Distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Beta_distribution
 * @param alpha: number - alpha > 0, alpha must be integer
 * @param beta: number - beta > 0, beta must be integer
 * @returns Beta Distributed value
 * Created by Alexey S. Kiselev
 */

let Gamma = require('./gamma'),
    Utils = require('../utils/utils');

class Beta {
    constructor(alpha: number, beta: number): void {
        this.alpha = alpha;
        this.beta = beta;
        // Create an instance of Gamma distribution class for alpha
        this.gammaA = new Gamma(this.alpha, 1);
        // Create an instance of Gamma distribution class for beta
        this.gammaB = new Gamma(this.beta, 1);
    }

    /**
     * Generates a random number
     * First: refresh Gamma class (I need it to ensure I have correct value after refreshing Beta class),
     * then create a gammaA variable, then refresh Gamma class, then create gammaB variable
     * @returns a Beta distributed number
     */
    random(): number {
        let gammaA: number,
            gammaB: number;

        this.gammaA.refresh(this.alpha, 1);
        gammaA = this.gammaA.random();

        this.gammaB.refresh(this.beta, 1);
        gammaB = this.gammaB.random();

        return gammaA / (gammaA + gammaB);
    }

    /**
     * Generates Beta distributed numbers
     * For generating array I am not going to use .random method
     * For performance I am going to create another instance of Gamma class
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Beta distributed numbers
     */
    distribution(n: number): Array<number> {
        let betaArray: Array<number> = [],
            gammaA: number,
            gammaB: number;

        this.gammaA.refresh(this.alpha, 1);
        this.gammaB.refresh(this.beta, 1);

        for(let i: number = 0; i < n; i += 1){
            gammaA = this.gammaA.random();
            gammaB = this.gammaB.random();
            betaArray[i] = gammaA / (gammaA + gammaB);
        }
        return betaArray;
    }

    /**
     * Error handling
     * Parameter "alpha" must be positive
     * Parameter "beta" must be positive
     * @returns {boolean}
     */
    isError(): boolean | {error: string} {
        if(this.alpha <= 0){
            return {error: 'Beta distribution: Parameter "alpha" must be positive'};
        }
        if(this.beta <= 0){
            return {error: 'Beta distribution: Parameter "beta" must be positive'};
        }
        return false;
    }

    /**
     * Refresh method
     * @param newAlpha: number - new parameter "alpha"
     * @param newBeta: number - new parameter "beta"
     * This method does not return values
     */
    refresh(newAlpha: number, newBeta: number): void {
        this.alpha = newAlpha;
        this.beta = newBeta;
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Beta Distribution',
            `Usage: randomjs.beta(${this.alpha}, ${this.beta}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.alpha / (this.alpha + this.beta);
    }

    /**
     * Mode value
     * This formula is correct only for "alpha" > 1 and "beta" > 1
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return (this.alpha - 1) / (this.alpha + this.beta - 2);
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return (this.alpha * this.beta) / (Math.pow(this.alpha + this.beta, 2) * (this.alpha + this.beta + 1));
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return 2 * (this.beta - this.alpha) * Math.sqrt(this.alpha + this.beta + 1) / ((this.alpha + this.beta + 1) * Math.sqrt(this.alpha * this.beta));
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        let B: number = Utils.gamma(this.alpha) * Utils.gamma(this.beta) / Utils.gamma(this.alpha + this.beta);
        return Math.log(B) - (this.alpha - 1) * Utils.digamma(this.alpha) - (this.bate - 1) * Utils.digamma(this.beta) + (this.alpha + this.beta - 2) * Utils.digamma(this.alpha + this.beta);
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
            entropy: this.entropy
        };
    }
}

module.exports = Beta;
