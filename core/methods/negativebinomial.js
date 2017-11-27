// @flow
/**
 * Negative Binomial Distribution
 * This is discreet distribution
 * https://en.wikipedia.org/wiki/Negative_binomial_distribution
 * @param r: number - integer number, r > 0
 * @param p: number - float number, 0 <= p <= 1
 * @returns a Negative Binomial Distributed number
 * Created by Alexey S. Kiselev
 */

let Gamma = require('./gamma'),
    Poisson = require('./poisson');

class NegativeBinomial {
    constructor(r: number, p: number): void {
        this.numberFailures = Number(r);
        this.successProb = Number(p);
        this.gamma = new Gamma(this.numberFailures, this.successProb / (1 - this.successProb));
        this.poisson = new Poisson(1);
    }

    /**
     * Generates a random number
     * @returns a Negative Binomial distributed number
     */
    random(): number {
        this.gamma.refresh(this.numberFailures, this.successProb / (1 - this.successProb));
        let temp: number = this.gamma.random();
        this.poisson.refresh(temp);
        return this.poisson.random();
    }

    /**
     * Generates Negative Binomial distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Negative Binomial distributed numbers
     */
    distribution(n: number) {
        let negativeBinomialArray: Array<number> = [];
        for(let i:number = 0; i < n; i += 1){
            negativeBinomialArray[i] = this.random();
        }
        return negativeBinomialArray;
    }

    /**
     * Error handling
     * Parameter "r" must be positive integer
     * Parameter "p" must be 0 <= p <= 1
     * @returns {boolean}
     */
    isError(): boolean | {error: string} {
        if(!this.numberFailures || (!this.successProb && this.successProb !== 0)){
            return {error: 'Negative Binomial distribution: you should point "r" and "p" parameters with numerical values'};
        }
        if(this.numberFailures <= 0){
            return {error: 'Negative Binomial distribution: parameter "r" must be positive integer'};
        }
        if(this.successProb < 0 || this.successProb > 1) {
            return {error: 'Negative Binomial distribution: parameter "p" (probability of success) must be 0 <= p <= 1'};
        }
        return false;
    }

    /**
     * Refresh method
     * @param newR: number - new parameter "r"
     * @param newP: number - new parameter "p"
     * This method does not return values
     */
    refresh(newR: number, newP: number): void {
        this.numberFailures = Number(newR);
        this.successProb = Number(newP);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Negative Binomial Distribution',
            `Usage: randomjs.negativebinomial(${this.numberFailures}, ${this.successProb}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.numberFailures * this.successProb / (1 - this.successProb);
    }

    /**
     * Mode value
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        if(this.numberFailures > 1){
            return Math.floor((this.numberFailures - 1)* this.successProb / (1 - this.successProb));
        }
        return 0;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return this.mean / (1 - this.successProb);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return (1 + this.successProb) / Math.sqrt(this.numberFailures * this.successProb);
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
            skewness: this.skewness
        };
    }
}

module.exports = NegativeBinomial;
