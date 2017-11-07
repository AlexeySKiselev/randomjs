// @flow
/**
 * Continuous Uniform Distribution
 * https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)
 * @param min: number - Minimal value of Uniform Distribution
 * @param max: number - Maximum value of Uniform Distribution
 * @returns Uniform Distributed value based on parameters
 * Created by Alexey S. Kiselev
 */

class Uniform {
    constructor(min: number, max: number): void {
        this.min = Math.min(min, max);
        this.max = Math.max(min, max);
    }

    /**
     * Generates a random number
     * Uses core Math.random() method but with [min, max] range
     */
    random(): number {
        return this.min + Math.random()*(this.max - this.min);
    }

    /**
     * Generates an array of uniformly distributed numbers
     * @param n: number - number of elements in resulting array
     */
    distribution(n: number): Array<number> {
        let uniformArray: Array<number> = [];
        for(let i: number = 0; i < n; i += 1){
            uniformArray[i] = this.random();
        }
        return uniformArray;
    }

    /**
     * Error handling
     * Check if min === max then throw Error
     * @returns {boolean}
     */
    isError(): boolean | {error: string} {
        if(this.min === this.max) {
            return {error: 'Uniform distribution: min and max values can\'t be the same'};
        }
        return false;
    }

    /**
     * Refresh method
     * @param newMin
     * @param newMax
     */
    refresh(newMin: number, newMax: number): void {
        this.min = Math.min(newMin, newMax);
        this.max = Math.max(newMin, newMax);
    }

    /**
     * toString() method
     * Show the description of this distribution
     * @returns {string}
     */
    toString() {
        return `Continuous Uniform Distribution
                Usage: randomjs.uniform(${this.min}, ${this.max}).random()
                `;
    }

    /**
     * Mean value of this distribution
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return (this.mix + this.max) / 2;
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return (this.mix + this.max) / 2;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return Math.pow(this.max - this.min, 2) / 12;
    }

    /**
     * Skewness value
     * Information only
     */
    get skewness(): number {
        return 0;
    }

    /**
     * Entropy value
     * Information only
     */
    get entropy(): number {
        return Math.log(this.max - this.min);
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
            entropy: this.entropy
        };
    }
}

module.exports = Uniform;
