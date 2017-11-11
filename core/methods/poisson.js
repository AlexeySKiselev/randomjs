// @flow
/**
 * Poisson Distribution (Knuth algorithm)
 * This is discreet distribution
 * https://en.wikipedia.org/wiki/Poisson_distribution
 * @param lambda: number (lambda > 0)
 * @returns Poisson Distributed integer number
 * Created by Alexey S. Kiselev
 */

class Poisson {
    constructor(lambda: number): void {
        this.lambda = lambda;
    }

    /**
     * Generates a random number
     * @returns a Poisson distributed number
     */
    random(): number {
        let res: number = 0,
            p: number = 1,
            L: number = Math.exp(-this.lambda);
        do {
            p *= Math.random();
            res += 1;
        } while(p >= L);
        return res - 1;
    }

    /**
     * Generates Poisson distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Poisson distributed numbers
     */
    distribution(n: number) {
        let poissonArray: Array<number> = [];
        for(let i:number = 0; i < n; i += 1){
            poissonArray[i] = this.random();
        }
        return poissonArray;
    }

    /**
     * Error handling
     * Parameter "lambda" must be positive integer
     * @returns {boolean}
     */
    isError(): boolean | {error: string} {
        if(this.lambda <= 0){
            return {error: 'Poisson distribution: parameter "lambda" must be positive integer'};
        }
        return false;
    }

    /**
     * Refresh method
     * @param newLambda: number - new parameter "lambda"
     * This method does not return values
     */
    refresh(newLambda: number): void {
        this.lambda = newLambda;
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Poisson Distribution',
            `Usage: randomjs.poisson(${this.lambda}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.lambda;
    }

    /**
     * There are no exact Mode and Median values
     */

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return this.lambda;
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return 1 / Math.sqrt(this.lambda);
    }

    /**
     * Fisher information
     * Information only
     * For calculating real skewness value use analyzer
     */
    get fisher(): number {
        return 1 / this.lambda;
    }

    // TODO: implement entropy method

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            variance: this.variance,
            skewness: this.skewness,
            fisher: this.fisher
        };
    }
}

module.exports = Poisson;
