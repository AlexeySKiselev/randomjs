// @flow
/**
 * Project Interfaces
 * Created by Alexey S. Kiselev
 */

import type {
    RandomArray, RandomArrayString, AnalyzerPublicMethods, AnalyzerPublicProperties, MethodError,
    RandomArrayStringObject, SampleOptions, PercentileInput, NumberString, RandomArrayNumber
} from './types';

/**
 * Analyzer methods interface
 */
export interface IAnalyzerMethods {
    /**
     * Analyzer must contains randomArray property, which represents input Array
     */
    -randomArray: RandomArray;

    /**
     * This list will contains methods, which AnalyzerFactory is going to copy
     * List contains names of methods to copy
     * Then copy this methods via defineProperty method
     */
    +publicMethods: AnalyzerPublicMethods;

    /**
     * This list will contains only properties, not functions
     * I need it for returning an object of properties, when calling analyzer like a function
     */
    +publicProperties: AnalyzerPublicProperties;
}

/**
 * Analyzer method singleton interface
 */
export interface IAnalyzerSingleton {
    /**
     * Read only instance of Analyzer imported class
     * I use this object in Singleton decorator to memorize instance
     * @private
     */
    _instance?: any;

    /**
     * This method I use to create singleton instance of imported class
     * I add this method to class in SingletonDecorator
     */
    getInstance(...args: any): IAnalyzerMethods;
    publicMethods?: AnalyzerPublicProperties;
    publicFunctions?: AnalyzerPublicProperties;
}

/**
 * Random Distributions Factory Interface
 */
export interface IRandomFactory<R, D> {
    /**
     * Object for storing imported classes
     * @private
     */
    _method?: IRandomFactory<number, RandomArray>;

    /**
     * Required method
     * Method .random(): Promise<number> generates a random number due to distribution
     * This method is asynchronous, contains method .then(data: number => {}) and
     * .catch(err: {error: string} => {}) corresponds to error in random distribution
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns a random number on each call, can be integer or float
     */
    random(): R;
    next(): R;

    /**
     * Required method
     * Method .randomSync(): number generates a random number due to distribution
     * This method is synchronous
     * Produces a random number or throw an error message
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns a random number on each call, can be integer or float
     */
    randomSync(): number;
    nextSync(): number;

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
    distribution(n: number): D;

    /**
     * Required method
     * Method .distributionSync(n: number): Array<number> generates an array of random numbers due to distribution
     * Contains n (n > 0) random distributed numbers. By default n = 10
     * Can contains additional parameters for formatting purposes
     * This method is synchronous. Produces an array of random numbers or throw an error message
     * Error can occurs with incorrect input values, served by .isError() method
     * @returns an array of random numbers on each call, numbers can be integer or float
     */
    distributionSync(n: number): RandomArray;

    /**
     * Required method
     * Method .isError(): boolean | {error: string} checks whether an error occurs in random method due to incorrect input values
     * This method is synchronous.
     * @returns "false" if no error occurred
     * or {error: string} object with error message if error occurred
     */
    isError(): MethodError;

    /**
     * Required method
     * Method .refresh(..params): void change th input values in existing distribution without creating new instance
     * Input parameters must be the same as in constructor
     * In this method .isError will refreshes too
     * Example usage:
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

/**
 * Interface for sample method
 */
export interface ISample {
    getSample(input: any, k: ?number, options: SampleOptions): RandomArrayStringObject<number | string>;
}

/**
 * Interface for shuffle method
 */
export interface IShuffle {
    getPermutation(input: any): RandomArrayString<number | string>;
    getDerangement(input: any): RandomArrayString<number | string>;
}

/**
 * Interface for winsorize method
 */
export interface IWinsorize {
    winsorize(input: RandomArray, limits: PercentileInput<number>, mutate: boolean): RandomArray;
}

/**
 * PRNG Interface
 */
export interface IPRNG {
    seed(seed_value: ?NumberString): void;
    random(n: ?number): RandomArrayNumber;
    randomInt(n: ?number): RandomArrayNumber;
    next(): number;
    nextInt():  number;
}

/**
 * PRNG Factory Interface
 */

export interface IPRNGProxy extends IPRNG {
    set_prng(prng_name: string): void;
}

/**
 * Hash interface
 */
export interface IHash {
    hash(data: NumberString, seed: number): number;
}
