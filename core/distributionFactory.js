// @flow
/**
 * Factory method for creation random distributed methods
 * Created by Alexey S. Kiselev
 */

import type { IRandomFactory, IDistribution } from './interfaces';
import type { MethodError, RandomArray } from './types';

class RandomFactory implements IRandomFactory<Promise<number>, Promise<RandomArray>> {
    _current_method: IDistribution;
    _distributions: {[string]: IDistribution};

    constructor(): void {
        this._distributions = {};
    }

    /**
     * Returns current generator
     */
    get_current_generator(method: string, ...params: any): IDistribution {
        const _method: string = method.slice(0, -3);
        if (!this._distributions[_method]) {
            const Method: Class<IDistribution> = require(__dirname + '/methods/' + method);
            this._distributions[_method] = new Method(...params);
        }

        this._current_method = this._distributions[_method];
        this._current_method.refresh(...params);
        return this._current_method;
    }

    /**
     * Required method
     * Method .random(): Promise<number> generates a random number due to distribution
     * This method is asynchronous, contains method .then(data: number => {}) and
     * .catch(err: {error: string} => {}) corresponds to error in random distribution
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns a random number on each call, can be integer or float
     */
    random(): Promise<number> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(this.isError().error){
                    reject(this.isError());
                } else {
                    resolve(this._current_method.random());
                }
            }, 0);
        });
    }

    /**
     * Required method
     * Method .next(): Promise<number> generates a next seeded random number due to distribution
     * This method is asynchronous, contains method .then(data: number => {}) and
     * .catch(err: {error: string} => {}) corresponds to error in random distribution
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns a random number on each call, can be integer or float
     */
    next(): Promise<number> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(this.isError().error){
                    reject(this.isError());
                } else {
                    resolve(this._current_method.next());
                }
            }, 0);
        });
    }

    /**
     * Required method
     * Method .randomSync(): number generates a random number due to distribution
     * This method is synchronous
     * Produces a random number or throw an error message
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns a random number on each call, can be integer or float
     */
    randomSync(): number {
        if(this.isError().error){
            throw new Error(this.isError().error);
        } else
            return this._current_method.random();
    }

    /**
     * Required method
     * Method .nextSync(): number generates a seeded next random number due to distribution
     * This method is synchronous
     * Produces a random number or throw an error message
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns a random number on each call, can be integer or float
     */
    nextSync(): number {
        if(this.isError().error){
            throw new Error(this.isError().error);
        } else
            return this._current_method.next();
    }

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
    distribution(n: number = 10, ...distParams: any): Promise<RandomArray> {
        if(n < 1) {
            n = 1;
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(this.isError().error){
                    reject(this.isError());
                } else {
                    resolve(this._current_method.distribution(n, ...distParams));
                }
            }, 0);
        });
    }

    /**
     * Required method
     * Method .distributionSync(n: number): Array<number> generates an array of random numbers due to distribution
     * Contains n (n > 0) random distributed numbers. By default n = 10
     * Can contains additional parameters for formatting purposes
     * This method is synchronous. Produces an array of random numbers or throw an error message
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns an array of random numbers on each call, numbers can be integer or float
     */
    distributionSync(n: number = 10, ...distParams: any): RandomArray {
        if(n < 1) {
            n = 1;
        }
        if(this.isError().error){
            throw new Error(this.isError().error);
        } else
            return this._current_method.distribution(n, ...distParams);
    }

    /**
     * Required method
     * Method .isError(): boolean | {error: string} checks whether an error occurs in random method due to incorrect input values
     * This method is synchronous.
     * @returns "false" if no error occurred
     * or {error: string} object with error message if error occurred
     */
    isError(): MethodError {
        return this._current_method.isError();
    }

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
    refresh(...newParams: any): void {
        this._current_method.refresh(...newParams);
    }

    /**
     * class .toString() method, which will output information about distribution
     * @returns string
     */
    toString(): string {
        return this._current_method.toString();
    }
}

export default RandomFactory;
