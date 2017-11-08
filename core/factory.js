// @flow
/**
 * Factory method for creation random distributed methods
 * Created by Alexey S. Kiselev
 */

interface IRandomFactory {
    /**
     * Required method
     * Method .random(): Promise<number> generates a random number due to distribution
     * This method is asynchronous, contains method .then(data: number => {}) and
     * .catch(err: {error: string} => {}) corresponds to error in random distribution
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns a random number on each call, can be integer or float
     */
    random() : Promise<number>;

    /**
     * Required method
     * Method .randomSync(): number generates a random number due to distribution
     * This method is synchronous
     * Produces a random number or throw an error message
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns a random number on each call, can be integer or float
     */
    randomSync(): number;

    /**
     * Required method
     * Method .distribution(n: number): Promise<Array<number>> generates an array of random numbers due to distribution
     * Contains n (n > 0) random distributed numbers. By default n = 10
     * Can contains additional parameters for formatting purposes
     * This method is asynchronous, contains method .then(data: Array<number> => {}) and
     * .catch(err: {error: string} => {}) corresponds to error in random distribution
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns an array of random numbers on each call, numbers can be integer or float
     */
    distribution(n: number): Promise<Array<number>>;

    /**
     * Required method
     * Method .distributionSync(n: number): Array<number> generates an array of random numbers due to distribution
     * Contains n (n > 0) random distributed numbers. By default n = 10
     * Can contains additional parameters for formatting purposes
     * This method is synchronous. Produces an array of random numbers or throw an error message
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns an array of random numbers on each call, numbers can be integer or float
     */
    distributionSync(n: number): Array<number>;

    /**
     * Required method
     * Method .isError(): boolean | {error: string} checks whether an error occurs in random method due to incorrect input values
     * This method is synchronous.
     * @returns "false" if no error occurred
     * or {error: string} object with error message if error occurred
     */
    isError(): boolean | {error: string};

    /**
     * Required method
     * Method .refresh(..params): void change th input values in existing distribution without creating new instance
     * Input parameters must be the same as in constructor
     * In this method .isError will refreshes too
     * Examle usage:
     * let normal = randomjs.normal(1, 2);
     * normal.random() // will generate random numbers with Gaussian distribution with mu = 1 and sigma = 2
     * normal.refresh(3, 4);
     * normal.random() // will generate random numbers with Gaussian distribution with mu = 3 and sigma = 4
     */
    refresh(): void;

    /**
     * class .toString() method, which will output information about distribution
     * @returns string
     */
    toString(): string;
}

class RandomFactory implements IRandomFactory {
    constructor(method: string, ...params): void {
        let Method = require(__dirname + '/methods/' + method);
        this.method = new Method(...params);
        /**
         * Add methods to this Factory class form the "Method" class
         * Add only that methods which is not in RandomFactory class
         * Because in this class we are re-define existing methods from "Method" class
         * All names of created methods will be the same as in the "Method" class
         */
        Object.getOwnPropertyNames(Object.getPrototypeOf(this.method)).map(method => {
            if(!this[method]){
                Object.defineProperty(this, method, {
                    __proto__: null,
                    get: () => {
                        return this.method[method];
                    }
                });
            }
        });
    }

    random(): number {
        return new Promise((resolve, reject) => {
            if(this.isError()){
                reject(this.isError());
            } else {
                resolve(this.method.random());
            }
        });
    }

    randomSync(): number {
        if(this.isError()){
            throw new Error(this.isError().error);
        } else
            return this.method.random();
    }

    distribution(n: number = 10, ...distParams): Array<number> {
        if(n < 1) {
            n = 1;
        }
        return new Promise((resolve, reject) => {
            if(this.isError()){
                reject(this.isError());
            } else {
                resolve(this.method.distribution(n, ...distParams));
            }
        });
    }

    distributionSync(n: number = 10, ...distParams): Array<number> {
        if(n < 1) {
            n = 1;
        }
        if(this.isError()){
            throw new Error(this.isError().error);
        } else
            return this.method.distribution(n, ...distParams);
    }

    isError(): boolean | {error: string} {
        return this.method.isError();
    }

    refresh(...newParams): void {
        this.method = this.method.refresh(...newParams);
    }

    toString(): string {
        return this.method.toString();
    }
}

export default RandomFactory;
