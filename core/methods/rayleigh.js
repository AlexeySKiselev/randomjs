// @flow
/**
 * Rayleigh distribution
 * This is continuous distribution
 * https://en.wikipedia.org/wiki/Rayleigh_distribution
 * @param sigma <number> - scale parameter, sigma > 0
 * @returns Rayleigh distributed value
 * Created by Alexey S. Kiselev
 */

class Rayleigh {
    sigma: number;

    constructor(sigma: number): void {
        this.sigma = Number(sigma);
    }

    /**
     * Generates a random number
     * @returns a Rayleigh distributed number
     */
    random(): number {
        let u: number = Math.random();
        if(u === 0) {
            return this.random();
        }
        return this.sigma * Math.sqrt(-2 * Math.log(u));
    }

    /**
     * Generates Rayleigh distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Pareto distributed numbers
     */
    distribution(n: number): Array<number> {
        let rayleighArray: Array<number> = [];
        for(let i: number = 0; i < n; i += 1){
            rayleighArray[i] = this.random();
        }
        return rayleighArray;
    }

    /**
     * Error handling
     * @returns {boolean}
     */
    isError(): boolean | {error: string} {
        if(!this.sigma) {
            return {error: 'Rayleigh distribution: you should point "sigma" (scale) numerical value'};
        }
        if(this.sigma <= 0) {
            return {error: 'Rayleigh distribution: parameter "sigma" (scale) must be a positive value'};
        }
        return false;
    }

    /**
     * Refresh method
     * @param newSigma: number - new parameter "sigma"
     * This method does not return values
     */
    refresh(newSigma: number): void {
        this.sigma = Number(newSigma);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Rayleigh Distribution',
            `Usage: randomjs.rayleigh(${this.sigma}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.sigma * Math.sqrt(Math.PI / 2);
    }

    /**
     * Median value
     * Information only
     * For calculating real median value use analyzer
     */
    get median(): number {
        return this.sigma * Math.sqrt(2 * Math.log(2));
    }

    /**
     * Mode value - value, which appears most often
     * Information only
     * For calculating real mode value use analyzer
     */
    get mode(): number {
        return this.sigma;
    }

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return Math.pow(this.sigma, 2) * (4 - Math.PI) / 2;
    }

    /**
     * Entropy value
     * Information only
     * For calculating real entropy value use analyzer
     */
    get entropy(): number {
        return 1.28860783245076643030325605 + Math.log(this.sigma / 1.4142135623730950488016887242097);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return 2 * Math.sqrt(Math.PI) * (Math.PI - 3) / Math.pow(4 - Math.PI, 1.5);
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
            entropy: this.entropy,
            skewness: this.skewness
        };
    }
}

module.exports = Rayleigh;
