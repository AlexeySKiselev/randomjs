// @flow
/**
 * Normal Gaussian Distribution
 * https://en.wikipedia.org/wiki/Normal_distribution
 * @param mu: number - Mu value of Normal Distribution, any value
 * @param sigma: number - Sigma value of Normal Distribution, sigma > 0
 * @returns Normal Distributed value based on parameters
 * Created by Alexey S. Kiselev
 */

let Uniform = require('./uniform');

class Normal {
    mu: number;
    sigma: number;
    uniform: Uniform;

    constructor(mu: number, sigma: number): void {
        this.mu = Number(mu);
        this.sigma = Number(sigma);
        /**
         * Create an instance of Uniform class
         * Use this class for generation random normal distributed numbers
         * @type {Uniform}
         */
        this.uniform = new Uniform(-1, 1);
    }

    /**
     * Generates a random number
     * Uses Box-Muller transform and Marsaglia polar method
     * This method generats two random numbers, but use one of it
     * @returns a normal distributed number
     */
    random(): number {
        let U1: number,
            U2: number,
            W: number,
            mult: number;
        do {
            U1 = this.uniform.random();
            U2 = this.uniform.random();
            W = Math.pow(U1, 2) + Math.pow(U2, 2);
        } while(W >= 1 || W === 0);
        mult = Math.sqrt((-2*Math.log(W))/W);

        return this.mu + this.sigma * U1 * mult;
    }

    /**
     * Generates normal distributed numbers
     * Uses the same algorithm as in .random() method
     * Add both two random generated values to array
     * For this purpose use algorithm again (not .random() method)
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - normal distributed numbers
     */
    distribution(n: number): Array<number> {
        let normalArray: Array<number> = [],
            U1: number,
            U2: number,
            W: number,
            mult: number;
        for(let i: number = 0; i < n; i += 2){
            do {
                U1 = this.uniform.random();
                U2 = this.uniform.random();
                W = Math.pow(U1, 2) + Math.pow(U2, 2);
            } while(W >= 1 || W === 0);
            mult = Math.sqrt((-2*Math.log(W))/W);
            normalArray[i] = this.mu + this.sigma * U1 * mult;
            normalArray[i + 1] = this.mu + this.sigma * U2 * mult;
        }
        /**
         * This algorithm generates two values
         * So, if we need odd-length array check value "n"
         * if "n" is odd - delete last element
         */
        if(n % 2 !== 0){
            normalArray.pop();
        }
        return normalArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): boolean | {error: string} {
        if((!this.mu && this.mu !== 0) || (!this.sigma && this.sigma !== 0)) {
            return {error: 'Normal distribution: you should point "mu" and "sigma" numerical values'};
        }

        if(this.sigma <= 0) {
            return {error: 'Normal distribution: parameter "sigma" must be a positive value'};
        }

        return false;
    }

    /**
     * Refresh method
     * @param newMu: number - new parameter "mu"
     * @param newSigma: number - new parameter "sigma"
     * This method does not return values
     */
    refresh(newMu: number, newSigma: number): void {
        this.mu = Number(newMu);
        this.sigma = Number(newSigma);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Normal (Gaussian) Distribution',
            `Usage: randomjs.normal(${this.mu}, ${this.sigma}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.mu;
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return this.mu;
    }

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return this.mu;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return Math.pow(this.sigma, 2);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return 0;
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return Math.log(2* Math.PI * Math.E * this.variance) / 2;
    }

    /**
     * Fisher information matrix
     * Information only
     */
    get fisher(): Array<Array<number>> {
        return [[(1 / this.variance), 0], [0, (0.5 / Math.pow(this.variance, 2))]];
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
            fisher: this.fisher
        };
    }
}

module.exports = Normal;
