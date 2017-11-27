// @flow
/**
 * Binomial Distribution
 * This is discreet distribution
 * https://en.wikipedia.org/wiki/Binomial_distribution
 * @param n: number - Number of Independent Bernoulli trials
 * @param p: number (0 <= p <= 1) - Probability of success
 * @returns Binomial Distributed number
 * Created by Alexey S. Kiselev
 */

class Binomial {
    constructor(n: number, p: number) {
        this.trials = Number(n);
        this.successProb = Number(p);
    }

    /**
     * Generates a random number
     * @returns a Binomial distributed number
     */
    random(): number {
        let res: number = 0;
        for(let i: number = 0; i < this.trials; i += 1){
            if(Math.random() < this.successProb) {
                res += 1;
            }
        }
        return res;
    }

    /**
     * Generates Binomial distributed numbers
     * @param n: number - Number of elements in resulting array, n > 0
     * @returns Array<number> - Binomial distributed numbers
     */
    distribution(n: number) {
        let binomialArray: Array<number> = [];
        for(let i:number = 0; i < n; i += 1){
            binomialArray[i] = this.random();
        }
        return binomialArray;
    }

    /**
     * Error handling
     * Parameter "n" must be positive integer
     * Parameter "p" must be 0 <= p <= 1
     * @returns {boolean}
     */
    isError(): boolean | {error: string} {
        if(!this.trials|| (!this.successProb && this.successProb !== 0)) {
            return {error: 'Binomial distribution: you should point parameter "n" like a positive integer and parameter "p" like a numerical value'};
        }
        if(this.trials <= 0){
            return {error: 'Binomial distribution: parameter "n" must be positive integer'};
        }
        if(this.successProb < 0 || this.successProb > 1) {
            return {error: 'Binomial distribution: parameter "p" (probability of success) must be 0 <= p <= 1'};
        }
        return false;
    }

    /**
     * Refresh method
     * @param newN: number - new parameter "n"
     * @param newP: number - new parameter "p"
     * This method does not return values
     */
    refresh(newN: number, newP: number): void {
        this.trials = Number(newN);
        this.successProb = Number(newP);
    }

    /**
     * Class .toString method
     * @returns {string}
     */
    toString(): string {
        let info = [
            'Binomial Distribution',
            `Usage: randomjs.binomial(${this.trials}, ${this.successProb}).random()`
        ];
        return info.join('\n');
    }

    /**
     * Mean value
     * Information only
     * For calculating real mean value use analyzer
     */
    get mean(): number {
        return this.trials * this.successProb;
    }

    /**
     * There are no exact Mode and Median parameters
     */

    /**
     * Variance value
     * Information only
     * For calculating real variance value use analyzer
     */
    get variance(): number {
        return this.trials * this.successProb * (1 - this.successProb);
    }

    /**
     * Skewness value
     * Information only
     * For calculating real skewness value use analyzer
     */
    get skewness(): number {
        return (1 - 2* this.successProb) / Math.sqrt(this.variance);
    }

    // TODO: implement entropy formula (https://math.stackexchange.com/questions/244455/entropy-of-a-binomial-distribution)

    /**
     * All parameters of distribution in one object
     * Information only
     */
    get parameters(): {} {
        return {
            mean: this.mean,
            variance: this.variance,
            skewness: this.skewness
        };
    }
}

module.exports = Binomial;
